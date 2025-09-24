import { useState, useEffect, useCallback } from "react"
import { ChevronDown, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Service } from "@/types/booking"
import { getServicesByEmployee } from "@/actions/App/Http/Controllers/ServiceController"    // Props for the service selection step
    interface ServiceSelectionProps {
        onServiceSelect: (serviceIds: string[]) => void
        onBack?: () => void
        selectedBarber: string
        selectedServices: string[]
    }

    export default function ServiceSelection({
        onServiceSelect,
        onBack,
        selectedBarber,
        selectedServices,
    }: ServiceSelectionProps) {
    // State for expanded service details
    const [expandedService, setExpandedService] = useState<string>("")
    // State for fetched services
    const [services, setServices] = useState<Service[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string>("")

    // Fetch services for the selected barber
    useEffect(() => {
        const fetchServices = async () => {
            if (!selectedBarber) {
                setServices([])
                return
            }

            setLoading(true)
            setError("")

            try {
                const response = await fetch(getServicesByEmployee.url(selectedBarber));
                if (!response.ok) {
                    throw new Error('Failed to fetch services')
                }
                const data = await response.json()
                setServices(Array.isArray(data) ? data : [])
            } catch (error) {
                console.error('Error fetching services:', error)
                setError('Failed to load services')
                setServices([])
            } finally {
                setLoading(false)
            }
        }

        fetchServices()
    }, [selectedBarber])

    // Toggle service selection
    const handleServiceToggle = useCallback((serviceId: string) => {
        const updated = selectedServices.includes(serviceId)
            ? selectedServices.filter((id) => id !== serviceId)
            : [...selectedServices, serviceId]
        onServiceSelect?.(updated)
    }, [selectedServices, onServiceSelect])

    // Toggle expanded service details
    const toggleServiceDetails = useCallback((serviceId: string) => {
        setExpandedService(prev => prev === serviceId ? "" : serviceId)
    }, [])

    return (
            <div className="min-h-screen bg-background">
                {/* Mobile App Header */}
                <div className="sticky top-0 bg-background z-10">
                    <div className="flex items-center justify-center px-4 py-4 relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-4 bg-gray-100 rounded-full"
                            onClick={onBack}
                        >
                            <ChevronLeft className="h-8 w-8" />
                        </Button>
                        <h1 className="text-2xl font-semibold text-foreground">Choose a service</h1>
                    </div>
                </div>

                {/* Services List */}
                <div className="px-4 py-6 space-y-0 max-w-md mx-auto divide-y divide-border pb-24">
                    {loading ? (
                        // Loading skeleton
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="py-4 animate-pulse">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                                        <div className="h-4 bg-muted rounded w-1/2"></div>
                                    </div>
                                    <div className="ml-4 h-12 w-20 bg-muted rounded-xl"></div>
                                </div>
                            </div>
                        ))
                    ) : error ? (
                        <div className="py-8 text-center">
                            <p className="text-destructive mb-4">{error}</p>
                            <Button
                                variant="outline"
                                onClick={() => window.location.reload()}
                                className="text-sm"
                            >
                                Try Again
                            </Button>
                        </div>
                    ) : services.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground">
                            No services available for this barber
                        </div>
                    ) : (
                        services.map((service) => {
                            const isSelected = selectedServices.includes(service.id)
                            return (
                                <div key={service.id} className="py-4">
                                    <div className="flex items-center justify-between">
                                        {/* Service Info */}
                                        <div className="flex flex-col flex-1 min-w-0">
                                            <h3 className="font-medium text-card-foreground truncate">
                                                {service.name} - {service.duration}min
                                            </h3>
                                            <button
                                                type="button"
                                                className="text-blue-500 hover:underline text-sm font-normal inline-flex items-center mt-1 self-start"
                                                onClick={() => toggleServiceDetails(service.id)}
                                            >
                                                Service details
                                                <ChevronDown
                                                    className={`ml-1 h-4 w-4 transition-transform ${expandedService === service.id ? "rotate-180" : ""}`}
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
                                            variant={isSelected ? "default" : "outline"}
                                            onClick={() => handleServiceToggle(service.id)}
                                            className={`ml-4 rounded-xl px-4 sm:px-6 py-3 sm:py-5 font-semibold text-sm sm:text-base tracking-wide transition border ${
                                                isSelected
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : "border-border text-foreground hover:bg-muted"
                                            }`}
                                        >
                                            €{service.price}
                                        </Button>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>

            </div>
        )
    }
