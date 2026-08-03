import './site.js?v=20260803-1'

const loginPanel = document.querySelector('#session-login')
const loginForm = document.querySelector('#session-login-form')
const loginMessage = document.querySelector('#session-message')
const loginSubmit = document.querySelector('#session-submit')
const workspace = document.querySelector('#edit-workspace')
const editForm = document.querySelector('#knowledge-edit-form')
const editMessage = document.querySelector('#edit-message')
const submitButton = document.querySelector('#submit-edit')
const infoId = new URLSearchParams(location.search).get('id') || ''

const readJson = async (response) => response.json().catch(() => ({}))

const showLogin = (message = '') => {
  loginPanel.hidden = false
  workspace.hidden = true
  loginMessage.textContent = message
}

const fillEntry = (entry) => {
  document.querySelector('#edit-info-id').textContent = entry.id
  document.querySelector('#edit-uploader').textContent = entry.uploaded_by || '未知'
  document.querySelector('#edit-revision').textContent = String(entry.revision || 1)
  document.querySelector('#edit-title').value = entry.title || ''
  document.querySelector('#edit-text').value = entry.text || ''
  document.querySelector('#edit-source-url').value = entry.source_url || ''
  document.querySelector('#edit-source-type').value = entry.source_type || 'user_upload'
  document.querySelector('#edit-confidence').value = entry.confidence || 'medium'
  document.querySelector('#edit-tags').value = (entry.tags || []).join('、')
}

const loadEntry = async () => {
  if (!infoId) {
    showLogin('缺少 InfoID。请从知识卡片或 AstrBot 管理界面的“编辑”入口进入。')
    loginForm.hidden = true
    return
  }
  const response = await fetch(`/api/knowledge/edit/${encodeURIComponent(infoId)}`, { headers: { Accept: 'application/json' } })
  const payload = await readJson(response)
  if (response.status === 401) return showLogin()
  if (!response.ok || !payload.ok) throw new Error(payload.error || `知识读取返回 ${response.status}`)
  loginPanel.hidden = true
  workspace.hidden = false
  document.querySelector('#session-user-name').textContent = payload.user.name
  fillEntry(payload.entry)
}

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
  await loadEntry().catch((error) => showLogin(error.message))
})

editForm.addEventListener('submit', async (event) => {
  event.preventDefault()
  submitButton.disabled = true
  editMessage.className = 'form-message'
  editMessage.textContent = '正在提交经过身份标记的编辑任务……'
  const tags = document.querySelector('#edit-tags').value
    .split(/[、,，;；\n]+/)
    .map((tag) => tag.trim())
    .filter(Boolean)
  const response = await fetch(`/api/knowledge/edit/${encodeURIComponent(infoId)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      title: document.querySelector('#edit-title').value,
      text: document.querySelector('#edit-text').value,
      source_url: document.querySelector('#edit-source-url').value,
      source_type: document.querySelector('#edit-source-type').value,
      confidence: document.querySelector('#edit-confidence').value,
      tags
    })
  })
  const payload = await readJson(response)
  submitButton.disabled = false
  if (response.status === 401) return showLogin('会话已过期，请重新输入身份口令。')
  if (!response.ok || !payload.ok) {
    editMessage.className = 'form-message form-error'
    editMessage.textContent = payload.error || `提交返回 ${response.status}`
    return
  }
  editMessage.className = 'form-message form-success'
  editMessage.textContent = payload.message
  document.querySelector('#edit-confirm').checked = false
})

document.querySelector('#session-logout').addEventListener('click', async () => {
  await fetch('/api/knowledge/session', { method: 'DELETE' })
  showLogin('已经退出当前身份会话。')
})

loadEntry().catch((error) => showLogin(error.message))
