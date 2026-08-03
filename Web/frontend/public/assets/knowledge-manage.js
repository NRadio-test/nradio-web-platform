import './site.js?v=20260730-2'

const terminalStatuses = new Set(['review_ready', 'pr_created', 'completed', 'failed', 'dispatch_failed'])
const statusLabels = {
  stored: '已保存',
  queued: '等待处理',
  parsing: '正在解析',
  reviewing: '结构化处理中',
  publishing: '正在发布',
  review_ready: '等待审核',
  pr_created: '等待 PR 审核',
  completed: '已完成',
  failed: '处理失败',
  dispatch_failed: '启动失败'
}

const form = document.querySelector('#knowledge-import-form')
const loginPanel = document.querySelector('#session-login')
const loginForm = document.querySelector('#session-login-form')
const loginMessage = document.querySelector('#session-message')
const loginSubmit = document.querySelector('#session-submit')
const workspace = document.querySelector('#manage-workspace')
const sessionUserName = document.querySelector('#session-user-name')
const fileInput = document.querySelector('#knowledge-files')
const dropZone = document.querySelector('#drop-zone')
const selectedFiles = document.querySelector('#selected-files')
const submitButton = document.querySelector('#submit-import')
const formMessage = document.querySelector('#form-message')
const taskList = document.querySelector('#task-list')
const taskEmpty = document.querySelector('#task-empty')
const taskIds = new Set(JSON.parse(localStorage.getItem('nradio-import-jobs') || '[]'))
const tasks = new Map()

const showLogin = (message = '') => {
  loginPanel.hidden = false
  workspace.hidden = true
  loginMessage.textContent = message
}

const showWorkspace = (user) => {
  loginPanel.hidden = true
  workspace.hidden = false
  sessionUserName.textContent = user.name
  if (taskIds.size) refreshTasks()
}

const readJson = async (response) => response.json().catch(() => ({}))

const loadSession = async () => {
  const response = await fetch('/api/knowledge/session', { headers: { Accept: 'application/json' } })
  const payload = await readJson(response)
  if (!response.ok || !payload.ok) return showLogin()
  showWorkspace(payload.user)
}

const saveTaskIds = () => {
  localStorage.setItem('nradio-import-jobs', JSON.stringify([...taskIds].slice(-50)))
}

const escapeText = (value) => String(value || '')

const renderSelectedFiles = () => {
  const files = [...fileInput.files]
  selectedFiles.hidden = files.length === 0
  selectedFiles.replaceChildren(...files.map((file) => {
    const row = document.createElement('div')
    const name = document.createElement('strong')
    const size = document.createElement('span')
    name.textContent = file.name
    size.textContent = `${(file.size / 1024 / 1024).toFixed(2)} MB`
    row.append(name, size)
    return row
  }))
}

const createTaskCard = (job) => {
  const card = document.createElement('article')
  card.className = `task-card task-${job.status || 'queued'}`

  const top = document.createElement('div')
  top.className = 'task-topline'
  const name = document.createElement('strong')
  name.textContent = escapeText(job.filename || job.id)
  const status = document.createElement('span')
  status.textContent = statusLabels[job.status] || job.status || '等待处理'
  top.append(name, status)

  const message = document.createElement('p')
  message.textContent = job.error || job.message || '任务已经建立。'

  const progress = document.createElement('div')
  progress.className = 'task-progress'
  const bar = document.createElement('i')
  bar.style.width = `${Math.max(2, Math.min(100, Number(job.progress || 0)))}%`
  progress.append(bar)

  const footer = document.createElement('div')
  footer.className = 'task-footer'
  const id = document.createElement('code')
  id.textContent = job.id.slice(0, 8)
  footer.append(id)
  if (job.pr_url) {
    const link = document.createElement('a')
    link.href = job.pr_url
    link.target = '_blank'
    link.rel = 'noreferrer'
    link.textContent = job.status === 'review_ready' ? '查看审核分支 / PR ↗' : '查看 Draft PR ↗'
    footer.append(link)
  }

  card.append(top, message, progress, footer)
  return card
}

const renderTasks = () => {
  const values = [...tasks.values()].sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
  taskEmpty.hidden = values.length > 0
  taskList.replaceChildren(...(values.length ? values.map(createTaskCard) : [taskEmpty]))
}

