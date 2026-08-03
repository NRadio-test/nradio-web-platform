import './site.js?v=20260730-2'

const state = {
  entries: [],
  query: '',
  tag: '全部'
}

const grid = document.querySelector('#knowledge-grid')
const searchInput = document.querySelector('#knowledge-search')
const filters = document.querySelector('#tag-filters')
const resultSummary = document.querySelector('#result-summary')
const emptyState = document.querySelector('#empty-state')
const clearFilters = document.querySelector('#clear-filters')

const confidenceLabels = {
  high: '高可信',
  medium_high: '中高可信',
  medium: '中等可信',
  low_medium: '需谨慎引用'
}

const sourceLabels = {
  official_web: '官方网站',
  official_help: '官方帮助中心',
  douyin_profile: '抖音主页',
  douyin_video: '抖音公开视频',
  user_upload: '成员上传资料',
  official_documentation_summary: '官方文档整理',
  error_resolution_guide: '报错解决指南',
  community_and_plugin_guide: '社区与插件指南',
  local_package_analysis: '本地安装包分析'
}

const createElement = (tag, className, text) => {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (text !== undefined) node.textContent = text
  return node
}

const loadKnowledge = async () => {
  const candidates = ['/api/knowledge', '/data/knowledge.json']
  let lastError
  for (const url of candidates) {
    try {
      const response = await fetch(url, { headers: { Accept: 'application/json' } })
      if (!response.ok) throw new Error(`${url} 返回 ${response.status}`)
      return await response.json()
    } catch (error) {
      lastError = error
    }
  }
  throw lastError
}

const renderFilters = () => {
  const counts = new Map()
  state.entries.forEach((entry) => {
    entry.tags.forEach((tag) => counts.set(tag, (counts.get(tag) || 0) + 1))
  })
  const topTags = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh-CN'))
    .slice(0, 10)
  const items = [['全部', state.entries.length], ...topTags]

  filters.replaceChildren(...items.map(([tag, count]) => {
    const button = createElement('button', tag === state.tag ? 'filter-chip active' : 'filter-chip')
    button.type = 'button'
    button.dataset.tag = tag
    button.append(tag, createElement('span', '', String(count)))
    button.addEventListener('click', () => {
      state.tag = tag
      renderFilters()
      renderEntries()
    })
    return button
  }))
}

const matchesEntry = (entry) => {
  const query = state.query.trim().toLocaleLowerCase('zh-CN')
  const haystack = [entry.id, entry.title, entry.text, entry.source_url, entry.source_type, entry.uploaded_by, ...entry.tags].join(' ').toLocaleLowerCase('zh-CN')
  const queryMatch = !query || query.split(/\s+/).every((part) => haystack.includes(part))
  const tagMatch = state.tag === '全部' || entry.tags.includes(state.tag)
  return queryMatch && tagMatch
}

const createCard = (entry, index) => {
  const article = createElement('article', 'knowledge-card')
  article.style.setProperty('--card-order', String(index))

  const top = createElement('div', 'card-topline')
  top.append(
    createElement('span', `confidence confidence-${entry.confidence}`, confidenceLabels[entry.confidence] || entry.confidence),
    createElement('span', 'source-type', sourceLabels[entry.source_type] || entry.source_type)
  )

  const title = createElement('h2', '', entry.title)
  const text = createElement('p', 'knowledge-text', entry.text)
  const tags = createElement('div', 'card-tags')
  entry.tags.forEach((tag) => tags.append(createElement('span', '', tag)))

  const footer = createElement('div', 'card-footer')
  const identity = createElement('div', 'entry-identity')
  const id = createElement('span', 'entry-id', `InfoID · ${entry.id}`)
  const uploader = createElement('span', 'entry-uploader', `上传者 · ${entry.uploaded_by || '未知'}`)
  identity.append(id, uploader)
  const actions = createElement('div', 'card-actions')
  const edit = createElement('a', '', '编辑')
  edit.href = `/knowledge/manage/edit/?id=${encodeURIComponent(entry.id)}`
  const source = createElement('a', '', '查看来源 ↗')
  source.href = entry.source_url
  source.target = '_blank'
  source.rel = 'noreferrer'
  actions.append(edit, source)
  footer.append(identity, actions)

  article.append(top, title, text, tags, footer)
  return article
}

const renderEntries = () => {
  const matches = state.entries.filter(matchesEntry)
  grid.replaceChildren(...matches.map(createCard))
  emptyState.hidden = matches.length !== 0
  grid.hidden = matches.length === 0
  resultSummary.textContent = `显示 ${matches.length} / ${state.entries.length} 条知识`
  clearFilters.hidden = !state.query && state.tag === '全部'
}

const resetFilters = () => {
  state.query = ''
  state.tag = '全部'
  searchInput.value = ''
  renderFilters()
  renderEntries()
  searchInput.focus()
}

searchInput.addEventListener('input', (event) => {
  state.query = event.target.value
  renderEntries()
})
clearFilters.addEventListener('click', resetFilters)
document.querySelector('#empty-reset').addEventListener('click', resetFilters)
document.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    searchInput.focus()
  }
  if (event.key === 'Escape' && document.activeElement === searchInput) resetFilters()
})

try {
  const payload = await loadKnowledge()
  state.entries = payload.entries || []
  document.querySelector('#entry-count').textContent = String(state.entries.length)
  document.querySelector('#source-count').textContent = String(new Set(state.entries.map((entry) => entry.source_type)).size)
  document.querySelector('#verified-date').textContent = payload.meta?.verified_at || '待核对'
  if (payload.meta?.notice) document.querySelector('#knowledge-notice').textContent = payload.meta.notice
  renderFilters()
  renderEntries()
} catch (error) {
  resultSummary.textContent = '知识库暂时无法加载，请稍后刷新。'
  emptyState.hidden = false
  emptyState.querySelector('h2').textContent = '加载失败'
  emptyState.querySelector('p').textContent = error.message
}
