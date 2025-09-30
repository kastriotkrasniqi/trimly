import { AppointmentPicker } from '@/components/booking/AppoinmentPicker';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Scissors, DollarSign, TrendingUp, Clock, CheckCircle, UserCheck } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface DashboardProps {
    stats: {
        overview: {
            total_clients: number;
            total_employees: number;
            total_services: number;
            total_appointments: number;
            active_employees: number;
        };
        appointments: {
            today: number;
            this_week: number;
            this_month: number;
            recent: Array<{
                id: string;
                client_name: string;
                employee_name: string;
                date: string;
                time: string | null;
                services: string;
                price: string | null;
                status: string;
            }>;
        };
        revenue: {
            this_week: number;
            this_month: number;
        };
        popular_services: Array<{
            name: string;
            count: number;
        }>;
    };
    userRole: 'admin' | 'employee' | 'client';
}

export default function Dashboard() {
    const { stats, userRole } = usePage<DashboardProps>().props;
    const isAdmin = userRole === 'admin';
    const isEmployee = userRole === 'employee';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Overview Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {isAdmin && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.overview.total_clients}</div>
                                <p className="text-xs text-muted-foreground">Registered clients</p>
                            </CardContent>
                        </Card>
                    )}

                    {isAdmin && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
                                <UserCheck className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.overview.active_employees}</div>
                                <p className="text-xs text-muted-foreground">
                                    of {stats.overview.total_employees} total
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {isEmployee ? 'My Services' : 'Total Services'}
                            </CardTitle>
                            <Scissors className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.overview.total_services}</div>
                            <p className="text-xs text-muted-foreground">
                                {isEmployee ? 'Services you offer' : 'Available services'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {isEmployee ? 'My Appointments' : 'Total Appointments'}
                            </CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.overview.total_appointments}</div>
                            <p className="text-xs text-muted-foreground">
                                {isEmployee ? 'Your appointments' : 'All time'}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Today's Appointments */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Today</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.appointments.today}</div>
                            <p className="text-xs text-muted-foreground">Appointments</p>
                        </CardContent>
                    </Card>

                    {/* This Week */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">This Week</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.appointments.this_week}</div>
                            <p className="text-xs text-muted-foreground">Appointments</p>
                        </CardContent>
                    </Card>

                    {/* Weekly Revenue */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Weekly Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${stats.revenue.this_week.toFixed(2)}</div>
                            <p className="text-xs text-muted-foreground">This week</p>
                        </CardContent>
                    </Card>

                    {/* Monthly Revenue */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${stats.revenue.this_month.toFixed(2)}</div>
                            <p className="text-xs text-muted-foreground">This month</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {/* Recent Appointments */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Appointments</CardTitle>
                            <CardDescription>
                                {isEmployee ? 'Your latest 5 appointments' : 'Latest 5 appointments'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {stats.appointments.recent.length > 0 ? (
                                    stats.appointments.recent.map((appointment) => (
                                        <div key={appointment.id} className="flex items-center justify-between space-x-4">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {appointment.client_name}
                                                </p>
                                                <p className="text-sm text-gray-500 truncate">
                                                    with {appointment.employee_name}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {appointment.services}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end space-y-1">
                                                <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}>
                                                    {appointment.status}
                                                </Badge>
                                                <div className="text-xs text-gray-500">
                                                    {appointment.date}{appointment.time ? ` at ${appointment.time}` : ''}
                                                </div>
                                                {appointment.price && (
                                                    <div className="text-sm font-medium">
                                                        ${appointment.price}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">No recent appointments</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Popular Services */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {isEmployee ? 'Your Popular Services' : 'Popular Services'}
                            </CardTitle>
                            <CardDescription>
                                {isEmployee ? 'Your most booked services' : 'Most booked services'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {stats.popular_services.length > 0 ? (
                                    stats.popular_services.map((service, index) => (
                                        <div key={service.name} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <div className="text-sm font-medium">#{index + 1}</div>
                                                <div>
                                                    <p className="text-sm font-medium">{service.name}</p>
                                                </div>
                                            </div>
                                            <Badge variant="outline">
                                                {service.count} bookings
                                            </Badge>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">No service data available</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
