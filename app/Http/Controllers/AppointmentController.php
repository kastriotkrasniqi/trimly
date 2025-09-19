<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAppointmentRequest;
use App\Http\Resources\AppointmentResource;
use App\Models\Client;
use App\Models\Employee;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Zap\Facades\Zap;
use Illuminate\Support\Str;
class AppointmentController extends Controller
{

    public function index()
    {
        return Inertia::render('my-appointments');
    }

    public function store(StoreAppointmentRequest $request)
    {
        sleep(1); // Simulate processing delay

        $request->validated();

        $employee = Employee::find($request->employee_id);

        try {
            $services = Service::whereIn('id', $request->service_ids)->get(['id', 'name', 'duration', 'price']);
            $client = Client::select('clients.id','clients.user_id','users.name as name','clients.phone')
                ->join('users', 'users.id', '=', 'clients.user_id')
                ->where('clients.id', $request->client_id)
                ->first();

            $appointment = Zap::for($employee)
                ->named('Appointment')
                ->appointment()
                ->from($request->date)
                ->addPeriod($request->start_time, $request->end_time)
                ->withMetadata([
                    'client' => $client,
                    'services' => $services,
                    'price' => $request->price,
                    'status' => 'confirmed',
                    'reference' => Str::ulid(),
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
