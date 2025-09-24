<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Appointment Reminder</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f59e0b; color: white; padding: 20px; text-align: center; }
        .content { background: #fffbeb; padding: 20px; }
        .appointment-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .service { border-left: 3px solid #f59e0b; padding-left: 10px; margin: 10px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        .reminder-icon { font-size: 48px; }
        .urgent { background: #fef3c7; padding: 10px; border-radius: 5px; border-left: 4px solid #f59e0b; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="reminder-icon">⏰</div>
            <h1>Appointment Reminder</h1>
        </div>
        
        <div class="content">
            <h2>Hello {{ $client->name }},</h2>
            
            <div class="urgent">
                <strong>⚠️ Your appointment is coming up in 3 hours!</strong>
            </div>
            
            <p>This is a friendly reminder about your upcoming appointment at our barbershop.</p>
            
            <div class="appointment-details">
                <h3>📋 Appointment Details</h3>
                <p><strong>Reference:</strong> {{ $appointment->metadata['reference'] }}</p>
                <p><strong>Date:</strong> {{ \Carbon\Carbon::parse($appointment->date)->format('l, F j, Y') }}</p>
                <p><strong>Time:</strong> {{ $appointment->periods[0]->start_time }} - {{ $appointment->periods[0]->end_time }}</p>
            </div>

            <div class="appointment-details">
                <h3>👨‍💼 Your Barber</h3>
                <p><strong>{{ $employee->user->name }}</strong></p>
            </div>

            <div class="appointment-details">
                <h3>✂️ Services</h3>
                @foreach($services as $service)
                    <div class="service">
                        <strong>{{ $service->name }}</strong><br>
                        <small>Duration: {{ $service->duration }} minutes</small>
                    </div>
                @endforeach
            </div>

            <div class="appointment-details">
                <h3>📍 Reminders</h3>
                <ul>
                    <li><strong>Arrive 5-10 minutes early</strong> to check in</li>
                    <li>Bring a valid ID if this is your first visit</li>
                    <li>Let us know if you're running late</li>
                    <li>If you need to cancel, please call us immediately</li>
                </ul>
            </div>

            <p><strong>We look forward to seeing you soon!</strong></p>
        </div>
        
        <div class="footer">
            <p>This is an automated reminder. Reference: {{ $appointment->metadata['reference'] }}</p>
        </div>
    </div>
</body>
</html>
