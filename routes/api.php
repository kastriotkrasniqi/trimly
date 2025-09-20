<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\EmployeeController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


//employees
Route::get('/employees', [EmployeeController::class, 'index'])->name('api.employees.index');

//appointments
Route::get('/appointments', [\App\Http\Controllers\API\AppointmentController::class, 'index'])->name('api.appointments.index');

//services by employee
Route::get('/services/{employee}', [\App\Http\Controllers\API\ServicesController::class, 'index'])->name('api.services.index');
