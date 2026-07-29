const encoder = new TextEncoder()

export const allowedExtensions = new Set([
  'pdf', 'txt', 'md', 'markdown', 'rst', 'adoc', 'docx', 'xlsx', 'xls', 'epub'
])

export const sanitizeFilename = (value) => {
  const base = String(value || 'document').replace(/\\/g, '/').split('/').pop()
  const safe = base.replace(/[^\p{L}\p{N}._ -]+/gu, '_').replace(/^\.+/, '').slice(0, 160)
  return safe || 'document'
}

export const sha256Hex = async (value) => {
  const input = typeof value === 'string' ? encoder.encode(value) : value
  const digest = await crypto.subtle.digest('SHA-256', input)
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

export const timingSafeEqual = async (left, right) => {
  const [leftHash, rightHash] = await Promise.all([sha256Hex(String(left)), sha256Hex(String(right))])
  return leftHash === rightHash
}

export const requireImportBindings = (env) => {
  if (!env.KNOWLEDGE_UPLOADS || !env.KNOWLEDGE_DB) {
    throw new Error('知识库上传存储尚未配置。')
  }
}

export const getJob = async (env, jobId) => env.KNOWLEDGE_DB
  .prepare('SELECT * FROM knowledge_import_jobs WHERE id = ?')
  .bind(jobId)
  .first()

export const updateJob = async (env, jobId, fields) => {
  const entries = Object.entries(fields).filter(([, value]) => value !== undefined)
  if (entries.length === 0) return
  const assignments = entries.map(([key]) => `${key} = ?`).join(', ')
  const values = entries.map(([, value]) => value)
  await env.KNOWLEDGE_DB
    .prepare(`UPDATE knowledge_import_jobs SET ${assignments}, updated_at = ? WHERE id = ?`)
    .bind(...values, new Date().toISOString(), jobId)
    .run()
}

export const publicJob = (job) => ({
  id: job.id,
  filename: job.filename,
  size: job.size,
  content_type: job.content_type,
  title: job.title,
  uploaded_by: job.uploader,
  source_url: job.source_url,
  status: job.status,
  progress: job.progress,
  message: job.message,
  pr_url: job.pr_url,
  document_path: job.document_path,
  entry_count: job.entry_count,
  error: job.error,
  created_at: job.created_at,
  updated_at: job.updated_at
})

export const requireServiceToken = async (request, env) => {
  const expected = String(env.IMPORT_SERVICE_TOKEN || '')
  const authorization = request.headers.get('Authorization') || ''
  const actual = authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : ''
  if (!expected || !actual || !(await timingSafeEqual(actual, expected))) {
    throw new Error('导入服务认证失败。')
  }
}
