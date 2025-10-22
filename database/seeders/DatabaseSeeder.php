<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([
            PermissionSeeder::class,
            // EmployeeSeeder::class,
            // ClientSeeder::class,
            // ServiceSeeder::class,
            // EmployeeServiceSeeder::class,
            // ScheduleSeeder::class,
            // AppointmentSeeder::class,
        ]);

        // $user = User::factory()->create([
        //     'name' => 'Kastriot',
        //     'email' => 'krasniqikastriot01@gmail.com',
        //     'password' => bcrypt('password'),
        // ]);

        // $user->assignRole('admin');

    }
}
