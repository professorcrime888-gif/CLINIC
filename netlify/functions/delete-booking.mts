import type { Context } from '@netlify/functions'
import { getStore } from '@netlify/blobs'

export default async (req: Request, _context: Context) => {
  const provided = req.headers.get('x-admin-password') ?? ''
  const real = process.env.ADMIN_PASSWORD ?? ''

  if (!real || provided !== real) {
    return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const { id } = await req.json()
    const store = getStore('clinic-bookings')
    const existing = (await store.get('all', { type: 'json' })) as Array<any> | null
    const list = existing ?? []
    const updated = list.filter((b) => b.id !== id)
    await store.setJSON('all', updated)
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
