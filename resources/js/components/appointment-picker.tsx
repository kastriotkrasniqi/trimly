import { useState, useEffect } from "react"
import { format, addDays, isAfter } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { ScrollArea } from "@/components/ui/scroll-area"

// Accept slots and employee as props
export type AppointmentPickerProps = {
  slots?: string[];
  employee?: { id: string|number; name?: string; email?: string };
};

export function AppointmentPicker({ slots, employee }: AppointmentPickerProps) {
  const today = new Date();
  const [date, setDate] = useState<Date>(today);
  const [time, setTime] = useState<string | null>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [employeeId, setEmployeeId] = useState<string | null>(employee ? String(employee.id) : null);
  const [timeSlots, setTimeSlots] = useState<{ time: string, available: boolean }[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // If slots are provided as prop, use them
  useEffect(() => {
    if (slots) {
      setTimeSlots(slots.map(slot => ({ time: slot, available: true })));
      setLoadingSlots(false);
    }
  }, [slots]);

  // If no slots prop, fetch employees and slots as before
  useEffect(() => {
    if (slots) return;
    fetch('/api/employees')
      .then(res => res.json())
      .then(data => setEmployees(data));
  }, [slots]);

  useEffect(() => {
    if (slots) return;
    if (!employeeId || !date) return;
    setLoadingSlots(true);
    fetch(`/api/employees/${employeeId}/slots?date=${format(date, 'yyyy-MM-dd')}`)
      .then(res => res.json())
      .then(data => {
        setTimeSlots((data.slots || []).map((slot: string) => ({ time: slot, available: true })));
        setLoadingSlots(false);
      })
      .catch(() => setLoadingSlots(false));
  }, [employeeId, date, slots]);

  // Only allow booking up to 1 week in advance
  const maxDate = addDays(today, 7);

  return (
    <div>
      {!employee && !slots && (
        <div className="mb-4">
          <label className="block mb-1 font-medium">Select Employee</label>
          <select
            className="border rounded px-2 py-1"
            value={employeeId || ''}
            onChange={e => {
              setEmployeeId(e.target.value)
              setTime(null)
            }}
          >
            <option value="" disabled>Select...</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name || emp.email || `Employee #${emp.id}`}</option>
            ))}
          </select>
        </div>
      )}
      <div className="rounded-md border">
        <div className="flex max-sm:flex-col">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              if (newDate && !isAfter(newDate, maxDate)) {
                setDate(newDate)
                setTime(null)
              }
            }}
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
                    {loadingSlots && <span>Loading...</span>}
                    {!loadingSlots && timeSlots.length === 0 && <span>No slots</span>}
                    {!loadingSlots && timeSlots.map(({ time: timeSlot, available }) => (
                      <Button
                        key={timeSlot}
                        variant={time === timeSlot ? "default" : "outline"}
                        size="sm"
                        className="w-full"
                        onClick={() => setTime(timeSlot)}
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
      <p
        className="text-muted-foreground mt-4 text-center text-xs"
        role="region"
        aria-live="polite"
      >
        Appointment picker -{" "}
        <a
          className="hover:text-foreground underline"
          href="https://daypicker.dev/"
          target="_blank"
          rel="noopener nofollow"
        >
          React DayPicker
        </a>
      </p>
    </div>
  );
}
