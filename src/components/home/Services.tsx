import {
  Activity,
  Baby,
  CalendarHeart,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  type LucideIcon,
} from 'lucide-react'
import { services } from '@/data/clinic'

const icons: Record<string, LucideIcon> = {
  'heart-pulse': HeartPulse,
  baby: Baby,
  stethoscope: Stethoscope,
  'calendar-heart': CalendarHeart,
  activity: Activity,
  'shield-check': ShieldCheck,
}

export function Services() {
  return (
    <section id="services" className="mx-auto max-w-7xl px-5 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          خدمات العيادة
        </h2>
        <p className="mt-3 text-slate-600">
          رعاية متكاملة لصحة المرأة في جميع مراحل حياتها.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const Icon = icons[service.icon]
          return (
            <div
              key={service.id}
              className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-teal-100 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700 transition-colors group-hover:bg-teal-700 group-hover:text-white">
                <Icon size={22} />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {service.description}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
