import { Link } from '@tanstack/react-router'
import { CalendarCheck, Clock3, MessageCircle } from 'lucide-react'
import { doctor } from '@/data/clinic'
import { useSiteContent } from '@/lib/site-content'

export function Hero() {
  const content = useSiteContent()
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-teal-50 via-white to-white">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 lg:grid-cols-2 lg:py-20">
        <div className="order-2 lg:order-1">
          <span className="inline-flex items-center rounded-full bg-teal-100 px-4 py-1.5 text-sm font-semibold text-teal-800">
            {content.heroBadge}
          </span>

          <h1 className="mt-5 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {doctor.name}
          </h1>
          <p className="mt-3 text-lg font-semibold text-teal-700 sm:text-xl">
            {doctor.specialty}
          </p>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600">
            {content.heroDescription}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-700/25 transition-all hover:-translate-y-0.5 hover:bg-teal-800"
            >
              <CalendarCheck size={18} />
              احجز موعد
            </Link>
            <a
              href="#hours"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-teal-200 hover:text-teal-700"
            >
              <Clock3 size={18} />
              مواعيد العيادة
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-teal-200 hover:text-teal-700"
            >
              <MessageCircle size={18} />
              تواصل معنا
            </a>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-slate-100 pt-6 sm:max-w-md">
            <div>
              <dt className="text-xs text-slate-500">الحجز</dt>
              <dd className="mt-1 text-sm font-bold text-slate-900">إلكتروني وسريع</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">الخصوصية</dt>
              <dd className="mt-1 text-sm font-bold text-slate-900">سرية تامة</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">المتابعة</dt>
              <dd className="mt-1 text-sm font-bold text-slate-900">مستمرة ومنظمة</dd>
            </div>
          </dl>
        </div>

        <div className="order-1 lg:order-2">
          <div className="mx-auto max-w-lg overflow-hidden rounded-3xl bg-white p-4 shadow-xl shadow-teal-900/10 ring-1 ring-slate-100">
            <img
              src="/.netlify/images?url=/img/hero-illustration.png&w=900&fm=webp"
              alt="رعاية صحة المرأة"
              className="w-full rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
