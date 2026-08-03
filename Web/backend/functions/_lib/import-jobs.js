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

const workflowConfig = (env) => ({
  token: String(env.GITHUB_ACTIONS_TOKEN || ''),
  owner: String(env.GITHUB_OWNER || 'NRadio-test'),
  repository: String(env.GITHUB_REPOSITORY || 'nradio-web-platform'),
  workflow: String(env.GITHUB_IMPORT_WORKFLOW || 'knowledge-import.yml'),
  ref: String(env.GITHUB_IMPORT_REF || 'main'),
  baseUrl: String(env.PUBLIC_BASE_URL || 'https://nradio.fallaxaura.dpdns.org').replace(/\/$/, '')
})

export const triggerImportWorkflow = async (env, job) => {
  const config = workflowConfig(env)
  if (!config.token) return false
  const response = await fetch(
    `https://api.github.com/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repository)}/actions/workflows/${encodeURIComponent(config.workflow)}/dispatches`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${config.token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'NRadio-Knowledge-Importer',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      body: JSON.stringify({
        ref: config.ref,
        inputs: {
          job_id: job.id,
          file_name: job.filename,
          base_url: config.baseUrl
        }
      })
    }
  )
  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`GitHub 导入工作流触发失败：${response.status} ${detail.slice(0, 300)}`)
  }
  return true
}

export const dispatchNextImportJob = async (env) => {
  if (!workflowConfig(env).token) return null

  const now = new Date()
  const resetBefore = String(env.IMPORT_QUEUE_RESET_BEFORE || '')
  if (resetBefore) {
    await env.KNOWLEDGE_DB.prepare(`
      UPDATE knowledge_import_jobs
      SET status = 'cancelled', progress = 100,
          message = '知识库已重置，此前的导入任务已作废。', error = NULL, updated_at = ?
      WHERE created_at < ? AND status != 'cancelled'
    `).bind(now.toISOString(), resetBefore).run()
  }
  const queuedCutoff = new Date(now.getTime() - 10 * 60 * 1000).toISOString()
  const runningCutoff = new Date(now.getTime() - 45 * 60 * 1000).toISOString()
  await env.KNOWLEDGE_DB.prepare(`
    UPDATE knowledge_import_jobs
    SET status = 'stored', progress = 5,
        message = '任务等待超时，已自动重新排队。', error = NULL, updated_at = ?
    WHERE (status = 'queued' AND updated_at < ?)
       OR (status IN ('parsing', 'reviewing', 'publishing') AND updated_at < ?)
  `).bind(now.toISOString(), queuedCutoff, runningCutoff).run()

  const job = await env.KNOWLEDGE_DB.prepare(`
    UPDATE knowledge_import_jobs
    SET status = 'queued', progress = 10,
        message = '自动结构化任务已进入队列。', error = NULL, updated_at = ?
    WHERE id = (
      SELECT id FROM knowledge_import_jobs
      WHERE status = 'stored'
      ORDER BY created_at ASC
      LIMIT 1
    )
    AND NOT EXISTS (
      SELECT 1 FROM knowledge_import_jobs
      WHERE status IN ('queued', 'parsing', 'reviewing', 'publishing')
    )
    RETURNING id, filename
  `).bind(now.toISOString()).first()

  if (!job) return null
  try {
    await triggerImportWorkflow(env, job)
    return job
  } catch (error) {
    await updateJob(env, job.id, {
      status: 'dispatch_failed',
      progress: 5,
      message: '文件已保存，但自动处理任务未能启动。',
      error: error.message
    })
    return { ...job, status: 'dispatch_failed', error: error.message }
  }
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
