import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { contact, doctor, workingHours as defaultWorkingHours } from '@/data/clinic'

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

export interface SiteContent {
  phone: string
  whatsapp: string
  email: string
  address: string
  mapUrl: string
  doctorBio: string
  workingHours: Array<WorkingHourRow>
  social: SocialLinks
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
}

const SiteContentContext = createContext<SiteContent>(defaultSiteContent)

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent)

  useEffect(() => {
    let cancelled = false

    fetch('/.netlify/functions/get-content')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: Partial<SiteContent> | null | undefined) => {
        if (cancelled || !data) return
        setContent((prev) => ({
          ...prev,
          ...data,
          social: { ...prev.social, ...(data.social ?? {}) },
          workingHours:
            data.workingHours && data.workingHours.length > 0
              ? data.workingHours
              : prev.workingHours,
        }))
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
