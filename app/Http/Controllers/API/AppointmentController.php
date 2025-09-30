<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\AppointmentResource;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Zap\Models\Schedule;

class AppointmentController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $perPage = request('per_page', 10);
        $user = auth()->user();

        // Check if user has admin role/permission
        if ($user->hasRole('admin') || $user->hasPermissionTo('view all appointments')) {
            // Admin can see all appointments from all employees
            $query = Schedule::appointments()->with(['periods', 'schedulable.user']);
        } elseif ($user->hasRole('client') || $user->hasPermissionTo('view appointments')) {
            // Employee can only see their own appointments
            $employee = $user->employee;

            if (!$employee) {
                return response()->json(['message' => 'Employee profile not found'], 403);
            }

            $query = $employee->appointmentSchedules()->with(['periods', 'schedulable.user']);
        } else {
            $client = $user->client;
            if (!$client) {
                return response()->json(['message' => 'Client profile not found'], 403);
            }
            $query = Schedule::appointments()->where('metadata->client->id', $client->id)->with(['periods', 'schedulable.user']);
        }

        $search = request('search');
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                    ->orWhere('metadata->client->name', 'like', "%$search%")
                    ->orWhere('metadata->client->phone', 'like', "%$search%")
                    ->orWhere('metadata->client->email', 'like', "%$search%")
                    ->orWhereHas('schedulable.user', function ($employeeQuery) use ($search) {
                        $employeeQuery->where('name', 'like', "%$search%");
                    });
            });
        }

        $appointments = $query->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return AppointmentResource::collection($appointments);
    }


}
