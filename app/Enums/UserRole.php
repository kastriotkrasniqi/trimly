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
            static::ADMIN => 'Administrator',
            static::CLIENT => 'Client',
            static::EMPLOYEE => 'Employee',
        };
    }

    public function color(): string
    {
        return match ($this) {
            static::ADMIN => 'red',
            static::CLIENT => 'blue',
            static::EMPLOYEE => 'green',
        };
    }

    public static function options(): array
    {
        return array_map(
            fn($role) => [
                'value' => $role->value,
                'label' => $role->label(),
                'color' => $role->color(),
            ],
            self::cases()
        );
    }
}
