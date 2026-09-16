import { access, readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dataVersion, galaxyPosition, GALAXY_VERSION, validateKnowledgeEntries } from './galaxy-coordinates.mjs'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const webDir = resolve(scriptDir, '..')
const requiredFiles = [
  'frontend/public/index.html',
  'frontend/public/knowledge/index.html',
  'frontend/public/knowledge/galaxy/index.html',
  'frontend/public/knowledge/manage/index.html',
  'frontend/public/knowledge/manage/edit/index.html',
  'frontend/public/assets/site.css',
  'frontend/public/assets/galaxy.css',
  'frontend/public/assets/site.js',
  'frontend/public/assets/knowledge.js',
  'frontend/public/assets/galaxy-data.js',
  'frontend/public/assets/galaxy-scene.js',
  'frontend/public/assets/galaxy-page.js',
  'frontend/public/assets/galaxy-transition.js',
  'frontend/public/assets/galaxy-transition.css',
  'frontend/public/assets/knowledge-manage.js',
  'frontend/public/assets/knowledge-edit.js',
  'frontend/public/assets/nradio-logo.png',
  'frontend/public/assets/pengzai-v9.png',
  'frontend/public/data/knowledge.json',
  'backend/functions/api/knowledge.js',
  'backend/functions/api/health.js',
  'backend/functions/api/knowledge/import.js',
  'backend/functions/api/knowledge/import/[jobId]/metadata.js',
  'backend/functions/api/knowledge/session.js',
  'backend/functions/api/knowledge/edit/[infoId].js',
  'migrations/0001_knowledge_import_jobs.sql'
]

await Promise.all(requiredFiles.map((file) => access(resolve(webDir, file))))

const editPageSource = await readFile(resolve(webDir, 'frontend/public/knowledge/manage/edit/index.html'), 'utf8')
const editStyleSource = await readFile(resolve(webDir, 'frontend/public/assets/site.css'), 'utf8')
if (
  !editPageSource.includes('class="edit-actions"') ||
  !editPageSource.includes('id="submit-edit" type="submit"') ||
  !editPageSource.includes('id="delete-entry" type="button"') ||
  !editStyleSource.includes('grid-template-columns: repeat(2, minmax(0, 1fr))')
) {
  throw new Error('编辑页底部的等宽修改/删除按钮检查失败。')
}

const payload = JSON.parse(await readFile(resolve(webDir, 'frontend/public/data/knowledge.json'), 'utf8'))
if (!Array.isArray(payload.entries)) {
  throw new Error('知识库数据格式无效。')
}

const sourceEntries = (await readFile(resolve(webDir, '..', 'knowledge-base/import/knowledge.jsonl'), 'utf8'))
  .split(/\r?\n/).filter((line) => line.trim()).map((line) => JSON.parse(line))
validateKnowledgeEntries(sourceEntries)
const sourceIds = sourceEntries.map((entry) => entry.id)
const outputIds = payload.entries.map((entry) => entry.id)
if (
  payload.meta?.entry_count !== sourceEntries.length ||
  payload.meta?.galaxy_version !== GALAXY_VERSION ||
  payload.meta?.data_version !== dataVersion(sourceEntries) ||
  JSON.stringify(sourceIds) !== JSON.stringify(outputIds)
) {
  throw new Error('知识同步数据版本或 InfoID 与源 JSONL 不一致，请先运行 npm run sync。')
}

for (const [index, entry] of payload.entries.entries()) {
  const { galaxy: _galaxy, ...sourceFields } = entry
  if (
    JSON.stringify(sourceFields) !== JSON.stringify(sourceEntries[index]) ||
    JSON.stringify(entry.galaxy) !== JSON.stringify(galaxyPosition(sourceEntries[index]))
  ) {
    throw new Error(`InfoID ${entry.id} 的字段或星图坐标与源 JSONL 不一致。`)
  }
}

const firstSource = sourceEntries[0]
for (const invalid of [[firstSource, firstSource], [{ ...firstSource, id: '' }], [{ ...firstSource, text: '' }]]) {
  let rejected = false
  try { validateKnowledgeEntries(invalid) } catch { rejected = true }
  if (!rejected) throw new Error('知识同步未拒绝重复 InfoID 或缺失条目。')
}

