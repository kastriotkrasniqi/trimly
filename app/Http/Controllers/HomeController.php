<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Employee;
use App\Http\Resources\EmployeeResource;

class HomeController extends Controller
{
    public function index()
    {
        $employees = EmployeeResource::collection(Employee::with('services')->whereHas('activeSchedules', function ($query) {
            $query->where('schedule_type', 'availability');
        })->get());
        return Inertia::render('front/index', ['employees' => $employees]);
    }
}
