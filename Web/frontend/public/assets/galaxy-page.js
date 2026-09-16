import { loadGalaxyKnowledge, matchesGalaxyEntry, confidenceLabels, sourceLabels } from './galaxy-data.js?v=20260916-10'
import { GalaxyScene, getGalaxyRelations } from './galaxy-scene.js?v=20260916-10'
import { prepareGalaxyArrival } from './galaxy-transition.js?v=20260916-10'

const finishGalaxyArrival = prepareGalaxyArrival()

const $ = (selector) => document.querySelector(selector)
const canvas = $('#galaxy-canvas')
const search = $('#galaxy-search')
const results = $('#galaxy-results')
const tags = $('#galaxy-tags')
const status = $('#galaxy-status')
const count = $('#galaxy-count')
const tooltip = $('#galaxy-tooltip')
const detail = $('#galaxy-detail')
const detailContent = $('#galaxy-detail-content')
const legend = $('#galaxy-legend')

const state = { entries: [], query: '', tag: '全部', selectedId: null, warnings: [], source: 'api' }
const add = (parent, tag, className, text) => {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (text !== undefined) node.textContent = text
  parent.append(node)
  return node
}

const updateTooltip = (entry) => {
  tooltip.hidden = !entry
  if (!entry) return
  tooltip.textContent = entry.title
  const point = scene.project(entry.galaxy)
  const canvasRect = canvas.getBoundingClientRect()
  const box = tooltip.getBoundingClientRect()
  const anchorX = point.x + canvasRect.left
  const anchorY = point.y + canvasRect.top
  const preferredLeft = anchorX + box.width + 24 > innerWidth ? anchorX - box.width - 12 : anchorX + 12
  const preferredTop = anchorY - box.height - 12 < 12 ? anchorY + 12 : anchorY - box.height - 12
  const left = Math.min(innerWidth - box.width - 12, Math.max(12, preferredLeft))
  const top = Math.min(innerHeight - box.height - 12, Math.max(12, preferredTop))
  tooltip.style.left = `${left}px`
  tooltip.style.top = `${top}px`
}

const scene = new GalaxyScene(canvas, {
  onPick: (entry) => selectEntry(entry),
  onHover: updateTooltip
})
if (finishGalaxyArrival.view) {
  scene.yaw = finishGalaxyArrival.view.yaw
  scene.pitch = finishGalaxyArrival.view.pitch
  scene.requestDraw()
}

const safeSource = (value) => {
  try {
    const url = new URL(value)
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null
  } catch { return null }
}

const detailField = (parent, label, value) => {
  const field = add(parent, 'div', 'galaxy-detail-meta-field')
  add(field, 'span', '', label)
  add(field, 'strong', '', value || '未提供')
}

const renderDetail = (entry) => {
  detailContent.replaceChildren()
  add(detailContent, 'p', 'galaxy-detail-id', `InfoID · ${entry.id}`)
  add(detailContent, 'h2', 'galaxy-detail-title', entry.title)
  const meta = add(detailContent, 'div', 'galaxy-detail-meta')
  detailField(meta, '来源类型', sourceLabels[entry.source_type] || entry.source_type)
  detailField(meta, '资料核对日期', entry.verified_at || '待核对')
  detailField(meta, '可信度', confidenceLabels[entry.confidence] || entry.confidence)
  add(detailContent, 'p', 'galaxy-detail-text', entry.text)
  const tagBox = add(detailContent, 'div', 'galaxy-detail-tags')
  for (const tag of entry.tags) add(tagBox, 'span', '', tag)
  const relations = getGalaxyRelations(entry, state.entries)
  add(detailContent, 'p', 'galaxy-detail-relation',
    `关联线依据：相同来源链接，或至少共享两个标签。当前可关联 ${relations.length} 个知识块；最多显示 9 条，背面连线会随转动出现。`)
  const url = safeSource(entry.source_url)
  if (url) {
    const link = add(detailContent, 'a', 'galaxy-detail-source', '查看原始来源 ↗')
    link.href = url
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
  } else add(detailContent, 'p', 'galaxy-detail-source', '此知识块没有可打开的公开来源链接')
}

const changeDeepLink = (id) => {
  const url = new URL(location.href)
  if (id) url.searchParams.set('id', id)
  else url.searchParams.delete('id')
  history.replaceState(null, '', url)
}

function selectEntry(entry, updateUrl = true) {
  state.selectedId = entry.id
  scene.setSelected(entry.id)
  scene.focusEntry(entry.id)
  renderDetail(entry)
  detail.hidden = false
  $('#galaxy-main').classList.add('galaxy-has-detail')
  tooltip.hidden = true
  setLegend(true)
  if (updateUrl) changeDeepLink(entry.id)
  status.textContent = `已选中 ${entry.id} · ${entry.title}`
}

