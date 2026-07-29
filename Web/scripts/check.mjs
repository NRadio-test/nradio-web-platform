import { access, readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const webDir = resolve(scriptDir, '..')
const requiredFiles = [
  'frontend/public/index.html',
  'frontend/public/knowledge/index.html',
  'frontend/public/assets/site.css',
  'frontend/public/assets/site.js',
  'frontend/public/assets/knowledge.js',
  'frontend/public/assets/pengzai-v5.png',
  'frontend/public/data/knowledge.json',
  'backend/functions/api/knowledge.js',
  'backend/functions/api/health.js'
]

await Promise.all(requiredFiles.map((file) => access(resolve(webDir, file))))

const payload = JSON.parse(await readFile(resolve(webDir, 'frontend/public/data/knowledge.json'), 'utf8'))
if (!Array.isArray(payload.entries) || payload.entries.length === 0) {
  throw new Error('知识库数据为空。')
}

for (const entry of payload.entries) {
  for (const field of ['id', 'title', 'text', 'source_url', 'source_type', 'verified_at', 'confidence', 'tags']) {
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

console.log(`检查通过：${payload.entries.length} 条知识，${requiredFiles.length} 个必要文件，2 个 API。`)
