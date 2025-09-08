import { useState } from "react";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { TimeSlot, Service, Barber } from "@/types/booking";
import { generateTimeSlots } from "@/data/bookingData";
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
      description: `Your appointment with ${selectedBarber.name} on ${format(selectedDate, "PPP")} at ${selectedTimeSlot.time} has been booked.`,
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
              <span className="text-foreground font-semibold">${totalPrice}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="font-semibold text-foreground mb-3">Select Date</h3>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-3">Available Time Slots</h3>
          {!selectedDate ? (
            <div className="text-center py-8 text-muted-foreground">
              Please select a date first
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              {timeSlots.map((slot) => (
                <Button
                  key={slot.id}
                  variant={selectedTimeSlot?.id === slot.id ? "default" : "outline"}
                  size="sm"
                  disabled={!slot.available}
                  onClick={() => onSelectTimeSlot(slot)}
                  className={cn(
                    "text-sm",
                    !slot.available && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {slot.time}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Services
        </Button>
        <Button onClick={handleConfirmBooking} disabled={!selectedDate || !selectedTimeSlot}>
          Confirm Booking
        </Button>
      </div>
    </div>
  );
}
