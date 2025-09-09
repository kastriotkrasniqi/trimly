import { useState } from "react";
import { Scissors } from "lucide-react";
import { StepIndicator } from "@/components/booking/StepIndicator";
import { BarberSelection } from "@/components/booking/BarberSelection";
import { ServiceSelection } from "@/components/booking/ServiceSelection";
import { TimeSlotSelection } from "@/components/booking/TimeSlotSelection";
import { BookingStep, BookingData, Barber, Service, TimeSlot } from "@/types/booking";

export default function AppointmentPage({ employees }: { employees: Barber[] }) {
  const [currentStep, setCurrentStep] = useState<BookingStep>(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    selectedServices: []
  });

  const handleSelectBarber = (barber: Barber) => {
    setBookingData(prev => ({ ...prev, selectedBarber: barber }));
  };

  const handleToggleService = (service: Service) => {
    setBookingData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.some(s => s.id === service.id)
        ? prev.selectedServices.filter(s => s.id !== service.id)
        : [...prev.selectedServices, service]
    }));
  };

  const handleSelectDate = (date: Date) => {
    setBookingData(prev => ({ ...prev, selectedDate: date, selectedTimeSlot: undefined }));
  };

  const handleSelectTimeSlot = (timeSlot: TimeSlot) => {
    setBookingData(prev => ({ ...prev, selectedTimeSlot: timeSlot }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => (prev + 1) as BookingStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => (prev - 1) as BookingStep);
    }
  };

  const handleConfirmBooking = () => {
    setCurrentStep(1);
    setBookingData({ selectedServices: [] });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Scissors className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Hair Salon Booking</h1>
          </div>
          <p className="text-muted-foreground">Book your perfect appointment in 3 easy steps</p>
        </div>

        <StepIndicator currentStep={currentStep} />

        <div className="max-w-4xl mx-auto">
            {currentStep === 1 && (
                <BarberSelection
                selectedBarber={bookingData.selectedBarber}
                onSelectBarber={handleSelectBarber}
                onNext={handleNext}
                employees={employees}
                />
            )}

          {currentStep === 2 && (
            <ServiceSelection
              selectedServices={bookingData.selectedServices}
              employee={bookingData.selectedBarber}
              onToggleService={handleToggleService}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 3 && bookingData.selectedBarber && (
            <TimeSlotSelection
              selectedDate={bookingData.selectedDate}
              selectedTimeSlot={bookingData.selectedTimeSlot}
              selectedBarber={bookingData.selectedBarber}
              selectedServices={bookingData.selectedServices}
              onSelectDate={handleSelectDate}
              onSelectTimeSlot={handleSelectTimeSlot}
              onBack={handleBack}
              onConfirmBooking={handleConfirmBooking}
            />
          )}
        </div>
      </div>
    </div>
  );
};
