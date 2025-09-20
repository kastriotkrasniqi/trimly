import { AppointmentPicker } from '@/components/booking/AppoinmentPicker';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {index as employeeIndex} from '@/actions/App/Http/Controllers/EmployeeController'
import { AppointmentsDatatable } from '@/components/datatables/appointments-datatable';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'My Appointments',  // Changed from 'Employees' to 'My Appointments'
        href: employeeIndex.url(),
    },
];

export default function MyAppointments() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Appointments" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <AppointmentsDatatable />
            </div>
        </AppLayout>
    );
}
