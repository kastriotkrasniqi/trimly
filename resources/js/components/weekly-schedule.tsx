import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Clock, Save, RotateCcw } from "lucide-react"
import { useForm } from '@inertiajs/react'
import { toast } from "sonner";
import { store } from '@/actions/App/Http/Controllers/ScheduleController';
import { DaySchedule,WeeklyScheduleData } from "@/types"
import { usePage } from "@inertiajs/react";

const DAYS = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
] as const

const DEFAULT_SCHEDULE: WeeklyScheduleData = {
  monday: { enabled: true, startTime: "09:00", endTime: "17:00" },
  tuesday: { enabled: true, startTime: "09:00", endTime: "17:00" },
  wednesday: { enabled: true, startTime: "09:00", endTime: "17:00" },
  thursday: { enabled: true, startTime: "09:00", endTime: "17:00" },
  friday: { enabled: true, startTime: "09:00", endTime: "17:00" },
  saturday: { enabled: false, startTime: "09:00", endTime: "17:00" },
  sunday: { enabled: false, startTime: "09:00", endTime: "17:00" },
  lunchBreak: { start: "12:00", end: "13:00" },
}

function convertBackendToFrontend(schedules: any, lunchBreak: any): WeeklyScheduleData {
  const converted: WeeklyScheduleData = { ...DEFAULT_SCHEDULE }

  // Convert backend schedules to frontend format
  if (schedules && Object.keys(schedules).length > 0) {
    DAYS.forEach(({ key }) => {
      const dayData = schedules[key]
      if (dayData && dayData.length > 0) {
        const firstPeriod = dayData[0]
        converted[key] = {
          enabled: true,
          startTime: firstPeriod.start,
          endTime: firstPeriod.end
        }
      } else {
        converted[key] = {
          enabled: false,
          startTime: "09:00",
          endTime: "17:00"
        }
      }
    })
  }

  // Convert lunch break
  if (lunchBreak && lunchBreak.start && lunchBreak.end) {
    converted.lunchBreak = {
      start: lunchBreak.start,
      end: lunchBreak.end
    }
  }

  return converted
}

function convertFrontendToBackend(schedule: WeeklyScheduleData) {
  const availability: any = {}
  const lunchBreak = schedule.lunchBreak.start && schedule.lunchBreak.end
    ? { start: schedule.lunchBreak.start, end: schedule.lunchBreak.end }
    : null

  DAYS.forEach(({ key }) => {
    const daySchedule = schedule[key]
    availability[key] = {
      enabled: daySchedule.enabled,
      startTime: daySchedule.startTime,
      endTime: daySchedule.endTime
    }
  })

  return { availability, lunch_break: lunchBreak }
}

