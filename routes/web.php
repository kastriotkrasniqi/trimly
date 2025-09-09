<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\SlotController;
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

Route::get('/appointment',[AppointmentController::class,'index'])->name('appointment.index');

// Add route for getting slots from employee
Route::get('/api/employee/{employee}/slots', action: [SlotController::class, 'getSlotsFromEmployee']);

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