for (const entry of payload.entries) {
  for (const field of ['id', 'title', 'text', 'source_url', 'source_type', 'uploaded_by', 'verified_at', 'confidence', 'tags']) {
    if (!(field in entry)) throw new Error(`${entry.id || '未知条目'} 缺少字段 ${field}`)
  }
}

const { onRequestGet: getKnowledge } = await import('../backend/functions/api/knowledge.js')
const fullApiResponse = await getKnowledge({ request: new Request('https://nradio.example/api/knowledge') })
const fullApiPayload = await fullApiResponse.json()
if (
  !fullApiResponse.ok ||
  fullApiPayload.meta?.data_version !== payload.meta.data_version ||
  fullApiPayload.meta?.galaxy_version !== payload.meta.galaxy_version ||
  JSON.stringify(fullApiPayload.entries) !== JSON.stringify(payload.entries)
) {
  throw new Error('知识库 API 与静态回退数据的版本或条目不一致。')
}
const apiResponse = await getKnowledge({
  request: new Request('https://nradio.example/api/knowledge?q=5g')
})
const apiPayload = await apiResponse.json()
if (!apiResponse.ok || !Array.isArray(apiPayload.entries)) {
  throw new Error('知识库 API 查询检查失败。')
}

const summaryResponse = await getKnowledge({
  request: new Request('https://nradio.example/api/knowledge?summary=1')
})
const summaryPayload = await summaryResponse.json()
if (
  !summaryResponse.ok ||
  summaryPayload.meta?.entry_count !== payload.entries.length ||
  'entries' in summaryPayload
) {
  throw new Error('知识库 API 轻量统计检查失败。')
}

const { onRequestGet: getHealth } = await import('../backend/functions/api/health.js')
const healthResponse = await getHealth()
if (!healthResponse.ok) throw new Error('健康检查 API 返回异常。')

const tokenBytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('123456'))
const tokenHash = [...new Uint8Array(tokenBytes)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
const sessionEnv = {
  KNOWLEDGE_SESSION_SECRET: 'local-test-signing-secret-with-32-characters',
  KNOWLEDGE_SESSION_TOKEN_HASHES: Buffer.from(JSON.stringify({ FallaxAura: tokenHash })).toString('base64url')
}
const { onRequestPost: createSession, onRequestGet: getSession } = await import('../backend/functions/api/knowledge/session.js')
const loginResponse = await createSession({
  request: new Request('https://nradio.example/api/knowledge/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: '123456' })
  }),
  env: sessionEnv
})
const sessionCookie = loginResponse.headers.get('Set-Cookie')?.split(';')[0]
const sessionResponse = await getSession({
  request: new Request('https://nradio.example/api/knowledge/session', { headers: { Cookie: sessionCookie } }),
  env: sessionEnv
})
const sessionPayload = await sessionResponse.json()
if (!loginResponse.ok || !sessionResponse.ok || sessionPayload.user?.name !== 'FallaxAura') {
  throw new Error('六位口令会话 API 检查失败。')
}

