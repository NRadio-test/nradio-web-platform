import {
  getJob,
  requireImportBindings,
  requireServiceToken,
  updateJob
} from '../../../../_lib/import-jobs.js'

const allowedStatuses = new Set(['queued', 'parsing', 'reviewing', 'review_ready', 'pr_created', 'completed', 'failed'])

export async function onRequestPost(context) {
  try {
    requireImportBindings(context.env)
    await requireServiceToken(context.request, context.env)
    const jobId = context.params.jobId
    if (!(await getJob(context.env, jobId))) {
      return Response.json({ ok: false, error: '导入任务不存在。' }, { status: 404 })
    }
    const body = await context.request.json()
    if (!allowedStatuses.has(body.status)) {
      return Response.json({ ok: false, error: '任务状态无效。' }, { status: 400 })
    }
    await updateJob(context.env, jobId, {
      status: body.status,
      progress: Math.max(0, Math.min(100, Number(body.progress || 0))),
      message: String(body.message || '').slice(0, 1000),
      pr_url: body.pr_url ? String(body.pr_url).slice(0, 1200) : undefined,
      document_path: body.document_path ? String(body.document_path).slice(0, 1200) : undefined,
      entry_count: body.entry_count === undefined ? undefined : Number(body.entry_count),
      error: body.error ? String(body.error).slice(0, 4000) : null
    })
    return Response.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    return Response.json({ ok: false, error: error.message }, { status: 401 })
  }
}
