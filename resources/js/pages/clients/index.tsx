import { AppointmentPicker } from '@/components/booking/AppoinmentPicker';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {index as clientIndex} from '@/actions/App/Http/Controllers/ClientController'
import { Datatable } from '@/components/datatables/client-datatable';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Clients',
        href: clientIndex.url(),
    },
];

export default function Clients() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Clients" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Datatable />
            </div>
        </AppLayout>
    );
}
