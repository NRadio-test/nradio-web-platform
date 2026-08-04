document.querySelectorAll('[data-current-year]').forEach((node) => {
  node.textContent = String(new Date().getFullYear())
})

const homeEntryCount = document.querySelector('#home-entry-count')
const homeVerifiedDate = document.querySelector('#home-verified-date')

const formatVerifiedMonth = (value) => {
  const match = String(value || '').match(/^(\d{4})-(\d{2})/)
  return match ? `${match[1]}.${match[2]}` : String(value || '—')
}

const applyKnowledgeSummary = (payload) => {
  const entryCount = Number(payload.meta?.entry_count ?? payload.entries?.length)
  if (!Number.isFinite(entryCount)) throw new Error('知识库统计数据无效。')

  homeEntryCount.textContent = String(entryCount)
  homeVerifiedDate.textContent = formatVerifiedMonth(payload.meta?.verified_at)
}

const loadKnowledgeSummary = async () => {
  try {
    const response = await fetch('/api/knowledge?summary=1')
    if (!response.ok) throw new Error(`知识库统计接口返回 ${response.status}`)
    applyKnowledgeSummary(await response.json())
  } catch {
    const response = await fetch('/data/knowledge.json')
    if (!response.ok) throw new Error(`知识库静态数据返回 ${response.status}`)
    applyKnowledgeSummary(await response.json())
  }
}

if (homeEntryCount && homeVerifiedDate) {
  loadKnowledgeSummary().catch(() => {
    homeEntryCount.textContent = '—'
    homeVerifiedDate.textContent = '—'
  })
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (!reducedMotion) {
  requestAnimationFrame(() => document.documentElement.classList.add('is-ready'))
}
