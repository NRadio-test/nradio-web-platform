import { access, readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const webDir = resolve(scriptDir, '..')
const requiredFiles = [
  'frontend/public/index.html',
  'frontend/public/knowledge/index.html',
  'frontend/public/knowledge/manage/index.html',
  'frontend/public/assets/site.css',
  'frontend/public/assets/site.js',
  'frontend/public/assets/knowledge.js',
  'frontend/public/assets/knowledge-manage.js',
  'frontend/public/assets/pengzai-v8.png',
  'frontend/public/data/knowledge.json',
  'backend/functions/api/knowledge.js',
  'backend/functions/api/health.js',
  'backend/functions/api/knowledge/import.js',
  'backend/functions/api/knowledge/import/[jobId]/metadata.js',
  'backend/functions/api/knowledge/session.js',
  'migrations/0001_knowledge_import_jobs.sql'
]

await Promise.all(requiredFiles.map((file) => access(resolve(webDir, file))))

const payload = JSON.parse(await readFile(resolve(webDir, 'frontend/public/data/knowledge.json'), 'utf8'))
if (!Array.isArray(payload.entries) || payload.entries.length === 0) {
  throw new Error('知识库数据为空。')
}

for (const entry of payload.entries) {
  for (const field of ['id', 'title', 'text', 'source_url', 'source_type', 'uploaded_by', 'verified_at', 'confidence', 'tags']) {
    if (!(field in entry)) throw new Error(`${entry.id || '未知条目'} 缺少字段 ${field}`)
  }
}

const { onRequestGet: getKnowledge } = await import('../backend/functions/api/knowledge.js')
const apiResponse = await getKnowledge({
  request: new Request('https://nradio.example/api/knowledge?q=5g')
})
const apiPayload = await apiResponse.json()
if (!apiResponse.ok || !Array.isArray(apiPayload.entries) || apiPayload.entries.length === 0) {
  throw new Error('知识库 API 查询检查失败。')
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
if (importResponse.status !== 202 || importRows.length < 2) {
  throw new Error('知识库导入 API 检查失败。')
}

console.log(`检查通过：${payload.entries.length} 条知识，${requiredFiles.length} 个必要文件，5 个 API。`)
