import { knowledgePayload } from '../../../_data/knowledge.js'
import { authorizeKnowledgeEditor, unauthorizedResponse } from '../../../_lib/access.js'

const encoder = new TextEncoder()
const confidenceValues = new Set(['high', 'medium_high', 'medium', 'low_medium'])

const base64UrlEncode = (value) => {
  let binary = ''
  for (const byte of encoder.encode(value)) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

const findEntry = (infoId) => knowledgePayload.entries.find((entry) => entry.id === infoId)

const validateBody = (body, infoId, editor) => {
  const title = String(body.title || '').trim().slice(0, 160)
  const text = String(body.text || '').replace(/\0/g, '').trim().slice(0, 12000)
  const sourceUrl = String(body.source_url || '').trim().slice(0, 1200)
  const sourceType = String(body.source_type || 'user_upload').trim().slice(0, 80)
  const confidence = String(body.confidence || '').trim()
  const tags = Array.isArray(body.tags)
    ? [...new Set(body.tags.map((tag) => String(tag).trim().slice(0, 40)).filter(Boolean))].slice(0, 12)
    : []
  if (!title) throw new Error('标题不能为空。')
  if (text.length < 20) throw new Error('知识正文至少需要 20 个字符。')
  if (!sourceUrl) throw new Error('来源 URL 或来源说明不能为空。')
  if (!confidenceValues.has(confidence)) throw new Error('请选择有效的可信度。')
  if (!tags.length) throw new Error('至少需要一个检索标签。')
  return { info_id: infoId, editor, title, text, source_url: sourceUrl, source_type: sourceType, confidence, tags }
}

const dispatchEdit = async (env, payload) => {
  const token = String(env.GITHUB_ACTIONS_TOKEN || '')
  const owner = String(env.GITHUB_OWNER || 'NRadio-test')
  const repository = String(env.GITHUB_REPOSITORY || 'nradio-web-platform')
  const workflow = String(env.GITHUB_EDIT_WORKFLOW || 'knowledge-edit.yml')
  const ref = String(env.GITHUB_EDIT_REF || 'main')
  if (!token) throw new Error('GitHub Actions 调用密钥尚未配置。')
  const response = await fetch(`https://api.github.com/repos/${owner}/${repository}/actions/workflows/${workflow}/dispatches`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'User-Agent': 'NRadio-Knowledge-Editor',
      'X-GitHub-Api-Version': '2022-11-28'
    },
    body: JSON.stringify({ ref, inputs: { payload: base64UrlEncode(JSON.stringify(payload)) } })
  })
  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`GitHub 编辑工作流启动失败（${response.status}）：${detail.slice(0, 240)}`)
  }
}

export async function onRequestGet(context) {
  try {
    const identity = await authorizeKnowledgeEditor(context)
    const entry = findEntry(context.params.infoId)
    if (!entry) return Response.json({ ok: false, error: '没有找到这条知识。' }, { status: 404 })
    return Response.json({ ok: true, user: identity, entry }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    return unauthorizedResponse(error)
  }
}

export async function onRequestPost(context) {
  try {
    const identity = await authorizeKnowledgeEditor(context)
    const entry = findEntry(context.params.infoId)
    if (!entry) return Response.json({ ok: false, error: '没有找到这条知识。' }, { status: 404 })
    const payload = validateBody(await context.request.json(), entry.id, identity.name)
    await dispatchEdit(context.env, payload)
    return Response.json({
      ok: true,
      message: '编辑任务已经提交。GitHub 验证通过后会自动更新正式知识库。',
      edit: { info_id: entry.id, editor: identity.name }
    }, { status: 202, headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    const status = String(error.message || '').includes('口令') || String(error.message || '').includes('会话') ? 401 : 400
    return unauthorizedResponse(error, status)
  }
}