export function WeeklySchedule({ initialSchedules, initialLunchBreak }: {
  initialSchedules?: any,
  initialLunchBreak?: any
}) {


  // Check if there are existing schedules
  const hasExistingSchedules = initialSchedules && Object.keys(initialSchedules).length > 0

  // Initialize schedule state
  const initialData = hasExistingSchedules
    ? convertBackendToFrontend(initialSchedules, initialLunchBreak)
    : DEFAULT_SCHEDULE

  const [schedule, setSchedule] = useState<WeeklyScheduleData>(initialData)

  // Add showForm state
  const [showForm, setShowForm] = useState(hasExistingSchedules);

  // Inertia form
  const { data, setData, post, processing, errors, reset } = useForm(convertFrontendToBackend(schedule))

  // Update form data whenever schedule changes
  const updateFormData = (newSchedule: WeeklyScheduleData) => {
    const backendData = convertFrontendToBackend(newSchedule)
    setData(backendData)
  }

  const updateDaySchedule = (day: keyof WeeklyScheduleData, field: keyof DaySchedule, value: string | boolean) => {
    const newSchedule = {
      ...schedule,
      [day]: {
        ...schedule[day],
        [field]: value,
      },
    }
    setSchedule(newSchedule)
    updateFormData(newSchedule)
  }

  const updateLunchBreak = (field: "start" | "end", value: string) => {
    const newSchedule = {
      ...schedule,
      lunchBreak: {
        ...schedule.lunchBreak,
        [field]: value,
      },
    }
    setSchedule(newSchedule)
    updateFormData(newSchedule)
  }

  const validateTimeRange = (startTime: string, endTime: string): boolean => {
    if (!startTime || !endTime) return false
    const start = new Date(`2000-01-01T${startTime}:00`)
    const end = new Date(`2000-01-01T${endTime}:00`)
    return start < end
  }

  const validateLunchBreak = (workStart: string, workEnd: string): boolean => {
    const { start: lunchStart, end: lunchEnd } = schedule.lunchBreak
    if (!lunchStart || !lunchEnd) return true // Lunch break is optional

    const workStartTime = new Date(`2000-01-01T${workStart}:00`)
    const workEndTime = new Date(`2000-01-01T${workEnd}:00`)
    const lunchStartTime = new Date(`2000-01-01T${lunchStart}:00`)
    const lunchEndTime = new Date(`2000-01-01T${lunchEnd}:00`)

    return (
      lunchStartTime < lunchEndTime && // Lunch end after lunch start
      lunchStartTime >= workStartTime && // Lunch starts after work starts
      lunchEndTime <= workEndTime // Lunch ends before work ends
    )
  }

  const [showValidationErrors, setShowValidationErrors] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const validationErrors: string[] = []

    if (schedule.lunchBreak.start && schedule.lunchBreak.end &&
        !validateTimeRange(schedule.lunchBreak.start, schedule.lunchBreak.end)) {
        setShowValidationErrors(true);
      validationErrors.push("Lunch break: End time must be after start time")
    }

    DAYS.forEach(({ key, label }) => {
      const daySchedule = schedule[key]
      if (daySchedule.enabled) {

        if (!validateTimeRange(daySchedule.startTime, daySchedule.endTime)) {
             setShowValidationErrors(true);
          validationErrors.push(`${label}: End time must be after start time`)
        }
        if (!validateLunchBreak(daySchedule.startTime, daySchedule.endTime)) {
             setShowValidationErrors(true);
          validationErrors.push(`${label}: Lunch break must be within work hours`)
        }
      }
    })
    post(store.url())
  }

  const handleReset = () => {
    const resetSchedule = hasExistingSchedules
      ? convertBackendToFrontend(initialSchedules, initialLunchBreak)
      : DEFAULT_SCHEDULE

    setSchedule(resetSchedule)
    updateFormData(resetSchedule)

    toast.info("Schedule Reset", {
      description: hasExistingSchedules
        ? "Schedule has been reset to your saved schedule."
        : "Schedule has been reset to default values.",
    })
  }

  const copyToAll = (sourceDay: keyof WeeklyScheduleData) => {
    const sourceSchedule = schedule[sourceDay]
    const newSchedule = { ...schedule }

    DAYS.forEach(({ key }) => {
      if (key !== sourceDay) {
        newSchedule[key] = { ...sourceSchedule }
      }
    })

    setSchedule(newSchedule)
    updateFormData(newSchedule)

    toast.info("Schedule Copied", {
      description: `${DAYS.find((d) => d.key === sourceDay)?.label} schedule copied to all days.`,
    })
  }

  const createScheduleButton = (
    <Button
      onClick={() => {
        setSchedule(DEFAULT_SCHEDULE);
        updateFormData(DEFAULT_SCHEDULE);
        setShowForm(true);
      }}
      className="flex items-center gap-2 mx-auto"
    >
      <Clock className="h-4 w-4" />
      Create Schedule
    </Button>
  );

  // Change conditional rendering
  if (!showForm) {
    return (
      <div className="space-y-6 px-2 sm:px-4 md:px-0">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Schedule Set</h3>
              <p className="text-muted-foreground mb-6">
                You haven't set up your weekly schedule yet. Create your working hours below.
              </p>
              {createScheduleButton}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 px-1 md:px-0">
      <Card>
        <CardHeader className="mt-2">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Weekly Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-muted/50 rounded-lg space-y-3">
            <Label className="text-base font-medium">Global Lunch Break</Label>
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
              <div className="flex items-center space-x-2">
                <Label htmlFor="lunch-start" className="text-sm text-muted-foreground min-w-[60px]">
                  Start:
                </Label>
                <Input
                  id="lunch-start"
                  type="time"
                  value={schedule.lunchBreak.start}
                  onChange={(e) => updateLunchBreak("start", e.target.value)}
                  className="w-32"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Label htmlFor="lunch-end" className="text-sm text-muted-foreground min-w-[60px]">
                  End:
                </Label>
                <Input
                  id="lunch-end"
                  type="time"
                  value={schedule.lunchBreak.end}
                  onChange={(e) => updateLunchBreak("end", e.target.value)}
                  className="w-32"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">This lunch break will apply to all enabled days</p>
          </div>

          {DAYS.map(({ key, label }) => {
            const daySchedule = schedule[key]
            const hasTimeError = daySchedule.enabled && !validateTimeRange(daySchedule.startTime, daySchedule.endTime)
            const hasLunchError = daySchedule.enabled && !validateLunchBreak(daySchedule.startTime, daySchedule.endTime)

            return (
              <div key={key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={daySchedule.enabled}
                      onCheckedChange={(checked) => updateDaySchedule(key, "enabled", checked)}
                    />
                    <Label className="text-base font-medium min-w-[100px]">{label}</Label>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => copyToAll(key)} className="text-xs">
                    Copy to All
                  </Button>
                </div>

                <div className="space-y-3 ml-8">
                  <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`${key}-start`} className="text-sm text-muted-foreground min-w-[60px]">
                        Start:
                      </Label>
                      <Input
                        id={`${key}-start`}
                        type="time"
                        value={daySchedule.startTime}
                        onChange={(e) => updateDaySchedule(key, "startTime", e.target.value)}
                        disabled={!daySchedule.enabled}
                        className={`w-32 ${hasTimeError ? "border-destructive" : ""}`}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`${key}-end`} className="text-sm text-muted-foreground min-w-[60px]">
                        End:
                      </Label>
                      <Input
                        id={`${key}-end`}
                        type="time"
                        value={daySchedule.endTime}
                        onChange={(e) => updateDaySchedule(key, "endTime", e.target.value)}
                        disabled={!daySchedule.enabled}
                        className={`w-32 ${hasTimeError ? "border-destructive" : ""}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Display server-side validation errors */}
          {showValidationErrors && Object.keys(errors).length > 0 && (
            <div className="p-4 bg-destructive/10 border border-destructive rounded-lg overflow-x-auto">
              <h4 className="font-medium text-destructive mb-2">Validation Errors:</h4>
              <ul className="list-disc list-inside text-sm text-destructive">
                {Object.entries(errors).map(([field, messages]) => (
                  Array.isArray(messages) && messages.length > 0 ? (
                    <li key={field}>{messages.join(", ")}</li>
                  ) : null
                ))}
              </ul>
            </div>
          )}

          {showValidationErrors && (
            <div className="p-4 bg-destructive/10 border border-destructive rounded-lg overflow-x-auto">
              <h4 className="font-medium text-destructive mb-2">Validation Errors:</h4>
              <ul className="list-disc list-inside text-sm text-destructive">
                {DAYS.flatMap(({ key, label }) => {
                  const daySchedule = schedule[key]
                  const errors: string[] = []

                  if (daySchedule.enabled) {
                    if (!validateTimeRange(daySchedule.startTime, daySchedule.endTime)) {
                      errors.push(`${label}: End time must be after start time`)
                    }
                    if (!validateLunchBreak(daySchedule.startTime, daySchedule.endTime)) {
                      errors.push(`${label}: Lunch break must be within work hours`)
                    }
                  }

                  return errors
                }).map((msg, idx) => (
                  <li key={idx}>{msg}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row gap-2 md:gap-0 justify-between">
        <Button variant="outline" onClick={handleReset} className="flex items-center gap-2 bg-transparent">
          <RotateCcw className="h-4 w-4" />
          Reset {hasExistingSchedules ? 'to Saved' : 'to Default'}
        </Button>

        <Button onClick={handleSubmit} disabled={processing} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          {processing ? 'Saving...' : 'Save Schedule'}
        </Button>
      </div>

      {/* Schedule Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Schedule Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-3 bg-muted rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Lunch Break (All Days)</span>
              <span className="text-sm text-muted-foreground">
                {schedule.lunchBreak.start && schedule.lunchBreak.end
                  ? `${schedule.lunchBreak.start} - ${schedule.lunchBreak.end}`
                  : 'Not set'
                }
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {DAYS.map(({ key, label }) => {
              const daySchedule = schedule[key]
              return (
                <div key={key} className="p-3 bg-muted rounded-lg space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{label}</span>
                    <span className="text-sm text-muted-foreground">
                      {daySchedule.enabled ? `${daySchedule.startTime} - ${daySchedule.endTime}` : "Closed"}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
