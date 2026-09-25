import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { faqs } from '@/data/clinic'
import { cn } from '@/lib/utils'

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="bg-slate-50 py-16">
      <div className="mx-auto max-w-3xl px-5">
        <h2 className="text-center text-2xl font-extrabold text-slate-900 sm:text-3xl">
          الأسئلة الشائعة
        </h2>

        <div className="mt-8 space-y-3">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={item.question}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-3 px-6 py-4 text-start"
                >
                  <span className="text-sm font-bold text-slate-900">{item.question}</span>
                  <ChevronDown
                    size={18}
                    className={cn(
                      'shrink-0 text-teal-700 transition-transform',
                      isOpen && 'rotate-180',
                    )}
                  />
                </button>
                <div
                  className={cn(
                    'grid px-6 transition-all duration-300',
                    isOpen ? 'grid-rows-[1fr] pb-4 opacity-100' : 'grid-rows-[0fr] opacity-0',
                  )}
                >
                  <p className="overflow-hidden text-sm leading-relaxed text-slate-600">
                    {item.answer}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
