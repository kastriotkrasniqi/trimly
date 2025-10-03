<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\SlotController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\DashboardController;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

Route::group(['middleware' => ['permission:view schedule']], function () {
    Route::resource('schedule', ScheduleController::class)->only(['index', 'store']);
});

Route::group(['middleware' => ['permission:create services']], function () {
    Route::resource('services', ServiceController::class)->only(['index', 'store', 'update']);
    Route::post('/delete-services', [ServiceController::class, 'destroy'])->name('services.destroy');
});

Route::get('/services/{employee}', [ServiceController::class, 'getServicesByEmployee']);
Route::get('/available-slots/{employee}', [SlotController::class, 'getAvailableSlots']);

Route::post('/appointments/book-appointment', [AppointmentController::class, 'store']);
Route::get('/my-appointments', [AppointmentController::class, 'index'])->name('my-appointments');


Route::group(['middleware' => ['permission:view employees']], function () {
    Route::resource('employees', EmployeeController::class)->only(['index', 'store', 'update']);
    Route::post('/delete-employees', [EmployeeController::class, 'destroy'])->name('employees.destroy')->middleware(['permission:delete employees']);
});

Route::group(['middleware' => ['permission:view clients']], function () {
    Route::resource('clients', ClientController::class)->only(['index', 'store', 'update']);
    Route::post('/delete-clients', [ClientController::class, 'destroy'])->name('clients.destroy')->middleware(['permission:delete clients']);
});




require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
