TypeScript
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
import { defaultSiteContent, applyThemeColor, type SiteContent } from '@/lib/site-content'

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
لوحة التحكم
أدخل كلمة المرور للمتابعة

setPassword(e.target.value)}
placeholder="كلمة المرور"
className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-700"
autoFocus
/>
{loginError && (

{loginError}

)}

{checking && }
دخول

)
}

return
}

function AdminShell({ password }: { password: string }) {
const [tab, setTab] = useState<'content' | 'bookings'>('bookings')

return (

لوحة التحكم
setTab('bookings')}
className={flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-bold transition-colors ${ tab === 'bookings' ? 'border-teal-700 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-700' }}

طلبات الحجز

setTab('content')}
className={flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-bold transition-colors ${ tab === 'content' ? 'border-teal-700 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-700' }}

بيانات الموقع

{tab === 'bookings' ?  : }

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
const [bookings, setBookings] = useState>([])
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
.then((data: Array) => setBookings(data))
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
// ignore
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
// ignore
}
}

if (loading) {
return (

)
}

if (error) {
return (

{error}

)
}

if (bookings.length === 0) {
return (

لا توجد طلبات حجز بعد. ستظهر هنا فور استلام أي طلب من موقعك.

)
}

return (

{bookings.length} طلب حجز، الأحدث أولًا.

{bookings.map((b) => (

{b.bookingNumber}

{b.status === 'confirmed' ? 'تم التأكيد' : 'قيد الانتظار'}

{new Date(b.createdAt).toLocaleString('ar-EG')}

{b.dateLabel}

{b.time}

{b.patient.fullName}

{b.patient.mobile}

{b.patient.whatsapp && (

{b.patient.whatsapp}

)}

نوع الزيارة:
{b.patient.visitType === 'first' ? 'زيارة أولى' : 'متابعة'}

وسيلة التواصل:
{b.patient.contactMethod || '—'}

سبب الزيارة:
{b.patient.reason || '—'}

{b.patient.notes && (

ملاحظات:
{b.patient.notes}

)}

toggleConfirm(b)}
className={flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${ b.status === 'confirmed' ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-emerald-600 text-white hover:bg-emerald-700' }}

{b.status === 'confirmed' ? 'إلغاء التأكيد' : 'تعليم كـ تم التأكيد'}

deleteBooking(b)}
className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100"

حذف

))}

)
}

function AdminForm({ password }: { password: string }) {
const [form, setForm] = useState(defaultSiteContent)
const [loading, setLoading] = useState(true)
const [saving, setSaving] = useState(false)
const [saved, setSaved] = useState(false)
const [error, setError] = useState('')

useEffect(() => {
fetch('/.netlify/functions/get-content')
.then((res) => (res.ok ? res.json() : {}))
.then((data: Partial) => {
setForm((prev) => {
const next = {
...prev,
...data,
social: { ...prev.social, ...(data.social ?? {}) },
workingHours:
data.workingHours && data.workingHours.length === 7
? data.workingHours
: prev.workingHours,
}
if (next.primaryColor) {
applyThemeColor(next.primaryColor)
}
return next
})
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
if (form.primaryColor) applyThemeColor(form.primaryColor)
setTimeout(() => setSaved(false), 3000)
} catch {
setError('حدث خطأ أثناء الحفظ، حاول مرة أخرى.')
} finally {
setSaving(false)
}
}

if (loading) {
return (

)
}

return (

عدّل بيانات التواصل، وسائل التواصل الاجتماعي، نبذة الطبيب، ومواعيد العمل.

بيانات التواصل
setForm({ ...form, phone: v })} />
setForm({ ...form, whatsapp: v })} />
setForm({ ...form, email: v })} />
setForm({ ...form, address: v })} />
setForm({ ...form, mapUrl: v })}
className="sm:col-span-2"
/>

لون الموقع
{
setForm({ ...form, primaryColor: e.target.value })
applyThemeColor(e.target.value)
}}
className="h-12 w-16 cursor-pointer rounded-lg border border-slate-200"
/>
{
setForm({ ...form, primaryColor: e.target.value })
if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) applyThemeColor(e.target.value)
}}
className="w-32 rounded-xl border border-slate-200 px-3 py-2 text-sm font-mono outline-none focus:border-teal-700"
/>

اضغطي على المربع أو اكتبي كود اللون. التغيير هيظهر فورًا كمعاينة، واحفظي عشان يثبت على الموقع.

العنوان الرئيسي للموقع
         setForm({ ...form, heroBadge: v })}
        />
        
          الفقرة التعريفية
           setForm({ ...form, heroDescription: e.target.value })}
            rows={3}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-700"
          />
        </label>
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

    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-sm font-bold text-slate-900">الخدمات</h2>
      <div className="space-y-5">
        {form.services.map((service, i) => (
          <div key={service.id} className="rounded-xl border border-slate-100 p-4">
            <Field
              label="عنوان الخدمة"
              value={service.title}
              onChange={(v) => {
                const next = [...form.services]
                next[i] = { ...next[i], title: v }
                setForm({ ...form, services: next })
              }}
            />
            <label className="mt-3 block text-sm">
              <span className="mb-1.5 block font-semibold text-slate-700">الوصف</span>
              <textarea
                value={service.description}
                onChange={(e) => {
                  const next = [...form.services]
                  next[i] = { ...next[i], description: e.target.value }
                  setForm({ ...form, services: next })
                }}
                rows={2}
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-teal-700"
              />
            </label>
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
<label className={block text-sm ${className ?? ''}}>
{label}
<input
type="text"
value={value}
onChange={(e) => onChange(e.target.value)}
className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-700"
/>

)
}
