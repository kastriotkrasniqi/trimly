<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Employee;
use App\Models\EmployeeSchedule;

class ScheduleSeeder extends Seeder
{
    public function run(): void
    {
        $employee = Employee::find(1);

        $weeklySchedule = [
            'monday' => [
                ['start' => '09:00', 'end' => '18:00']
            ],
            'tuesday' => [
                ['start' => '09:00', 'end' => '17:00']
            ],
            'wednesday' => [
                ['start' => '10:00', 'end' => '19:00']
            ],
            'thursday' => [
                ['start' => '09:00', 'end' => '18:00']
            ],
            'friday' => [
                ['start' => '09:00', 'end' => '17:00']
            ],
            'saturday' => [
                ['start' => '09:00', 'end' => '15:00']
            ],
            'sunday' => [
            ]
        ];

        // Single lunch break that applies to all working days
        $lunchBreak = [
            'start' => '12:30',
            'end' => '13:30'
        ];
        $service = app(\App\Services\WeeklyScheduleService::class);
        $service->setWeeklyAvailability($employee, $weeklySchedule, $lunchBreak);

    }
}
