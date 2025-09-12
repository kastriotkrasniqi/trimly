import { useState } from "react"
import { motion } from "framer-motion"
import { Scissors } from "lucide-react"
import BarberSelection from "@/components/booking-mobile/barber-selection"
import ServiceSelection from "@/components/booking-mobile/service-selection"
import TimeBooking from "@/components/booking-mobile/time-booking"
import BookingConfirmation from "@/components/booking-mobile/booking-confirmation"
import BookingSuccess from "@/components/booking-mobile/booking-success"
import { Barber, Service, TimeSlot, BookingStep, BookingData } from "@/types/booking"

export default function BookingApp({ employees }: { employees: Barber[] }) {
  const [currentStep, setCurrentStep] = useState<BookingStep>(1)
  const [bookingData, setBookingData] = useState<BookingData>({
    selectedBarber: undefined,
    selectedServices: [],
    selectedDate: undefined,
    selectedTimeSlot: undefined
  })

  const stepOrder: BookingStep[] = [1, 2, 3, 4, 5]
  const [prevStep, setPrevStep] = useState<BookingStep>(1)

  const direction = currentStep > prevStep ? 1 : -1

  const handleSelectBarber = (barber: Barber) => {
    setBookingData(prev => ({ ...prev, selectedBarber: barber }))
  }

  const handleToggleService = (service: Service) => {
    setBookingData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.some(s => s.id === service.id)
        ? prev.selectedServices.filter(s => s.id !== service.id)
        : [...prev.selectedServices, service]
    }))
  }

  const handleSelectDate = (date: Date) => {
    setBookingData(prev => ({ ...prev, selectedDate: date, selectedTimeSlot: undefined }))
  }

  const handleSelectTimeSlot = (timeSlot: TimeSlot) => {
    setBookingData(prev => ({ ...prev, selectedTimeSlot: timeSlot }))
  }

  const handleNext = () => {
    if (currentStep < 5) {
      setPrevStep(currentStep)
      setCurrentStep(prev => (prev + 1) as BookingStep)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setPrevStep(currentStep)
      setCurrentStep(prev => (prev - 1) as BookingStep)
    }
  }

  const handleConfirmBooking = () => {
    setPrevStep(currentStep)
    setCurrentStep(5) // success
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1: // Barber
        return (
          <BarberSelection
            selectedBarber={bookingData.selectedBarber}
            onSelectBarber={handleSelectBarber}
            onNext={handleNext}
            employees={employees}
          />
        )
      case 2: // Services
        return (
          <ServiceSelection
            selectedServices={bookingData.selectedServices}
            employee={bookingData.selectedBarber}
            onToggleService={handleToggleService}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case 3: // Time Booking
        return (
          <TimeBooking
            selectedBarber={bookingData.selectedBarber}
            selectedServices={bookingData.selectedServices}
            selectedDate={bookingData.selectedDate}
            selectedTime={bookingData.selectedTimeSlot}
            onSelectDate={handleSelectDate}
            onSelectTime={handleSelectTimeSlot}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case 4: // Confirmation
        return (
          <BookingConfirmation
            selectedBarber={bookingData.selectedBarber}
            selectedServices={bookingData.selectedServices}
            selectedDate={bookingData.selectedDate}
            selectedTime={bookingData.selectedTimeSlot}
            onConfirm={handleConfirmBooking}
            onBack={handleBack}
          />
        )
      case 5: // Success
        return <BookingSuccess onNewBooking={() => {
          setBookingData({ selectedServices: [] })
          setPrevStep(currentStep)
          setCurrentStep(1)
        }} />
    }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* Optional header */}
      <div className="text-center mb-4 py-4">
        <div className="flex justify-center items-center gap-2">
          <Scissors className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Book Your Appointment</h1>
        </div>
      </div>

      {/* Animated steps */}
      <motion.div
        key={currentStep}
        initial={{ x: direction * 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -direction * 300, opacity: 0 }}
        transition={{ type: "tween", duration: 0.3 }}
        className="absolute top-0 left-0 w-full h-full"
      >
        {renderStep()}
      </motion.div>
    </div>
  )
}