const closeDetail = ({ focus = true, updateUrl = true } = {}) => {
  if (!state.selectedId) return
  state.selectedId = null
  scene.setSelected(null)
  if (matchMedia('(max-width: 700px)').matches) scene.animateView(scene.yaw, scene.pitch, scene.distance, 0, 0)
  detail.hidden = true
  $('#galaxy-main').classList.remove('galaxy-has-detail')
  setLegend(false)
  if (updateUrl) changeDeepLink(null)
  updateStatus()
  if (focus) $('#galaxy-reset-view').focus()
}

const setLegend = (selected) => {
  legend.replaceChildren()
  const point = add(legend, 'p', '')
  add(point, 'span', 'galaxy-legend-dot').setAttribute('aria-hidden', 'true')
  point.append('可选亮星：一个 InfoID 对应一个网站知识块。')
  const grain = add(legend, 'p', '')
  add(grain, 'span', 'galaxy-legend-grain').setAttribute('aria-hidden', 'true')
  grain.append('细碎星雾与少量星芒：不计入知识块，不可点击，也不表示知识关联。')
  const line = add(legend, 'p', '')
  add(line, 'span', 'galaxy-legend-line').setAttribute('aria-hidden', 'true')
  line.append(selected
    ? '仅选中时连线：同一来源链接（暖色），或至少共享两个标签（冷色）；最多 9 条。'
    : '选中后仅突出有依据的关联连线。')
}

const updateStatus = (matches = state.entries) => {
  if (!scene.ctx) {
    status.textContent = `图形不可用；仍可在结果列表中查看 ${matches.length} 个知识块的完整内容。`
    return
  }
  const filtered = Boolean(state.query.trim() || state.tag !== '全部')
  const sourceNote = state.source === 'static' ? ' · 本站静态数据' : ''
  status.textContent = filtered
    ? `高亮 ${matches.length} / ${state.entries.length} 个知识块${sourceNote}` : `${state.entries.length} 个网站知识块 · 拖拽转动，滚轮缩放${sourceNote}`
}

const updateResults = (matches) => {
  results.replaceChildren()
  const filtered = !scene.ctx || Boolean(state.query.trim() || state.tag !== '全部')
  results.hidden = !filtered
  if (!filtered) return
  if (!matches.length) {
    add(results, 'p', 'galaxy-results-empty', '没有匹配的知识块；可以缩短关键词或清除筛选。')
    return
  }
  const summary = add(results, 'p', 'galaxy-results-summary', `匹配 ${matches.length} 个知识块`)
  summary.setAttribute('aria-live', 'polite')
  for (const entry of matches) {
    const button = add(results, 'button', 'galaxy-result-item')
    button.type = 'button'
    add(button, 'span', '', entry.title)
    add(button, 'small', '', entry.id)
    button.addEventListener('click', () => selectEntry(entry))
  }
}

const updateFilter = () => {
  const matches = state.entries.filter((entry) => matchesGalaxyEntry(entry, state.query, state.tag))
  if (state.selectedId && !matches.some((entry) => entry.id === state.selectedId)) closeDetail({ focus: false })
  scene.setMatches(state.query.trim() || state.tag !== '全部' ? new Set(matches.map((entry) => entry.id)) : null)
  updateResults(matches)
  updateStatus(matches)
  $('#galaxy-clear').hidden = !state.query.trim() && state.tag === '全部'
}

