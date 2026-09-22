import { useState } from 'react'
import { ArrowLeft, ArrowRight, CalendarCheck, ClipboardList, User } from 'lucide-react'
import { doctor } from '@/data/clinic'
import { contactMethods } from '@/data/booking'
import type { PatientInfo } from './types'
import { Captcha } from './Captcha'
import { cn } from '@/lib/utils'

interface SummaryStepProps {
  dateLabel: string
  time: string
  patient: PatientInfo
  onBack: () => void
  onConfirm: () => void
}

export function SummaryStep({ dateLabel, time, patient, onBack, onConfirm }: SummaryStepProps) {
  const [agreed, setAgreed] = useState(false)
  const [captchaVerified, setCaptchaVerified] = useState(false)

  const contactLabel = contactMethods.find((m) => m.value === patient.contactMethod)?.label

  const canConfirm = agreed && captchaVerified

  return (
    <div>
      <h2 className="text-base font-bold text-slate-800">مراجعة الحجز والتأكيد</h2>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
            <CalendarCheck size={16} className="text-teal-700" />
            تفاصيل الموعد
          </div>
          <dl className="space-y-2 text-sm">
            <Row label="الطبيب" value={doctor.name} />
            <Row label="التخصص" value={doctor.specialty} />
            <Row label="التاريخ" value={dateLabel} />
            <Row label="الوقت" value={time} />
            <Row label="نوع الزيارة" value={patient.visitType === 'first' ? 'زيارة أولى' : 'متابعة'} />
          </dl>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
            <User size={16} className="text-teal-700" />
            بيانات المريضة
          </div>
          <dl className="space-y-2 text-sm">
            <Row label="الاسم" value={patient.fullName} />
            <Row label="الهاتف" value={patient.mobile} />
            <Row label="واتساب" value={patient.whatsapp || '—'} />
            <Row label="سبب الزيارة" value={patient.reason} />
            <Row label="وسيلة التواصل" value={contactLabel ?? '—'} />
          </dl>
        </div>
      </div>

      {patient.notes && (
        <div className="mt-5 rounded-2xl border border-slate-100 bg-white p-5">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800">
            <ClipboardList size={16} className="text-teal-700" />
            ملاحظات
          </div>
          <p className="text-sm text-slate-600">{patient.notes}</p>
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-5 text-sm leading-relaxed text-amber-900">
        <p className="font-bold">سياسة المواعيد</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>يُرجى الحضور قبل الموعد بعشر دقائق على الأقل.</li>
          <li>في حال الرغبة بالإلغاء أو التأجيل، يُرجى التواصل مع العيادة مسبقًا.</li>
          <li>يُعتبر الموعد "لم يحضر" في حال التأخر أكثر من 15 دقيقة دون إشعار.</li>
          <li>هذا الحجز طلب مبدئي، وسيتم تأكيده النهائي من طاقم العيادة.</li>
        </ul>
      </div>

      <div className="mt-6 space-y-4">
        <Captcha onVerifiedChange={setCaptchaVerified} />

        <label className="flex items-start gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-700"
          />
          أوافق على سياسة المواعيد الموضحة أعلاه، وأؤكد صحة البيانات المدخلة.
        </label>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-600 transition-all hover:border-slate-300"
        >
          <ArrowRight size={16} />
          رجوع
        </button>
        <button
          type="button"
          disabled={!canConfirm}
          onClick={onConfirm}
          className={cn(
            'inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition-all',
            canConfirm
              ? 'bg-teal-700 hover:bg-teal-800'
              : 'cursor-not-allowed bg-slate-200 text-slate-400',
          )}
        >
          <ArrowLeft size={16} />
          تأكيد الحجز
        </button>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-semibold text-slate-800">{value}</dd>
    </div>
  )
}
