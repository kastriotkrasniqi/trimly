import { CalendarComponent } from '@/components/comp-542'
import AppLayout from '@/layouts/app-layout'
import { Head } from '@inertiajs/react';
import { index as calendarIndex } from '@/actions/App/Http/Controllers/CalendarController'
import { useState } from "react"
import { type BreadcrumbItem } from '@/types';

import {
    EventCalendar,
    type CalendarEvent,
} from "@/components/event-calendar/event-calendar"

interface CalendarPageProps {
    appointments: CalendarEvent[]
    employees: Array<{
        id: number
        name: string
        phone: string
        avatar?: string
        specialties: string[]
        is_active: boolean
    }>
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Calendar',
        href: calendarIndex.url(),
    },
];

export default function CalendarPage({ appointments: initialAppointments, employees }: CalendarPageProps) {
    // Convert date strings to Date objects
    const processedAppointments = (initialAppointments || []).map(appointment => ({
        ...appointment,
        start: new Date(appointment.start),
        end: new Date(appointment.end)
    }));

    console.log('Processed appointments:', processedAppointments);

    const [events, setEvents] = useState<CalendarEvent[]>(processedAppointments)

    const handleEventAdd = (event: CalendarEvent) => {
        // TODO: Add API call to create appointment
        setEvents([...events, event])
    }

    const handleEventUpdate = (updatedEvent: CalendarEvent) => {
        // TODO: Add API call to update appointment
        setEvents(
            events.map((event) =>
                event.id === updatedEvent.id ? updatedEvent : event
            )
        )
    }

    const handleEventDelete = (eventId: string) => {
        // TODO: Add API call to delete appointment
        setEvents(events.filter((event) => event.id !== eventId))
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Calendar" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <EventCalendar
                    events={events}
                    onEventAdd={handleEventAdd}
                    onEventUpdate={handleEventUpdate}
                    onEventDelete={handleEventDelete}
                />
            </div>
        </AppLayout>
    )
}
