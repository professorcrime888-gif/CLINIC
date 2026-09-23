import type { Context } from '@netlify/functions'
import { getStore } from '@netlify/blobs'

async function notifyWhatsApp(text: string) {
  const phone = process.env.CALLMEBOT_PHONE
  const apikey = process.env.CALLMEBOT_APIKEY
  if (!phone || !apikey) return

  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(apikey)}`
  try {
    await fetch(url)
  } catch (err) {
    // Notification failing shouldn't block the booking from being saved
  }
}

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

    const patientName = body?.patient?.fullName || 'مريضة جديدة'
    const patientPhone = body?.patient?.mobile || 'غير متوفر'
    const dateLabel = body?.dateLabel || ''
    const time = body?.time || ''
    const bookingNumber = body?.bookingNumber || ''

    const message =
      `📅 حجز جديد!\n` +
      `الاسم: ${patientName}\n` +
      `التليفون: ${patientPhone}\n` +
      `التاريخ: ${dateLabel}\n` +
      `الوقت: ${time}\n` +
      `رقم الحجز: ${bookingNumber}`

    await notifyWhatsApp(message)

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
