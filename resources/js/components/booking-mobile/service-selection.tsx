    import { useEffect, useState } from "react"
    import { ChevronDown, Check, ChevronLeft } from "lucide-react"
    import { Button } from "@/components/ui/button"
    import { Card } from "@/components/ui/card"
    import { Service } from "@/types/booking"



    interface ServiceSelectionProps {
        onServiceSelect: (serviceIds: string[]) => void
        onBack?: () => void
        selectedBarber: string
        selectedServices: string[]
    }

    export default function ServiceSelection({ onServiceSelect, onBack, selectedBarber, selectedServices }: ServiceSelectionProps) {
        const [expandedService, setExpandedService] = useState<string>("")
        const [services, setServices] = useState<Service[]>([])

        // fetch services based on selectedBarber id  (employee_id on services)
        useEffect(() => {
            const fetchServices = async () => {
                try {
                    const response = await fetch(`/api/services/${selectedBarber}`)
                    const data = await response.json()
                    setServices(data || [])
                }
                catch (error) {
                    setServices([])
                }
            }
            if (selectedBarber) {
                fetchServices()
            }
        }, [selectedBarber])


        const handleServiceToggle = (serviceId: string) => {
            const updated = selectedServices.includes(serviceId)
                ? selectedServices.filter((id) => id !== serviceId)
                : [...selectedServices, serviceId]
            if (onServiceSelect) onServiceSelect(updated)
        }


        const toggleServiceDetails = (serviceId: string) => {
            setExpandedService(expandedService === serviceId ? "" : serviceId)
        }

        return (
            <div className="min-h-screen bg-background">
                {/* Mobile App Header */}
                <div className="sticky top-0 bg-background  z-10">
                    <div className="flex items-center justify-center px-4 py-4 relative">
                        <Button variant="ghost" size="icon" className="absolute left-4 bg-gray-100 rounded-full" onClick={onBack}>
                            <ChevronLeft className="h-8 w-8" />
                        </Button>
                        <h1 className="text-2xl font-semibold text-foreground">Choose a service</h1>
                    </div>
                </div>

                {/* Services List */}
                <div className="px-4 py-6 space-y-0 max-w-md mx-auto divide-y divide-border">
                    {services.map((service) => (
                        <div key={service.id} className="py-4">
                            <div className="flex items-center justify-between">
                                {/* Service Info */}
                                <div className="flex flex-col">
                                    <h3 className="font-medium text-card-foreground">
                                        {service.name} - {service.duration}min
                                    </h3>

                                    <button
                                        type="button"
                                        className="text-blue-500 hover:underline text-sm font-normal inline-flex items-center mt-1"
                                        onClick={() => toggleServiceDetails(service.id)}
                                    >
                                        Service details
                                        <ChevronDown
                                            className={`ml-1 h-4 w-4 transition-transform ${expandedService === service.id ? "rotate-180" : ""
                                                }`}
                                        />
                                    </button>

                                    {expandedService === service.id && service.description && (
                                        <div className="mt-2 text-sm text-muted-foreground">
                                            {service.description}
                                        </div>
                                    )}
                                </div>

                                {/* Price Button */}
                                <Button
                                    variant={selectedServices.includes(service.id) ? "default" : "outline"}
                                    onClick={() => handleServiceToggle(service.id)}
                                    className={`ml-4 rounded-xl px-6 py-5 font-semibold text-base tracking-wide
                                        transition
                                        ${selectedServices.includes(service.id)
                                            ? "bg-black text-white"
                                            : "border text-foreground"
                                        }`}
                                >
                                    €{service.price}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>


                {/* Continue button removed; handled by main template */}
            </div>
        )
    }
