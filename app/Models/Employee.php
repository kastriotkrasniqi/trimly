<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    /** @use HasFactory<\Database\Factories\EmployeeFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'phone',
        'avatar',
        'specialty',
    ];

    /**
     * Get the user that owns the employee.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the schedules (business hours) for the employee.
     */
    public function schedules()
    {
        return $this->hasMany(EmployeeSchedule::class);
    }

    /**
     * Get the appointments for the employee.
     */
    public function appointments()
    {
        return $this->hasMany(\App\Models\Appointment::class);
    }


     public function services()
    {
        return $this->belongsToMany(Service::class, 'employee_services');
    }
}
