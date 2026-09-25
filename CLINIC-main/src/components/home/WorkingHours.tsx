import { Clock3, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { useSiteContent } from '@/lib/site-content'

export function WorkingHours() {
  const content = useSiteContent()
  return (
    <section id="hours" className="mx-auto max-w-7xl px-5 py-16">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <Clock3 size={20} />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">مواعيد العيادة</h2>
          </div>

          <ul className="mt-6 divide-y divide-slate-100">
            {content.workingHours.map((row) => (
              <li key={row.day} className="flex items-center justify-between py-3 text-sm">
                <span className="font-semibold text-slate-700">{row.day}</span>
                <span className="text-slate-500">{row.hours}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-slate-400">
            * يتم تحديث مواعيد العمل من خلال لوحة التحكم.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <MapPin size={20} />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">الموقع والتواصل</h2>
          </div>

          <ul className="mt-6 space-y-4 text-sm">
            <li className="flex items-center gap-3 text-slate-600">
              <Phone size={16} className="shrink-0 text-teal-700" />
              {content.phone}
            </li>
            <li className="flex items-center gap-3 text-slate-600">
              <MessageCircle size={16} className="shrink-0 text-teal-700" />
              {content.whatsapp}
            </li>
            <li className="flex items-center gap-3 text-slate-600">
              <Mail size={16} className="shrink-0 text-teal-700" />
              {content.email}
            </li>
            <li className="flex items-start gap-3 text-slate-600">
              <MapPin size={16} className="mt-0.5 shrink-0 text-teal-700" />
              {content.address}
            </li>
          </ul>

          <div className="mt-6 flex h-40 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
            سيتم عرض خريطة الموقع هنا بعد إضافة العنوان
          </div>
        </div>
      </div>
    </section>
  )
}
