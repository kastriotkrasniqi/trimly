<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AppointmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employee = \App\Models\Employee::first();
        $client = \App\Models\Client::first() ?? \App\Models\Client::factory()->create();
        $services = \App\Models\Service::all();
        // Book 09:00-09:45 and 14:00-15:00 on next Monday
        $date = now()->next('Monday')->toDateString();
        // First appointment: attach first 2 services
        $a1Services = $services->take(2);
        $a1Start = '09:00:00';
        $a1Duration = $a1Services->sum('duration');
        $a1End = \Carbon\Carbon::parse($a1Start)->addMinutes($a1Duration)->format('H:i:s');
        $a1 = \App\Models\Appointment::create([
            'employee_id' => $employee->id,
            'client_id' => $client->id,
            'date' => $date,
            'start_time' => $a1Start,
            'end_time' => $a1End,
            'price' => $a1Services->sum('price'),
            'is_cancelled' => false,
            'cancelled_reason' => null,
        ]);
        $a1->services()->attach($a1Services->pluck('id'));

        // Second appointment: attach last service
        $a2Service = $services->last();
        $a2Start = '14:00:00';
        $a2Duration = $a2Service ? $a2Service->duration : 0;
        $a2End = \Carbon\Carbon::parse($a2Start)->addMinutes($a2Duration)->format('H:i:s');
        $a2 = \App\Models\Appointment::create([
            'employee_id' => $employee->id,
            'client_id' => $client->id,
            'date' => $date,
            'start_time' => $a2Start,
            'end_time' => $a2End,
            'price' => $a2Service ? $a2Service->price : null,
            'is_cancelled' => false,
            'cancelled_reason' => null,
        ]);
        if ($a2Service) {
            $a2->services()->attach($a2Service->id);
        }
    }
}
