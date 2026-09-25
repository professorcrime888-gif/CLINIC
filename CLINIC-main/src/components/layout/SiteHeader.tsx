import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getInitials, resolveImageSrc, useSiteContent } from '@/lib/site-content'

const navLinks = [
  { href: '/#services', label: 'الخدمات' },
  { href: '/#about', label: 'عن الطبيب' },
  { href: '/#hours', label: 'مواعيد العيادة' },
  { href: '/#faq', label: 'الأسئلة الشائعة' },
  { href: '/#contact', label: 'تواصل معنا' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const content = useSiteContent()

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <Logo name={content.doctorName} logoUrl={content.logoUrl} />
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-bold text-slate-900 sm:text-base">
              {content.doctorName}
            </span>
            <span className="text-xs text-teal-700">{content.specialty}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-teal-700"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden shrink-0 lg:block">
          <Link
            to="/booking"
            className="inline-flex items-center rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm shadow-teal-700/20 transition-all hover:bg-teal-800 hover:shadow-md"
          >
            احجز موعد
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 lg:hidden"
          aria-label="فتح القائمة"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div
        className={cn(
          'grid overflow-hidden border-t border-slate-100 bg-white transition-all duration-300 lg:hidden',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="flex flex-col gap-1 overflow-hidden px-5 py-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/booking"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex items-center justify-center rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white"
          >
            احجز موعد
          </Link>
        </div>
      </div>
    </header>
  )
}

export function Logo({
  name,
  logoUrl,
  size = 44,
}: {
  name: string
  logoUrl: string
  size?: number
}) {
  if (logoUrl && logoUrl.trim().length > 0) {
    return (
      <img
        src={resolveImageSrc(logoUrl, logoUrl, 160)}
        alt={name}
        style={{ height: size, width: size }}
        className="shrink-0 rounded-2xl object-contain"
      />
    )
  }
  return (
    <span
      style={{ height: size, width: size }}
      className="flex shrink-0 items-center justify-center rounded-2xl bg-teal-700 text-lg font-bold text-white"
    >
      {getInitials(name)}
    </span>
  )
}
