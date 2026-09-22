import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Lock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
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

  return <AdminForm password={password} />
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
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="text-2xl font-extrabold text-slate-900">لوحة التحكم</h1>
      <p className="mt-1 text-sm text-slate-500">
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
