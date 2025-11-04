import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const DAYS = [
  { key: "monday", label: "Mon" },
  { key: "tuesday", label: "Tue" },
  { key: "wednesday", label: "Wed" },
  { key: "thursday", label: "Thu" },
  { key: "friday", label: "Fri" },
  { key: "saturday", label: "Sat" },
  { key: "sunday", label: "Sun" },
] as const

interface ScheduleSummaryProps {
  schedules: any;
  lunchBreak: any;
  employeeName?: string;
}

function convertBackendToScheduleData(schedules: any, lunchBreak: any) {
  const converted: any = {}

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
  } else {
    // Default to disabled for all days if no schedules
    DAYS.forEach(({ key }) => {
      converted[key] = {
        enabled: false,
        startTime: "09:00",
        endTime: "17:00"
      }
    })
  }

  return converted
}

export function ScheduleSummary({ schedules, lunchBreak, employeeName }: ScheduleSummaryProps) {
  const schedule = convertBackendToScheduleData(schedules, lunchBreak)

  return (
    <Card className="h-fit">
      {employeeName && (
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{employeeName}</CardTitle>
        </CardHeader>
      )}
      <CardContent className={employeeName ? "pt-0" : "pt-4"}>
        <div className="mb-4 p-3 bg-muted rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">Lunch Break</span>
            <span className="text-sm text-muted-foreground">
              {lunchBreak && lunchBreak.start && lunchBreak.end
                ? `${lunchBreak.start} - ${lunchBreak.end}`
                : 'Not set'
              }
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {DAYS.map(({ key, label }) => {
            const daySchedule = schedule[key]
            return (
              <div key={key} className="p-3 bg-muted rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{label}</span>
                  <span className="text-sm text-muted-foreground">
                    {daySchedule && daySchedule.enabled ? `${daySchedule.startTime} - ${daySchedule.endTime}` : "Closed"}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
