<?php

namespace App\Http\Controllers;

use App\Events\AppointmentBooked;
use App\Http\Requests\StoreAppointmentRequest;
use App\Models\Client;
use App\Models\Employee;
use App\Models\Service;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Zap\Exceptions\ScheduleConflictException;
use Zap\Facades\Zap;

class AppointmentController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Check if user has permission to view appointments
        if (! $user->hasPermissionTo('view appointments')) {
            abort(403, 'Access denied. You do not have permission to view appointments.');
        }

        return Inertia::render('appointments/index');
    }

    public function store(StoreAppointmentRequest $request)
    {
        sleep(1); // Simulate processing delay
        $request->validated();

        $employee = Employee::find($request->employee_id);

        try {
            $services = Service::whereIn('id', $request->service_ids)->get(['id', 'name', 'duration', 'price']);
            $client = Client::select('clients.id', 'clients.user_id', 'users.name as name', 'clients.phone')
                ->join('users', 'users.id', '=', 'clients.user_id')
                ->where('clients.user_id', $request->client_id)
                ->first();

            $appointment = Zap::for($employee)
                ->named('Appointment')
                ->appointment()
                ->from($request->date)
                ->addPeriod($request->start_time, $request->end_time)
                ->withMetadata([
                    'client' => $client,
                    'services' => $services,
                    'price' => number_format($request->price, 2),
                    'status' => 'confirmed',
                    'reference' => Str::ulid(),
                ])->save();

            AppointmentBooked::dispatch($appointment, $client, $employee, $services);

            return response()->json([
                'message' => 'Appointment booked successfully',
                'appointment' => $appointment,
            ]);

        } catch (ScheduleConflictException $e) {
            return response()->json([
                'error' => 'The selected time slot is already booked. Please choose a different time.',
            ], 409);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 422);
        }
    }
}
