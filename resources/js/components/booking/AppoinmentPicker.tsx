import { useState, useEffect } from "react"
import { format, addDays, isAfter } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { ScrollArea } from "@/components/ui/scroll-area"

// Accept slots and employee as props
export type AppointmentPickerProps = {
  slots?: string[];
  employee?: { id: string|number; name?: string; email?: string };
  date?: Date;
  onSelectDate?: (date: Date) => void;
  time?: string | null;
  onSelectTime?: (time: string) => void;
};

export function AppointmentPicker({ slots, employee, date: propDate, onSelectDate, time: propTime, onSelectTime }: AppointmentPickerProps) {
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
    if (slots) {
      setTimeSlots(slots.map(slot => ({ time: slot, available: true })));
      setLoadingSlots(false);
      return;
    }
    if (!employee || !date) return;
    setLoadingSlots(true);
    fetch(`/api/employee/${employee.id}/slots?date=${format(date, 'yyyy-MM-dd')}`)
      .then(res => res.json())
      .then(data => {
        setTimeSlots((data.slots || []).map((slot: string) => ({ time: slot, available: true })));
        setLoadingSlots(false);
      })
      .catch(() => setLoadingSlots(false));
  }, [date]);

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
    onSelectTime?.(slot);
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
                    {!loadingSlots && timeSlots.map(({ time: timeSlot, available }) => (
                      <Button
                        key={timeSlot}
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
