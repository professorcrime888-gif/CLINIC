import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const steps = ['التاريخ والوقت', 'بيانات المريضة', 'مراجعة وتأكيد']

export function StepIndicator({ current }: { current: number }) {
  return (
    <ol className="mx-auto flex max-w-2xl items-center justify-between gap-2">
      {steps.map((step, index) => {
        const isDone = index < current
        const isActive = index === current

        return (
          <li key={step} className="flex flex-1 items-center gap-2">
            <div className="flex flex-1 flex-col items-center gap-2 text-center">
              <span
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors',
                  isDone && 'bg-teal-700 text-white',
                  isActive && !isDone && 'bg-teal-100 text-teal-800 ring-2 ring-teal-700',
                  !isDone && !isActive && 'bg-slate-100 text-slate-400',
                )}
              >
                {isDone ? <Check size={16} /> : index + 1}
              </span>
              <span
                className={cn(
                  'text-xs font-semibold',
                  isActive || isDone ? 'text-slate-800' : 'text-slate-400',
                )}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'mb-6 h-0.5 flex-1 rounded-full',
                  isDone ? 'bg-teal-700' : 'bg-slate-100',
                )}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
