export async function onRequestGet() {
  return Response.json(
    {
      ok: true,
      service: 'nradio-knowledge',
      timestamp: new Date().toISOString()
    },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
