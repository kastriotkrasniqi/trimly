<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Spatie\Permission\PermissionRegistrar;
use Spatie\Permission\Models\Permission;



class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'create services',
            'view services',
            'view all services',
            'edit services',
            'delete services',
            'view dashboard',
            'view appointments',
            'view all appointments',
            'edit appointments',
            'delete appointments',
            'create appointments',
            'view users',
            'create users',
            'edit users',
            'delete users',
        ];

        foreach ($permissions as $permission) {
            if (!Permission::where('name', $permission)->exists()) {
                Permission::create([
                    'name' => $permission,
                ]);
            }
        }

        if (!Role::where('name', UserRole::ADMIN->value)->exists()) {
            $admin = Role::create(['name' => UserRole::ADMIN->value]);
        } else {
            $admin = Role::where('name', UserRole::ADMIN->value)->first();
        }

        foreach ($permissions as $permission) {
            $admin->givePermissionTo($permission);
        }

        if (!Role::where('name', UserRole::EMPLOYEE->value)->exists()) {
            $employee = Role::create(['name' => UserRole::EMPLOYEE->value]);
        } else {
            $employee = Role::where('name', UserRole::EMPLOYEE->value)->first();
        }

        $employeePermissions = [
            'view services',
            'view appointments',
            'edit appointments',
            'create appointments',
            'view dashboard',
        ];


        foreach ($employeePermissions as $permission) {
            $employee->givePermissionTo($permission);
        }


        if (!Role::where('name', UserRole::CLIENT->value)->exists()) {
            $client = Role::create(['name' => UserRole::CLIENT->value]);
        } else {
            $client = Role::where('name', UserRole::CLIENT->value)->first();
        }


        $clientPermissions = [
            'view appointments',
            'create appointments',
            'view dashboard',
        ];

        foreach ($clientPermissions as $permission) {
            $client->givePermissionTo($permission);
        }


    }
}