const firstEntry = payload.entries[0]
const { onRequestGet: getEditableKnowledge, onRequestPost: editKnowledge, onRequestDelete: deleteKnowledge } = await import('../backend/functions/api/knowledge/edit/[infoId].js')
const editGetResponse = await getEditableKnowledge({
  request: new Request(`https://nradio.example/api/knowledge/edit/${encodeURIComponent(firstEntry.id)}`, { headers: { Cookie: sessionCookie } }),
  env: sessionEnv,
  params: { infoId: firstEntry.id }
})
const originalFetch = globalThis.fetch
const dispatchedChanges = []
globalThis.fetch = async (_url, options) => {
  const dispatch = JSON.parse(options.body)
  dispatchedChanges.push(JSON.parse(Buffer.from(dispatch.inputs.payload, 'base64url').toString('utf8')))
  return new Response(null, { status: 204 })
}
const editPostResponse = await editKnowledge({
  request: new Request(`https://nradio.example/api/knowledge/edit/${encodeURIComponent(firstEntry.id)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: sessionCookie },
    body: JSON.stringify({
      title: firstEntry.title,
      text: firstEntry.text,
      source_url: firstEntry.source_url,
      source_type: firstEntry.source_type,
      confidence: firstEntry.confidence,
      tags: firstEntry.tags
    })
  }),
  env: { ...sessionEnv, GITHUB_ACTIONS_TOKEN: 'test-actions-token' },
  params: { infoId: firstEntry.id }
})
const editDeleteResponse = await deleteKnowledge({
  request: new Request(`https://nradio.example/api/knowledge/edit/${encodeURIComponent(firstEntry.id)}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', Cookie: sessionCookie },
    body: JSON.stringify({ confirmation: firstEntry.id, expected_revision: Number(firstEntry.revision || 1) })
  }),
  env: { ...sessionEnv, GITHUB_ACTIONS_TOKEN: 'test-actions-token' },
  params: { infoId: firstEntry.id }
})
const rejectedDeleteResponse = await deleteKnowledge({
  request: new Request(`https://nradio.example/api/knowledge/edit/${encodeURIComponent(firstEntry.id)}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', Cookie: sessionCookie },
    body: JSON.stringify({ confirmation: 'wrong-id', expected_revision: Number(firstEntry.revision || 1) })
  }),
  env: { ...sessionEnv, GITHUB_ACTIONS_TOKEN: 'test-actions-token' },
  params: { infoId: firstEntry.id }
})
const staleDeleteResponse = await deleteKnowledge({
  request: new Request(`https://nradio.example/api/knowledge/edit/${encodeURIComponent(firstEntry.id)}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', Cookie: sessionCookie },
    body: JSON.stringify({ confirmation: firstEntry.id, expected_revision: Number(firstEntry.revision || 1) + 1 })
  }),
  env: { ...sessionEnv, GITHUB_ACTIONS_TOKEN: 'test-actions-token' },
  params: { infoId: firstEntry.id }
})
globalThis.fetch = originalFetch
if (
  !editGetResponse.ok || editPostResponse.status !== 202 || editDeleteResponse.status !== 202 ||
  rejectedDeleteResponse.status !== 400 || staleDeleteResponse.status !== 400 || dispatchedChanges.length !== 2 ||
  dispatchedChanges[0].action !== 'edit' || dispatchedChanges[1].action !== 'delete' ||
  dispatchedChanges[1].info_id !== firstEntry.id
) {
  throw new Error('知识条目编辑或删除 API 检查失败。')
}

const importRows = []
const mockStatement = {
  bind(...values) {
    importRows.push(values)
    return this
  },
  async run() {
    return { success: true }
  }
}
const importForm = new FormData()
importForm.append('file', new File(['NRadio knowledge import test content with enough text.'], 'sample.txt', { type: 'text/plain' }))
const { onRequestPost: importKnowledge } = await import('../backend/functions/api/knowledge/import.js')
const importResponse = await importKnowledge({
  request: new Request('http://localhost/api/knowledge/import', { method: 'POST', body: importForm }),
  env: {
    ALLOW_LOCAL_IMPORTS: 'true',
    KNOWLEDGE_UPLOADS: { async put() {} },
    KNOWLEDGE_DB: { prepare() { return mockStatement } }
  }
})
if (importResponse.status !== 202 || importRows.length < 1) {
  throw new Error('知识库导入 API 检查失败。')
}

const workflowSource = await readFile(resolve(webDir, '../.github/workflows/knowledge-import.yml'), 'utf8')
if (workflowSource.includes('gh pr create') || !workflowSource.includes('git push origin HEAD:main')) {
  throw new Error('知识库导入工作流没有配置为直接发布 main。')
}
const editWorkflowSource = await readFile(resolve(webDir, '../.github/workflows/knowledge-edit.yml'), 'utf8')
if (!editWorkflowSource.includes('scripts/knowledge_edit.py') || !editWorkflowSource.includes('git push origin HEAD:main')) {
  throw new Error('知识条目编辑工作流没有配置为验证后发布 main。')
}
const importJobsSource = await readFile(resolve(webDir, 'backend/functions/_lib/import-jobs.js'), 'utf8')
if (!importJobsSource.includes('dispatchNextImportJob') || !importJobsSource.includes("status IN ('queued', 'parsing', 'reviewing', 'publishing')")) {
  throw new Error('知识库导入队列检查失败。')
}

console.log(`检查通过：${payload.entries.length} 条知识，${requiredFiles.length} 个必要文件，8 个 API。`)
