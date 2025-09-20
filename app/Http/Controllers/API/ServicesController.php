<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceResource;
use App\Models\Employee;
use Illuminate\Http\Request;

class ServicesController extends Controller
{
    public function index(Request $request, Employee $employee)
    {
        $perPage = $request->input('per_page', 10);
        $query = $employee->services();
        $search = $request->input('search');
        if ($search) {
            $query->where('name', 'like', "%$search%")
                ->orWhere('description', 'like', "%$search%");
        }
        $services = $query->paginate($perPage);
        return ServiceResource::collection($services);
    }
}
