
import { Check, Calendar, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// Props for the booking success screen
interface BookingSuccessProps {
  bookingRef: string | number;
  onNewBooking?: () => void
}

export default function BookingSuccess({ bookingRef, onNewBooking }: BookingSuccessProps) {
  // Use the real booking ID as the reference

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-8 max-w-md mx-auto">
        {/* Success Icon and message */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground">Your appointment has been successfully scheduled</p>
        </div>

        {/* Booking Reference */}
        <Card className="bg-card border-border mb-6">
          <div className="p-4 text-center">
            <h3 className="font-semibold text-card-foreground mb-2">Booking Reference</h3>
            <p className="text-md font-mono font-bold text-primary">#{bookingRef}</p>
          </div>
        </Card>

        {/* Next Steps */}
        <Card className="bg-card border-border mb-6">
          <div className="p-4">
            <h3 className="font-semibold text-card-foreground mb-4">What's Next?</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-accent-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">You'll receive a confirmation email shortly</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <Clock className="h-4 w-4 text-accent-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">We'll send a reminder 24 hours before</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-accent-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">Find us at 123 Main Street, Downtown</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            className="w-full h-12 bg-primary text-primary-foreground font-semibold"
            onClick={onNewBooking}
          >
            Book Another Appointment
          </Button>
          <Button variant="outline" className="w-full h-12 bg-transparent">
            View My Bookings
          </Button>
        </div>
      </div>
    </div>
  )
}
