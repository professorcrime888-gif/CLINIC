import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { contact, doctor, services as defaultServicesData, workingHours as defaultWorkingHours } from '@/data/clinic'

export interface SocialLinks {
  facebook: string
  instagram: string
  tiktok: string
  twitter: string
}

export interface WorkingHourRow {
  day: string
  hours: string
}

export interface ServiceContent {
  id: string
  title: string
  description: string
}

export interface SiteContent {
  phone: string
  whatsapp: string
  email: string
  address: string
  mapUrl: string
  doctorBio: string
  workingHours: Array<WorkingHourRow>
  social: SocialLinks
  primaryColor: string
  heroBadge: string
  heroDescription: string
  services: Array<ServiceContent>
}

export const defaultSiteContent: SiteContent = {
  phone: contact.phonePlaceholder,
  whatsapp: contact.whatsappPlaceholder,
  email: contact.emailPlaceholder,
  address: contact.addressPlaceholder,
  mapUrl: contact.mapUrl ?? '',
  doctorBio: doctor.bio,
  workingHours: defaultWorkingHours,
  social: { facebook: '', instagram: '', tiktok: '', twitter: '' },
  primaryColor: '#0f766e',
  heroBadge: 'رعاية صحية متخصصة لكل امرأة',
  heroDescription:
    'نوفر متابعة طبية دقيقة ومريحة لصحة المرأة، من الفحوصات الدورية إلى متابعة الحمل والولادة، في بيئة تحترم خصوصيتكِ وتضع راحتكِ أولاً.',
  services: defaultServicesData.map((s) => ({ id: s.id, title: s.title, description: s.description })),
}

const SiteContentContext = createContext<SiteContent>(defaultSiteContent)

// --- runtime color theming -------------------------------------------------
// Tailwind v4 exposes each palette shade as a CSS custom property
// (e.g. --color-teal-700). Overriding those on :root re-colors every
// utility class that uses "teal" across the whole site, without having to
// touch each component.
function hexToHsl(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16) / 255
  const g = parseInt(clean.slice(2, 4), 16) / 255
  const b = parseInt(clean.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      default:
        h = (r - g) / d + 4
    }
    h /= 6
  }
  return [h * 360, s * 100, l * 100]
}

function hslToHex(h: number, s: number, l: number): string {
  const sN = s / 100
  const lN = l / 100
  const k = (n: number) => (n + h / 30) % 12
  const a = sN * Math.min(lN, 1 - lN)
  const f = (n: number) => lN - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  const toHex = (x: number) =>
    Math.round(255 * x)
      .toString(16)
      .padStart(2, '0')
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`
}

const SHADE_LIGHTNESS: Record<string, number> = {
  '50': 96,
  '100': 91,
  '200': 82,
  '300': 70,
  '400': 56,
  '500': 45,
  '600': 38,
  '700': 31,
  '800': 26,
  '900': 21,
}

export function applyThemeColor(hex: string) {
  if (typeof document === 'undefined' || !/^#[0-9a-fA-F]{6}$/.test(hex)) return
  const [h, s] = hexToHsl(hex)
  const root = document.documentElement
  for (const [shade, lightness] of Object.entries(SHADE_LIGHTNESS)) {
    root.style.setProperty(`--color-teal-${shade}`, hslToHex(h, Math.max(s, 35), lightness))
  }
}
// ---------------------------------------------------------------------------

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent)

  useEffect(() => {
    let cancelled = false

    fetch('/.netlify/functions/get-content')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: Partial<SiteContent> | null | undefined) => {
        if (cancelled || !data) return
        setContent((prev) => {
          const next = {
            ...prev,
            ...data,
            social: { ...prev.social, ...(data.social ?? {}) },
            workingHours:
              data.workingHours && data.workingHours.length > 0
                ? data.workingHours
                : prev.workingHours,
            services:
              data.services && data.services.length > 0 ? data.services : prev.services,
          }
          if (next.primaryColor) applyThemeColor(next.primaryColor)
          return next
        })
      })
      .catch(() => {
        // Silently keep defaults if the function isn't reachable yet
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <SiteContentContext.Provider value={content}>{children}</SiteContentContext.Provider>
  )
}

export function useSiteContent() {
  return useContext(SiteContentContext)
}
