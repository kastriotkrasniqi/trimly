<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>New Appointment Booked</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 20px; }
        .appointment-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .service { border-left: 3px solid #2563eb; padding-left: 10px; margin: 10px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 New Appointment Booked!</h1>
        </div>
        
        <div class="content">
            <h2>Hello {{ $employee->user->name }},</h2>
            <p>You have a new appointment scheduled. Here are the details:</p>
            
            <div class="appointment-details">
                <h3>📋 Appointment Information</h3>
                <p><strong>Reference:</strong> {{ $appointment->metadata['reference'] }}</p>
                <p><strong>Date:</strong> {{ \Carbon\Carbon::parse($appointment->date)->format('l, F j, Y') }}</p>
                <p><strong>Time:</strong> {{ $appointment->periods[0]->start_time }} - {{ $appointment->periods[0]->end_time }}</p>
                <p><strong>Status:</strong> {{ ucfirst($appointment->metadata['status']) }}</p>
            </div>

            <div class="appointment-details">
                <h3>👤 Client Information</h3>
                <p><strong>Name:</strong> {{ $client->name }}</p>
                <p><strong>Phone:</strong> {{ $client->phone }}</p>
            </div>

            <div class="appointment-details">
                <h3>✂️ Services Requested</h3>
                @foreach($services as $service)
                    <div class="service">
                        <strong>{{ $service->name }}</strong><br>
                        <small>Duration: {{ $service->duration }} minutes | Price: ${{ number_format($service->price, 2) }}</small>
                    </div>
                @endforeach
                <p><strong>Total Price:</strong> ${{ number_format($appointment->metadata['price'], 2) }}</p>
            </div>

            <p>Please make sure to prepare for this appointment and arrive on time.</p>
        </div>
        
        <div class="footer">
            <p>This is an automated message from your appointment booking system.</p>
        </div>
    </div>
</body>
</html>
