<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Appointment Confirmation</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #059669; color: white; padding: 20px; text-align: center; }
        .content { background: #f0fdfa; padding: 20px; }
        .appointment-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .service { border-left: 3px solid #059669; padding-left: 10px; margin: 10px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        .success-icon { font-size: 48px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="success-icon">✅</div>
            <h1>Appointment Confirmed!</h1>
        </div>
        
        <div class="content">
            <h2>Hello {{ $client->name }},</h2>
            <p>Your appointment has been successfully booked! We're excited to see you.</p>
            
            <div class="appointment-details">
                <h3>📋 Your Appointment Details</h3>
                <p><strong>Reference Number:</strong> {{ $appointment->metadata['reference'] }}</p>
                <p><strong>Date:</strong> {{ \Carbon\Carbon::parse($appointment->date)->format('l, F j, Y') }}</p>
                <p><strong>Time:</strong> {{ $appointment->periods[0]->start_time }} - {{ $appointment->periods[0]->end_time }}</p>
            </div>

            <div class="appointment-details">
                <h3>👨‍💼 Your Barber</h3>
                <p><strong>{{ $employee->user->name }}</strong></p>
            </div>

            <div class="appointment-details">
                <h3>✂️ Services Booked</h3>
                @foreach($services as $service)
                    <div class="service">
                        <strong>{{ $service->name }}</strong><br>
                        <small>Duration: {{ $service->duration }} minutes | Price: ${{ number_format($service->price, 2) }}</small>
                    </div>
                @endforeach
                <p><strong>Total Price:</strong> ${{ number_format($appointment->metadata['price'], 2) }}</p>
            </div>

            <div class="appointment-details">
                <h3>📝 Important Notes</h3>
                <ul>
                    <li>Please arrive 5-10 minutes before your appointment time</li>
                    <li>You will receive a reminder 3 hours before your appointment</li>
                    <li>If you need to cancel or reschedule, please contact us at least 2 hours in advance</li>
                </ul>
            </div>

            <p><strong>Thank you for choosing our barbershop!</strong></p>
        </div>
        
        <div class="footer">
            <p>Save this email for your records. Reference: {{ $appointment->metadata['reference'] }}</p>
        </div>
    </div>
</body>
</html>
