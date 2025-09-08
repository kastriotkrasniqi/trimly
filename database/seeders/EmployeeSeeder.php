<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Employee;
use App\Models\User;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        // Create 3 employees, each with a user
        for ($i = 1; $i <= 3; $i++) {
            $user = User::factory()->create([
                'name' => "Employee $i",
                'email' => "employee$i@example.com",
            ]);
            Employee::factory()->create([
                'user_id' => $user->id,
            ]);
        }
    }
}
