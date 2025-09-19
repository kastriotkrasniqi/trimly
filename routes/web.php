<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\SlotController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\AppointmentController;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::get('/schedule', [ScheduleController::class, 'index'])->name('schedule.index');
Route::post('/schedule/{employee}', [ScheduleController::class, 'store'])->name('schedule.store');


Route::get('/services/{employee}', [ServiceController::class, 'getServicesByEmployee']);
Route::get('/available-slots/{employee}', [SlotController::class, 'getAvailableSlots']);

Route::post('/appointments/book-appointment', [AppointmentController::class, 'store']);
Route::get('/my-appointments', [AppointmentController::class, 'index'])->name('my-appointments');


Route::resource('employees', EmployeeController::class);


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
