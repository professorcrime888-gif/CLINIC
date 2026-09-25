import { Link } from '@tanstack/react-router'
import { CalendarCheck, CheckCircle2, Copy, Home, User } from 'lucide-react'
import { useState } from 'react'
import { useSiteContent } from '@/lib/site-content'

interface ConfirmationCardProps {
  bookingNumber: string
  dateLabel: string
  time: string
  patientName: string
}

export function ConfirmationCard({
  bookingNumber,
  dateLabel,
  time,
  patientName,
}: ConfirmationCardProps) {
  const content = useSiteContent()
  const [copied, setCopied] = useState(false)

  async function copyNumber() {
    try {
      await navigator.clipboard.writeText(bookingNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-teal-100 bg-white p-8 text-center shadow-lg shadow-teal-900/5">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-teal-700">
        <CheckCircle2 size={32} />
      </div>
      <h2 className="mt-5 text-xl font-extrabold text-slate-900">تم استقبال طلب حجزكِ</h2>
      <p className="mt-2 text-sm text-slate-600">
        شكرًا لكِ {patientName || ''}. سيتم تأكيد الموعد النهائي من طاقم العيادة عبر وسيلة
        التواصل التي اخترتِها.
      </p>

      <div className="mt-6 rounded-2xl bg-slate-50 p-5">
        <p className="text-xs text-slate-500">رقم الحجز</p>
        <div className="mt-1 flex items-center justify-center gap-2">
          <span className="text-lg font-extrabold tracking-wide text-teal-800">
            {bookingNumber}
          </span>
          <button
            type="button"
            onClick={copyNumber}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:text-teal-700"
            aria-label="نسخ رقم الحجز"
          >
            <Copy size={14} />
          </button>
        </div>
        {copied && <p className="mt-1 text-xs font-semibold text-teal-700">تم النسخ</p>}
      </div>

      <dl className="mt-6 space-y-3 text-start text-sm">
        <div className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3">
          <dt className="flex items-center gap-2 text-slate-500">
            <CalendarCheck size={16} className="text-teal-700" />
            التاريخ والوقت
          </dt>
          <dd className="font-semibold text-slate-800">
            {dateLabel} — {time}
          </dd>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3">
          <dt className="flex items-center gap-2 text-slate-500">
            <User size={16} className="text-teal-700" />
            الطبيب
          </dt>
          <dd className="font-semibold text-slate-800">{content.doctorName}</dd>
        </div>
      </dl>

      <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-500">
        ستصلكِ رسالة تأكيد عبر وسيلة التواصل التي اخترتِها فور تفعيل قنوات الإشعارات
        (واتساب / رسائل نصية / بريد إلكتروني) من لوحة تحكم العيادة.
      </div>

      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-teal-700 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-teal-800"
      >
        <Home size={16} />
        العودة للصفحة الرئيسية
      </Link>
    </div>
  )
}
