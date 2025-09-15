<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;
use Zap\Facades\Zap;

class ScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Employee $employee)
    {
        $request->validate([
            'availability' => 'required|array',
            'lunch_break' => 'nullable|array',
            'lunch_break.start' => 'required_with:lunch_break|date_format:H:i',
            'lunch_break.end' => 'required_with:lunch_break|date_format:H:i|after:lunch_break.start',
        ]);


        try {
            $service = app(\App\Services\WeeklyScheduleService::class);
            $service->setWeeklyAvailability($employee, $request->input('availability'), $request->input('lunch_break'));

            return response()->json([
                'message' => 'Employee availability updated successfully'
            ]);

        } catch (\Throwable $th) {

            return response()->json([
                'error' => $th->getMessage()
            ], 422);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
