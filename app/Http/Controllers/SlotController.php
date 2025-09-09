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

        $generator = app(TimeSlotGenerator::class);
        $slots = $generator->generate($employee, $date);
        return response()->json([
            'slots' => $slots,
        ]);
    }
}
