import { GraduationCap } from 'lucide-react'
import { useSiteContent } from '@/lib/site-content'
import { Logo } from '@/components/layout/SiteHeader'

export function DoctorIntro() {
  const content = useSiteContent()
  return (
    <section id="about" className="mx-auto max-w-7xl px-5 py-16">
      <div className="grid gap-10 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm lg:grid-cols-[1fr_1.4fr] lg:p-12">
        <div className="flex flex-col items-start">
          <Logo name={content.doctorName} logoUrl={content.logoUrl} size={64} />
          <h2 className="mt-5 text-2xl font-extrabold text-slate-900">{content.doctorName}</h2>
          <p className="mt-1 font-semibold text-teal-700">{content.specialty}</p>

          <div className="mt-6 flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
            <GraduationCap size={18} className="shrink-0 text-teal-700" />
            <span>تُضاف المؤهلات والشهادات العلمية من خلال لوحة التحكم.</span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900">نبذة عن الطبيب</h3>
          <p className="mt-3 leading-relaxed text-slate-600">{content.doctorBio}</p>
          <p className="mt-4 leading-relaxed text-slate-600">
            نحرص على تقديم رعاية طبية دقيقة ومتابعة مستمرة لحالة كل مريضة، مع إعطاء وقت
            كافٍ للاستماع والشرح، بما يضمن راحتكِ وثقتكِ في كل خطوة من رحلتك الصحية.
          </p>
        </div>
      </div>
    </section>
  )
}
