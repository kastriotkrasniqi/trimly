<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Service::create(['name' => 'Haircut', 'description' => 'Basic haircut', 'price' => 20, 'duration' => 30]);
        \App\Models\Service::create(['name' => 'Shave', 'description' => 'Beard shave', 'price' => 15, 'duration' => 20]);
        \App\Models\Service::create(['name' => 'Color', 'description' => 'Hair coloring', 'price' => 40, 'duration' => 60]);
    }
}
