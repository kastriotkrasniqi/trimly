<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\EmployeeController;
use App\Http\Controllers\API\ClientController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


//employees - admin only
Route::get('/employees', [EmployeeController::class, 'index'])->name('api.employees.index')->middleware(['web']);

//clients - admin only
Route::get('/clients', [ClientController::class, 'index'])->name('api.clients.index')->middleware(['web']);

//appointments
Route::get('/appointments', [\App\Http\Controllers\API\AppointmentController::class, 'index'])
    ->name('api.appointments.index')
    ->middleware('web');

//services - role-based access
Route::get('/services', [\App\Http\Controllers\API\ServicesController::class, 'index'])
    ->name('api.services.index')
    ->middleware('web');
