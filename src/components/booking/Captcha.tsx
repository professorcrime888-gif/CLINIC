import { useMemo, useState } from 'react'
import { RefreshCw, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CaptchaProps {
  onVerifiedChange: (verified: boolean) => void
}

function makeChallenge() {
  const a = Math.floor(Math.random() * 8) + 1
  const b = Math.floor(Math.random() * 8) + 1
  return { a, b, answer: a + b }
}

export function Captcha({ onVerifiedChange }: CaptchaProps) {
  const [challenge, setChallenge] = useState(makeChallenge)
  const [input, setInput] = useState('')
  const isCorrect = useMemo(
    () => input.trim() !== '' && Number(input) === challenge.answer,
    [input, challenge.answer],
  )

  function refresh() {
    setChallenge(makeChallenge())
    setInput('')
    onVerifiedChange(false)
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <ShieldCheck size={16} className="text-teal-700" />
        تأكيد أنكِ لستِ برنامجًا آليًا
      </div>
      <div className="mt-3 flex items-center gap-3">
        <span className="rounded-lg bg-white px-4 py-2 text-sm font-bold tracking-widest text-slate-800 ring-1 ring-slate-200">
          {challenge.a} + {challenge.b} = ؟
        </span>
        <input
          type="text"
          inputMode="numeric"
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            onVerifiedChange(Number(e.target.value) === challenge.answer && e.target.value !== '')
          }}
          className={cn(
            'w-24 rounded-lg border px-3 py-2 text-center text-sm font-bold outline-none focus:ring-2 focus:ring-teal-100',
            isCorrect ? 'border-teal-500 text-teal-700' : 'border-slate-200 text-slate-800',
          )}
          placeholder="الناتج"
        />
        <button
          type="button"
          onClick={refresh}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:text-teal-700"
          aria-label="تحديث السؤال"
        >
          <RefreshCw size={15} />
        </button>
      </div>
    </div>
  )
}
