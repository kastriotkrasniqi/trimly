import { Clock, DollarSign, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Service } from "@/types/booking";
import { services } from "@/data/bookingData";

interface ServiceSelectionProps {
  selectedServices: Service[];
  onToggleService: (service: Service) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ServiceSelection({ selectedServices, onToggleService, onNext, onBack }: ServiceSelectionProps) {
  const totalDuration = selectedServices.reduce((sum, service) => sum + service.duration, 0);
  const totalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0);

  const isServiceSelected = (service: Service) =>
    selectedServices.some(s => s.id === service.id);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Select Services</h2>
        <p className="text-muted-foreground mt-2">Choose the services you'd like to book</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {services.map((service) => {
          const isSelected = isServiceSelected(service);
          return (
            <Card
              key={service.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected
                  ? "ring-2 ring-primary border-primary bg-primary/5"
                  : "hover:border-primary/50"
              }`}
              onClick={() => onToggleService(service)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{service.name}</h3>
                      {isSelected && (
                        <Check className="w-5 h-5 text-primary" />
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground">{service.description}</p>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{service.duration} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">{service.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedServices.length > 0 && (
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-2">Selected Services Summary</h3>
            <div className="space-y-1">
              {selectedServices.map((service) => (
                <div key={service.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{service.name}</span>
                  <span className="text-foreground">${service.price}</span>
                </div>
              ))}
            </div>
            <div className="border-t mt-2 pt-2 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Badge variant="secondary">
                  <Clock className="w-3 h-3 mr-1" />
                  {totalDuration} min total
                </Badge>
              </div>
              <div className="font-semibold text-foreground">
                Total: ${totalPrice}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Barber
        </Button>
        <Button onClick={onNext} disabled={selectedServices.length === 0}>
          Continue to Time Selection
        </Button>
      </div>
    </div>
  );
}
