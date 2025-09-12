<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;

class Appointment extends Model
{
    /** @use HasFactory<\Database\Factories\AppointmentFactory> */
    use HasFactory,HasUuids;


    protected $fillable = [
        'client_id',
        'employee_id',
        'date',
        'start_time',
        'end_time',
        'price',
        'is_cancelled',
        'cancelled_reason',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function services()
    {
        return $this->belongsToMany(Service::class, 'appointment_services');
    }

    /**
     * Generate a new UUID for the model.
     */
    public function newUniqueId(): string
    {
        $uuid = (string) Uuid::uuid4();

        // Keep only the first 4 sections of the UUID (drop the last one)
        return collect(explode('-', $uuid))
            ->slice(0, 4)
            ->implode('-');
    }

};
