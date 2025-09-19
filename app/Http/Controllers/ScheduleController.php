<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreScheduleRequest;
use Inertia\Inertia;
use Zap\Facades\Zap;
use App\Models\Employee;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\WeeklyScheduleService;

class ScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $employee = auth()->user()->employee;
        $schedules = [];
        $lunchBreak = null;

        if ($employee) {
            foreach ($employee->availabilitySchedules()->with('periods')->get() as $schedule) {
                $day = strtolower($schedule->name);
                $schedules[$day] = $schedule->periods->map(function ($period) {
                    return [
                        'start' => $period->start_time,
                        'end' => $period->end_time,
                    ];
                })->toArray();
            }

            // Get lunch break (blocked schedule named Lunch Break)
            $lunch = $employee->blockedSchedules()->where('name', 'Lunch Break')->first();
            if ($lunch && !empty($lunch->periods)) {
                $lunchBreak = [
                    'start' => $lunch->periods[0]['start_time'] ?? null,
                    'end' => $lunch->periods[0]['end_time'] ?? null,
                ];
            }
        }


        return Inertia::render('schedules/index', [
            'schedules' => $schedules,
            'lunchBreak' => $lunchBreak,
        ]);
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
    public function store(StoreScheduleRequest $request, Employee $employee)
    {
        sleep(1); // Simulate processing delay for better UX feedback

        $request->validated();

        try {
            $service = app(WeeklyScheduleService::class);

            $availabilityInput = $request->input('availability', []);
            $availabilityData = [];

            foreach ($availabilityInput as $day => $info) {
                if (!empty($info['enabled']) && $info['enabled'] === true) {
                    $availabilityData[$day] = [
                        [
                            'start' => $info['startTime'],
                            'end' => $info['endTime'],
                        ]
                    ];
                }
            }

            $lunchBreak = $request->input('lunch_break');

            $service->setWeeklyAvailability($employee, $availabilityData, $lunchBreak);

            return redirect()->route('schedule.index')->with('success', 'Employee availability updated successfully');

        } catch (\Throwable $th) {
            return back()->withErrors(['error' => 'An error occurred while updating availability: ' . $th->getMessage()]);
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
