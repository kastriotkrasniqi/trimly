import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, CalendarClock, CalendarIcon, Folder, Globe, LayoutGrid, Scissors, User, UserRoundCheck, Users, Users2, Users2Icon } from 'lucide-react';
import AppLogo from './app-logo';
import { index as employeeIndex } from '@/actions/App/Http/Controllers/EmployeeController'
import { index as scheduleIndex } from '@/actions/App/Http/Controllers/ScheduleController'
import { index as appointmentIndex } from '@/actions/App/Http/Controllers/AppointmentController'
import { index as serviceIndex } from '@/actions/App/Http/Controllers/ServiceController'
import { index as clientIndex } from '@/actions/App/Http/Controllers/ClientController'
import {index as calendarIndex} from '@/actions/App/Http/Controllers/CalendarController'

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const user = auth?.user;
    const isAdmin = user?.roles?.some((role: any) => role.name === 'admin') || false;
    const isEmployee = user?.roles?.some((role: any) => role.name === 'employee') || false;
    const isClient = user?.roles?.some((role: any) => role.name === 'client') || false;

    // Base navigation items available to all authenticated users
    const baseNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
    ];

    // Navigation items for admin users
    const adminNavItems: NavItem[] = [
        {
            title: 'Calendar',
            href: calendarIndex.url(),
            icon: CalendarIcon,
        },
        {
            title: 'Schedules',
            href: scheduleIndex.url(),
            icon: CalendarClock,
        },
        {
            title: 'Appointments',
            href: appointmentIndex.url(),
            icon: UserRoundCheck,
        },
        {
            title: 'Services',
            href: serviceIndex.url(),
            icon: Scissors,
        },
        {
            title: 'Employees',
            href: employeeIndex.url(),
            icon: Users2,
        },
        {
            title: 'Clients',
            href: clientIndex.url(),
            icon: Users2,
        },
    ];

    // Navigation items for employee users
    const employeeNavItems: NavItem[] = [
        {
            title: 'Calendar',
            href: calendarIndex.url(),
            icon: CalendarIcon,
        },
        {
            title: 'Schedules',
            href: scheduleIndex.url(),
            icon: CalendarClock,
        },
        {
            title: 'Appointments',
            href: appointmentIndex.url(),
            icon: UserRoundCheck,
        },
        {
            title: 'Services',
            href: serviceIndex.url(),
            icon: Scissors,
        },
    ];

    // Navigation items for client users
    const clientNavItems: NavItem[] = [
        {
            title: 'Calendar',
            href: calendarIndex.url(),
            icon: CalendarIcon,
        },
        {
            title: 'Appointments',
            href: appointmentIndex.url(),
            icon: UserRoundCheck,
        },
    ];

    // Build final navigation items based on user role
    let mainNavItems: NavItem[] = [...baseNavItems];

    if (isAdmin) {
        mainNavItems = [...mainNavItems, ...adminNavItems];
    } else if (isEmployee) {
        mainNavItems = [...mainNavItems, ...employeeNavItems];
    } else if (isClient) {
        mainNavItems = [...mainNavItems, ...clientNavItems];
    }
    const footerNavItems: NavItem[] = [
        {
            title: 'Website',
            href: 'http://trimly.test',
            icon: Globe,
        },
        // {
        //     title: 'Documentation',
        //     href: 'https://laravel.com/docs/starter-kits#react',
        //     icon: BookOpen,
        // },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
