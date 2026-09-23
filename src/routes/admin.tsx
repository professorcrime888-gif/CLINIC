import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Settings,
  CalendarDays,
  Phone,
  MessageCircle,
  Clock3,
  Check,
  Trash2,
} from 'lucide-react'
import { defaultSiteContent, type SiteContent } from '@/lib/site-content'

export const Route = createFileRoute('/admin')({
  component: AdminPage,
})

const STORAGE_KEY = 'clinic-admin-password'

function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(false)
  const [loginError, setLoginError] = useState('')

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    if (saved) {
      verifyPassword(saved).then((ok) => {
        if (ok) {
          setPassword(saved)
          setAuthed(true)
        }
      })
    }
  }, [])

  async function verifyPassword(pw: string) {
    try {
      const res = await fetch('/.netlify/functions/verify-password', {
        headers: { 'x-admin-password': pw },
      })
      return res.ok
    } catch {
      return false
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setChecking(true)
    setLoginError('')
    const ok = await verifyPassword(password)
    setChecking(false)
    if (ok) {
      sessionStorage.setItem(STORAGE_KEY, password)
      setAuthed(true)
    } else {
      setLoginError('كلمة المرور غير صحيحة، أو لم يتم إعداد ADMIN_PASSWORD بعد في إعدادات Netlify.')
    }
  }

  if (!authed) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-5 py-16">
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
            <Lock size={20} />
          </div>
          <h1 className="text-lg font-extrabold text-slate-900">لوحة التحكم</h1>
          <p className="mt-1 text-sm text-slate-500">أدخل كلمة المرور للمتابعة</p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-700"
              autoFocus
            />
            {loginError && (
              <p className="flex items-start gap-2 text-xs text-red-600">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                {loginError}
              </p>
            )}
            <button
              type="submit"
              disabled={checking}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-800 disabled:opacity-60"
            >
              {checking && <Loader2 size={16} className="animate-spin" />}
              دخول
            </button>
          </form>
        </div>
      </div>
    )
  }

  return <AdminShell password={password} />
}

