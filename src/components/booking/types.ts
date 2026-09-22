import type { ContactMethod } from '@/data/booking'

export type Gender = 'female' | 'male' | ''

export type VisitType = 'first' | 'follow-up'

export interface PatientInfo {
  fullName: string
  mobile: string
  whatsapp: string
  sameAsMobile: boolean
  dob: string
  gender: Gender
  nationalId: string
  address: string
  email: string
  visitType: VisitType
  reason: string
  notes: string
  contactMethod: ContactMethod | ''
}

export const emptyPatientInfo: PatientInfo = {
  fullName: '',
  mobile: '',
  whatsapp: '',
  sameAsMobile: true,
  dob: '',
  gender: '',
  nationalId: '',
  address: '',
  email: '',
  visitType: 'first',
  reason: '',
  notes: '',
  contactMethod: '',
}
