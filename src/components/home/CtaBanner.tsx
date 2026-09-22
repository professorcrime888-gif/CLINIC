import { Link } from '@tanstack/react-router'
import { CalendarCheck } from 'lucide-react'

export function CtaBanner() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-4">
      <div className="flex flex-col items-center justify-between gap-5 rounded-3xl bg-teal-700 px-8 py-10 text-center sm:flex-row sm:text-start">
        <div>
          <h2 className="text-xl font-extrabold text-white sm:text-2xl">
            جاهزة لحجز موعدكِ؟
          </h2>
          <p className="mt-2 text-sm text-teal-50">
            احجزي موعدك الآن خلال دقائق واختاري الوقت الأنسب لكِ.
          </p>
        </div>
        <Link
          to="/booking"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-teal-800 shadow-lg transition-all hover:-translate-y-0.5"
        >
          <CalendarCheck size={18} />
          احجز موعد الآن
        </Link>
      </div>
    </section>
  )
}
