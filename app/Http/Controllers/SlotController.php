<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Services\TimeSlotGenerator;

class SlotController extends Controller
{
     public function getAvailableSlots(Request $request, int $employee_id)
    {
        sleep(1);
        $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'duration' => 'required|integer|min:15'
        ]);

        $employee = Employee::find($employee_id);
        $date = $request->input('date');
        $duration = $request->input('duration');

        // Get the actual working hours for this day from availability schedules
        $workingHours = $this->getEmployeeWorkingHoursForDate($employee, $date);

        if (!$workingHours) {
            return response()->json([
                'date' => $date,
                'employee' => $employee->first_name . ' ' . $employee->last_name,
                'available_slots' => []
            ]);
        }

        $dayStart = $workingHours['start'];
        $dayEnd = $workingHours['end'];

        // If booking for today, start from current time to prevent past slots
        if (Carbon::parse($date)->isToday()) {
            $currentTime = Carbon::now();

            // Round up to the next 5-minute interval
            $minutes = $currentTime->minute;
            $roundedMinutes = ceil($minutes / 5) * 5;

            if ($roundedMinutes >= 60) {
                $currentTime = $currentTime->addHour()->minute(0);
            } else {
                $currentTime = $currentTime->minute($roundedMinutes);
            }

            $roundedCurrentTime = $currentTime->format('H:i');

            if ($roundedCurrentTime > $dayStart) {
                $dayStart = $roundedCurrentTime;
            }
        }

        // Now pass the actual working hours to getAvailableSlots
        $slots = $employee->getAvailableSlots(
            date: $date,
            dayStart: $dayStart,
            dayEnd: $dayEnd,
            slotDuration: $duration
        );

        return response()->json([
            'date' => $date,
            'employee' => $employee->first_name . ' ' . $employee->last_name,
            'available_slots' => array_filter($slots, fn($slot) => $slot['is_available'] === true)
        ]);
    }

    /**
     * Get employee's actual working hours for a specific date from their availability schedules
     */
    private function getEmployeeWorkingHoursForDate($employee, $date)
    {
        $dayName = strtolower(Carbon::parse($date)->format('l')); // monday, tuesday, etc.

        // Find the availability schedule for this day of the week
        $schedule = $employee->availabilitySchedules()
            ->whereJsonContains('frequency_config->days', $dayName)
            ->with('periods')
            ->first();


        if (!$schedule || $schedule->periods->isEmpty()) {
            return null; // No availability for this day
        }

        // For weekly recurring schedules, get the template period
        // (the periods contain the time ranges that apply to this day)
        $period = $schedule->periods->first();

        return [
            'start' => $period->start_time,
            'end' => $period->end_time
        ];


    }

}
