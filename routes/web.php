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

Route::get('/schedule', [ScheduleController::class, 'index'])->name('schedule.index');
Route::post('/schedule/{employee}', [ScheduleController::class, 'store'])->name('schedule.store');

Route::post('/services', [ServiceController::class, 'store'])->name('services.store');
Route::get('/services', [ServiceController::class, 'index'])->name('services.index');
Route::put('/services/{service}', [ServiceController::class, 'update'])->name('services.update');
Route::post('/delete-services', [ServiceController::class, 'destroy'])->name('services.destroy');
Route::get('/services/{employee}', [ServiceController::class, 'getServicesByEmployee']);
Route::get('/available-slots/{employee}', [SlotController::class, 'getAvailableSlots']);

Route::post('/appointments/book-appointment', [AppointmentController::class, 'store']);
Route::get('/my-appointments', [AppointmentController::class, 'index'])->name('my-appointments');


Route::group(['middleware' => ['role:admin']], function () {
    Route::resource('employees', EmployeeController::class)->only(['index', 'store', 'update']);
    Route::post('/delete-employees', [EmployeeController::class, 'destroy'])->name('employees.destroy');

    Route::resource('clients', ClientController::class)->only(['index', 'store', 'update']);
    Route::post('/delete-clients', [ClientController::class, 'destroy'])->name('clients.destroy');
});



require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
