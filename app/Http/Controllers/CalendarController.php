<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class CalendarController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        // Check if user has permission to view calendar
        if (!$user->hasPermissionTo('view calendar')) {
            abort(403, 'Access denied. You do not have permission to view the calendar.');
        }

        // Get date range from request or default to current month
        $startDate = $request->get('start_date', now()->startOfMonth());
        $endDate = $request->get('end_date', now()->endOfMonth());

        // Parse dates if they're strings
        if (is_string($startDate)) {
            $startDate = Carbon::parse($startDate);
        }
        if (is_string($endDate)) {
            $endDate = Carbon::parse($endDate);
        }

        $appointments = collect();

        if ($user->hasRole('admin')) {
            // Admin can see all appointments from all employees
            $employees = Employee::with(['user', 'schedules' => function ($query) use ($startDate, $endDate) {
                $query->where('start_date', '>=', $startDate)
                      ->where('start_date', '<=', $endDate)
                      ->where('name', 'Appointment')
                      ->with('periods');
            }])->where('is_active', true)->get();

            foreach ($employees as $employee) {
                $this->addEmployeeAppointments($appointments, $employee);
            }
        } elseif ($user->hasRole('employee')) {
            // Employee can only see their own appointments
            $employee = $user->employee;

            if ($employee) {
                $employee->load(['user', 'schedules' => function ($query) use ($startDate, $endDate) {
                    $query->where('start_date', '>=', $startDate)
                          ->where('start_date', '<=', $endDate)
                          ->where('name', 'Appointment')
                          ->with('periods');
                }]);

                $this->addEmployeeAppointments($appointments, $employee);
                $employees = collect([$employee]);
            } else {
                $employees = collect();
            }
        } elseif ($user->hasRole('client')) {
            // Client can only see their own appointments
            $client = $user->client;

            if ($client) {
                $employees = Employee::with(['user', 'schedules' => function ($query) use ($startDate, $endDate, $client) {
                    $query->where('start_date', '>=', $startDate)
                          ->where('start_date', '<=', $endDate)
                          ->where('name', 'Appointment')
                          ->where('metadata->client->id', $client->id)
                          ->with('periods');
                }])->where('is_active', true)->get();

                foreach ($employees as $employee) {
                    $this->addEmployeeAppointments($appointments, $employee);
                }
            } else {
                $employees = collect();
            }
        } else {
            // User without proper role cannot access calendar
            abort(403, 'Access denied. You do not have permission to view the calendar.');
        }

        return Inertia::render('calendar/index', [
            'appointments' => $appointments->toArray(),
            'employees' => $employees->map(function ($employee) {
                return [
                    'id' => $employee->id,
                    'name' => $employee->user->name,
                    'phone' => $employee->phone,
                    'avatar' => $employee->avatar,
                    'specialties' => $employee->specialties,
                    'is_active' => $employee->is_active,
                ];
            }),
        ]);
    }

    /**
     * Add appointments for a specific employee to the collection
     */
    private function addEmployeeAppointments($appointments, $employee)
    {
        foreach ($employee->schedules as $schedule) {
            $metadata = $schedule->metadata ?? [];

            // Get the first period to extract time information
            $firstPeriod = $schedule->periods->first();

            if ($firstPeriod) {
                // Combine the schedule date with the period times
                $scheduleDate = Carbon::parse($schedule->start_date);
                $startTime = Carbon::parse($firstPeriod->start_time);
                $endTime = Carbon::parse($firstPeriod->end_time);

                // Create full datetime by combining date and time
                $startDateTime = $scheduleDate->copy()
                    ->setHour($startTime->hour)
                    ->setMinute($startTime->minute)
                    ->setSecond($startTime->second);

                $endDateTime = $scheduleDate->copy()
                    ->setHour($endTime->hour)
                    ->setMinute($endTime->minute)
                    ->setSecond($endTime->second);

                $appointments->push([
                    'id' => $schedule->id,
                    'title' => $schedule->name ?? 'Appointment',
                    'description' => $this->getAppointmentDescription($metadata),
                    'start' => $startDateTime->format('Y-m-d\TH:i:s'),
                    'end' => $endDateTime->format('Y-m-d\TH:i:s'),
                    'allDay' => false,
                    'color' => $this->getEmployeeColor($employee->id),
                    'location' => $employee->user->name ?? 'Unknown Employee',
                    'metadata' => [
                        'employee' => [
                            'id' => $employee->id,
                            'name' => $employee->user->name,
                            'phone' => $employee->phone,
                        ],
                        'client' => $metadata['client'] ?? null,
                        'services' => $metadata['services'] ?? [],
                        'price' => $metadata['price'] ?? null,
                        'status' => $metadata['status'] ?? 'confirmed',
                        'reference' => $metadata['reference'] ?? null,
                    ]
                ]);
            }
        }
    }

    /**
     * Get appointment description from metadata
     */
    private function getAppointmentDescription(array $metadata): string
    {
        $parts = [];

        if (isset($metadata['client']['name'])) {
            $parts[] = "Client: " . $metadata['client']['name'];
        }

        if (isset($metadata['services']) && is_array($metadata['services'])) {
            $serviceNames = collect($metadata['services'])->pluck('name')->join(', ');
            if ($serviceNames) {
                $parts[] = "Services: " . $serviceNames;
            }
        }

        if (isset($metadata['price'])) {
            $parts[] = "Price: $" . $metadata['price'];
        }

        return implode(' | ', $parts);
    }

    /**
     * Get color for employee (you can customize this logic)
     */
    private function getEmployeeColor(int $employeeId): string
    {
        $colors = ['sky', 'amber', 'violet', 'rose', 'emerald', 'orange'];
        return $colors[$employeeId % count($colors)];
    }
}
