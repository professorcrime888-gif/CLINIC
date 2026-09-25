import { useMemo, useState } from 'react'
import { ArrowLeft, CalendarDays, Clock3 } from 'lucide-react'
import { getUpcomingDays } from '@/data/booking'
import { cn } from '@/lib/utils'

interface DateTimeStepProps {
  selectedDate: string | null
  selectedTime: string | null
  onSelect: (date: string, time: string) => void
  onNext: () => void
}

export function DateTimeStep({
  selectedDate,
  selectedTime,
  onSelect,
  onNext,
}: DateTimeStepProps) {
  const days = useMemo(() => getUpcomingDays(14), [])
  const [activeDate, setActiveDate] = useState<string>(selectedDate ?? days[0].date)

  const activeDay = days.find((d) => d.date === activeDate) ?? days[0]

  return (
    <div>
      <div className="flex items-center gap-2 text-slate-800">
        <CalendarDays size={18} className="text-teal-700" />
        <h2 className="text-base font-bold">اختر التاريخ</h2>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        {days.map((day) => {
          const isActive = day.date === activeDate
          return (
            <button
              key={day.date}
              type="button"
              onClick={() => setActiveDate(day.date)}
              className={cn(
                'flex shrink-0 flex-col items-center gap-1 rounded-2xl border px-4 py-3 text-sm transition-all',
                isActive
                  ? 'border-teal-700 bg-teal-700 text-white shadow-md shadow-teal-700/20'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-teal-200 hover:text-teal-700',
              )}
            >
              <span className="whitespace-nowrap font-semibold">{day.label}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-8 flex items-center gap-2 text-slate-800">
        <Clock3 size={18} className="text-teal-700" />
        <h2 className="text-base font-bold">اختر الوقت المتاح</h2>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {activeDay.slots.map((slot) => {
          const isSelected = activeDate === selectedDate && slot.time === selectedTime
          return (
            <button
              key={slot.time}
              type="button"
              disabled={!slot.available}
              onClick={() => onSelect(activeDate, slot.time)}
              className={cn(
                'rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all',
                !slot.available &&
                  'cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300 line-through',
                slot.available &&
                  !isSelected &&
                  'border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:text-teal-700',
                isSelected &&
                  'border-teal-700 bg-teal-700 text-white shadow-md shadow-teal-700/20',
              )}
            >
              {slot.time}
            </button>
          )
        })}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          disabled={!selectedDate || !selectedTime}
          onClick={onNext}
          className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
        >
          التالي
          <ArrowLeft size={16} />
        </button>
      </div>
    </div>
  )
}
