import React from 'react';
import { Barber } from '@/types/booking';

interface TeamSectionProps {
  employees: Barber[];
}

export default function TeamSection({ employees }: TeamSectionProps) {
    return (
        <section id="team" className="bg-gray-50 py-16 md:py-32 dark:bg-gray-900">
            <div className="mx-auto max-w-5xl border-t px-6 border-gray-200 dark:border-gray-700">
                <span className="text-caption -ml-6 -mt-3.5 block w-max bg-gray-50 px-6 dark:bg-gray-900 text-gray-600 dark:text-gray-400">Team</span>
                <div className="mt-12 gap-4 sm:grid sm:grid-cols-2 md:mt-24">
                    <div className="sm:w-2/5">
                        <h2 className="text-3xl font-bold sm:text-4xl text-gray-900 dark:text-white font-serif">Our Master Barbers</h2>
                    </div>
                    <div className="mt-6 sm:mt-0">
                        <p className="text-gray-600 dark:text-gray-400">Each member of our team brings years of experience and passion for the craft. We believe in precision, style, and creating the perfect look for every client who walks through our doors.</p>
                    </div>
                </div>
                <div className="mt-12 md:mt-24">
                    <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                        {employees.map((employee, index) => (
                            <div
                                key={employee.id}
                                className="group overflow-hidden">
                                {employee.avatar ? (
                                    <img
                                        className="h-96 w-full rounded-md object-cover object-top grayscale transition-all duration-500 hover:grayscale-0 group-hover:h-[22.5rem] group-hover:rounded-xl"
                                        src={employee.avatar}
                                        alt={employee.user?.name || 'Master Barber'}
                                        width="826"
                                        height="1239"
                                    />
                                ) : (
                                    <div className="h-96 w-full rounded-md bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center grayscale transition-all duration-500 hover:grayscale-0 group-hover:h-[22.5rem] group-hover:rounded-xl">
                                        <div className="text-white text-6xl font-bold">
                                            {employee.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'MB'}
                                        </div>
                                    </div>
                                )}
                                <div className="px-2 pt-2 sm:pb-0 sm:pt-4">
                                    <div className="flex justify-between">
                                        <h3 className="text-base font-medium transition-all duration-500 group-hover:tracking-wider text-gray-900 dark:text-white">
                                            {employee.user?.name || 'Master Barber'}
                                        </h3>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">_0{index + 1}</span>
                                    </div>
                                    <div className="mt-1 flex items-center justify-between">
                                        <span className="text-gray-600 dark:text-gray-400 inline-block translate-y-6 text-sm opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                            {employee.services && employee.services.length > 0
                                                ? employee.services.slice(0, 2).map(s => s.name).join(', ')
                                                : 'Hair & Beard Specialist'
                                            }
                                        </span>
                                        <span className="text-primary inline-block translate-y-8 text-sm tracking-wide opacity-0 transition-all duration-500 hover:underline group-hover:translate-y-0 group-hover:opacity-100">
                                            Specialist
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
