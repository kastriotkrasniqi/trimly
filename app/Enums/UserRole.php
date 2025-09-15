<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case CLIENT = 'client';
    case EMPLOYEE = 'employee';

    public function label(): string
    {
        return match ($this) {
            UserRole::ADMIN => 'Administrator',
            UserRole::CLIENT => 'Client',
            UserRole::EMPLOYEE => 'Employee',
        };
    }

    public function color(): string
    {
        return match ($this) {
            UserRole::ADMIN => 'red',
            UserRole::CLIENT => 'blue',
            UserRole::EMPLOYEE => 'green',
        };
    }


}
