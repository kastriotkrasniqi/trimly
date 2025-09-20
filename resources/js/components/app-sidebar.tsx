import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, CalendarClock, Folder, LayoutGrid, Scissors, User, UserRoundCheck, Users, Users2, Users2Icon } from 'lucide-react';
import AppLogo from './app-logo';
import { index as employeeIndex } from '@/actions/App/Http/Controllers/EmployeeController'
import { index as scheduleIndex } from '@/actions/App/Http/Controllers/ScheduleController'
import { index as appointmentIndex } from '@/actions/App/Http/Controllers/AppointmentController'
import { index as serviceIndex } from '@/actions/App/Http/Controllers/ServiceController'

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Employees',
        href: employeeIndex.url(),
        icon: Users2,
    },
    {
        title: 'My Schedules',
        href: scheduleIndex.url(),
        icon: CalendarClock,
    },
    {
        title: 'My Appointments',
        href: appointmentIndex.url(),
        icon: UserRoundCheck,
    },
    {
        title: 'My Services',
        href: serviceIndex.url(),
        icon: Scissors,
    }

];

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
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
