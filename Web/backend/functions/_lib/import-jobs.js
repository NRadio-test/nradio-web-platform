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

const pendingReviewStatuses = new Set(['review_ready', 'pr_created'])

const parseGitHubPullRequestUrl = (value) => {
  try {
    const url = new URL(String(value || ''))
    const parts = url.pathname.split('/').filter(Boolean)
    if (url.hostname !== 'github.com' || parts.length < 4 || parts[2] !== 'pull') return null
    const number = Number(parts[3])
    if (!Number.isInteger(number) || number <= 0) return null
    return { owner: parts[0], repository: parts[1], number }
  } catch {
    return null
  }
}

export const reconcileJobReviewStatus = async (env, job) => {
  if (!job || !pendingReviewStatuses.has(job.status) || !job.pr_url) return job
  const pullRequest = parseGitHubPullRequestUrl(job.pr_url)
  if (!pullRequest) return job

  const currentOwner = String(env.GITHUB_OWNER || 'NRadio-test')
  const currentRepository = String(env.GITHUB_REPOSITORY || 'nradio-web-platform')
  if (
    pullRequest.owner.toLowerCase() !== currentOwner.toLowerCase()
    || pullRequest.repository.toLowerCase() !== currentRepository.toLowerCase()
  ) {
    const fields = {
      status: 'review_closed',
      progress: 100,
      message: '该任务属于迁移前的旧仓库，原审核请求已失效。',
      error: null
    }
    await updateJob(env, job.id, fields)
    return { ...job, ...fields, updated_at: new Date().toISOString() }
  }

  const token = String(env.GITHUB_ACTIONS_TOKEN || '')
  if (!token) return job
  try {
    const response = await fetch(
      `https://api.github.com/repos/${encodeURIComponent(currentOwner)}/${encodeURIComponent(currentRepository)}/pulls/${pullRequest.number}`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${token}`,
          'User-Agent': 'NRadio-Knowledge-Importer',
          'X-GitHub-Api-Version': '2022-11-28'
        }
      }
    )
    if (!response.ok) return job
    const payload = await response.json()
    if (payload.merged_at) {
      const fields = {
        status: 'completed',
        progress: 100,
        message: '审核 PR 已合并，知识库内容已经发布。',
        error: null
      }
      await updateJob(env, job.id, fields)
      return { ...job, ...fields, updated_at: new Date().toISOString() }
    }
    if (payload.state === 'closed') {
      const fields = {
        status: 'review_closed',
        progress: 100,
        message: '审核 PR 已关闭，内容没有写入正式知识库。',
        error: null
      }
      await updateJob(env, job.id, fields)
      return { ...job, ...fields, updated_at: new Date().toISOString() }
    }
  } catch {
    // A temporary GitHub API failure must not turn a valid review into a failed job.
  }
  return job
}

export const requireServiceToken = async (request, env) => {
  const expected = String(env.IMPORT_SERVICE_TOKEN || '')
  const authorization = request.headers.get('Authorization') || ''
  const actual = authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : ''
  if (!expected || !actual || !(await timingSafeEqual(actual, expected))) {
    throw new Error('导入服务认证失败。')
  }
}
