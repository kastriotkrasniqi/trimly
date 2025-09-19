<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\AppointmentResource;
use App\Models\Employee;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $perPage = request('per_page', 10);
        $employee = Employee::find(1);
        $query = $employee->appointmentSchedules()->with('periods');
        $search = request('search');
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('metadata->client->name', 'like', "%$search%")
                  ->orWhere('metadata->client->phone', 'like', "%$search%")
                  ->orWhere('status', 'like', "%$search%");
            });
        }
        $appointments = $query->paginate($perPage);
        return AppointmentResource::collection($appointments);
    }


}
