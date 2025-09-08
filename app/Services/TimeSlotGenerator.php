<?php

namespace App\Services;

use App\Models\Employee;
use Carbon\Carbon;
use Label84\HoursHelper\Facades\HoursHelper;

namespace App\Services;

use App\Models\Employee;

use Carbon\Carbon;
use Label84\HoursHelper\Facades\HoursHelper;


class TimeSlotGenerator
{
    /**
     * Make the class invokable for single-purpose slot generation.
     */
    public function __invoke(Employee $employee, string $date): array
    {
        return $this->generate($employee, $date);
    }
    /**
     * Generate all available time slots for an employee on a given date.
     *
     * @param Employee $employee
     * @param string $date (Y-m-d)
     * @return array
     */
    public function generate(Employee $employee, string $date): array
    {
        $carbonDate = Carbon::parse($date);
        $dayOfWeek = $carbonDate->dayOfWeek; // 0=Sunday
        $interval =  config('settings.slot_interval_minutes');
        $buffer =  config('settings.appointment_buffer_minutes');

        $schedule = $employee->schedules()->where('day_of_week', $dayOfWeek)->first();
        if (!$schedule) {
            return [];
        }

        $slotStartTime = substr($schedule->start_time, 0, 5);
        $slotEndTime = substr($schedule->end_time, 0, 5);
        $excludeRanges = [
            [config('settings.lunch_time_break.start'), config('settings.lunch_time_break.end')],
        ];

        $hours = HoursHelper::create($slotStartTime, $slotEndTime, $interval, 'H:i', $excludeRanges);
        $slots = $hours->toArray();

        if (method_exists($employee, 'appointments')) {
            $appointments = $employee->appointments()->whereDate('start_time', $date)->get();
        } else {
            $appointments = collect();
        }

        $availableSlots = [];
        $skipUntil = null;
        foreach ($slots as $slot) {
            $slotStart = Carbon::createFromFormat('Y-m-d H:i', $date . ' ' . $slot);
            $slotEnd = $slotStart->copy()->addMinutes($interval);
            if ($skipUntil && $slotStart < $skipUntil) {
                continue;
            }
            $overlap = false;
            foreach ($appointments as $appointment) {
                $appStart = Carbon::parse($appointment->start_time);
                $appEnd = Carbon::parse($appointment->end_time);
                if ($slotStart < $appEnd && $slotEnd > $appStart) {
                    $overlap = true;
                    $skipUntil = $appEnd->copy()->addMinutes($buffer);
                    break;
                }
            }
            if (!$overlap) {
                $availableSlots[] = $slot;
            }
        }
        return $availableSlots;
    }

}
