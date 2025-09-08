<?php

return [
    'appointment_buffer_minutes' => (int) env('APPOINTMENT_BUFFER_MINUTES', 0),
    'slot_interval_minutes' => (int) env('SLOT_INTERVAL_MINUTES', 15),
    'lunch_time_break' => [
        'start' => env('LUNCH_TIME_START', '12:00'),
        'end' => env('LUNCH_TIME_END', '12:59'),
    ],
];
