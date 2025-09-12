<?php

namespace App\Http\Controllers;

use App\Http\Resources\EmployeeResource;
use App\Models\Appointment;
use App\Models\Employee;
use App\Services\TimeSlotGenerator;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $employees = EmployeeResource::collection(Employee::with('user','services')->get());
        return Inertia::render('appointment', [
            'employees' => $employees
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        sleep(1);
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'employee_id' => 'required|exists:employees,id',
            'date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required',
            'price' => 'nullable|integer',
            'service_ids' => 'required|array',
            'service_ids.*' => 'exists:services,id',
        ]);

        $appointment = Appointment::create([
            'client_id' => $validated['client_id'],
            'employee_id' => $validated['employee_id'],
            'date' => $validated['date'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'price' => $validated['price'] ?? null,
        ]);

        $appointment->services()->sync($validated['service_ids']);

        return response()->json(data: ['success' => true, 'appointment_id' => $appointment->id]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Appointment $appointment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Appointment $appointment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Appointment $appointment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Appointment $appointment)
    {
        //
    }
}
