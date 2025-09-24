<?php

namespace App\Listeners;

use App\Events\AppointmentBooked;
use App\Jobs\AppointmentReminder;
use App\Mail\AppointmentBookedClient;
use App\Mail\AppointmentBookedEmployee;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class SendAppointmentNotifications implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(AppointmentBooked $event): void
    {
        // Send immediate confirmation emails
        $this->sendClientConfirmation($event);
        $this->sendEmployeeNotification($event);

        // Schedule reminder 3 hours before appointment
        $this->scheduleReminder($event);
    }

    /**
     * Send confirmation email to client
     */
    private function sendClientConfirmation(AppointmentBooked $event): void
    {
        Mail::to($event->client->user->email)
            ->send(new AppointmentBookedClient(
                $event->appointment,
                $event->client,
                $event->employee,
                $event->services
            ));
    }

    /**
     * Send notification email to employee
     */
    private function sendEmployeeNotification(AppointmentBooked $event): void
    {
        Mail::to($event->employee->user->email)
            ->send(new AppointmentBookedEmployee(
                $event->appointment,
                $event->client,
                $event->employee,
                $event->services
            ));
    }

    /**
     * Schedule appointment reminder 3 hours before
     */
    private function scheduleReminder(AppointmentBooked $event): void
    {
        try {

            $dateOnly = Carbon::parse($event->appointment->start_date)->toDateString();
            $appointmentDateTime = Carbon::createFromFormat('Y-m-d H:i', $dateOnly . ' ' . $event->appointment->periods[0]->start_time);
            $reminderTime = $appointmentDateTime->copy()->subHours(3);

        } catch (\Exception $e) {

            \Log::error('Error in scheduleReminder', [
                'error' => $e->getMessage(),
                'start_date' => $event->appointment->start_date,
                'start_time' => $event->appointment->periods[0]->start_time
            ]);
            return; // Exit early if parsing fails
        }

        if ($reminderTime->isFuture()) {
            try {
                AppointmentReminder::dispatch(
                    $event->appointment,
                    $event->client,
                    $event->employee,
                    $event->services
                )->delay($reminderTime);
            } catch (\Exception $e) {
                \Log::error('Failed to dispatch reminder job', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
            }
        }
    }
}
