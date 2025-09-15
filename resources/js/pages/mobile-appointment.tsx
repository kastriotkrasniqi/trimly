import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ServiceSelection from "@/components/booking-mobile/service-selection"
import TimeBooking from "@/components/booking-mobile/time-booking"
import BarberSelection from "@/components/booking-mobile/barber-selection"
import BookingConfirmation from "@/components/booking-mobile/booking-confirmation"
import BookingSuccess from "@/components/booking-mobile/booking-success"
import { Barber, Service, TimeSlot } from "@/types/booking"

type BookingStep = "barber" | "service" | "time" | "confirmation" | "processing" | "success"

export default function BookingApp({ employees }: { employees: Barber[] }) {
  const [currentStep, setCurrentStep] = useState<BookingStep>("barber")
  const [processingState, setProcessingState] = useState<"loading"|"success"|"error">("loading")
  const [bookingError, setBookingError] = useState<string>("")
  const [bookingId, setBookingId] = useState<string | number | null>(null)
  const [direction, setDirection] = useState(1)
  // Persisted booking data
  const [selectedBarber, setSelectedBarber] = useState<string>("")
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState<number>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>("")

  const stepOrder: BookingStep[] = ["barber", "service", "time", "confirmation", "success"]

  const changeStep = (step: BookingStep) => {
    setDirection(stepOrder.indexOf(step) > stepOrder.indexOf(currentStep) ? 1 : -1)
    setCurrentStep(step)
  }

  // Step handlers (no longer auto-advance)
  const handleBarberSelect = (barberId: string) => {
    setSelectedBarber(barberId)
  }
  const handleServiceSelect = (services: string[]) => {
    setSelectedServices(services)
  }
  const handleTimeSelect = (time: string, date: number) => {
    setSelectedTime(time)
    setSelectedDate(date)
  }
  // Simulate getting the client_id (replace with real auth/user context in production)
  const clientId = 1;

  // POST appointment to backend
  const handleConfirmBooking = async () => {
  changeStep("processing");
  setProcessingState("loading");
  setBookingError("");
    try {
      // Find selected barber and service details
      const barber = employees.find(e => e.id === selectedBarber);
      const serviceObjs = barber && barber.services ? barber.services.filter(s => selectedServices.includes(s.id)) : [];
      // Calculate end time based on duration
      const startDate = new Date(selectedDate);
      const [startHour, startMinute] = selectedTime.split(":").map(Number);
      startDate.setHours(startHour, startMinute, 0, 0);
      const totalDuration = serviceObjs.reduce((acc, s) => acc + (parseInt(s.duration) || 0), 0);
      const endDate = new Date(startDate.getTime() + totalDuration * 60000);
      const pad = (n) => n.toString().padStart(2, "0");
      const payload = {
        client_id: clientId,
        employee_id: selectedBarber,
        date: startDate.toISOString().slice(0, 10),
        start_time: `${pad(startDate.getHours())}:${pad(startDate.getMinutes())}`,
        end_time: `${pad(endDate.getHours())}:${pad(endDate.getMinutes())}`,
        price: serviceObjs.reduce((acc, s) => acc + (s.price || 0), 0),
        service_ids: selectedServices,
      };
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
      const res = await fetch("/appointments/book-appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let errorText = await res.text();
        if (/<[a-z][\s\S]*>/i.test(errorText)) {
          const doc = document.createElement('div');
          doc.innerHTML = errorText;
          errorText = doc.textContent || doc.innerText || "Failed to book appointment. Please try again.";
          errorText = errorText.trim().split('\n').slice(0, 3).join(' ');
        }
        setProcessingState("error");
        setBookingError(errorText || "Failed to book appointment. Please try again.");
        return;
      }
      const data = await res.json();
      setBookingId(data.appointment_id);
      setProcessingState("success");
      setTimeout(() => {
        changeStep("success");
      }, 900);
    } catch (e) {
      setProcessingState("error");
      setBookingError("Failed to book appointment. Please try again.");
    }
  }
  const handleNewBooking = () => {
    setSelectedBarber("")
    setSelectedServices([])
    setSelectedTime("")
    setSelectedDate(3)
    changeStep("barber")
  }
  const handleBack = () => {
    switch (currentStep) {
      case "service":
        changeStep("barber")
        break
      case "time":
        changeStep("service")
        break
      case "confirmation":
        changeStep("time")
        break
      default:
        break
    }
  }
  const handleCloseBarberSelection = () => {
    changeStep("time")
  }

  // Centralized continue handler
  const handleContinue = () => {
    switch (currentStep) {
      case "barber":
        changeStep("service")
        break
      case "service":
        changeStep("time")
        break
      case "time":
        changeStep("confirmation")
        break
      case "confirmation":
        handleConfirmBooking()
        break
      default:
        break
    }
  }

  // Determine if continue should be enabled
  const isContinueEnabled = () => {
    switch (currentStep) {
      case "barber":
        return !!selectedBarber
      case "service":
        return selectedServices.length > 0
      case "time":
        return !!selectedTime
      case "confirmation":
        return true
      default:
        return false
    }
  }

  // Continue button label
  const getContinueLabel = () => {
    switch (currentStep) {
      case "confirmation":
        return "Confirm Booking"
      case "success":
        return ""
      default:
        return "Continue"
    }
  }

  // Render steps with persisted data (no continue button in children)
  const renderStep = (step: BookingStep) => {
    switch (step) {
      case "processing":
        return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-background">
            {processingState === "loading" && (
              <>
                <div className="relative w-20 h-20 mb-6">
                  <svg className="w-full h-full" viewBox="0 0 48 48">
                    <circle
                      className="text-muted-foreground opacity-20"
                      cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4"
                    />
                    <motion.circle
                      className="text-primary"
                      cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4"
                      strokeDasharray="125.6"
                      strokeDashoffset="100"
                      strokeLinecap="round"
                      initial={{ strokeDashoffset: 125.6 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                    />
                  </svg>
                  <span className="sr-only">Processing</span>
                </div>
                <div className="text-xl font-semibold text-foreground">Processing</div>
              </>
            )}
            {processingState === "success" && (
              <motion.div
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 60, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="flex flex-col items-center"
              >
                <div className="w-20 h-20 mb-6 rounded-full bg-primary flex items-center justify-center">
                  <svg className="w-12 h-12" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="text-xl font-semibold text-white">Success</div>
              </motion.div>
            )}
            {processingState === "error" && (
              <>
                <div className="w-20 h-20 mb-6 rounded-full bg-red-500 flex items-center justify-center">
                  <svg className="w-12 h-12" viewBox="0 0 24 24">
                    <path d="M6 18L18 6M6 6l12 12" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="text-xl font-semibold text-red-600 mb-2">Booking Failed</div>
                <div className="text-base text-red-500 mb-4 max-w-xs text-center">{bookingError}</div>
                <button
                  className="px-6 py-2 bg-primary text-white rounded-xl shadow"
                  onClick={() => changeStep("confirmation")}
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        );
      case "barber":
        return (
          <BarberSelection
            selectedBarber={selectedBarber}
            onBarberSelect={handleBarberSelect}
            onClose={handleCloseBarberSelection}
            employees={employees}
          />
        )
      case "service":
        return (
          <ServiceSelection
            selectedBarber={selectedBarber}
            selectedServices={selectedServices}
            onServiceSelect={handleServiceSelect}
            onBack={handleBack}
          />
        )
      case "time": {
        // Find the selected service's duration (assume first selected service for now)
        let selectedServiceDuration = 30;
        if (selectedServices.length > 0 && employees && employees.length > 0) {
          const barber = employees.find(e => e.id === selectedBarber);
          if (barber && barber.services && Array.isArray(barber.services)) {
            const service = barber.services.find(s => s.id === selectedServices[0]);
            if (service && service.duration) {
              selectedServiceDuration = service.duration;
            }
          }
        }
        return (
          <TimeBooking
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            selectedBarber={selectedBarber}
            serviceDuration={selectedServiceDuration}
            onTimeSelect={handleTimeSelect}
            onBack={handleBack}
          />
        );
      }
      case "confirmation":
        return (
          <BookingConfirmation
            selectedBarber={selectedBarber}
            selectedServiceIds={selectedServices}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            employees={employees}
            onBack={handleBack}
            // onConfirm={handleConfirmBooking} // handled by main button
          />
        )
      case "success":
  return <BookingSuccess bookingId={bookingId ?? ""} onNewBooking={handleNewBooking} />
      default:
        return null
    }
  }

  return (
    <div className="relative w-full min-h-screen bg-background overflow-auto">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          initial={{ x: direction * 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -direction * 300, opacity: 0 }}
          transition={{ type: "tween", duration: 0.25 }}
          className="absolute top-0 left-0 w-full h-full"
        >
          {renderStep(currentStep)}
          {/* Continue button for all steps except success */}
          {/* Animated Continue button, slides in from bottom when enabled */}
          {currentStep !== "success" && (
            <AnimatePresence>
              {isContinueEnabled() && (
                <motion.button
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="sticky mt-2 left-1/2 bottom-6 z-50 -translate-x-1/2 px-6 py-3 bg-primary text-white rounded-2xl shadow-lg"
                  onClick={handleContinue}
                >
                  {getContinueLabel()}
                </motion.button>
              )}
            </AnimatePresence>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
