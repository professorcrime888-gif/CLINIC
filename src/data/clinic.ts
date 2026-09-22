// Central content module for the clinic site.
// Fields marked "قابل للتعديل" are intentionally placeholders and are meant to be
// managed later from the admin dashboard (see PLAN.md) rather than hardcoded here.

export const doctor = {
  name: 'د. عادل عمار آدم',
  nameEn: 'Dr. Adel Ammar Adam',
  specialty: 'أخصائي أمراض النساء والولادة',
  specialtyEn: 'Obstetrics & Gynecology (OB-GYN)',
  // Bio, qualifications, affiliations are intentionally left as editable placeholders —
  // they are not invented here and should be filled in by the clinic via the admin panel.
  bio: 'تُضاف نبذة تعريفية عن الطبيب من خلال لوحة التحكم.',
  qualifications: [] as Array<string>,
}

export const clinicName = 'عيادة د. عادل عمار آدم لأمراض النساء والولادة'

export const contact = {
  phonePlaceholder: 'يُضاف رقم الهاتف من لوحة التحكم',
  whatsappPlaceholder: 'يُضاف رقم واتساب من لوحة التحكم',
  emailPlaceholder: 'يُضاف البريد الإلكتروني من لوحة التحكم',
  addressPlaceholder: 'يُضاف عنوان العيادة من لوحة التحكم',
  mapUrl: null as string | null,
}

export interface WorkingHourRow {
  day: string
  hours: string
}

// Placeholder schedule — every clinic sets its own hours from the admin panel.
export const workingHours: Array<WorkingHourRow> = [
  { day: 'الأحد', hours: '—' },
  { day: 'الإثنين', hours: '—' },
  { day: 'الثلاثاء', hours: '—' },
  { day: 'الأربعاء', hours: '—' },
  { day: 'الخميس', hours: '—' },
  { day: 'الجمعة', hours: '—' },
  { day: 'السبت', hours: '—' },
]

export interface Service {
  id: string
  title: string
  description: string
  icon: 'heart-pulse' | 'baby' | 'stethoscope' | 'calendar-heart' | 'activity' | 'shield-check'
}

export const services: Array<Service> = [
  {
    id: 'pregnancy-care',
    title: 'متابعة الحمل والولادة',
    description: 'متابعة دورية لصحة الأم والجنين خلال جميع مراحل الحمل حتى الولادة.',
    icon: 'baby',
  },
  {
    id: 'gyn-checkup',
    title: 'الفحص الدوري لأمراض النساء',
    description: 'فحوصات وقائية ودورية للكشف المبكر عن مشاكل صحة المرأة.',
    icon: 'stethoscope',
  },
  {
    id: 'ultrasound',
    title: 'الموجات فوق الصوتية (السونار)',
    description: 'تصوير تشخيصي دقيق لمتابعة الحمل وتقييم صحة الجهاز التناسلي.',
    icon: 'activity',
  },
  {
    id: 'cycle-disorders',
    title: 'اضطرابات الدورة الشهرية',
    description: 'تشخيص ومتابعة مشاكل الدورة الشهرية والاضطرابات الهرمونية.',
    icon: 'calendar-heart',
  },
  {
    id: 'family-planning',
    title: 'تنظيم الأسرة',
    description: 'استشارات ووسائل تنظيم الأسرة المناسبة لكل حالة.',
    icon: 'heart-pulse',
  },
  {
    id: 'premarital',
    title: 'فحوصات ما قبل الزواج',
    description: 'فحوصات شاملة لصحة المرأة قبل الزواج بإرشاد طبي متكامل.',
    icon: 'shield-check',
  },
]

export interface FaqItem {
  question: string
  answer: string
}

export const faqs: Array<FaqItem> = [
  {
    question: 'هل يلزم الحجز المسبق لزيارة العيادة؟',
    answer:
      'نعم، يُفضّل حجز موعد مسبق عبر الموقع لضمان استقبالكم في الوقت المناسب وتقليل وقت الانتظار.',
  },
  {
    question: 'كيف يمكنني تعديل أو إلغاء موعدي؟',
    answer:
      'يمكنكم التواصل مع العيادة عبر وسائل الاتصال الموضحة في صفحة "تواصل معنا"، أو من خلال صفحة متابعة الحجز الخاصة بكم.',
  },
  {
    question: 'ماذا يحدث بعد إرسال طلب الحجز؟',
    answer:
      'يصلكم رقم حجز فوري، ثم يتم تأكيد الموعد من قِبل طاقم العيادة عبر وسيلة التواصل التي اخترتموها.',
  },
  {
    question: 'هل بياناتي الطبية والشخصية محفوظة بأمان؟',
    answer:
      'نتعامل مع جميع البيانات الشخصية والطبية بسرية تامة، ولا يمكن الوصول إليها إلا من الطاقم الطبي المخوّل.',
  },
]

export interface WhyChooseUsItem {
  title: string
  description: string
  icon: 'shield-check' | 'heart-pulse' | 'clock' | 'users'
}

export const whyChooseUs: Array<WhyChooseUsItem> = [
  {
    title: 'رعاية مخصصة لكل مريضة',
    description: 'متابعة دقيقة تراعي خصوصية كل حالة على مدار مراحل العلاج والحمل.',
    icon: 'heart-pulse',
  },
  {
    title: 'خصوصية وسرية تامة',
    description: 'إجراءات صارمة لحماية بيانات المريضات وسجلاتهن الطبية.',
    icon: 'shield-check',
  },
  {
    title: 'حجز مرن وسهل',
    description: 'نظام حجز مواعيد إلكتروني سريع يوفر عليكِ وقت الانتظار والاتصال.',
    icon: 'clock',
  },
  {
    title: 'متابعة مستمرة',
    description: 'تذكير بالمواعيد والمتابعات الدورية لضمان استمرارية الرعاية الصحية.',
    icon: 'users',
  },
]
