import { createFileRoute } from '@tanstack/react-router'
import { Hero } from '@/components/home/Hero'
import { DoctorIntro } from '@/components/home/DoctorIntro'
import { Services } from '@/components/home/Services'
import { CtaBanner } from '@/components/home/CtaBanner'
import { WhyChooseUs } from '@/components/home/WhyChooseUs'
import { WorkingHours } from '@/components/home/WorkingHours'
import { Faq } from '@/components/home/Faq'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div>
      <Hero />
      <DoctorIntro />
      <Services />
      <CtaBanner />
      <WhyChooseUs />
      <WorkingHours />
      <Faq />
    </div>
  )
}
