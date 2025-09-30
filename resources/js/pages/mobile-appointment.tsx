import { useState, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ServiceSelection from "@/components/booking-mobile/service-selection"
import TimeBooking from "@/components/booking-mobile/time-booking"
import BarberSelection from "@/components/booking-mobile/barber-selection"
import BookingConfirmation from "@/components/booking-mobile/booking-confirmation"
import BookingSuccess from "@/components/booking-mobile/booking-success"
import { Barber, Service, TimeSlot } from "@/types/booking"

type BookingStep = "barber" | "service" | "time" | "confirmation" | "processing" | "success"

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
  const [currentStep, setCurrentStep] = useState<BookingStep>("barber")
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
    ["barber", "service", "time", "confirmation", "success"], []
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
                    className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent z-50"
                  >
                    <button
                      className="w-full max-w-sm mx-auto block px-6 py-3 bg-primary text-white rounded-2xl shadow-lg font-medium"
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
