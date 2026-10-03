import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { baseCommit, reviewDate, userConfirmations, categories, groups, archived } from '../knowledge-base/curation/2026-10-03/plan.mjs'
import { validateKnowledgeEntries } from '../Web/scripts/galaxy-coordinates.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const relativeInput = 'knowledge-base/import/knowledge.jsonl'
const inputPath = resolve(root, relativeInput)
const reviewDir = resolve(root, 'knowledge-base/curation', reviewDate)
const hash = (value) => createHash('sha256').update(value).digest('hex')
const referenceUrls = (text) => [...new Set((text.match(/https?:\/\/[^\s、，；;）)。（“”‘’`]+/g) ?? []).map((url) => url.replace(/[.;]+$/, '')))]
const original = execFileSync('git', ['show', `${baseCommit}:${relativeInput}`], { cwd: root, encoding: 'utf8', maxBuffer: 2_000_000 })
const before = original.trim().split('\n').map(JSON.parse)
if (before.length !== 303) throw new Error('This plan requires the reviewed 303-entry snapshot.')
validateKnowledgeEntries(before)

const seen = new Map()
const decisions = new Map()
const categoryOrder = Object.keys(categories)
const confidenceOrder = ['low_medium', 'medium', 'medium_high', 'high']
const statusLabels = {
  source_snapshot: '已整理来源快照',
  current_check_required: '动态信息，回答前核对',
  source_conflict: '资料冲突，确认机型或版本后回答',
}

function claim(rows, kind) {
  for (const row of rows) {
    if (!Number.isInteger(row) || !before[row - 1]) throw new Error(`Unknown source row ${row}`)
    if (seen.has(row)) throw new Error(`Source row ${row} used twice: ${seen.get(row)} and ${kind}`)
    seen.set(row, kind)
  }
}

function cleanProductText(text, row) {
  let result = text
    .replace(/^知识分类：[\s\S]*?产品定位：/, '产品定位：')
    .replace(/(?:资料)?核对日期：\d{4}-\d{2}-\d{2}。?/g, '')
    .replace(/官方来源：[\s\S]*$/, '')
    .replace(/注意：以上速率为官方参数表中的理论最高值，不是实际网速承诺；不同地区、批次和套餐的模组、频段、SIM 形态可能不同，实机信息优先。/g, '适用边界：理论速率不代表实际网速；地区、批次、套餐与实机信息优先。')
    .replace(/注意：以上为理论速率，非实际速度保证，实际速度与运营商、频段和环境有关。/g, '理论速率不代表实际网速，实际受运营商、频段及环境影响。')
    .replace(/C2000\s*MAX/g, 'C2000 Max')
    .replace(/；\s*；/g, '；')
    .replace(/。\s*。/g, '。')
    .replace(/\s{2,}/g, ' ')
    .trim()
  if (row === 200) result = result.replace('天线、指示灯、尺寸与环境：与 C5800-688 的官方机身参数相同；', '尺寸与重量：')
  return result
}

const after = groups.map((group) => {
  claim(group.rows, 'group')
  if (!categories[group.category]) throw new Error(`Unknown category ${group.category}`)
  const canonicalRow = group.canonical ?? group.rows[0]
  if (!group.rows.includes(canonicalRow)) throw new Error(`Canonical row ${canonicalRow} is outside its group`)
  const primary = before[canonicalRow - 1]
  const originals = group.rows.map((row) => before[row - 1])
  const status = group.status ?? 'source_snapshot'
  if (!statusLabels[status]) throw new Error(`Unknown status ${status}`)
  const statusTag = status === 'current_check_required' ? ['动态待复核'] : status === 'source_conflict' ? ['资料冲突'] : []
  const tags = [...new Set([group.category, ...group.tags, ...statusTag])]
  if (tags.length > 12) throw new Error(`Too many tags: ${group.title}`)
  const confidence = group.confidence ?? confidenceOrder[Math.min(...originals.map((entry) => {
    const index = confidenceOrder.indexOf(entry.confidence)
    if (index < 0) throw new Error(`Invalid original confidence: ${entry.id}`)
    return index
  }))]
  const text = group.text === '@source' ? cleanProductText(primary.text, canonicalRow) : group.text.trim()
  if (text.length < 20 || text.length > 12_000) throw new Error(`Text outside edit API limits: ${group.title}`)
  const references = [...new Set(originals.flatMap((entry) => referenceUrls(entry.text)))]
  const preciseProductUrl = group.category === '产品与选型'
    ? referenceUrls(primary.text).find((url) => /^https:\/\/www\.nradiowifi\.com\/article\//.test(url))
    : undefined
  const sourceUrl = preciseProductUrl ?? primary.source_url
  const result = {
    ...primary,
    title: group.title,
    text,
    source_url: sourceUrl,
    confidence,
    tags,
    category: group.category,
    review_status: status,
    reviewed_at: reviewDate,
    source_ids: originals.map((entry) => entry.id),
    source_urls: [...new Set([sourceUrl, ...originals.map((entry) => entry.source_url), ...references])],
    source_records: originals.map((entry) => ({
      id: entry.id,
      source_url: entry.source_url,
      uploaded_by: entry.uploaded_by,
      verified_at: entry.verified_at,
      text_sha256: hash(entry.text),
    })),
    last_edited_by: 'Codex',
    last_edited_at: reviewDate,
    revision: Math.max(...originals.map((entry) => Number(entry.revision) || 1)) + 1,
  }
  for (const row of group.rows) {
    const entry = before[row - 1]
    decisions.set(row, {
      row,
      id: entry.id,
      title: entry.title,
      before_sha256: hash(JSON.stringify(entry)),
      action: entry.id === result.id ? 'revised' : 'merged',
      target_id: result.id,
      target_title: result.title,
      category: group.category,
      reason: group.reason ?? (group.rows.length === 1 ? '保留独立知识，清理正文元信息并统一标签与适用范围。' : '合并同一问题的碎片、重复提示和来源说明，保留一个可独立检索的完整回答。'),
    })
  }
  return result
}).sort((a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category))

for (const item of archived) {
  claim(item.rows, 'archive')
  for (const row of item.rows) {
    const entry = before[row - 1]
    decisions.set(row, {
      row, id: entry.id, title: entry.title,
      before_sha256: hash(JSON.stringify(entry)),
      action: 'removed_from_active', target_id: null, reason: item.reason,
    })
  }
}
const unreviewed = before.map((_, i) => i + 1).filter((row) => !seen.has(row))
if (unreviewed.length) throw new Error(`Unreviewed source rows: ${unreviewed.join(', ')}`)
validateKnowledgeEntries(after)
if (new Set(after.map((entry) => entry.text)).size !== after.length) throw new Error('Duplicate output text')

const generated = after.map((entry) => JSON.stringify(entry)).join('\n') + '\n'
const removed = [...decisions.values()].filter((item) => item.action === 'removed_from_active')
const merged = [...decisions.values()].filter((item) => item.action === 'merged')
const countCharacters = (entries) => entries.reduce((sum, entry) => sum + entry.text.length, 0)
const summary = {
  review_date: reviewDate,
  base_commit: baseCommit,
  snapshot_sha256: hash(original),
  output_sha256: hash(generated),
  before_entries: before.length,
  after_entries: after.length,
  merged_entries: merged.length,
  removed_entries: removed.length,
  before_text_characters: countCharacters(before),
  after_text_characters: countCharacters(after),
  before_distinct_tags: new Set(before.flatMap((entry) => entry.tags)).size,
  after_distinct_tags: new Set(after.flatMap((entry) => entry.tags)).size,
  categories: Object.fromEntries(categoryOrder.map((name) => [name, after.filter((entry) => entry.category === name).length])),
  statuses: Object.fromEntries(Object.keys(statusLabels).map((status) => [status, after.filter((entry) => entry.review_status === status).length])),
}

const mode = process.argv[2] ?? '--dry-run'
if (!['--dry-run', '--apply', '--check'].includes(mode)) throw new Error('Use --dry-run, --apply or --check')
if (mode === '--check') {
  const current = await readFile(inputPath, 'utf8')
  if (current !== generated) throw new Error('Active JSONL differs from the reviewed plan')
  if (await readFile(resolve(reviewDir, 'before.jsonl'), 'utf8') !== original) throw new Error('Archived snapshot differs from base commit')
  const audit = JSON.parse(await readFile(resolve(reviewDir, 'audit.json'), 'utf8'))
  if (JSON.stringify(audit.summary) !== JSON.stringify(summary)) throw new Error('Audit summary differs from plan')
  if (JSON.stringify(audit.decisions) !== JSON.stringify([...decisions.values()].sort((a, b) => a.row - b.row))) throw new Error('Audit coverage differs from plan')
  console.log('Verified every source decision, original snapshot, reviewed output and audit hashes.')
}

if (mode === '--apply') {
  const current = await readFile(inputPath, 'utf8')
  let matchesPriorReviewedOutput = false
  try {
    const priorAudit = JSON.parse(await readFile(resolve(reviewDir, 'audit.json'), 'utf8'))
    matchesPriorReviewedOutput = priorAudit.summary?.snapshot_sha256 === hash(original)
      && priorAudit.summary?.output_sha256 === hash(current)
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
  if (current !== original && current !== generated && !matchesPriorReviewedOutput) {
    throw new Error('Active knowledge changed outside the reviewed plan; refusing to overwrite')
  }
  await mkdir(reviewDir, { recursive: true })
  await writeFile(resolve(reviewDir, 'before.jsonl'), original)
  await writeFile(resolve(reviewDir, 'audit.json'), JSON.stringify({
    summary,
    scope: 'All 303 active entries; source uploads and original upload-review records are evidence archives, not active retrieval inputs.',
    user_confirmations: userConfirmations,
    limitations: [
      'Content review is not a new external fact verification; verified_at retains the original canonical entry date.',
      'Official NRadio pages returned HTTP 403 and OpenWrt Wiki returned an anti-bot page during review.',
      'Future imports are not automatically curated by this one-time plan.',
    ],
    decisions: [...decisions.values()].sort((a, b) => a.row - b.row),
  }, null, 2) + '\n')
  await writeFile(inputPath, generated)

  const topicsDir = resolve(root, 'knowledge-base/topics')
  await mkdir(topicsDir, { recursive: true })
  for (const category of categoryOrder) {
    const entries = after.filter((entry) => entry.category === category)
    const lines = [`# ${category}`, '', `本主题包含 ${entries.length} 条整理后的知识；事实日期见各条目，${reviewDate} 为内容审阅日期。`, '']
    for (const entry of entries) {
      lines.push(`## ${entry.title}`, '', entry.text, '',
        `- InfoID：${entry.id}`,
        `- 原资料核对日期：${entry.verified_at}`,
        `- 审阅状态：${statusLabels[entry.review_status]}`,
        `- 标签：${entry.tags.join('、')}`,
        ...entry.source_urls.map((url) => `- 来源：${url}`), '')
    }
    await writeFile(resolve(topicsDir, `${categories[category]}.md`), lines.join('\n').trim() + '\n')
  }
  const taxonomy = {
    review_date: reviewDate,
    tag_order: '分类、完整型号/系统、主题、必要的动态或冲突标记；不把来源日期、报错全文、上传者或每个芯片字段都变成标签。',
    category_tags: categoryOrder,
    status_tags: { '动态待复核': statusLabels.current_check_required, '资料冲突': statusLabels.source_conflict },
    aliases: { 'C8-788': 'C2000 Max', '788': 'C2000 Max', 'C2000MAX': 'C2000 Max', 'C2000-MAX': 'C2000 Max', 'C2000 MAX': 'C2000 Max', 'C8-798': 'C2000 Ultra', '798': 'C2000 Ultra', 'WiFi': 'Wi-Fi', 'WIFI': 'Wi-Fi', 'NBPCE': 'NBCPE' },
    cautions: ['Model aliases do not authorize combining conflicting hardware parameters from different source versions.'],
    tags: [...new Set(after.flatMap((entry) => entry.tags))].sort().map((tag) => ({ tag, entries: after.filter((entry) => entry.tags.includes(tag)).length })),
  }
  await writeFile(resolve(root, 'knowledge-base/import/tag-taxonomy.json'), JSON.stringify(taxonomy, null, 2) + '\n')
  const reduction = ((1 - after.length / before.length) * 100).toFixed(1)
  const textReduction = ((1 - countCharacters(after) / countCharacters(before)) * 100).toFixed(1)
  const lines = [
    '# 2026-10-03 知识库清洗审阅记录', '',
    `已逐条审阅 ${before.length} 条原知识，重组为 ${after.length} 条；${merged.length} 个重复/碎片条目并入其他条目，${removed.length} 条移出当前检索。条目减少 ${reduction}%，正文从 ${countCharacters(before)} 缩减为 ${countCharacters(after)} 字符（减少 ${textReduction}%）；标签从 ${summary.before_distinct_tags} 种统一为 ${summary.after_distinct_tags} 种。`, '',
    '## 可用内容', '',
    ...categoryOrder.map((category) => `- [${category}](../../topics/${categories[category]}.md)：${summary.categories[category]} 条。`), '',
    '生产同步仍只读 `knowledge-base/import/knowledge.jsonl`；`topics/` 是按主题组织的可读副本。`before.jsonl`、原始上传、旧上传文档和审计不进入网页或 AstrBot 当前检索文件。', '',
    '## 审阅边界', '',
    '- 产品参数保留完整型号，不按产品年龄删掉仍有用户设备的支持资料；N8 明确标注历史产品。',
    '- 根据用户 2026-10-03 明确确认，C8-788 就是 C2000 Max；统一型号与别名，不另建产品。旧来源外形/接口参数差异、Max/Ultra 早期 Wi-Fi 规格、C2000-500 规格、C5800-688 2.4GHz 带宽标记待确认，不能自动拼接。',
    '- C5800-688 用已有四页增量资料修正接口、PoE 描述和环境尾句，保留批次差异。',
    '- 套餐、欠费和会员条件保留历史资料日期，降为动态待复核；不承诺当下资费、销户结果或征信影响。',
    '- 直播建议保留转写文件/时间段及未回听、日期未核验限制，不能当正式零售规格或召回政策。',
    '- 本次是内容整理审阅；NRadio 官方页返回 403，OpenWrt Wiki 返回反爬页，未声称完成外部参数重新核验。',
    '- 本次一次性整理不修改上传审核模型或自动导入规则；后续新增内容需按相同分类和去重规则审阅。', '',
    '## 恢复与追溯', '',
    `清洗基线提交为 \`${baseCommit}\`。完整原始活动库保存在 [before.jsonl](before.jsonl)，SHA-256 为 \`${summary.snapshot_sha256}\`。`, '',
    '[audit.json](audit.json) 逐条记录全部 303 个旧 InfoID 的修改、合并目标或移除原因；[plan.mjs](plan.mjs) 是具体分组、正文和标签。保留条目的 InfoID、原上传者和原核对日期不伪造；新增 reviewed_at 仅表示编辑审阅日期，合并来源的日期单独保存在 source_records。', '',
    '检查命令：`node scripts/curate_knowledge.mjs --check`；同步仍用 `npm --prefix Web run sync` 和 `npm --prefix Web run check`。若要恢复，先审查后续新增或编辑，再把 before.jsonl 恢复为活动库并重新同步，不覆盖后来的用户工作。', '',
    '## 移出当前检索的条目', '',
    '| 原 InfoID | 原标题 | 原因 |',
    '| --- | --- | --- |',
    ...removed.map((item) => `| ${item.id} | ${item.title.replaceAll('|', '\\|')} | ${item.reason} |`), '',
  ]
  await writeFile(resolve(reviewDir, 'README.md'), lines.join('\n').trim() + '\n')
}
console.log(JSON.stringify(summary, null, 2))
