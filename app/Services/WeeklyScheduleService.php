<?php

namespace App\Services;

use App\Models\Employee;
use Zap\Facades\Zap;
use Carbon\Carbon;

class WeeklyScheduleService
{
    public function setWeeklyAvailability(Employee $employee, $availabilityData, $lunchBreak = null)
    {
        // Clear existing availability and blocked schedules
        $employee->availabilitySchedules()->delete();
        $employee->blockedSchedules()->delete();

        $allDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        $workingDays = [];

        // Create availability schedules
        foreach ($availabilityData as $day => $timeSlots) {
            if (!empty($timeSlots)) {
                $workingDays[] = $day;

                $availability = Zap::for($employee)
                    ->named(ucfirst($day))
                    ->availability()
                    ->from(now())
                    ->to(now()->endOfYear())
                    ->weekly([$day]);

                foreach ($timeSlots as $slot) {
                    $availability->addPeriod($slot['start'], $slot['end']);
                }
                $availability->save();
            }
        }

        // Add lunch break if needed
        if ($lunchBreak && !empty($workingDays)) {
            Zap::for($employee)
                ->named("Lunch Break")
                ->blocked()
                ->from(now())
                ->to(now()->endOfYear())
                ->addPeriod($lunchBreak['start'], $lunchBreak['end'])
                ->weekly($workingDays)
                ->withMetaData([
                    'type' => 'lunch_break',
                    'applies_to_all_days' => true,
                    'working_days' => $workingDays
                ])
                ->save();
        }

        $offDays = array_values(array_diff($allDays, $workingDays));
        if (!empty($offDays)) {
            Zap::for($employee)
                ->named("Days Off")
                ->blocked()
                ->from(now())
                ->to(now()->endOfYear())
                ->addPeriod('00:00', '23:59')
                ->weekly($offDays)
                ->withMetaData([
                    'type' => 'day_off'
                ])
                ->save();
        }
    }


}
