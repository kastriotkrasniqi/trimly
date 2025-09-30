<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceResource;
use App\Models\Employee;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ServicesController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $user = auth()->user();

        // Role-based access control
        if ($user->hasRole('admin') || $user->hasPermissionTo('view all services')) {
            // Admin can see all services
            $query = Service::with('employees.user');
        } else {
            // Employee can only see their own services
            $employee = $user->employee;

            if (!$employee) {
                return response()->json(['message' => 'Employee profile not found'], 403);
            }

            $query = $employee->services();
        }

        $search = $request->input('search');
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                  ->orWhere('description', 'like', "%$search%")
                  ->orWhere('price', 'like', "%$search%")
                  ->orWhereHas('employees.user', function ($employeeQuery) use ($search) {
                      $employeeQuery->where('name', 'like', "%$search%");
                  });
            });
        }

        $services = $query->paginate($perPage);
        return ServiceResource::collection($services);
    }
}
