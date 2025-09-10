import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppointmentPicker } from "@/components/booking/AppoinmentPicker";
import { Barber, Service, TimeSlot } from "@/types/booking";
import { cn } from "@/lib/utils";

interface TimeSlotSelectionProps {
  selectedDate?: Date;
  selectedTimeSlot?: TimeSlot;
  selectedBarber: Barber;
  selectedServices: Service[];
  onSelectDate: (date: Date) => void;
  onSelectTimeSlot: (timeSlot: TimeSlot) => void;
  onBack: () => void;
  onConfirmBooking: () => void;
}

export function TimeSlotSelection({
  selectedDate,
  selectedTimeSlot,
  selectedBarber,
  selectedServices,
  onSelectDate,
  onSelectTimeSlot,
  onBack,
  onConfirmBooking
}: TimeSlotSelectionProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    // If no selectedDate, set it to today by default
    if (!selectedDate) {
      onSelectDate(new Date());
    }
    // Remove direct fetch here, let AppointmentPicker handle fetching with duration
    if (!selectedDate || !selectedBarber?.id) return;
    setTimeSlots([]); // Optionally clear slots on date/barber change
  }, [selectedDate, selectedBarber]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onSelectDate(date);
      setTimeSlots(generateTimeSlots(date));
    }
  };

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedTimeSlot) {
      toast({
        title: "Missing Information",
        description: "Please select both date and time slot.",
        variant: "destructive"
      });
      return;
    }

    onConfirmBooking();
    toast({
      title: "Booking Confirmed!",
      description: `Your appointment with ${selectedBarber.name} on ${selectedDate.toLocaleDateString()} at ${selectedTimeSlot.time} has been booked.`,
    });
  };

  const totalDuration = selectedServices.reduce((sum, service) => sum + service.duration, 0);
  const totalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Select Date & Time</h2>
        <p className="text-muted-foreground mt-2">Choose your preferred appointment slot</p>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <h3 className="font-semibold text-foreground mb-3">Booking Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Barber:</span>
              <span className="text-foreground font-medium">{selectedBarber.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Services:</span>
              <div className="text-right">
                {selectedServices.map((service) => (
                  <div key={service.id} className="text-foreground text-sm">
                    {service.name}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration:</span>
              <Badge variant="secondary">
                <Clock className="w-3 h-3 mr-1" />
                {totalDuration} min
              </Badge>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-muted-foreground">Total Price:</span>
              <span className="text-foreground font-semibold">€{totalPrice}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="col-span-full">
          <AppointmentPicker
            employee={selectedBarber}
            date={selectedDate}
            onSelectDate={onSelectDate}
            time={selectedTimeSlot?.time || null}
            onSelectTime={slot => {
              // Accept slot as "start - end" string, pass as timeSlot object for parent
              onSelectTimeSlot({ id: slot, time: slot, available: true });
            }}
            selectedServices={selectedServices}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Services
        </Button>
        <Button onClick={handleConfirmBooking} disabled={!selectedTimeSlot}>
          Confirm Booking
        </Button>
      </div>
    </div>
  );
}