function AdminShell({ password }: { password: string }) {
  const [tab, setTab] = useState<'content' | 'bookings'>('bookings')

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="text-2xl font-extrabold text-slate-900">لوحة التحكم</h1>

      <div className="mt-6 flex gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setTab('bookings')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-bold transition-colors ${
            tab === 'bookings'
              ? 'border-teal-700 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <CalendarDays size={16} />
          طلبات الحجز
        </button>
        <button
          type="button"
          onClick={() => setTab('content')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-bold transition-colors ${
            tab === 'content'
              ? 'border-teal-700 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Settings size={16} />
          بيانات الموقع
        </button>
      </div>

      <div className="mt-8">
        {tab === 'bookings' ? <BookingsPanel password={password} /> : <AdminForm password={password} />}
      </div>
    </div>
  )
}

interface BookingEntry {
  id: string
  status: 'pending' | 'confirmed'
  bookingNumber: string
  date: string
  dateLabel: string
  time: string
  createdAt: string
  patient: {
    fullName: string
    mobile: string
    whatsapp: string
    dob: string
    gender: string
    nationalId: string
    address: string
    email: string
    visitType: string
    reason: string
    notes: string
    contactMethod: string
  }
}

function BookingsPanel({ password }: { password: string }) {
  const [bookings, setBookings] = useState<Array<BookingEntry>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/.netlify/functions/get-bookings', {
      headers: { 'x-admin-password': password },
    })
      .then((res) => {
        if (!res.ok) throw new Error('failed')
        return res.json()
      })
      .then((data: Array<BookingEntry>) => setBookings(data))
      .catch(() => setError('تعذّر تحميل طلبات الحجز.'))
      .finally(() => setLoading(false))
  }, [password])

  async function toggleConfirm(booking: BookingEntry) {
    const newStatus = booking.status === 'confirmed' ? 'pending' : 'confirmed'
    setBookings((prev) =>
      prev.map((b) => (b.id === booking.id ? { ...b, status: newStatus } : b)),
    )
    try {
      await fetch('/.netlify/functions/update-booking-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ id: booking.id, status: newStatus }),
      })
    } catch {
      // ignore, UI already updated optimistically
    }
  }

  async function deleteBooking(booking: BookingEntry) {
    if (!window.confirm('متأكد إنك عايز تحذف طلب الحجز ده؟')) return
    setBookings((prev) => prev.filter((b) => b.id !== booking.id))
    try {
      await fetch('/.netlify/functions/delete-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ id: booking.id }),
      })
    } catch {
      // ignore, UI already updated optimistically
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center text-slate-400">
        <Loader2 size={22} className="animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <p className="flex items-center gap-2 text-sm text-red-600">
        <AlertCircle size={16} />
        {error}
      </p>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
        لا توجد طلبات حجز بعد. ستظهر هنا فور استلام أي طلب من موقعك.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        {bookings.length} طلب حجز، الأحدث أولًا.
      </p>
      {bookings.map((b) => (
        <div
          key={b.bookingNumber + b.createdAt}
          className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-extrabold tracking-wide text-teal-800">
                {b.bookingNumber}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  b.status === 'confirmed'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {b.status === 'confirmed' ? 'تم التأكيد' : 'قيد الانتظار'}
              </span>
            </div>
            <span className="text-xs text-slate-400">
              {new Date(b.createdAt).toLocaleString('ar-EG')}
            </span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <CalendarDays size={15} className="shrink-0 text-teal-700" />
              <span className="font-semibold">{b.dateLabel}</span>
              <span className="flex items-center gap-1 text-slate-500">
                <Clock3 size={13} />
                {b.time}
              </span>
            </div>
            <div className="text-sm font-bold text-slate-800">{b.patient.fullName}</div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Phone size={14} className="shrink-0 text-teal-700" />
              {b.patient.mobile}
            </div>
            {b.patient.whatsapp && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MessageCircle size={14} className="shrink-0 text-teal-700" />
                {b.patient.whatsapp}
              </div>
            )}
          </div>

          <dl className="mt-4 grid gap-x-6 gap-y-1.5 text-xs text-slate-500 sm:grid-cols-2">
            <div>
              <span className="font-semibold text-slate-600">نوع الزيارة: </span>
              {b.patient.visitType === 'first' ? 'زيارة أولى' : 'متابعة'}
            </div>
            <div>
              <span className="font-semibold text-slate-600">وسيلة التواصل: </span>
              {b.patient.contactMethod || '—'}
            </div>
            <div className="sm:col-span-2">
              <span className="font-semibold text-slate-600">سبب الزيارة: </span>
              {b.patient.reason || '—'}
            </div>
            {b.patient.notes && (
              <div className="sm:col-span-2">
                <span className="font-semibold text-slate-600">ملاحظات: </span>
                {b.patient.notes}
              </div>
            )}
          </dl>

          <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => toggleConfirm(b)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                b.status === 'confirmed'
                  ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              <Check size={13} />
              {b.status === 'confirmed' ? 'إلغاء التأكيد' : 'تعليم كـ تم التأكيد'}
            </button>
            <button
              type="button"
              onClick={() => deleteBooking(b)}
              className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100"
            >
              <Trash2 size={13} />
              حذف
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

function AdminForm({ password }: { password: string }) {
  const [form, setForm] = useState<SiteContent>(defaultSiteContent)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/.netlify/functions/get-content')
      .then((res) => (res.ok ? res.json() : {}))
      .then((data: Partial<SiteContent>) => {
        setForm((prev) => ({
          ...prev,
          ...data,
          social: { ...prev.social, ...(data.social ?? {}) },
          workingHours:
            data.workingHours && data.workingHours.length === 7
              ? data.workingHours
              : prev.workingHours,
        }))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function updateHour(index: number, value: string) {
    setForm((prev) => {
      const next = [...prev.workingHours]
      next[index] = { ...next[index], hours: value }
      return { ...prev, workingHours: next }
    })
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    setError('')
    try {
      const res = await fetch('/.netlify/functions/save-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('save failed')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('حدث خطأ أثناء الحفظ، حاول مرة أخرى.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-slate-400">
        <Loader2 size={22} className="animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm text-slate-500">
        عدّل بيانات التواصل، وسائل التواصل الاجتماعي، نبذة الطبيب، ومواعيد العمل.
      </p>

      <form onSubmit={handleSave} className="mt-8 space-y-8">
        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-bold text-slate-900">بيانات التواصل</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="رقم الهاتف" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
            <Field label="رقم واتساب" value={form.whatsapp} onChange={(v) => setForm({ ...form, whatsapp: v })} />
            <Field label="البريد الإلكتروني" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            <Field label="العنوان" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
            <Field
              label="رابط خرائط جوجل (اختياري)"
              value={form.mapUrl}
              onChange={(v) => setForm({ ...form, mapUrl: v })}
              className="sm:col-span-2"
            />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-bold text-slate-900">وسائل التواصل الاجتماعي</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="فيسبوك"
              value={form.social.facebook}
              onChange={(v) => setForm({ ...form, social: { ...form.social, facebook: v } })}
            />
            <Field
              label="إنستغرام"
              value={form.social.instagram}
              onChange={(v) => setForm({ ...form, social: { ...form.social, instagram: v } })}
            />
            <Field
              label="تيك توك"
              value={form.social.tiktok}
              onChange={(v) => setForm({ ...form, social: { ...form.social, tiktok: v } })}
            />
            <Field
              label="X (تويتر)"
              value={form.social.twitter}
              onChange={(v) => setForm({ ...form, social: { ...form.social, twitter: v } })}
            />
          </div>
          <p className="mt-3 text-xs text-slate-400">
            ضع الرابط الكامل، مثال: https://facebook.com/yourpage — اترك الحقل فارغًا لإخفائه من الموقع.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-bold text-slate-900">نبذة عن الطبيب</h2>
          <textarea
            value={form.doctorBio}
            onChange={(e) => setForm({ ...form, doctorBio: e.target.value })}
            rows={4}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-700"
          />
        </section>

        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-bold text-slate-900">مواعيد العمل</h2>
          <div className="space-y-3">
            {form.workingHours.map((row, i) => (
              <div key={row.day} className="flex items-center gap-3">
                <span className="w-20 shrink-0 text-sm font-semibold text-slate-700">{row.day}</span>
                <input
                  type="text"
                  value={row.hours}
                  onChange={(e) => updateHour(i, e.target.value)}
                  placeholder="مثال: 5:00 م - 9:00 م، أو أجازة"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-teal-700"
                />
              </div>
            ))}
          </div>
        </section>

        {error && (
          <p className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle size={16} />
            {error}
          </p>
        )}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-teal-700 px-6 py-3 text-sm font-bold text-white hover:bg-teal-800 disabled:opacity-60"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            حفظ التعديلات
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm font-semibold text-teal-700">
              <CheckCircle2 size={16} />
              تم الحفظ بنجاح
            </span>
          )}
        </div>
      </form>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  className,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  className?: string
}) {
  return (
    <label className={`block text-sm ${className ?? ''}`}>
      <span className="mb-1.5 block font-semibold text-slate-700">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-700"
      />
    </label>
  )
}
