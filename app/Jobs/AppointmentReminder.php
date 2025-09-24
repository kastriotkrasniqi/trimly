<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class AppointmentReminder implements ShouldQueue
{
    use Queueable;

    public $appointment;
    public $client;
    public $employee;
    public $services;

    /**
     * Create a new job instance.
     */
    public function __construct($appointment, $client, $employee, $services)
    {
        $this->appointment = $appointment;
        $this->client = $client;
        $this->employee = $employee;
        $this->services = $services;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Mail::to($this->client->user->email)
            ->send(new \App\Mail\AppointmentReminderMail(
                $this->appointment,
                $this->client,
                $this->employee,
                $this->services
            ));
    }
}
