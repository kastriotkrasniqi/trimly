<?php

namespace App\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AppointmentBooked
{
    use Dispatchable, SerializesModels;

    public $appointment;
    public $client;
    public $employee;
    public $services;

    /**
     * Create a new event instance.
     */
    public function __construct($appointment, $client, $employee, $services)
    {
        $this->appointment = $appointment;
        $this->client = $client;
        $this->employee = $employee;
        $this->services = $services;
    }
}
