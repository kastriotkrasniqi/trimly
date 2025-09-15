<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\SlotController;
use App\Http\Resources\EmployeeResource;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Employee;
use App\Services\TimeSlotGenerator;
use Label84\HoursHelper\Facades\HoursHelper;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::get('/schedule/create', [\App\Http\Controllers\ScheduleController::class, 'create'])->name('schedule.create');

Route::get('/appointment', [AppointmentController::class, 'index'])->name('appointment.index');
Route::post('/api/appointments', [AppointmentController::class, 'store']);

// Add route for getting slots from employee
Route::get('/api/employee/{employee}/slots', action: [SlotController::class, 'getSlotsFromEmployee']);

Route::get('/api/services/{employee_id}', [ServiceController::class, 'getServicesByEmployee']);

Route::get('/mobile-test', function () {
    $employees = EmployeeResource::collection(Employee::with('services')->get());
    return Inertia::render('mobile-appointment', ['employees' => $employees]);
});



Route::get('/employees/{employee}/available-slots', [SlotController::class, 'getAvailableSlots']);
Route::post('/appointments/book-appointment', [AppointmentController::class, 'store']);


Route::resource('employees', \App\Http\Controllers\EmployeeController::class);







require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
