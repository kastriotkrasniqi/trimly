
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { format, addDays } from "date-fns"

// Type for a single time slot
interface TimeSlot {
    start: string
    end: string
    available?: boolean
}

interface TimeBookingProps {
    onTimeSelect?: (time: string, date: Date) => void
    onBack?: () => void
    selectedDate?: Date
    selectedTime?: string
    selectedBarber?: string
    serviceDuration?: number
}

export default function TimeBooking({
    onTimeSelect,
    onBack,
    selectedDate: initialDate,
    selectedTime: initialTime = "",
    selectedBarber = "",
    serviceDuration = 30,
}: TimeBookingProps) {
    // Today's date for disabling past dates
    const today = new Date()

    // State for selected date and time
    const [selectedDate, setSelectedDate] = useState<Date>(initialDate ?? today)
    const [selectedTime, setSelectedTime] = useState<string>(initialTime)
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
    const [loading, setLoading] = useState(false)

    // Sync state with props when they change
    useEffect(() => {
        if (initialDate) setSelectedDate(initialDate)
        setSelectedTime(initialTime)
    }, [initialDate, initialTime])



    // Fetch available time slots when barber/date/duration changes
    useEffect(() => {
        if (!selectedBarber || !selectedDate) {
            setTimeSlots([])
            return
        }
        setLoading(true)
        const dateStr = format(selectedDate, "yyyy-MM-dd")
        const url = `/api/employee/${selectedBarber}/slots?date=${dateStr}&duration=${serviceDuration}`
        fetch(url)
            .then(res => res.json())
            .then(data => {
                setTimeSlots(Array.isArray(data.slots) ? data.slots : [])
            })
            .catch(() => setTimeSlots([]))
            .finally(() => setLoading(false))
    }, [selectedBarber, selectedDate, serviceDuration])

    // Handle time slot selection
    const handleTimeSelect = (time: string) => {
        setSelectedTime(time)
        if (onTimeSelect) {
            onTimeSelect(time, selectedDate)
        }
    }

    // Format date for display
    const getDateString = (date: Date | undefined) => {
        if (!date || !(date instanceof Date)) return ""
        return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile App Header */}
            <div className="sticky top-0 bg-background z-10">
                <div className="flex items-center justify-center px-4 py-4 relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 bg-gray-100 rounded-full"
                        onClick={onBack}
                    >
                        <ChevronLeft className="h-8 w-8" />
                    </Button>
                    <h1 className="text-2xl font-semibold text-foreground">Choose a time</h1>
                </div>
            </div>

            <div className="px-4 py-6 md:max-w-md mx-auto space-y-8">
                {/* Calendar for date selection */}
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                        setSelectedDate(date);
                        setSelectedTime("");
                        if (onTimeSelect) {
                            onTimeSelect("", date);
                        }
                    }}
                    className="rounded-md border p-2 w-full"
                    classNames={{
                        caption_label: "text-base md:text-lg",
                        weekday: "size-12 md:size-16 text-sm md:text-base",
                        day: "size-11 md:size-12 text-md",
                    }}
                    disabled={[
                        { before: today },
                        { after: addDays(today, 6) },
                    ]}
                />

                {/* Time Slots Grid */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-medium text-foreground">Available Times</h3>
                        {selectedDate && (
                            <span className="text-sm text-muted-foreground">{getDateString(selectedDate)}</span>
                        )}
                    </div>

                    <div className="grid grid-cols-3 gap-3 min-h-[56px]">
                        {loading ? (
                            // Show animated placeholders while loading
                            Array.from({ length: 9 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-12 rounded-2xl bg-muted animate-pulse flex items-center justify-center"
                                >
                                    <span className="w-12 h-3 bg-muted-foreground/20 rounded-full" />
                                </div>
                            ))
                        ) : timeSlots.length === 0 ? (
                            // No slots available
                            <span className="col-span-3 text-center text-muted-foreground">No slots available</span>
                        ) : (
                            // Render available slots
                            timeSlots.map((slot) => (
                                <Button
                                    key={slot.start + '-' + slot.end}
                                    variant={selectedTime === slot.start ? "default" : "outline"}
                                    className={`h-12 rounded-2xl text-md ${selectedTime === slot.start
                                        ? "bg-primary text-primary-foreground"
                                        : "text-secondary border-border hover:bg-secondary/80"
                                    }`}
                                    onClick={() => handleTimeSelect(slot.start)}
                                >
                                    {slot.start}
                                </Button>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Continue button handled by main template */}
            <AnimatePresence>
                {selectedTime && <></>}
            </AnimatePresence>
        </div>
    )
}
