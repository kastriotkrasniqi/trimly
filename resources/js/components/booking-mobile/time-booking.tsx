import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { format,addDays } from "date-fns"

interface TimeSlot {
    time: string
    available: boolean
}

const timeSlots: TimeSlot[] = [
    { time: "7:30am", available: true },
    { time: "8:00am", available: true },
    { time: "8:30am", available: true },
    { time: "10:00am", available: true },
    { time: "11:30am", available: true },
    { time: "12:30pm", available: true },
    { time: "1:45pm", available: true },
    { time: "2:00pm", available: true },
    { time: "3:30pm", available: true },
    { time: "4:00pm", available: true },
    { time: "4:30pm", available: true },
]


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
    const today = new Date();
    const [selectedDate, setSelectedDate] = useState<Date>(initialDate ?? today)
    const [selectedTime, setSelectedTime] = useState<string>(initialTime)
        // const [hasContinued, setHasContinued] = useState(false)
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (initialDate) setSelectedDate(initialDate)
        setSelectedTime(initialTime)
    }, [initialDate, initialTime])

    // Reset selectedTime when selectedDate changes
    useEffect(() => {
        setSelectedTime("");
        if (onTimeSelect) {
            onTimeSelect("", selectedDate);
        }
    }, [selectedDate])

    // Fetch slots when selectedBarber or selectedDate changes
    useEffect(() => {
        if (!selectedBarber || !selectedDate) {
            setTimeSlots([])
            return
        }
        setLoading(true)
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const url = `/api/employee/${selectedBarber}/slots?date=${dateStr}&duration=${serviceDuration}`;
    fetch(url)
            .then(res => res.json())
            .then(data => {
                setTimeSlots(Array.isArray(data.slots) ? data.slots : [])
            })
            .catch(() => setTimeSlots([]))
            .finally(() => setLoading(false))
    }, [selectedBarber, selectedDate, serviceDuration])

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
        if (onTimeSelect) {
            onTimeSelect(time, selectedDate);
        }
    }

    // Handler for continue button
        // Continue button removed; handled by main template

    const getDateString = (date: Date | undefined) => {
        if (!date || !(date instanceof Date)) return ""
        return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile App Header */}
            <div className="sticky top-0 bg-background  z-10">
                <div className="flex items-center justify-center px-4 py-4 relative">
                    <Button variant="ghost" size="icon" className="absolute left-4 bg-gray-100 rounded-full" onClick={onBack}>
                        <ChevronLeft className="h-8 w-8" />
                    </Button>
                    <h1 className="text-2xl font-semibold text-foreground">Choose a time</h1>
                </div>
            </div>

            <div className="px-4 py-6 md:max-w-md mx-auto space-y-8">
                {/* Calendar */}
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border p-2 w-full"
                    classNames={{
                        caption_label:"text-base md:text-lg",
                        weekday:"size-12 md:size-16 text-sm md:text-base",
                        day:"size-11 md:size-12 text-md"
                    }}
                    disabled={[
                        { before: today },
                        { after: addDays(today, 6) },
                    ]}
                />

                {/* Time Slots */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-medium text-foreground">Available Times</h3>
                        {selectedDate && (
                            <span className="text-sm text-muted-foreground">{getDateString(selectedDate)}</span>
                        )}
                    </div>

                    <div className="grid grid-cols-3 gap-3 min-h-[56px]">
                        {loading ? (
                            Array.from({ length: 9 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-12 rounded-2xl bg-muted animate-pulse flex items-center justify-center "
                                >
                                    <span className="w-12 h-3 bg-muted-foreground/20 rounded-full" />
                                </div>
                            ))
                        ) : timeSlots.length === 0 ? (
                            <span className="col-span-3 text-center text-muted-foreground">No slots available</span>
                        ) : (
                            timeSlots.map((slot) => (
                                <Button
                                    key={slot.start + '-' + slot.end}
                                    variant={selectedTime === slot.start ? "default" : "outline"}
                                    className={`h-12 rounded-2xl text-md ${selectedTime === slot.start
                                            ? "bg-primary text-primary-foreground"
                                            : "text-secondary-foreground border-border  hover:bg-secondary/80"
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

            {/* Animated Continue button, slides in from bottom when a time is selected */}
            <AnimatePresence>
                    {selectedTime && (
                        // Continue button removed; handled by main template
                        <></>
                    )}
            </AnimatePresence>
        </div>
    )
}
