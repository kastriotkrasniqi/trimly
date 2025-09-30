
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Barber } from "@/types/booking"

// Props for the barber selection step
interface BarberSelectionProps {
  selectedBarber?: string
  onBarberSelect?: (barberId: string) => void
  onClose?: () => void
  employees: Barber[]
}

export default function BarberSelection({
  selectedBarber = "",
  onBarberSelect,
  onClose,
  employees,
}: BarberSelectionProps) {
  // Local state for selected barber
  const [selected, setSelected] = useState<string>(selectedBarber)

  // Sync local state with prop when coming back
  useEffect(() => {
    setSelected(selectedBarber)
  }, [selectedBarber])

  // Handle barber selection
  const handleBarberSelect = (barberId: string) => {
    setSelected(barberId)
    if (onBarberSelect) onBarberSelect(barberId)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background z-10">
        <div className="flex items-center px-4 py-4 relative">
          <h1 className="text-2xl font-semibold text-foreground">Choose a professional</h1>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 bg-gray-100 rounded-full"
            onClick={onClose}
          >
            <X className="h-8 w-8 text-gray-400" />
          </Button>
        </div>
      </div>

      <div className="px-4 py-6 max-w-md mx-auto pb-24">
        <div className="grid grid-cols-2 gap-4">
          {employees.map((barber) => {
            const isSelected = selected === barber.id
            return (
              <Card
                key={barber.id}
                className={`cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border-border hover:bg-card/80"
                }`}
                onClick={() => handleBarberSelect(barber.id)}
              >
                <div className="p-2 text-center space-y-3">
                  <div className="flex justify-center">
                    <img
                      src={barber.avatar || `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="%23f3f4f6"/><text x="32" y="38" text-anchor="middle" font-size="12" fill="%236b7280">${barber.user?.name?.split(' ').map(n => n[0]).join('') || 'N/A'}</text></svg>`}
                      alt={barber.user?.name || 'Barber'}
                      className="w-16 h-16 rounded-lg object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="%23f3f4f6"/><text x="32" y="38" text-anchor="middle" font-size="12" fill="%236b7280">${barber.user?.name?.split(' ').map(n => n[0]).join('') || 'N/A'}</text></svg>`;
                      }}
                    />
                  </div>
                  <div>
                    <h3
                      className={`font-semibold text-base ${
                        isSelected ? "text-primary-foreground" : "text-card-foreground"
                      }`}
                    >
                      {barber.user.name}
                    </h3>
                    <p
                      className={`text-sm mt-1 ${
                        isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                      }`}
                    >
                      Hair Stylist
                    </p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
