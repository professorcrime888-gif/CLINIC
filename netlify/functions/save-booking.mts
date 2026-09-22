import type { Context } from '@netlify/functions'
import { getStore } from '@netlify/blobs'

export default async (req: Request, _context: Context) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const body = await req.json()
    const store = getStore('clinic-bookings')
    const existing = (await store.get('all', { type: 'json' })) as Array<unknown> | null
    const list = existing ?? []
    list.unshift({ ...body, createdAt: new Date().toISOString() })
    await store.setJSON('all', list)
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid data' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
