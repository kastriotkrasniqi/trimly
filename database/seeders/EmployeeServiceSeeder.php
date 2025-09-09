<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Employee;
use App\Models\Service;

class EmployeeServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Example: Attach all services to all employees
        $services = Service::all();
        $employees = Employee::all();

        foreach ($employees as $employee) {
            // Attach a random subset of services to each employee
            $serviceIds = $services->random(rand(1, $services->count()))->pluck('id')->toArray();
            $employee->services()->sync($serviceIds);
        }
    }
}
