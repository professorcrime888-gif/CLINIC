import type { Context } from '@netlify/functions'

export default async (req: Request, _context: Context) => {
  const provided = req.headers.get('x-admin-password') ?? ''
  const real = process.env.ADMIN_PASSWORD ?? ''

  if (!real) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: 'ADMIN_PASSWORD is not set in Netlify environment variables yet.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }

  if (provided && provided === real) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ ok: false }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  })
}
