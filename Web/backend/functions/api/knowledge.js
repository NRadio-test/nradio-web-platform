import { knowledgePayload } from '../_data/knowledge.js'

const normalize = (value) => String(value || '').trim().toLowerCase()

export async function onRequestGet(context) {
  const url = new URL(context.request.url)
  const query = normalize(url.searchParams.get('q'))
  const tag = normalize(url.searchParams.get('tag'))
  const summaryOnly = url.searchParams.get('summary') === '1'

  if (summaryOnly) {
    return Response.json(
      { meta: knowledgePayload.meta },
      {
        headers: {
          'Cache-Control': 'public, max-age=300',
          'X-Content-Type-Options': 'nosniff'
        }
      }
    )
  }

  const entries = knowledgePayload.entries.filter((entry) => {
    const haystack = normalize([entry.title, entry.text, ...(entry.tags || [])].join(' '))
    const matchesQuery = !query || haystack.includes(query)
    const matchesTag = !tag || (entry.tags || []).some((item) => normalize(item) === tag)
    return matchesQuery && matchesTag
  })

  return Response.json(
    {
      meta: { ...knowledgePayload.meta, result_count: entries.length },
      entries
    },
    {
      headers: {
        'Cache-Control': query || tag ? 'public, max-age=60' : 'public, max-age=300',
        'X-Content-Type-Options': 'nosniff'
      }
    }
  )
}
