import { authorizeKnowledgeEditor, unauthorizedResponse } from '../../_lib/access.js'
import {
  allowedExtensions,
  dispatchNextImportJob,
  requireImportBindings,
  sanitizeFilename
} from '../../_lib/import-jobs.js'

const MAX_DEFAULT_BYTES = 25 * 1024 * 1024

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
      '文件已安全保存，等待自动处理。',
      now,
      now
    ).run()

    const dispatchedJob = await dispatchNextImportJob(context.env)
    const status = dispatchedJob?.id === jobId
      ? (dispatchedJob.status || 'queued')
      : 'stored'

    return Response.json({
      ok: true,
      job: { id: jobId, filename, status }
    }, { status: 202, headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    return Response.json({ ok: false, error: error.message || '上传失败。' }, {
      status: 500,
      headers: { 'Cache-Control': 'no-store' }
    })
  }
}
