<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Client;
use App\Models\User;

class ClientSeeder extends Seeder
{
    public function run(): void
    {
        // Create 3 clients, each with a user
        for ($i = 1; $i <= 3; $i++) {
            $user = User::factory()->create([
                'email' => fake()->unique()->safeEmail(),
            ]);
            Client::factory()->create([
                'first_name' => fake()->firstName(),
                'last_name' => fake()->lastName(),
                'user_id' => $user->id,
            ]);
        }
    }
}
