<?php

namespace App\Http\Controllers;

use App\Http\Resources\AppointmentResource;
use App\Models\Client;
use App\Models\Employee;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Zap\Facades\Zap;

class AppointmentController extends Controller
{

    public function index()
    {
        return Inertia::render('my-appointments');
    }

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
                    'client' => [Client::find($request->client_id)->only('id', 'first_name', 'last_name', 'email', 'phone')],
                    'services' => Service::whereIn('id', $request->service_ids)->get(['id', 'name', 'duration', 'price']),
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



}
