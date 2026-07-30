import { getJob, requireImportBindings, requireServiceToken } from '../../../../_lib/import-jobs.js'

export async function onRequestGet(context) {
  try {
    requireImportBindings(context.env)
    await requireServiceToken(context.request, context.env)
    const job = await getJob(context.env, context.params.jobId)
    if (!job) return Response.json({ ok: false, error: '导入任务不存在。' }, { status: 404 })

    return Response.json({
      ok: true,
      job: {
        id: job.id,
        filename: job.filename,
        title: job.title || '',
        source_url: job.source_url || '',
        notes: job.notes || '',
        uploaded_by: job.uploader || ''
      }
    }, { headers: { 'Cache-Control': 'private, no-store' } })
  } catch (error) {
    return Response.json({ ok: false, error: error.message }, { status: 401 })
  }
}
