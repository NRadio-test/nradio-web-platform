import {
  authorizeKnowledgeEditor,
  clearKnowledgeSessionCookie,
  createKnowledgeSession,
  knowledgeSessionCookie,
  unauthorizedResponse
} from '../../_lib/access.js'

export async function onRequestGet(context) {
  try {
    const identity = await authorizeKnowledgeEditor(context)
    return Response.json({ ok: true, user: identity }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    return unauthorizedResponse(error)
  }
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json()
    const session = await createKnowledgeSession(body.token, context.env)
    return Response.json({ ok: true, user: { name: session.name } }, {
      headers: {
        'Cache-Control': 'no-store',
        'Set-Cookie': knowledgeSessionCookie(session.value, context.request)
      }
    })
  } catch (error) {
    return unauthorizedResponse(error)
  }
}

export async function onRequestDelete(context) {
  return Response.json({ ok: true }, {
    headers: {
      'Cache-Control': 'no-store',
      'Set-Cookie': clearKnowledgeSessionCookie(context.request)
    }
  })
}
