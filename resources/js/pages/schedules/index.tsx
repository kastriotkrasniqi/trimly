import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { index as scheduleIndex } from '@/actions/App/Http/Controllers/ScheduleController'
import { WeeklySchedule } from '@/components/weekly-schedule';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Schedules',
        href: scheduleIndex.url(),
    },
];

export default function Schedules({schedules, lunchBreak}: {schedules?: any, lunchBreak?: any   }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Schedules" />
            <div className="max-w-4xl mx-auto mt-4">
                <div className="text-center mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Weekly Schedule Manager</h1>
                    <p className="text-muted-foreground">Set your working hours for each day of the week</p>
                </div>
                <WeeklySchedule initialSchedules={schedules} initialLunchBreak={lunchBreak} />
            </div>
        </AppLayout>
    );
}
