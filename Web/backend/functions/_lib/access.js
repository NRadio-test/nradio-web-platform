const encoder = new TextEncoder()
const decoder = new TextDecoder()
const SESSION_COOKIE = 'nradio_knowledge_session'
const SESSION_HOURS = 12

const base64UrlEncode = (value) => {
  const bytes = typeof value === 'string' ? encoder.encode(value) : value
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

const base64UrlDecode = (value) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0))
}

const sha256Hex = async (value) => {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(String(value)))
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

const timingSafeEqual = async (left, right) => {
  const [leftHash, rightHash] = await Promise.all([sha256Hex(left), sha256Hex(right)])
  return leftHash === rightHash
}

const getSigningKey = async (env) => {
  const secret = String(env.KNOWLEDGE_SESSION_SECRET || '')
  if (secret.length < 32) throw new Error('知识库会话签名密钥尚未配置。')
  return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
}

const sign = async (payload, env) => {
  const key = await getSigningKey(env)
  return base64UrlEncode(new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(payload))))
}

const readTokenOwners = (env) => {
  let owners
  try {
    owners = JSON.parse(String(env.KNOWLEDGE_SESSION_TOKEN_HASHES || '{}'))
  } catch {
    throw new Error('知识库用户口令配置格式无效。')
  }
  if (!owners || Array.isArray(owners) || typeof owners !== 'object' || !Object.keys(owners).length) {
    throw new Error('知识库用户口令尚未配置。')
  }
  return owners
}

const cookieValue = (request, name) => {
  const prefix = `${name}=`
  return (request.headers.get('Cookie') || '')
    .split(';')
    .map((item) => item.trim())
    .find((item) => item.startsWith(prefix))
    ?.slice(prefix.length) || ''
}

export const createKnowledgeSession = async (token, env) => {
  if (!/^\d{6}$/.test(String(token || ''))) throw new Error('请输入六位数字身份口令。')
  const tokenHash = await sha256Hex(token)
  const owners = readTokenOwners(env)
  let name = ''
  for (const [candidate, expectedHash] of Object.entries(owners)) {
    if (await timingSafeEqual(tokenHash, String(expectedHash).toLowerCase())) name = candidate
  }
  if (!name) throw new Error('身份口令不正确。')

  const payload = base64UrlEncode(JSON.stringify({
    name,
    exp: Math.floor(Date.now() / 1000) + SESSION_HOURS * 60 * 60
  }))
  return { name, value: `${payload}.${await sign(payload, env)}` }
}

export const knowledgeSessionCookie = (value, request) => {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : ''
  return `${SESSION_COOKIE}=${value}; Path=/; HttpOnly; SameSite=Strict${secure}`
}

export const clearKnowledgeSessionCookie = (request) => {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : ''
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`
}

export const authorizeKnowledgeEditor = async (context) => {
  if (context.env.ALLOW_LOCAL_IMPORTS === 'true' && ['localhost', '127.0.0.1', '::1'].includes(new URL(context.request.url).hostname)) {
    return { name: 'FallaxAura' }
  }
  const session = cookieValue(context.request, SESSION_COOKIE)
  const [payload, signature] = session.split('.')
  if (!payload || !signature || !(await timingSafeEqual(signature, await sign(payload, context.env)))) {
    throw new Error('请先输入身份口令。')
  }
  const identity = JSON.parse(decoder.decode(base64UrlDecode(payload)))
  if (!identity.name || !identity.exp || identity.exp <= Math.floor(Date.now() / 1000)) {
    throw new Error('身份会话已过期，请重新输入口令。')
  }
  if (!(identity.name in readTokenOwners(context.env))) throw new Error('当前用户已停用。')
  return { name: String(identity.name) }
}

export const unauthorizedResponse = (error, status = 401) => Response.json(
  { ok: false, error: error instanceof Error ? error.message : String(error) },
  { status, headers: { 'Cache-Control': 'no-store' } }
)
