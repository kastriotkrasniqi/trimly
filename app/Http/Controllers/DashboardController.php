<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Employee;
use App\Models\Service;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Zap\Models\Schedule;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Check if user has permission to view dashboard
        if (!$user->hasPermissionTo('view dashboard')) {
            abort(403, 'Access denied. You do not have permission to view the dashboard.');
        }

        $isAdmin = $user->hasRole('admin');
        $isEmployee = $user->hasRole('employee');
        $isClient = $user->hasRole('client');

        // Role-based data filtering
        if ($isAdmin) {
            // Admin sees all data
            $totalClients = Client::count();
            $totalEmployees = Employee::count();
            $totalServices = Service::count();
            $totalUsers = User::count();
            $totalAppointments = Schedule::where('name', 'Appointment')->count();
            $activeEmployees = Employee::whereHas('activeSchedules')->count();

            // All appointments for admin
            $appointmentQuery = Schedule::where('name', 'Appointment');
        } elseif ($isEmployee) {
            // Employee sees only their own data
            $employee = $user->employee;

            if (!$employee) {
                // If user is not properly set up as employee, show minimal data
                $totalClients = 0;
                $totalEmployees = 1; // themselves
                $totalServices = 0;
                $totalUsers = 1;
                $totalAppointments = 0;
                $activeEmployees = 0;
                $appointmentQuery = Schedule::where('name', 'Appointment')->where('schedulable_id', -1); // No results
            } else {
                // Employee-specific counts
                $totalClients = 0; // Employees don't see client counts
                $totalEmployees = 1; // Only themselves
                $totalServices = $employee->services()->count();
                $totalUsers = 1;
                $totalAppointments = Schedule::where('name', 'Appointment')
                    ->where('schedulable_type', Employee::class)
                    ->where('schedulable_id', $employee->id)
                    ->count();
                $activeEmployees = 1; // Only themselves

                // Only their appointments
                $appointmentQuery = Schedule::where('name', 'Appointment')
                    ->where('schedulable_type', Employee::class)
                    ->where('schedulable_id', $employee->id);
            }
        } elseif ($isClient) {
            // Client sees only their own appointment data
            $client = $user->client;

            if (!$client) {
                // If user is not properly set up as client, show minimal data
                $totalClients = 1; // themselves
                $totalEmployees = 0; // don't show employee counts to clients
                $totalServices = 0; // don't show service counts to clients
                $totalUsers = 1;
                $totalAppointments = 0;
                $activeEmployees = 0;
                $appointmentQuery = Schedule::where('name', 'Appointment')->where('metadata->client->id', -1); // No results
            } else {
                // Client-specific counts
                $totalClients = 1; // Only themselves
                $totalEmployees = 0; // Don't show employee counts
                $totalServices = 0; // Don't show service counts
                $totalUsers = 1;
                $totalAppointments = Schedule::where('name', 'Appointment')
                    ->where('metadata->client->id', $client->id)
                    ->count();
                $activeEmployees = 0; // Don't show employee counts

                // Only their appointments
                $appointmentQuery = Schedule::where('name', 'Appointment')
                    ->where('metadata->client->id', $client->id);
            }
        } else {
            // User without proper role cannot access dashboard
            abort(403, 'Access denied. You do not have a valid role to view the dashboard.');
        }

        // Today's appointments
        $todayAppointments = (clone $appointmentQuery)
            ->where('start_date', today())
            ->count();

        // This week's appointments (starting from Monday)
        $weekStart = now()->startOfWeek();
        $weekEnd = now()->endOfWeek();
        $weeklyAppointments = (clone $appointmentQuery)
            ->whereBetween('start_date', [$weekStart, $weekEnd])
            ->count();

        // This month's appointments
        $monthStart = now()->startOfMonth();
        $monthEnd = now()->endOfMonth();
        $monthlyAppointments = (clone $appointmentQuery)
            ->whereBetween('start_date', [$monthStart, $monthEnd])
            ->count();

        // Recent appointments (last 5)
        $recentAppointments = (clone $appointmentQuery)
            ->with('schedulable.user')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($appointment) {
                $startTime = $appointment->periods->first()?->start_time;
                $formattedTime = $startTime ? \Carbon\Carbon::parse($startTime)->format('H:i') : null;
                $formattedDate = \Carbon\Carbon::parse($appointment->start_date)->format('M j, Y');

                return [
                    'id' => $appointment->id,
                    'client_name' => $appointment->metadata['client']['name'] ?? 'Unknown',
                    'employee_name' => $appointment->schedulable->user->name ?? 'Unknown',
                    'date' => $formattedDate,
                    'time' => $formattedTime,
                    'services' => collect($appointment->metadata['services'] ?? [])->pluck('name')->join(', '),
                    'price' => $appointment->metadata['price'] ?? null,
                    'status' => $appointment->metadata['status'] ?? 'pending',
                ];
            });

        // Revenue stats
        $monthlyRevenue = (clone $appointmentQuery)
            ->whereBetween('start_date', [$monthStart, $monthEnd])
            ->whereNotNull('metadata->price')
            ->get()
            ->sum(function ($appointment) {
                return (float) ($appointment->metadata['price'] ?? 0);
            });

        $weeklyRevenue = (clone $appointmentQuery)
            ->whereBetween('start_date', [$weekStart, $weekEnd])
            ->whereNotNull('metadata->price')
            ->get()
            ->sum(function ($appointment) {
                return (float) ($appointment->metadata['price'] ?? 0);
            });

        // Most popular services (based on appointment metadata)
        $appointments = (clone $appointmentQuery)
            ->whereNotNull('metadata->services')
            ->get();

        $serviceCount = [];
        foreach ($appointments as $appointment) {
            $services = $appointment->metadata['services'] ?? [];
            foreach ($services as $service) {
                $serviceName = $service['name'] ?? 'Unknown';
                $serviceCount[$serviceName] = ($serviceCount[$serviceName] ?? 0) + 1;
            }
        }

        $popularServices = collect($serviceCount)
            ->sortDesc()
            ->take(5)
            ->map(function ($count, $name) {
                return [
                    'name' => $name,
                    'count' => $count,
                ];
            })
            ->values();

        $stats = [
            'overview' => [
                'total_clients' => $totalClients,
                'total_employees' => $totalEmployees,
                'total_services' => $totalServices,
                'total_appointments' => $totalAppointments,
                'active_employees' => $activeEmployees,
            ],
            'appointments' => [
                'today' => $todayAppointments,
                'this_week' => $weeklyAppointments,
                'this_month' => $monthlyAppointments,
                'recent' => $recentAppointments,
            ],
            'revenue' => [
                'this_week' => $weeklyRevenue,
                'this_month' => $monthlyRevenue,
            ],
            'popular_services' => $popularServices,
        ];

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'userRole' => $isAdmin ? 'admin' : ($isEmployee ? 'employee' : ($isClient ? 'client' : 'unknown')),
        ]);
    }
}
