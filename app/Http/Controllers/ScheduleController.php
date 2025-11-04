<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreScheduleRequest;
use App\Models\Employee;
use App\Services\WeeklyScheduleService;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();

        // Check user role using Spatie permissions and return appropriate schedule data
        if ($user->hasRole('admin')) {
            // Admin can view all employees' schedules
            $employees = Employee::with('user')->where('is_active', true)->get();
            $schedulesData = [];

            foreach ($employees as $employee) {
                $schedules = [];
                $lunchBreak = null;

                foreach ($employee->availabilitySchedules()->with('periods')->get() as $schedule) {
                    $day = strtolower($schedule->name);
                    $schedules[$day] = $schedule->periods->map(function ($period) {
                        return [
                            'start' => $period->start_time,
                            'end' => $period->end_time,
                        ];
                    })->toArray();
                }

                // Only include employees that have at least one schedule set
                if (empty($schedules)) {
                    continue;
                }

                // Get lunch break (blocked schedule named Lunch Break)
                $lunch = $employee->blockedSchedules()->where('name', 'Lunch Break')->first();
                if ($lunch && ! empty($lunch->periods)) {
                    $lunchBreak = [
                        'start' => $lunch->periods[0]['start_time'] ?? null,
                        'end' => $lunch->periods[0]['end_time'] ?? null,
                    ];
                }

                $schedulesData[] = [
                    'employee_id' => $employee->id,
                    'employee_name' => $employee->user->name,
                    'schedules' => $schedules,
                    'lunchBreak' => $lunchBreak,
                ];
            }

            return Inertia::render('schedules/admin', [
                'employeeSchedules' => $schedulesData,
            ]);
        } elseif ($user->hasRole('employee')) {
            // Employee can only view their own schedule
            $employee = $user->employee;

            if (! $employee) {
                abort(403, 'Employee profile not found.');
            }

            $schedules = [];
            $lunchBreak = null;

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
            if ($lunch && ! empty($lunch->periods)) {
                $lunchBreak = [
                    'start' => $lunch->periods[0]['start_time'] ?? null,
                    'end' => $lunch->periods[0]['end_time'] ?? null,
                ];
            }

            return Inertia::render('schedules/index', [
                'schedules' => $schedules,
                'lunchBreak' => $lunchBreak,
            ]);
        } else {
            // Clients or users without proper roles cannot access schedules
            abort(403, 'Access denied. Only administrators and employees can view schedules.');
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreScheduleRequest $request)
    {
        sleep(1); // Simulate processing delay for better UX feedback

        $request->validated();

        $employee = auth()->user()->employee;

        try {
            $service = app(WeeklyScheduleService::class);

            $availabilityInput = $request->input('availability', []);
            $availabilityData = [];

            foreach ($availabilityInput as $day => $info) {
                if (! empty($info['enabled']) && $info['enabled'] === true) {
                    $availabilityData[$day] = [
                        [
                            'start' => $info['startTime'],
                            'end' => $info['endTime'],
                        ],
                    ];
                }
            }

            $lunchBreak = $request->input('lunch_break');

            $service->setWeeklyAvailability($employee, $availabilityData, $lunchBreak);

            return redirect()->route('schedule.index')->with('success', 'Employee availability updated successfully');

        } catch (\Throwable $th) {
            return back()->withErrors(['error' => 'An error occurred while updating availability: '.$th->getMessage()]);
        }
    }
}
