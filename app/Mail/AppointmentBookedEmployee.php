<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AppointmentBookedEmployee extends Mailable
{
    use Queueable, SerializesModels;

    public $appointment;
    public $client;
    public $employee;
    public $services;

    /**
     * Create a new message instance.
     */
    public function __construct($appointment, $client, $employee, $services)
    {
        $this->appointment = $appointment;
        $this->client = $client;
        $this->employee = $employee;
        $this->services = $services;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Appointment Booked - ' . $this->appointment->metadata['reference'],
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.appointment-booked-employee',
            with: [
                'appointment' => $this->appointment,
                'client' => $this->client,
                'employee' => $this->employee,
                'services' => $this->services,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
