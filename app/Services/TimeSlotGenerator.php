<?php

namespace App\Services;

use App\Http\Resources\EmployeeResource;
use App\Models\Employee;
use Carbon\Carbon;
use Label84\HoursHelper\Facades\HoursHelper;

class TimeSlotGenerator
{
    /**
     * Make the class invokable for single-purpose slot generation.
     */
    public function __invoke(Employee $employee, string $date, int $serviceDuration): array
    {
        return $this->generate($employee, $date, $serviceDuration);
    }
    /**
     * Generate all available time slots for an employee on a given date.
     *
     * @param Employee $employee
     * @param string $date (Y-m-d)
     * @return array
     */
    public function generate(Employee $employee, string $date, int $serviceDuration): array
    {
        $carbonDate = Carbon::parse($date);
        $dayOfWeek = $carbonDate->dayOfWeek; // 0=Sunday

        $interval = config('settings.slot_interval_minutes'); // step size (e.g. 15)
        $buffer = config('settings.appointment_buffer_minutes');

        $schedule = $employee->schedules()->where('day_of_week', $dayOfWeek)->first();
        if (!$schedule) {
            return [];
        }

        // Ensure start_time and end_time are only times (not full datetimes)
    $startTime = is_string($schedule->start_time) ? $schedule->start_time : ($schedule->start_time->format('H:i') ?? '09:00');
    $endTime = is_string($schedule->end_time) ? $schedule->end_time : ($schedule->end_time->format('H:i') ?? '18:00');

    $slotStartTime = Carbon::parse($date . ' ' . $startTime)->format('H:i');
    $slotEndTime = Carbon::parse($date . ' ' . $endTime)->format('H:i');

        // Generate base slots
        $hours = HoursHelper::create($slotStartTime, $slotEndTime, $interval, 'H:i', []);
        $slots = $hours->toArray();

        // Real appointments
        $appointments = method_exists($employee, 'appointments')
            ? $employee->appointments()->whereDate('date', $date)->get()
            : collect();

        // Add lunch break as a "virtual appointment"
        $lunchStartTime = config('settings.lunch_time_break.start');
        $lunchEndTime = config('settings.lunch_time_break.end');
        $lunchStart = Carbon::parse($date . ' ' . $lunchStartTime);
        $lunchEnd = Carbon::parse($date . ' ' . $lunchEndTime);

        $appointments->push((object) [
            'start_time' => $lunchStart,
            'end_time' => $lunchEnd,
        ]);

        $availableBlocks = [];

        foreach ($slots as $slot) {
            $blockStart = Carbon::createFromFormat('Y-m-d H:i', $date . ' ' . $slot);
            $blockEnd = $blockStart->copy()->addMinutes($serviceDuration);

            // ensure block is within working hours
            if ($blockEnd->format('H:i') > $slotEndTime) {
                continue;
            }

            // check overlap
            $overlap = false;
            foreach ($appointments as $appointment) {
                // If appointment times are already Carbon instances, use as is; otherwise, parse
                $appStart = $appointment->start_time instanceof \Carbon\Carbon
                    ? $appointment->start_time
                    : Carbon::parse($date . ' ' . $appointment->start_time);
                $appEnd = $appointment->end_time instanceof \Carbon\Carbon
                    ? $appointment->end_time->copy()->addMinutes($buffer)
                    : Carbon::parse($date . ' ' . $appointment->end_time)->addMinutes($buffer);

                if ($blockStart < $appEnd && $blockEnd > $appStart) {
                    $overlap = true;
                    break;
                }
            }

            if (!$overlap) {
                $availableBlocks[] = [
                    'start' => $blockStart->format('H:i'),
                    'end' => $blockEnd->format('H:i'),
                ];
            }
        }
        sleep(1);
        return $availableBlocks;
    }



}
