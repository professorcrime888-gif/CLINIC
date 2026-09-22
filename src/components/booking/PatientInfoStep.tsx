import { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { contactMethods, visitReasons } from '@/data/booking'
import type { PatientInfo } from './types'
import { cn } from '@/lib/utils'

interface PatientInfoStepProps {
  value: PatientInfo
  onChange: (value: PatientInfo) => void
  onNext: () => void
  onBack: () => void
}

type Errors = Partial<Record<keyof PatientInfo, string>>

export function PatientInfoStep({ value, onChange, onNext, onBack }: PatientInfoStepProps) {
  const [errors, setErrors] = useState<Errors>({})

  function set<K extends keyof PatientInfo>(key: K, val: PatientInfo[K]) {
    onChange({ ...value, [key]: val })
  }

  function validate(): boolean {
    const nextErrors: Errors = {}
    if (!value.fullName.trim()) nextErrors.fullName = 'الاسم الكامل مطلوب'
    if (!value.mobile.trim()) nextErrors.mobile = 'رقم الهاتف مطلوب'
    if (!value.dob.trim()) nextErrors.dob = 'تاريخ الميلاد مطلوب'
    if (!value.gender) nextErrors.gender = 'الجنس مطلوب'
    if (!value.reason.trim()) nextErrors.reason = 'سبب الزيارة مطلوب'
    if (!value.contactMethod) nextErrors.contactMethod = 'وسيلة التواصل المفضلة مطلوبة'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleNext() {
    if (validate()) onNext()
  }

  return (
    <div>
      <h2 className="text-base font-bold text-slate-800">بيانات المريضة</h2>
      <p className="mt-1 text-sm text-slate-500">
        الحقول المعلّمة بعلامة (*) مطلوبة، وباقي الحقول اختيارية.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field label="الاسم الكامل" required error={errors.fullName}>
          <input
            type="text"
            value={value.fullName}
            onChange={(e) => set('fullName', e.target.value)}
            className={inputClass(!!errors.fullName)}
            placeholder="اسمك الكامل"
          />
        </Field>

        <Field label="رقم الهاتف" required error={errors.mobile}>
          <input
            type="tel"
            value={value.mobile}
            onChange={(e) => {
              const mobile = e.target.value
              set('mobile', mobile)
              if (value.sameAsMobile) set('whatsapp', mobile)
            }}
            className={inputClass(!!errors.mobile)}
            placeholder="05xxxxxxxx"
          />
        </Field>

        <Field label="رقم الواتساب">
          <div className="space-y-2">
            <input
              type="tel"
              value={value.whatsapp}
              disabled={value.sameAsMobile}
              onChange={(e) => set('whatsapp', e.target.value)}
              className={cn(inputClass(false), value.sameAsMobile && 'bg-slate-50 text-slate-400')}
              placeholder="05xxxxxxxx"
            />
            <label className="flex items-center gap-2 text-xs text-slate-500">
              <input
                type="checkbox"
                checked={value.sameAsMobile}
                onChange={(e) => {
                  const checked = e.target.checked
                  onChange({
                    ...value,
                    sameAsMobile: checked,
                    whatsapp: checked ? value.mobile : value.whatsapp,
                  })
                }}
                className="h-4 w-4 rounded border-slate-300 text-teal-700"
              />
              نفس رقم الهاتف
            </label>
          </div>
        </Field>

        <Field label="تاريخ الميلاد" required error={errors.dob}>
          <input
            type="date"
            value={value.dob}
            onChange={(e) => set('dob', e.target.value)}
            className={inputClass(!!errors.dob)}
          />
        </Field>

        <Field label="الجنس" required error={errors.gender}>
          <select
            value={value.gender}
            onChange={(e) => set('gender', e.target.value as PatientInfo['gender'])}
            className={inputClass(!!errors.gender)}
          >
            <option value="">اختر</option>
            <option value="female">أنثى</option>
            <option value="male">ذكر</option>
          </select>
        </Field>

        <Field label="رقم الهوية / الإقامة (اختياري)">
          <input
            type="text"
            value={value.nationalId}
            onChange={(e) => set('nationalId', e.target.value)}
            className={inputClass(false)}
            placeholder="اختياري"
          />
        </Field>

        <Field label="البريد الإلكتروني (اختياري)">
          <input
            type="email"
            value={value.email}
            onChange={(e) => set('email', e.target.value)}
            className={inputClass(false)}
            placeholder="example@email.com"
          />
        </Field>

        <Field label="العنوان (اختياري)">
          <input
            type="text"
            value={value.address}
            onChange={(e) => set('address', e.target.value)}
            className={inputClass(false)}
            placeholder="المدينة / الحي"
          />
        </Field>

        <Field label="نوع الزيارة" required>
          <div className="flex gap-3">
            {(
              [
                { value: 'first', label: 'زيارة أولى' },
                { value: 'follow-up', label: 'متابعة' },
              ] as const
            ).map((option) => (
              <label
                key={option.value}
                className={cn(
                  'flex flex-1 cursor-pointer items-center justify-center rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors',
                  value.visitType === option.value
                    ? 'border-teal-700 bg-teal-50 text-teal-800'
                    : 'border-slate-200 text-slate-600',
                )}
              >
                <input
                  type="radio"
                  name="visitType"
                  className="sr-only"
                  checked={value.visitType === option.value}
                  onChange={() => set('visitType', option.value)}
                />
                {option.label}
              </label>
            ))}
          </div>
        </Field>

        <Field label="سبب الزيارة" required error={errors.reason}>
          <select
            value={value.reason}
            onChange={(e) => set('reason', e.target.value)}
            className={inputClass(!!errors.reason)}
          >
            <option value="">اختر السبب</option>
            {visitReasons.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </Field>

        <Field label="وسيلة التواصل المفضلة" required error={errors.contactMethod}>
          <select
            value={value.contactMethod}
            onChange={(e) => set('contactMethod', e.target.value as PatientInfo['contactMethod'])}
            className={inputClass(!!errors.contactMethod)}
          >
            <option value="">اختر</option>
            {contactMethods.map((method) => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="ملاحظات إضافية (اختياري)" full>
          <textarea
            value={value.notes}
            onChange={(e) => set('notes', e.target.value)}
            rows={3}
            className={inputClass(false)}
            placeholder="أي معلومات تودين إضافتها قبل الزيارة"
          />
        </Field>
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
          onClick={handleNext}
          className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-teal-800"
        >
          التالي
          <ArrowLeft size={16} />
        </button>
      </div>
    </div>
  )
}

function inputClass(hasError: boolean) {
  return cn(
    'w-full rounded-xl border px-4 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-teal-600 focus:ring-2 focus:ring-teal-100',
    hasError ? 'border-red-300' : 'border-slate-200',
  )
}

function Field({
  label,
  required,
  error,
  full,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  full?: boolean
  children: React.ReactNode
}) {
  return (
    <div className={cn(full && 'sm:col-span-2')}>
      <label className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="text-teal-700"> *</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}
