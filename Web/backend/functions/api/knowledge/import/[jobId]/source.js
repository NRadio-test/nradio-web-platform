import { getJob, requireImportBindings, requireServiceToken } from '../../../../_lib/import-jobs.js'

export async function onRequestGet(context) {
  try {
    requireImportBindings(context.env)
    await requireServiceToken(context.request, context.env)
    const job = await getJob(context.env, context.params.jobId)
    if (!job) return Response.json({ ok: false, error: '导入任务不存在。' }, { status: 404 })
    const object = await context.env.KNOWLEDGE_UPLOADS.get(job.object_key)
    if (!object) return Response.json({ ok: false, error: '上传源文件不存在。' }, { status: 404 })
    return new Response(object.body, {
      headers: {
        'Content-Type': job.content_type || 'application/octet-stream',
        'Content-Length': String(job.size),
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(job.filename)}`,
        'Cache-Control': 'private, no-store'
      }
    })
  } catch (error) {
    return Response.json({ ok: false, error: error.message }, { status: 401 })
  }
}
