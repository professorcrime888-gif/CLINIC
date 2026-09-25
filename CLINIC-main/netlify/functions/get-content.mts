import type { Context } from '@netlify/functions'
import { getStore } from '@netlify/blobs'

export default async (_req: Request, _context: Context) => {
  try {
    const store = getStore('clinic-content')
    const data = await store.get('content', { type: 'json' })
    return new Response(JSON.stringify(data ?? {}), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
