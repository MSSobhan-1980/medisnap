
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Medication } from "@/types/medication";

interface MedicationStatusProps {
  medication: Medication;
  onMarkAsTaken: (medicationId: string) => Promise<void>;
  onMarkAsMissed: (medicationId: string) => Promise<void>;
}

export function MedicationStatus({ medication, onMarkAsTaken, onMarkAsMissed }: MedicationStatusProps) {
  if (medication.status === 'taken') {
    return (
      <div className="flex items-center text-green-600">
        <CheckCircle className="h-5 w-5 mr-1" />
        <span className="text-sm font-medium">Taken</span>
      </div>
    );
  } else if (medication.status === 'missed') {
    return (
      <div className="flex items-center text-red-600">
        <XCircle className="h-5 w-5 mr-1" />
        <span className="text-sm font-medium">Missed</span>
      </div>
    );
  } else {
    return (
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onMarkAsTaken(medication.id)}
        >
          Taken
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="text-red-500 border-red-200 hover:bg-red-50"
          onClick={() => onMarkAsMissed(medication.id)}
        >
          Missed
        </Button>
      </div>
    );
  }
}
