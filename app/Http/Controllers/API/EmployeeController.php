<?php

namespace App\Http\Controllers\API;

use App\Models\Employee;
use App\Http\Controllers\Controller;
use App\Http\Resources\EmployeeResource;


class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $perPage = request('per_page', 10);
        $query = Employee::with('services');
        $search = request('search');
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%$search%")
                  ->orWhere('last_name', 'like', "%$search%")
                  ->orWhere('phone', 'like', "%$search%")
                ;
            });
        }
        $employees = $query->paginate($perPage);
        return EmployeeResource::collection($employees);
    }
}
