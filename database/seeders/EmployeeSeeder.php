<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Employee;
use App\Models\User;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        for ($i = 1; $i <= 5; $i++) {
            $user = User::factory()->create([
                'email' => fake()->unique()->safeEmail(),
                'name' => fake()->name(),
            ]);
            Employee::factory()->create([
                'user_id' => $user->id,
                'avatar' => 'https://i.pravatar.cc/150?img=' . rand(1, 70),
            ]);
        }
    }
}