const fetchTask = async (jobId) => {
  try {
    const response = await fetch(`/api/knowledge/import/${encodeURIComponent(jobId)}`, {
      headers: { Accept: 'application/json' }
    })
    if (response.status === 401) {
      showLogin('会话已过期，请重新输入身份口令。')
      return tasks.get(jobId) || { id: jobId, status: 'failed' }
    }
    if (!response.ok) throw new Error(`任务查询返回 ${response.status}`)
    const payload = await response.json()
    tasks.set(jobId, payload.job)
    renderTasks()
    return payload.job
  } catch (error) {
    const existing = tasks.get(jobId) || { id: jobId, filename: jobId }
    tasks.set(jobId, { ...existing, message: `暂时无法刷新：${error.message}` })
    renderTasks()
    return existing
  }
}

const refreshTasks = async () => {
  const jobs = await Promise.all([...taskIds].map(fetchTask))
  if (jobs.some((job) => !terminalStatuses.has(job.status))) {
    window.setTimeout(refreshTasks, 5000)
  }
}

const uploadFile = async (file) => {
  const data = new FormData()
  data.append('file', file)
  data.append('title', document.querySelector('#import-title').value)
  data.append('source_url', document.querySelector('#import-source-url').value)
  data.append('notes', document.querySelector('#import-notes').value)
  const response = await fetch('/api/knowledge/import', { method: 'POST', body: data })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok || !payload.ok) throw new Error(payload.error || `上传返回 ${response.status}`)
  taskIds.add(payload.job.id)
  saveTaskIds()
  tasks.set(payload.job.id, { ...payload.job, progress: payload.job.status === 'queued' ? 10 : 5 })
  renderTasks()
  return payload.job
}

fileInput.addEventListener('change', renderSelectedFiles)
for (const eventName of ['dragenter', 'dragover']) {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault()
    dropZone.classList.add('is-dragging')
  })
}
for (const eventName of ['dragleave', 'drop']) {
  dropZone.addEventListener(eventName, () => dropZone.classList.remove('is-dragging'))
}
dropZone.addEventListener('drop', (event) => {
  event.preventDefault()
  if (event.dataTransfer?.files?.length) {
    fileInput.files = event.dataTransfer.files
    renderSelectedFiles()
  }
})

form.addEventListener('submit', async (event) => {
  event.preventDefault()
  const files = [...fileInput.files]
  if (!files.length) return
  submitButton.disabled = true
  formMessage.className = 'form-message'
  formMessage.textContent = `正在上传 ${files.length} 个文件；后台会按顺序自动处理……`
  let successCount = 0
  const errors = []
  for (const file of files) {
    try {
      await uploadFile(file)
      successCount += 1
    } catch (error) {
      errors.push(`${file.name}：${error.message}`)
    }
  }
  submitButton.disabled = false
  formMessage.className = errors.length ? 'form-message form-error' : 'form-message form-success'
  formMessage.textContent = errors.length
    ? `成功 ${successCount} 个；${errors.join('；')}`
    : `${successCount} 个导入任务已建立，后台会逐个处理并自动发布。`
  if (successCount) {
    fileInput.value = ''
    renderSelectedFiles()
    refreshTasks()
  }
})

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault()
  loginSubmit.disabled = true
  loginMessage.className = 'form-message'
  loginMessage.textContent = '正在验证身份……'
  const response = await fetch('/api/knowledge/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ token: document.querySelector('#session-token').value })
  })
  const payload = await readJson(response)
  loginSubmit.disabled = false
  if (!response.ok || !payload.ok) {
    loginMessage.className = 'form-message form-error'
    loginMessage.textContent = payload.error || '身份验证失败。'
    return
  }
  loginForm.reset()
  showWorkspace(payload.user)
})

document.querySelector('#session-logout').addEventListener('click', async () => {
  await fetch('/api/knowledge/session', { method: 'DELETE' })
  showLogin('已经退出当前身份会话。')
})

document.querySelector('#clear-tasks').addEventListener('click', () => {
  taskIds.clear()
  tasks.clear()
  saveTaskIds()
  renderTasks()
})

renderTasks()
loadSession().catch(() => showLogin('暂时无法验证会话，请稍后重试。'))
