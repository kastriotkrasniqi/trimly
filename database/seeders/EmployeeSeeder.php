<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Employee;
use App\Models\User;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        // for ($i = 1; $i <= 200; $i++) {
            // $user = User::factory()->create([
            //     'email' => fake()->unique()->safeEmail(),
            // ]);
           for($i=0; $i < 10; $i++) {
            Employee::factory(10000)->create([
                'user_id' => 1,
                'first_name' => fake()->firstName(),
                'last_name' => fake()->lastName(),
                'avatar' => 'https://i.pravatar.cc/150?img=' . rand(1, 70),
            ]);
        }
        }
    // }
}
