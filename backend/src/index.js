/**
 * Beat Sheet Tool — Cloudflare Worker API
 *
 * Routes:
 *   GET    /api/sheets          — list all sheets (by user, via future auth)
 *   POST   /api/sheets          — create a new sheet
 *   GET    /api/sheets/:id      — fetch a single sheet
 *   PUT    /api/sheets/:id      — update a sheet
 *   DELETE /api/sheets/:id      — delete a sheet
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  })
}

function notFound(msg = 'Not found') {
  return json({ error: msg }, 404)
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const { pathname } = url

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS })
    }

    // Route: /api/sheets
    if (pathname === '/api/sheets') {
      if (request.method === 'GET') return listSheets(env)
      if (request.method === 'POST') return createSheet(request, env)
    }

    // Route: /api/sheets/:id
    const sheetMatch = pathname.match(/^\/api\/sheets\/([^/]+)$/)
    if (sheetMatch) {
      const id = sheetMatch[1]
      if (request.method === 'GET')    return getSheet(id, env)
      if (request.method === 'PUT')    return updateSheet(id, request, env)
      if (request.method === 'DELETE') return deleteSheet(id, env)
    }

    return notFound('Route not found')
  },
}

async function listSheets(env) {
  // env.SHEETS is a KV namespace bound in wrangler.toml
  if (!env.SHEETS) return json({ sheets: [], note: 'KV not configured' })
  const list = await env.SHEETS.list()
  return json({ sheets: list.keys })
}

async function createSheet(request, env) {
  const body = await request.json().catch(() => null)
  if (!body) return json({ error: 'Invalid JSON' }, 400)

  const id = `sheet-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  const sheet = {
    id,
    title: body.title ?? 'Untitled Story',
    template: body.template ?? 'blank',
    beats: body.beats ?? [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  if (env.SHEETS) {
    await env.SHEETS.put(id, JSON.stringify(sheet))
  }

  return json(sheet, 201)
}

async function getSheet(id, env) {
  if (!env.SHEETS) return json({ error: 'KV not configured' }, 503)
  const raw = await env.SHEETS.get(id)
  if (!raw) return notFound(`Sheet '${id}' not found`)
  return json(JSON.parse(raw))
}

async function updateSheet(id, request, env) {
  if (!env.SHEETS) return json({ error: 'KV not configured' }, 503)
  const raw = await env.SHEETS.get(id)
  if (!raw) return notFound(`Sheet '${id}' not found`)

  const existing = JSON.parse(raw)
  const body = await request.json().catch(() => null)
  if (!body) return json({ error: 'Invalid JSON' }, 400)

  const updated = {
    ...existing,
    ...body,
    id,                                     // id is immutable
    updatedAt: new Date().toISOString(),
  }

  await env.SHEETS.put(id, JSON.stringify(updated))
  return json(updated)
}

async function deleteSheet(id, env) {
  if (!env.SHEETS) return json({ error: 'KV not configured' }, 503)
  await env.SHEETS.delete(id)
  return json({ deleted: true, id })
}