const renderTagSelect = () => {
  const counts = new Map()
  for (const entry of state.entries) for (const tag of entry.tags) counts.set(tag, (counts.get(tag) || 0) + 1)
  const label = add(tags, 'label', 'galaxy-tag-label')
  add(label, 'span', '', '标签筛选')
  const select = add(label, 'select', '', '')
  select.id = 'galaxy-tag-select'
  const all = add(select, 'option', '', `全部标签 · ${state.entries.length}`)
  all.value = '全部'
  for (const [tag, number] of [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh-CN'))) {
    const option = add(select, 'option', '', `${tag} · ${number}`)
    option.value = tag
  }
  select.addEventListener('change', () => { state.tag = select.value; updateFilter() })
}

search.addEventListener('input', () => { state.query = search.value; updateFilter() })
$('#galaxy-clear').addEventListener('click', () => {
  state.query = ''
  state.tag = '全部'
  search.value = ''
  $('#galaxy-tag-select').value = '全部'
  closeDetail({ focus: false })
  updateFilter()
})
const resetView = () => { closeDetail({ focus: false }); scene.resetView() }
$('#galaxy-reset-view').addEventListener('click', resetView)
$('#galaxy-zoom-in').addEventListener('click', () => scene.zoomAt(.82))
$('#galaxy-zoom-out').addEventListener('click', () => scene.zoomAt(1.22))
$('#galaxy-detail-close').addEventListener('click', () => closeDetail())

const pointers = new Map()
let moved = false
let pinched = false
const localPoint = (event) => {
  const rect = canvas.getBoundingClientRect()
  return { x: event.clientX - rect.left, y: event.clientY - rect.top }
}
const pinchInfo = () => {
  const [a, b] = [...pointers.values()]
  return { distance: Math.hypot(a.x - b.x, a.y - b.y), x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}

canvas.addEventListener('pointerdown', (event) => {
  canvas.setPointerCapture(event.pointerId)
  const point = localPoint(event)
  pointers.set(event.pointerId, { ...point, startX: point.x, startY: point.y })
  moved = false
  if (pointers.size > 1) pinched = true
  scene.dragging = true
  scene.setHovered(null)
})
canvas.addEventListener('pointermove', (event) => {
  const point = localPoint(event)
  if (!pointers.has(event.pointerId)) {
    if (event.pointerType !== 'touch') scene.pointerHover(point.x, point.y)
    return
  }
  const previous = pointers.get(event.pointerId)
  const beforePinch = pointers.size >= 2 ? pinchInfo() : null
  pointers.set(event.pointerId, { ...point, startX: previous.startX, startY: previous.startY })
  if (pointers.size >= 2) {
    const afterPinch = pinchInfo()
    if (beforePinch?.distance && afterPinch.distance) scene.zoomAt(beforePinch.distance / afterPinch.distance, afterPinch.x, afterPinch.y)
    moved = true
    pinched = true
  } else {
    const dx = point.x - previous.x, dy = point.y - previous.y
    // Screen-space drag follows the pointer: a downward drag brings the front upward-facing surface down.
    if (Math.hypot(dx, dy) > 0) scene.rotate(dx, -dy)
    if (Math.hypot(point.x - previous.startX, point.y - previous.startY) > 5) moved = true
  }
})
const endPointer = (event) => {
  const point = localPoint(event)
  const shouldPick = pointers.size === 1 && !moved && !pinched
  pointers.delete(event.pointerId)
  if (!pointers.size) { scene.dragging = false; pinched = false }
  if (shouldPick) scene.pointerPick(point.x, point.y)
}
canvas.addEventListener('pointerup', endPointer)
canvas.addEventListener('pointercancel', (event) => {
  pointers.delete(event.pointerId)
  if (!pointers.size) { scene.dragging = false; pinched = false }
})
canvas.addEventListener('pointerleave', () => { if (!pointers.size) scene.setHovered(null) })
canvas.addEventListener('wheel', (event) => {
  event.preventDefault()
  const point = localPoint(event)
  scene.zoomAt(Math.exp(event.deltaY * .00115), point.x, point.y)
}, { passive: false })

document.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault(); search.focus(); return
  }
  if (event.key === 'Escape' && state.selectedId) { event.preventDefault(); closeDetail(); return }
  if (event.key === '/' && !['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
    event.preventDefault(); search.focus(); return
  }
  if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) return
  if (event.key === '+' || event.key === '=') scene.zoomAt(.82)
  else if (event.key === '-' || event.key === '_') scene.zoomAt(1.22)
  else if (event.key === '0') resetView()
  else if (event.key === 'ArrowLeft') scene.rotate(-30, 0)
  else if (event.key === 'ArrowRight') scene.rotate(30, 0)
  else if (event.key === 'ArrowUp') scene.rotate(0, -30)
  else if (event.key === 'ArrowDown') scene.rotate(0, 30)
  else return
  event.preventDefault()
})

window.addEventListener('popstate', () => {
  const id = new URL(location.href).searchParams.get('id')
  const entry = state.entries.find((item) => item.id === id)
  if (entry) selectEntry(entry, false)
  else closeDetail({ focus: false, updateUrl: false })
})

try {
  const payload = await loadGalaxyKnowledge()
  state.entries = payload.entries
  state.warnings = payload.warnings
  state.source = payload.source
  scene.setEntries(state.entries, payload.meta.data_version)
  count.textContent = `${state.entries.length} 个知识块`
  renderTagSelect()
  updateFilter()
  if (state.warnings.length) {
    const note = add(status.parentElement, 'p', 'galaxy-data-warning', state.warnings.join('；'))
    note.setAttribute('role', 'status')
  }
  const id = new URL(location.href).searchParams.get('id')
  if (id) {
    const entry = state.entries.find((item) => item.id === id)
    if (entry) selectEntry(entry, false)
    else status.textContent = `InfoID ${id} 不在当前知识数据中`
  }
  finishGalaxyArrival()
} catch (error) {
  status.textContent = `知识星图暂时无法加载：${error.message}`
  count.textContent = '0 个知识块'
  finishGalaxyArrival()
}
