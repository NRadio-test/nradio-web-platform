import { authorizeKnowledgeEditor, unauthorizedResponse } from '../../../_lib/access.js'
import { getJob, publicJob, requireImportBindings } from '../../../_lib/import-jobs.js'

export async function onRequestGet(context) {
  try {
    await authorizeKnowledgeEditor(context)
    requireImportBindings(context.env)
    const job = await getJob(context.env, context.params.jobId)
    if (!job) return Response.json({ ok: false, error: '导入任务不存在。' }, { status: 404 })
    return Response.json({ ok: true, job: publicJob(job) }, {
      headers: { 'Cache-Control': 'no-store' }
    })
  } catch (error) {
    return unauthorizedResponse(error, error.message.includes('存储') ? 503 : 401)
  }
}
