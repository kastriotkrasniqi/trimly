import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { index as scheduleIndex } from '@/actions/App/Http/Controllers/ScheduleController'
import { ScheduleSummary } from '@/components/schedule-summary';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState, useMemo } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Schedules',
        href: scheduleIndex.url(),
    },
];

interface EmployeeScheduleData {
    employee_id: number;
    employee_name: string;
    schedules: any;
    lunchBreak: any;
}

export default function AdminSchedules({employeeSchedules}: {employeeSchedules: EmployeeScheduleData[]}) {
    const [search, setSearch] = useState('');

    // Filter employees based on search input
    const filteredEmployees = useMemo(() => {
        if (!search.trim()) {
            return employeeSchedules;
        }

        return employeeSchedules.filter(employee =>
            employee.employee_name.toLowerCase().includes(search.toLowerCase())
        );
    }, [employeeSchedules, search]);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Employee Schedules" />
            <div className="w-full mt-4 px-4">
                <div className="text-center mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Employee Schedules</h1>
                    <p className="text-muted-foreground">View all employee working hours and availability</p>
                </div>

                {/* Search Input */}
                <div className="mb-6 max-w-md mx-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            type="text"
                            placeholder="Search employees by name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {filteredEmployees.map((employeeData) => (
                        <ScheduleSummary
                            key={employeeData.employee_id}
                            schedules={employeeData.schedules}
                            lunchBreak={employeeData.lunchBreak}
                            employeeName={employeeData.employee_name}
                        />
                    ))}
                </div>

                {filteredEmployees.length === 0 && employeeSchedules.length > 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>No employees found matching "{search}"</p>
                    </div>
                )}

                {employeeSchedules.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>No active employees found.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
