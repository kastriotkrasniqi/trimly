import { AppointmentPicker } from '@/components/booking/AppoinmentPicker';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {index as employeeIndex} from '@/actions/App/Http/Controllers/EmployeeController'
import { Datatable } from '@/components/employees/employee-datatable';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Employees',
        href: employeeIndex.url(),
    },
];

export default function Employees() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Employees" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Datatable />
            </div>
        </AppLayout>
    );
}
