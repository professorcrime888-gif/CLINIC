// Stubbed booking-availability data for the booking flow UI.
// This module is the single source of "fake backend" data for milestone 1 —
// a later milestone (see PLAN.md) replaces it with real database-backed availability.

export interface TimeSlot {
  time: string
  available: boolean
}

export interface BookingDay {
  date: string // YYYY-MM-DD
  label: string // Arabic weekday + day number
  slots: Array<TimeSlot>
}

const weekdaysAr = [
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت',
]

const monthsAr = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
]

const baseSlotTimes = [
  '10:00 ص',
  '10:30 ص',
  '11:00 ص',
  '11:30 ص',
  '12:00 م',
  '05:00 م',
  '05:30 م',
  '06:00 م',
  '06:30 م',
  '07:00 م',
]

// Deterministic pseudo-availability so the same date always renders the same slots
// during a session, without needing a real backend yet.
function slotSeed(dateIndex: number, slotIndex: number) {
  return (dateIndex * 7 + slotIndex * 3) % 5 !== 0
}

export function getUpcomingDays(count = 14): Array<BookingDay> {
  const days: Array<BookingDay> = []
  const today = new Date()

  for (let i = 0; i < count; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)

    const iso = date.toISOString().slice(0, 10)
    const weekday = weekdaysAr[date.getDay()]
    const label = `${weekday} ${date.getDate()} ${monthsAr[date.getMonth()]}`

    const slots: Array<TimeSlot> = baseSlotTimes.map((time, slotIndex) => ({
      time,
      available: slotSeed(i, slotIndex),
    }))

    days.push({ date: iso, label, slots })
  }

  return days
}

export const visitReasons = [
  'فحص دوري',
  'متابعة حمل',
  'استشارة عامة',
  'نتائج فحوصات',
  'أخرى',
]

export type VisitKind = 'first' | 'follow-up'

export type ContactMethod = 'phone' | 'whatsapp' | 'sms' | 'email'

export const contactMethods: Array<{ value: ContactMethod; label: string }> = [
  { value: 'whatsapp', label: 'واتساب' },
  { value: 'phone', label: 'مكالمة هاتفية' },
  { value: 'sms', label: 'رسالة نصية (SMS)' },
  { value: 'email', label: 'البريد الإلكتروني' },
]

export function generateBookingNumber(dateIso: string): string {
  const compact = dateIso.replace(/-/g, '').slice(2)
  const random = Math.floor(1000 + Math.random() * 9000)
  return `CLN-${compact}-${random}`
}
