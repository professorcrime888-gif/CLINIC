import { Link } from '@tanstack/react-router'
import { MapPin, Mail, Phone, MessageCircle } from 'lucide-react'
import { clinicName, contact, doctor } from '@/data/clinic'

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer id="contact" className="border-t border-slate-100 bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-sm font-bold text-white">
              عأ
            </span>
            <span className="text-sm font-bold text-slate-900">{doctor.name}</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-600">{clinicName}</p>
          <p className="mt-1 text-sm text-teal-700">{doctor.specialty}</p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold text-slate-900">روابط سريعة</h3>
          <ul className="space-y-2.5 text-sm text-slate-600">
            <li>
              <a href="/#services" className="hover:text-teal-700">
                الخدمات
              </a>
            </li>
            <li>
              <a href="/#about" className="hover:text-teal-700">
                عن الطبيب
              </a>
            </li>
            <li>
              <a href="/#hours" className="hover:text-teal-700">
                مواعيد العيادة
              </a>
            </li>
            <li>
              <a href="/#faq" className="hover:text-teal-700">
                الأسئلة الشائعة
              </a>
            </li>
            <li>
              <Link to="/booking" className="hover:text-teal-700">
                حجز موعد
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold text-slate-900">تواصل معنا</h3>
          <ul className="space-y-2.5 text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <Phone size={16} className="shrink-0 text-teal-700" />
              <span>{contact.phonePlaceholder}</span>
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle size={16} className="shrink-0 text-teal-700" />
              <span>{contact.whatsappPlaceholder}</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="shrink-0 text-teal-700" />
              <span>{contact.emailPlaceholder}</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-teal-700" />
              <span>{contact.addressPlaceholder}</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold text-slate-900">سياسة المواعيد</h3>
          <p className="text-sm leading-relaxed text-slate-600">
            يُرجى الوصول قبل الموعد بعشر دقائق، وإخبارنا مسبقًا في حال الرغبة بالتأجيل أو
            الإلغاء حتى يتسنى لنا استقبال مريضة أخرى.
          </p>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-5 text-xs text-slate-500 sm:flex-row">
          <span>
            © {year} {clinicName}. جميع الحقوق محفوظة.
          </span>
          <span>تم تجهيز هذا الموقع بعناية لخدمة صحة المرأة.</span>
        </div>
      </div>
    </footer>
  )
}
