import { useState, useEffect } from "react"
import { format, addDays, isAfter } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { ScrollArea } from "@/components/ui/scroll-area"

// Accept slots and employee as props
export type AppointmentPickerProps = {
  slots?: string[];
  employee?: { id: string|number; name?: string; email?: string; services?: any[] };
  date?: Date;
  onSelectDate?: (date: Date) => void;
  time?: string | null;
  onSelectTime?: (time: string) => void;
  selectedServices?: { duration: number }[];
};

export function AppointmentPicker({ slots, employee, date: propDate, onSelectDate, time: propTime, onSelectTime, selectedServices }: AppointmentPickerProps) {
  const today = new Date();
  const [date, setDate] = useState<Date>(propDate || today);
  const [time, setTime] = useState<string | null>(propTime || null);
  const [timeSlots, setTimeSlots] = useState<{ time: string, available: boolean }[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Keep local date/time in sync with props
  useEffect(() => {
    if (propDate) setDate(propDate);
  }, [propDate]);
  useEffect(() => {
    if (propTime !== undefined) setTime(propTime);
  }, [propTime]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchData = async () => {
      setLoadingSlots(true);
      try {
        // Calculate total service duration
        let serviceDuration = 0;
        if (Array.isArray(employee?.services) && Array.isArray(selectedServices) && selectedServices.length > 0) {
          serviceDuration = selectedServices.reduce((sum, s) => sum + (typeof s.duration === 'number' ? s.duration : 0), 0);
        }
        // Fallback to 0 if not provided
        const durationParam = serviceDuration > 0 ? `&duration=${serviceDuration}` : '';
        const response = await fetch(`/api/employee/${employee?.id}/slots?date=${date ? format(date, 'yyyy-MM-dd') : ''}${durationParam}`,
          { signal: abortController.signal });
        const data = await response.json();
        setTimeSlots((data.slots || []).map((block: { start: string, end: string }) => ({ time: `${block.start} - ${block.end}`, available: true })));
      } catch (error: any) {
        if (error.name === 'AbortError') {
          // Request was aborted, do not update state
        } else {
          setTimeSlots([]);
        }
      } finally {
        setLoadingSlots(false);
      }
    };

    if (!slots && employee && date) {
      fetchData();
    } else if (slots) {
      setTimeSlots(slots.map(slot => ({ time: slot, available: true })));
      setLoadingSlots(false);
    }
    return () => {
      abortController.abort();
    };
  }, [slots, employee, date, selectedServices]);

  // Only allow booking up to 1 week in advance
  const maxDate = addDays(today, 6);

  const handleDateChange = (newDate: Date | undefined) => {
    if (!newDate || isAfter(newDate, maxDate)) return;
    setDate(newDate);
    setTime(null);
    onSelectDate?.(newDate);
  };

  const handleTimeClick = (slot: string) => {
    setTime(slot);
    if (onSelectTime) {
      // Pass the slot string, not an object, to match parent expectations
      onSelectTime(slot);
    }
  };

  return (
    <div>
      <div className="rounded-md border">
        <div className="flex max-sm:flex-col">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            className="p-2 sm:pe-5"
            disabled={[
              { before: today },
              { after: maxDate },
            ]}
          />
          <div className="relative w-full max-sm:h-48 sm:w-40">
            <div className="absolute inset-0 py-4 max-sm:border-t">
              <ScrollArea className="h-full sm:border-s">
                <div className="space-y-3">
                  <div className="flex h-5 shrink-0 items-center px-5">
                    <p className="text-sm font-medium">
                      {format(date, "EEEE, d")}
                    </p>
                  </div>
                  <div className="grid gap-1.5 px-5 max-sm:grid-cols-2">
                    {loadingSlots && (
                      <div className="space-y-2 w-full">
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className="animate-pulse h-8 bg-muted rounded w-full mb-2"
                          />
                        ))}
                      </div>
                    )}
                    {!loadingSlots && timeSlots.length === 0 && <span>No slots</span>}
                    {!loadingSlots && timeSlots.map(({ time: timeSlot, available },idx) => (
                      <Button
                        key={idx}
                        variant={time === timeSlot ? "default" : "outline"}
                        size="sm"
                        className="w-full"
                        onClick={() => handleTimeClick(timeSlot)}
                        disabled={!available}
                      >
                        {timeSlot}
                      </Button>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
