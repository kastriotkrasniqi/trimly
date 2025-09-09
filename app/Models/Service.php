<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    /** @use HasFactory<\Database\Factories\ServiceFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'duration',
    ];
    public function appointments()
    {
        return $this->belongsToMany(Appointment::class, 'appointment_service');
    }

    public function employees()
    {
        return $this->belongsToMany(Employee::class, 'employee_services');
    }
}
