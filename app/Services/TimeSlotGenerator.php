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

        $slotStartTime = Carbon::parse($date . ' ' . $schedule->start_time)->format('H:i');
        $slotEndTime = Carbon::parse($date . ' ' . $schedule->end_time)->format('H:i');

        // Generate base slots
        $hours = HoursHelper::create($slotStartTime, $slotEndTime, $interval, 'H:i', []);
        $slots = $hours->toArray();

        // Real appointments
        $appointments = method_exists($employee, 'appointments')
            ? $employee->appointments()->whereDate('date', $date)->get()
            : collect();

        // Add lunch break as a "virtual appointment"
        $lunchStart = Carbon::parse($date . ' ' . config('settings.lunch_time_break.start'));
        $lunchEnd = Carbon::parse($date . ' ' . config('settings.lunch_time_break.end'));

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
                $appStart = Carbon::parse($date . ' ' . $appointment->start_time);
                $appEnd = Carbon::parse($date . ' ' . $appointment->end_time)->addMinutes($buffer);

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
