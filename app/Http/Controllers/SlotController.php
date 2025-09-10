<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use App\Services\TimeSlotGenerator;

class SlotController extends Controller
{
    public function getSlotsFromEmployee(Request $request, $employee_id)
    {
        $date = $request->input('date');
        if (!$date) {
            return response()->json(['error' => 'Date is required'], 422);
        }
        $employee = Employee::with('services')->find($employee_id);

        $serviceDuration = (int) $request->input('duration', 0);
        if ($serviceDuration <= 0) {
            return response()->json(['error' => 'Service duration is required'], 422);
        }

        $generator = app(TimeSlotGenerator::class);
        $slots = $generator->generate($employee, $date, $serviceDuration);
        return response()->json([
            'slots' => $slots,
        ]);
    }
}
