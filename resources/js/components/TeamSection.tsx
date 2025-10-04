import React from 'react';
import { motion } from 'framer-motion';
import { Barber } from '@/types/booking';

interface TeamSectionProps {
  employees: Barber[];
}

export default function TeamSection({ employees }: TeamSectionProps) {
    return (
        <section id="team" className="py-20 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-6xl mx-auto px-4">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h3 className="text-4xl md:text-5xl font-bold mb-4 font-serif text-gray-900 dark:text-white">Meet Our Masters</h3>
                    <p className="text-xl text-gray-600 dark:text-gray-400">Skilled artisans dedicated to your perfect look</p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {employees.map((employee, index) => (
                        <motion.div
                            key={employee.id}
                            className="bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center overflow-hidden">
                                {employee.avatar ? (
                                    <img
                                        src={employee.avatar}
                                        alt={employee.user?.name || 'Barber'}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-primary flex items-center justify-center">
                                        <div className="text-white text-4xl font-bold">
                                            {employee.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'MB'}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-6">
                                <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{employee.user?.name || 'Master Barber'}</h4>
                                <p className="text-primary mb-3">
                                    {employee.services && employee.services.length > 0
                                        ? employee.services.slice(0, 2).map(s => s.name).join(', ')
                                        : 'Hair & Beard Specialist'
                                    }
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Specializing in precision cuts and classic styling techniques</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
