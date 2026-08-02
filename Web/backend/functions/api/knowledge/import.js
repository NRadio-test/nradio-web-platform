import { authorizeKnowledgeEditor, unauthorizedResponse } from '../../_lib/access.js'
import {
  allowedExtensions,
  requireImportBindings,
  sanitizeFilename,
  updateJob
} from '../../_lib/import-jobs.js'

const MAX_DEFAULT_BYTES = 25 * 1024 * 1024

const triggerWorkflow = async (env, job) => {
  const token = String(env.GITHUB_ACTIONS_TOKEN || '')
  const owner = String(env.GITHUB_OWNER || 'NRadio-test')
  const repository = String(env.GITHUB_REPOSITORY || 'nradio-web-platform')
  const workflow = String(env.GITHUB_IMPORT_WORKFLOW || 'knowledge-import.yml')
  const ref = String(env.GITHUB_IMPORT_REF || 'main')
  const baseUrl = String(env.PUBLIC_BASE_URL || 'https://nradio.fallaxaura.dpdns.org').replace(/\/$/, '')

  if (!token) return false
  const response = await fetch(
    `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}/actions/workflows/${encodeURIComponent(workflow)}/dispatches`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'NRadio-Knowledge-Importer',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      body: JSON.stringify({
        ref,
        inputs: {
          job_id: job.id,
          file_name: job.filename,
          base_url: baseUrl
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

export async function onRequestPost(context) {
  let identity
  try {
    identity = await authorizeKnowledgeEditor(context)
    requireImportBindings(context.env)
  } catch (error) {
    return unauthorizedResponse(error, error.message.includes('存储') ? 503 : 401)
  }

  try {
    const form = await context.request.formData()
    const file = form.get('file')
    if (!(file instanceof File)) {
      return Response.json({ ok: false, error: '请选择要导入的文件。' }, { status: 400 })
    }

    const filename = sanitizeFilename(file.name)
    const extension = filename.includes('.') ? filename.split('.').pop().toLowerCase() : ''
    const maxBytes = Number(context.env.MAX_KNOWLEDGE_UPLOAD_BYTES || MAX_DEFAULT_BYTES)
    if (!allowedExtensions.has(extension)) {
      return Response.json({ ok: false, error: `暂不支持 .${extension || '未知'} 文件。` }, { status: 415 })
    }
    if (file.size <= 0 || file.size > maxBytes) {
      return Response.json({ ok: false, error: `文件大小必须在 1 字节到 ${Math.floor(maxBytes / 1024 / 1024)} MB 之间。` }, { status: 413 })
    }

    const jobId = crypto.randomUUID()
    const now = new Date().toISOString()
    const objectKey = `pending/${now.slice(0, 7)}/${jobId}/${filename}`
    const title = String(form.get('title') || '').trim().slice(0, 200)
    const sourceUrl = String(form.get('source_url') || '').trim().slice(0, 1200)
    const notes = String(form.get('notes') || '').trim().slice(0, 4000)
    const uploader = String(identity.name || 'unknown').slice(0, 120)

    await context.env.KNOWLEDGE_UPLOADS.put(objectKey, file.stream(), {
      httpMetadata: { contentType: file.type || 'application/octet-stream' },
      customMetadata: { jobId, filename, uploader }
    })
    await context.env.KNOWLEDGE_DB.prepare(`
      INSERT INTO knowledge_import_jobs (
        id, filename, object_key, size, content_type, title, source_url, notes,
        uploader, status, progress, message, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'stored', 5, ?, ?, ?)
    `).bind(
      jobId,
      filename,
      objectKey,
      file.size,
      file.type || 'application/octet-stream',
      title,
      sourceUrl,
      notes,
      uploader,
      '文件已安全保存，等待审核任务。',
      now,
      now
    ).run()

    const job = { id: jobId, filename }
    let dispatched = false
    try {
      dispatched = await triggerWorkflow(context.env, job)
      await updateJob(context.env, jobId, dispatched
        ? { status: 'queued', progress: 10, message: '审核与结构化任务已进入队列。' }
        : { status: 'stored', progress: 5, message: '文件已保存；GitHub 审核工作流尚未配置。' })
    } catch (error) {
      await updateJob(context.env, jobId, {
        status: 'dispatch_failed',
        progress: 5,
        message: '文件已保存，但审核任务未能启动。',
        error: error.message
      })
      return Response.json({
        ok: true,
        warning: '文件已保存，但审核任务未能启动。请在配置修复后重试。',
        job: { id: jobId, filename, status: 'dispatch_failed' }
      }, { status: 202, headers: { 'Cache-Control': 'no-store' } })
    }

    return Response.json({
      ok: true,
      job: { id: jobId, filename, status: dispatched ? 'queued' : 'stored' }
    }, { status: 202, headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    return Response.json({ ok: false, error: error.message || '上传失败。' }, {
      status: 500,
      headers: { 'Cache-Control': 'no-store' }
    })
  }
}
