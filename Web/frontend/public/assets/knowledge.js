import './site.js?v=20260730-2'
import { loadGalaxyKnowledge, confidenceLabels, sourceLabels } from './galaxy-data.js?v=20260916-1'
import { installGalaxyDeparture } from './galaxy-transition.js?v=20260916-2'

const previewAnchor = document.querySelector('#galaxy-preview')
const previewCanvas = document.querySelector('#galaxy-preview-canvas')
let previewScene = null
installGalaxyDeparture(previewAnchor, previewCanvas, () => previewScene && { yaw: previewScene.yaw, pitch: previewScene.pitch })

const state = {
  entries: [],
  query: '',
  tag: '全部',
  source: 'api'
}

const grid = document.querySelector('#knowledge-grid')
const searchInput = document.querySelector('#knowledge-search')
const filters = document.querySelector('#tag-filters')
const resultSummary = document.querySelector('#result-summary')
const emptyState = document.querySelector('#empty-state')
const clearFilters = document.querySelector('#clear-filters')

const createElement = (tag, className, text) => {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (text !== undefined) node.textContent = text
  return node
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
  resultSummary.textContent = `显示 ${matches.length} / ${state.entries.length} 个网站知识块${state.source === 'static' ? ' · 本站静态数据' : ''}`
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
  const payload = await loadGalaxyKnowledge()
  state.entries = payload.entries
  state.source = payload.source
  document.querySelector('#verified-date').textContent = payload.meta?.verified_at || '待核对'
  if (payload.meta?.notice) document.querySelector('#knowledge-notice').textContent = payload.meta.notice
  renderFilters()
  renderEntries()
  const previewStatus = document.querySelector('#galaxy-preview-status')
  if (previewCanvas) {
    try {
      const { GalaxyScene } = await import('./galaxy-scene.js?v=20260916-5')
      const preview = new GalaxyScene(previewCanvas, { preview: true })
      preview.setEntries(state.entries, payload.meta?.data_version)
      preview.draw()
      previewScene = preview
      previewCanvas.dataset.galaxyReady = 'true'
      previewStatus.textContent = payload.warnings.length ? '数据需核对' : `${state.entries.length} 个知识块`
    } catch (error) {
      previewStatus.textContent = '星图预览不可用 · 仍可进入全屏页面'
    }
  }
  if (payload.warnings.length) resultSummary.textContent += ` · ${payload.warnings.join('；')}`
} catch (error) {
  resultSummary.textContent = '知识库暂时无法加载，请稍后刷新。'
  emptyState.hidden = false
  emptyState.querySelector('h2').textContent = '加载失败'
  emptyState.querySelector('p').textContent = error.message
}
