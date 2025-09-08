<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Employee;
use App\Models\EmployeeSchedule;

class ScheduleSeeder extends Seeder
{
    public function run(): void
    {
        // For each employee, add a 08:00-12:00 and 13:00-17:00 schedule for Mon-Fri
        foreach (Employee::all() as $employee) {
            for ($day = 1; $day <= 5; $day++) { // 1=Monday, 5=Friday
                EmployeeSchedule::create([
                    'employee_id' => $employee->id,
                    'day_of_week' => $day,
                    'start_time' => '08:00:00',
                    'end_time' => '12:00:00',
                ]);
                EmployeeSchedule::create([
                    'employee_id' => $employee->id,
                    'day_of_week' => $day,
                    'start_time' => '13:00:00',
                    'end_time' => '17:00:00',
                ]);
            }
        }
    }
}
