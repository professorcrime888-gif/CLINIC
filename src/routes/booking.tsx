import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { StepIndicator } from '@/components/booking/StepIndicator'
import { DateTimeStep } from '@/components/booking/DateTimeStep'
import { PatientInfoStep } from '@/components/booking/PatientInfoStep'
import { SummaryStep } from '@/components/booking/SummaryStep'
import { ConfirmationCard } from '@/components/booking/ConfirmationCard'
import { emptyPatientInfo, type PatientInfo } from '@/components/booking/types'
import { generateBookingNumber, getUpcomingDays } from '@/data/booking'

export const Route = createFileRoute('/booking')({
  component: BookingPage,
})

function BookingPage() {
  const [step, setStep] = useState(0)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [patient, setPatient] = useState<PatientInfo>(emptyPatientInfo)
  const [bookingNumber, setBookingNumber] = useState<string | null>(null)

  const days = useMemo(() => getUpcomingDays(14), [])
  const dateLabel = days.find((d) => d.date === selectedDate)?.label ?? ''

  function handleConfirm() {
    if (!selectedDate) return
    setBookingNumber(generateBookingNumber(selectedDate))
  }

  return (
    <section className="mx-auto max-w-4xl px-5 py-12">
      {!bookingNumber && (
        <>
          <div className="mb-10 text-center">
            <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">حجز موعد</h1>
            <p className="mt-2 text-slate-600">
              اختاري التاريخ والوقت المناسبين لكِ، ثم أكملي بياناتكِ لتأكيد الحجز.
            </p>
          </div>

          <div className="mb-10">
            <StepIndicator current={step} />
          </div>
        </>
      )}

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-10">
        {bookingNumber && selectedDate && selectedTime ? (
          <ConfirmationCard
            bookingNumber={bookingNumber}
            dateLabel={dateLabel}
            time={selectedTime}
            patientName={patient.fullName}
          />
        ) : step === 0 ? (
          <DateTimeStep
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSelect={(date, time) => {
              setSelectedDate(date)
              setSelectedTime(time)
            }}
            onNext={() => setStep(1)}
          />
        ) : step === 1 ? (
          <PatientInfoStep
            value={patient}
            onChange={setPatient}
            onNext={() => setStep(2)}
            onBack={() => setStep(0)}
          />
        ) : (
          <SummaryStep
            dateLabel={dateLabel}
            time={selectedTime ?? ''}
            patient={patient}
            onBack={() => setStep(1)}
            onConfirm={handleConfirm}
          />
        )}
      </div>
    </section>
  )
}
