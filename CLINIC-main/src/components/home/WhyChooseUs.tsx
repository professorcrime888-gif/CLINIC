import { Clock, HeartPulse, ShieldCheck, Users, type LucideIcon } from 'lucide-react'
import { whyChooseUs } from '@/data/clinic'
import { resolveImageSrc, useSiteContent } from '@/lib/site-content'

const icons: Record<string, LucideIcon> = {
  'shield-check': ShieldCheck,
  'heart-pulse': HeartPulse,
  clock: Clock,
  users: Users,
}

export function WhyChooseUs() {
  const content = useSiteContent()
  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
            لماذا تختارين عيادتنا؟
          </h2>
          <p className="mt-3 text-slate-600">
            نجمع بين الدقة الطبية والراحة النفسية لتكون تجربتكِ أفضل ما يمكن.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {whyChooseUs.map((item) => {
              const Icon = icons[item.icon]
              return (
                <div key={item.title} className="flex gap-3 rounded-2xl bg-white p-5 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl shadow-xl shadow-teal-900/10 ring-1 ring-slate-100">
          <img
            src={resolveImageSrc(content.aboutImageUrl, '/img/clinic-illustration.png')}
            alt="بيئة عيادة مريحة"
            className="w-full"
          />
        </div>
      </div>
    </section>
  )
}
