const SOURCES = ['/api/knowledge', '/data/knowledge.json']

const fetchPayload = async (url) => {
  const response = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!response.ok) throw new Error(`${url} 返回 ${response.status}`)
  const payload = await response.json()
  if (!Array.isArray(payload?.entries)) throw new Error(`${url} 数据格式无效`)
  if (payload.meta?.galaxy_version !== 1) throw new Error(`${url} 坐标版本不受支持`)
  if (payload.meta?.entry_count !== payload.entries.length) throw new Error(`${url} 条目计数与元数据不一致`)
  return payload
}

const hashId = (value) => {
  let hash = 2166136261
  for (const character of value) {
    hash ^= character.codePointAt(0)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

// A stable emergency position keeps an API-only row usable until the next sync.
const emergencyPosition = (id) => {
  const hash = hashId(id)
  const longitude = ((hash & 0xffff) / 0xffff) * Math.PI * 2
  const latitude = (((hash >>> 16) / 0xffff) * 1.8 - .9)
  const radius = .67 + ((hash % 97) / 97) * .28
  const ring = Math.sqrt(1 - latitude * latitude)
  return { x: radius * ring * Math.cos(longitude), y: radius * latitude, z: radius * ring * Math.sin(longitude) }
}

const normalizePayload = (payload) => {
  const ids = new Set()
  const warnings = []
  const entries = []
  for (const raw of payload.entries) {
    const id = typeof raw?.id === 'string' ? raw.id.trim() : ''
    if (!id) { warnings.push('存在缺失 InfoID 的条目，已跳过'); continue }
    if (ids.has(id)) { warnings.push(`重复 InfoID ${id} 已跳过`); continue }
    ids.add(id)
    const galaxy = raw.galaxy
    const hasPosition = galaxy && ['x', 'y', 'z'].every((axis) => Number.isFinite(galaxy[axis])) &&
      Math.hypot(galaxy.x, galaxy.y, galaxy.z) <= 1.1
    if (!hasPosition) warnings.push(`InfoID ${id} 缺少同步坐标，使用临时稳定位置`)
    entries.push({
      ...raw,
      id,
      tags: Array.isArray(raw.tags) ? raw.tags.filter((tag) => typeof tag === 'string' && tag.trim()) : [],
      galaxy: hasPosition ? galaxy : emergencyPosition(id)
    })
  }
  return { entries, meta: payload.meta || {}, warnings }
}

export const loadGalaxyKnowledge = async () => {
  const results = await Promise.allSettled(SOURCES.map(fetchPayload))
  const api = results[0].status === 'fulfilled' ? results[0].value : null
  const fallback = results[1].status === 'fulfilled' ? results[1].value : null
  if (!api && !fallback) throw new Error(`API 与静态数据均无法加载：${results.map((item) => item.reason?.message).join('；')}`)

  const selected = normalizePayload(api || fallback)
  const warnings = [...selected.warnings]
  const apiVersion = api?.meta?.data_version
  const staticVersion = fallback?.meta?.data_version
  if (api && fallback && apiVersion !== staticVersion) {
    warnings.push('API 与静态数据版本不一致；本次以 API 和其中的坐标为准')
  }
  if (!api && fallback && results[0].reason?.message !== '/api/knowledge 返回 404') {
    warnings.push(`API 数据不可用；已回退本站静态数据（${results[0].reason?.message || '未知原因'}）`)
  }
  return { ...selected, warnings, source: api ? 'api' : 'static' }
}

export const matchesGalaxyEntry = (entry, query, tag = '全部') => {
  const normalized = query.trim().toLocaleLowerCase('zh-CN')
  const haystack = [entry.id, entry.title, entry.text, ...entry.tags].join(' ').toLocaleLowerCase('zh-CN')
  return (!normalized || normalized.split(/\s+/).every((part) => haystack.includes(part))) &&
    (tag === '全部' || entry.tags.includes(tag))
}

export const confidenceLabels = {
  high: '高可信', medium_high: '中高可信', medium: '中等可信', low_medium: '需谨慎引用'
}

export const sourceLabels = {
  official_web: '官方网站', official_help: '官方帮助中心', douyin_profile: '抖音主页',
  douyin_video: '抖音公开视频', user_upload: '成员上传资料',
  official_documentation_summary: '官方文档整理', error_resolution_guide: '报错解决指南',
  community_and_plugin_guide: '社区与插件指南', local_package_analysis: '本地安装包分析'
}
