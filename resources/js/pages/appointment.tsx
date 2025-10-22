import { useState, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ServiceSelection from "@/components/booking-mobile/service-selection"
import TimeBooking from "@/components/booking-mobile/time-booking"
import BarberSelection from "@/components/booking-mobile/barber-selection"
import BookingConfirmation from "@/components/booking-mobile/booking-confirmation"
import BookingSuccess from "@/components/booking-mobile/booking-success"
import { Barber, Service, TimeSlot } from "@/types/booking"
import { usePage } from '@inertiajs/react'

type BookingStep = "login" | "barber" | "service" | "time" | "confirmation" | "processing" | "success"

interface BookingData {
  selectedBarber: string;
  selectedServices: string[];
  selectedDate: Date;
  selectedTime: string;
}

interface BookingAppProps {
  employees: Barber[];
  onClose?: () => void;
}

export default function BookingApp({ employees, onClose }: BookingAppProps) {
  const { props } = usePage()
  const user = props.auth?.user || null

  const [currentStep, setCurrentStep] = useState<BookingStep>(user ? "barber" : "login")
  const [processingState, setProcessingState] = useState<"loading" | "success" | "error">("loading")
  const [bookingError, setBookingError] = useState<string>("")
  const [bookingReference, setBookingReference] = useState<string | number | null>(null)
  const [direction, setDirection] = useState(1)
  const [closing, setClosing] = useState(false)

  // Persisted booking data
  const [bookingData, setBookingData] = useState<BookingData>({
    selectedBarber: "",
    selectedServices: [],
    selectedDate: new Date(),
    selectedTime: ""
  })

  const stepOrder: BookingStep[] = useMemo(() =>
    user ? ["barber", "service", "time", "confirmation", "success"] : ["login", "barber", "service", "time", "confirmation", "success"], [user]
  )

  const changeStep = useCallback((step: BookingStep) => {
    setDirection(stepOrder.indexOf(step) > stepOrder.indexOf(currentStep) ? 1 : -1)
    setCurrentStep(step)
  }, [stepOrder, currentStep])

  // Step handlers with optimized state updates
  const handleBarberSelect = useCallback((barberId: string) => {
    setBookingData(prev => ({ ...prev, selectedBarber: barberId }))
  }, [])

  const handleServiceSelect = useCallback((services: string[]) => {
    setBookingData(prev => ({ ...prev, selectedServices: services }))
  }, [])

  const handleTimeSelect = useCallback((time: string, date: Date) => {
    setBookingData(prev => ({
      ...prev,
      selectedTime: time,
      selectedDate: date
    }))
  }, [])

  // Simulate getting the client_id (replace with real auth/user context in production)
  const clientId = 1;

  // POST appointment to backend
  const handleConfirmBooking = useCallback(async () => {
    changeStep("processing");
    setProcessingState("loading");
    setBookingError("");

    try {
      // Find selected barber and service details
      const barber = employees.find(e => e.id === bookingData.selectedBarber);
      const serviceObjs = barber?.services?.filter(s =>
        bookingData.selectedServices.includes(s.id)
      ) || [];

      // Calculate end time based on duration
      const startDate = new Date(bookingData.selectedDate);
      const [startHour, startMinute] = bookingData.selectedTime.split(":").map(Number);
      startDate.setHours(startHour, startMinute, 0, 0);

      const totalDuration = serviceObjs.reduce((acc, s) => acc + (parseInt(s.duration) || 0), 0);
      const endDate = new Date(startDate.getTime() + totalDuration * 60000);

      const pad = (n: number) => n.toString().padStart(2, "0");
      const payload = {
        client_id: clientId,
        employee_id: bookingData.selectedBarber,
        date: startDate.toISOString().slice(0, 10),
        start_time: `${pad(startDate.getHours())}:${pad(startDate.getMinutes())}`,
        end_time: `${pad(endDate.getHours())}:${pad(endDate.getMinutes())}`,
        price: serviceObjs.reduce((acc, s) => acc + (parseFloat(s.price) || 0), 0),
        service_ids: bookingData.selectedServices,
      };

      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
      const response = await fetch("/appointments/book-appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage = "Failed to book appointment. Please try again.";

        try {
          const errorText = await response.text();

          // Try to parse as JSON first
          try {
            const errorData = JSON.parse(errorText);
            if (errorData.error) {
              errorMessage = errorData.error;
            } else if (errorData.message) {
              errorMessage = errorData.message;
            } else if (errorData.errors) {
              // Handle validation errors
              const firstError = Object.values(errorData.errors)[0];
              errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
            }

            // Clean up the error message - remove any remaining JSON structure
            errorMessage = errorMessage.toString().replace(/^["']|["']$/g, ''); // Remove quotes
            errorMessage = errorMessage.replace(/^\{.*?"error":\s*"([^"]+)".*\}$/i, '$1'); // Extract from JSON structure
            errorMessage = errorMessage.replace(/^\{.*?"message":\s*"([^"]+)".*\}$/i, '$1'); // Extract from JSON structure
          } catch {
            // If not JSON, check if it's HTML and extract text
            if (/<[a-z][\s\S]*>/i.test(errorText)) {
              const doc = document.createElement('div');
              doc.innerHTML = errorText;
              const textContent = doc.textContent || doc.innerText || "";
              errorMessage = textContent.trim().split('\n').slice(0, 3).join(' ') || errorMessage;
            } else {
              // Plain text error
              errorMessage = errorText.trim() || errorMessage;
            }
          }
        } catch {
          // Keep default error message
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      setBookingReference(data.appointment?.metadata?.reference || "N/A");
      setProcessingState("success");

      setTimeout(() => {
        changeStep("success");
      }, 900);
    } catch (error) {
      console.error('Booking error:', error);
      setProcessingState("error");
      setBookingError(error instanceof Error ? error.message : "Failed to book appointment. Please try again.");
    }
  }, [bookingData, employees, clientId, changeStep])
  const handleNewBooking = useCallback(() => {
    setBookingData({
      selectedBarber: "",
      selectedServices: [],
      selectedTime: "",
      selectedDate: new Date()
    })
    changeStep("barber")
  }, [changeStep])

  const handleBack = useCallback(() => {
    switch (currentStep) {
      case "barber":
        if (!user) {
          changeStep("login")
        }
        break
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
  }, [currentStep, changeStep])

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      onClose?.();
      setClosing(false);
    }, 300); // match animation duration
  }, [onClose])

  // Centralized continue handler
  const handleContinue = useCallback(() => {
    switch (currentStep) {
      case "login":
        // This case won't be used as login step doesn't have continue button
        break
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
  }, [currentStep, changeStep, handleConfirmBooking])

  // Determine if continue should be enabled
  const isContinueEnabled = useMemo(() => {
    switch (currentStep) {
      case "login":
        return false // Login step doesn't use continue button
      case "barber":
        return !!bookingData.selectedBarber
      case "service":
        return bookingData.selectedServices.length > 0
      case "time":
        return !!bookingData.selectedTime
      case "confirmation":
        return true
      default:
        return false
    }
  }, [currentStep, bookingData])

  // Continue button label
  const getContinueLabel = useMemo(() => {
    switch (currentStep) {
      case "login":
        return "" // Login step doesn't use continue button
      case "confirmation":
        return "Confirm Booking"
      case "success":
        return ""
      default:
        return "Continue"
    }
  }, [currentStep])

  // Calculate selected service duration outside of renderStep to avoid hook issues
  const selectedServiceDuration = useMemo(() => {
    if (bookingData.selectedServices.length > 0 && employees.length > 0) {
      const barber = employees.find(e => e.id === bookingData.selectedBarber);
      const service = barber?.services?.find(s => s.id === bookingData.selectedServices[0]);
      return service?.duration || 30;
    }
    return 30;
  }, [bookingData.selectedServices, bookingData.selectedBarber, employees])

  // Render steps with persisted data (no continue button in children)
  const renderStep = (step: BookingStep) => {
    switch (step) {
      case "login":
        return (
          <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-background z-10">
              <div className="flex items-center justify-center px-4 py-4 relative">
                <button
                  className="absolute left-4 bg-gray-100 dark:bg-gray-800 rounded-full p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  onClick={onClose}
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h1 className="text-2xl font-semibold text-foreground">Login Required</h1>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
              <div className="max-w-md w-full text-center space-y-6">
                {/* Icon */}
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>

                {/* Title & Description */}
                <div className="space-y-3">
                  <h2 className="text-2xl font-bold text-foreground">Login to Book Appointment</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    You need to be logged in to book an appointment. Please sign in to your account or create a new one to continue.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                  <a
                    href="/login"
                    className="w-full block px-6 py-4 bg-primary text-white rounded-2xl font-semibold hover:bg-primary/90 transition-colors text-center"
                  >
                    Sign In
                  </a>
                  <a
                    href="/register"
                    className="w-full block px-6 py-4 border-2 border-border text-foreground rounded-2xl font-semibold hover:bg-muted transition-colors text-center"
                  >
                    Create Account
                  </a>
                  <button
                    onClick={onClose}
                    className="w-full px-6 py-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
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
              <motion.div
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 60, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="flex flex-col items-center max-w-sm mx-auto px-4"
              >
                <div className="w-20 h-20 mb-6 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-12 h-12 text-red-500" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="m15 9-6 6" stroke="currentColor" strokeWidth="2"/>
                    <path d="m9 9 6 6" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="text-xl font-semibold text-foreground mb-3 text-center">Oops! Something went wrong</div>
                <div className="text-base text-muted-foreground mb-6 text-center leading-relaxed">
                  {bookingError}
                </div>
                <div className="flex flex-col gap-3 w-full">
                  <button
                    className="w-full px-6 py-3 bg-primary text-white rounded-xl shadow-sm hover:bg-primary/90 transition-colors font-medium"
                    onClick={() => changeStep("time")}
                  >
                    Choose Another Time
                  </button>
                  <button
                    className="w-full px-6 py-3 bg-transparent border border-border text-foreground rounded-xl hover:bg-muted transition-colors"
                    onClick={handleClose}
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        );
      case "barber":
        return (
          <div className="h-full flex flex-col">
            <div className="flex-1 pb-20">
              <BarberSelection
                selectedBarber={bookingData.selectedBarber}
                onBarberSelect={handleBarberSelect}
                onClose={handleClose}
                employees={employees}
              />
            </div>
          </div>
        )
      case "service":
        return (
          <div className="h-full flex flex-col">
            <div className="flex-1 pb-20">
              <ServiceSelection
                selectedBarber={bookingData.selectedBarber}
                selectedServices={bookingData.selectedServices}
                onServiceSelect={handleServiceSelect}
                onBack={handleBack}
              />
            </div>
          </div>
        )
      case "time":
        return (
          <div className="h-full flex flex-col">
            <div className="flex-1 pb-20">
              <TimeBooking
                selectedDate={bookingData.selectedDate}
                selectedTime={bookingData.selectedTime}
                selectedBarber={bookingData.selectedBarber}
                serviceDuration={selectedServiceDuration}
                onTimeSelect={handleTimeSelect}
                onBack={handleBack}
              />
            </div>
          </div>
        )
      case "confirmation":
        return (
          <div className="h-full flex flex-col">
            <div className="flex-1 pb-20">
              <BookingConfirmation
                selectedBarber={bookingData.selectedBarber}
                selectedServiceIds={bookingData.selectedServices}
                selectedDate={bookingData.selectedDate}
                selectedTime={bookingData.selectedTime}
                employees={employees}
                onBack={handleBack}
              />
            </div>
          </div>
        )
      case "success":
        return (
          <BookingSuccess
            bookingRef={bookingReference ?? ""}
            onNewBooking={handleNewBooking}
            onClose={handleClose}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden rounded-2xl">
      <AnimatePresence initial={false} custom={direction}>
        {!closing && (
          <motion.div
            key={currentStep}
            custom={direction}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 300, opacity: 0 }}
            transition={{ type: "tween", duration: 0.3 }}
            className="absolute inset-0 flex flex-col"
          >
            <div className="flex-1 overflow-auto">
              {renderStep(currentStep)}
            </div>

            {/* Fixed Continue button at the bottom */}
            {currentStep !== "success" && currentStep !== "processing" && (
              <AnimatePresence>
                {isContinueEnabled && (
                  <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="fixed bottom-0 left-0 right-0 p-6 z-50"
                  >
                    <button
                      className="w-full max-w-sm mx-auto block px-6 py-4 bg-primary text-white rounded-2xl shadow-lg font-medium md:mb-6"
                      onClick={handleContinue}
                    >
                      {getContinueLabel}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
