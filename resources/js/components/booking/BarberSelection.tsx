import { Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Barber } from "@/types/booking";
import { barbers } from "@/data/bookingData";

interface BarberSelectionProps {
  selectedBarber?: Barber;
  onSelectBarber: (barber: Barber) => void;
  onNext: () => void;
}

export function BarberSelection({ selectedBarber, onSelectBarber, onNext }: BarberSelectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Choose Your Barber</h2>
        <p className="text-muted-foreground mt-2">Select from our experienced professionals</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 ">
        {barbers.map((barber) => (
          <Card
            key={barber.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedBarber?.id === barber.id
                ? "ring-2 ring-primary border-primary"
                : "hover:border-primary/50"
            }`}
            onClick={() => onSelectBarber(barber)}
          >
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="relative">
                  <img
                    src={barber.image}
                    alt={barber.name}
                    className="w-20 h-20 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" fill="%23f3f4f6"/><text x="40" y="45" text-anchor="middle" font-size="14" fill="%236b7280">${barber.name.split(' ').map(n => n[0]).join('')}</text></svg>`;
                    }}
                  />
                  {selectedBarber?.id === barber.id && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-foreground">{barber.name}</h3>
                  <div className="flex items-center justify-center mt-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-muted-foreground ml-1">{barber.rating}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 justify-center">
                  {barber.specialties.slice(0, 2).map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">{barber.bio}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button onClick={onNext} disabled={!selectedBarber} size="lg">
          Continue to Services
        </Button>
      </div>
    </div>
  );
}
