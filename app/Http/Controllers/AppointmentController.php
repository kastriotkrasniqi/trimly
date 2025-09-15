<?php

namespace App\Http\Controllers;

use App\Http\Resources\EmployeeResource;
use App\Models\Appointment;
use App\Models\Employee;
use App\Models\Service;
use App\Services\TimeSlotGenerator;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Zap\Facades\Zap;

class AppointmentController extends Controller
{

    public function store(Request $request)
    {
        sleep(1);
        $request->validate([
            'client_id' => 'required|exists:users,id',
            'employee_id' => 'required|exists:employees,id',
            'service_ids' => 'required|array|min:1',
            'service_ids.*' => 'exists:services,id',
            'date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i',
            'price' => 'required|numeric|min:0',
        ]);

        $employee = Employee::find($request->employee_id);

        try {
            $services = Service::whereIn('id', $request->service_ids)->pluck('name')->toArray();

            $appointment = Zap::for($employee)
                ->named('Appointment')
                ->appointment()
                ->from($request->date)
                ->addPeriod($request->start_time, $request->end_time)
                ->withMetadata([
                    'client_id' => $request->client_id,
                    'service_ids' => $request->service_ids,
                    'service_names' => $services,
                    'price' => $request->price,
                    'status' => 'confirmed'
                ])->save();

            return response()->json([
                'message' => 'Appointment booked successfully',
                'appointment' => $appointment
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 422);
        }
    }


    public function getEmployeeSchedule(Employee $employee, $date)
    {
        $appointments = $employee->appointmentSchedules()
            ->forDate($date)
            ->with('periods')
            ->get()
            ->map(function ($schedule) {
                return [
                    'id' => $schedule->id,
                    'name' => $schedule->name,
                    'client_id' => $schedule->metadata['client_id'] ?? null,
                    'service_name' => $schedule->metadata['service_name'] ?? null,
                    'status' => $schedule->metadata['status'] ?? 'confirmed',
                    'periods' => $schedule->periods->map(function ($period) {
                        return [
                            'start_time' => $period->start_time,
                            'end_time' => $period->end_time
                        ];
                    })
                ];
            });

        return response()->json($appointments);
    }
}
