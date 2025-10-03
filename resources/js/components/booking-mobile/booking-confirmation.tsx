
import { ChevronLeft, Calendar, User, Scissors } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// Props for the booking confirmation summary
interface BookingConfirmationProps {
  selectedServiceIds: string[]
  selectedTime: string
  selectedDate: Date | number
  selectedBarber: string
  onBack?: () => void
  onConfirm?: () => void
  employees?: any[] // passed from parent for lookup
}

export default function BookingConfirmation({
  selectedServiceIds,
  selectedTime,
  selectedDate,
  selectedBarber,
  onBack,
  onConfirm,
  employees = [],
}: BookingConfirmationProps) {
  // Lookup selected barber from employees
  const barber = Array.isArray(employees)
    ? employees.find(e => e.id === selectedBarber)
    : undefined

  // Lookup selected services from barber
  const services = barber && Array.isArray(barber.services)
    ? barber.services.filter(s => Array.isArray(selectedServiceIds) && selectedServiceIds.includes(s.id))
    : []

  // Format the selected date for display
  let dateObj: Date
  if (selectedDate instanceof Date) {
    dateObj = selectedDate
  } else if (typeof selectedDate === "number") {
    dateObj = new Date(selectedDate)
  } else {
    dateObj = new Date()
  }
  const formattedDate = dateObj.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Handler for confirm booking (if needed in future)
  const handleConfirmBooking = () => {
    if (onConfirm) onConfirm()
  }

  // Calculate total duration and price
  const totalDuration = services.reduce((acc, s) => acc + (parseInt(s.duration) || 0), 0)
  const totalPrice = services.reduce((acc, s) => acc + (parseFloat(s.price) || 0), 0).toFixed(2);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background z-10">
        <div className="flex items-center justify-center px-4 py-4 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 bg-gray-100 rounded-full text-gray-400"
            onClick={onBack}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <h1 className="text-2xl font-semibold text-foreground">Booking Summary</h1>
        </div>
      </div>

      <div className="px-4 py-6 pb-24 max-w-md mx-auto space-y-6">
        {/* Date & Time */}
        <Card className="bg-card border border-border mb-4 shadow-sm">
          <div className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                <Calendar className="h-6 w-6 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-card-foreground text-base">Date & Time</h3>
                <p className="text-sm text-muted-foreground">{formattedDate}</p>
                <p className="text-lg font-semibold text-card-foreground mt-1">{selectedTime}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Barber */}
        <Card className="bg-card border border-border mb-4 shadow-sm">
          <div className="p-4">
            <div className="flex items-start space-x-3">
              {selectedBarber === "any" ? (
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                  <User className="h-6 w-6 text-accent-foreground" />
                </div>
              ) : (
                <img
                  src={barber?.image || "/placeholder.svg"}
                  alt={barber?.name || "Barber"}
                  className="w-12 h-12 rounded-full object-cover border border-border"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-card-foreground text-base mb-1">
                  {selectedBarber === "any" ? "Any Professional" : barber?.user?.name}
                </h3>
                <p className="text-sm text-muted-foreground">Hair Stylist</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Services */}
        {services.length > 0 && (
          <Card className="bg-card border border-border mb-4 shadow-sm">
            <div className="p-4 py-2">
              <h3 className="font-semibold text-card-foreground text-base mb-3 flex items-center gap-2">
                <Scissors className="h-5 w-5 text-accent-foreground" /> Services
              </h3>
              <ul className="divide-y divide-border">
                {services.map((service) => (
                  <li key={service.id} className="py-2 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{service.name}</span>
                      <span className="text-sm text-muted-foreground">{service.duration} min</span>
                    </div>
                    {service.description && (
                      <span className="text-xs text-muted-foreground">{service.description}</span>
                    )}
                    <span className="text-lg font-semibold text-card-foreground">€{service.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        )}

        {/* Total Summary */}
        <Card className="shadow-md">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Total</h3>
                <p className="text-sm opacity-90">{totalDuration} min appointment</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">€{totalPrice}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Booking Notes */}
        <div className="bg-muted rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-2">Booking Information</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Please arrive 5 minutes early</li>
            <li>• Cancellations must be made 24 hours in advance</li>
            <li>• We accept cash and card payments</li>
          </ul>
        </div>
      </div>

      {/* Confirm button removed; handled by main template */}
    </div>
  )
}
