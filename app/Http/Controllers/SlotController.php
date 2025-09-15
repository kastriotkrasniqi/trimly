<?php

namespace App\Http\Controllers;

use App\Models\Employee;
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

        $slots = $employee->getAvailableSlots(date: $date, slotDuration: $duration);

        return response()->json([
            'date' => $date,
            'employee' => $employee->first_name . ' ' . $employee->last_name,
            'available_slots' => array_filter($slots, fn($slot) => $slot['is_available'] === true)
        ]);
    }

}
