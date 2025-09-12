<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Employee;
use App\Models\User;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        for ($i = 1; $i <= 3; $i++) {
            $user = User::factory()->create([
                'name' => fake()->firstName().' '. fake()->lastName(),
                'email' => fake()->unique()->safeEmail(),

            ]);
            Employee::factory()->create([
                'user_id' => $user->id,
                'phone' => fake()->phoneNumber(),
                'avatar' => 'https://i.pravatar.cc/150?img=' . rand(1, 70),
                'specialty' => fake()->jobTitle(),
            ]);
        }
    }
}
