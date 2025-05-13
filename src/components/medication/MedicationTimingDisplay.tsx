
import { Sun, Circle, Moon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Medication } from "@/types/medication";
import { getDosingPattern } from "@/utils/medicationUtils";

interface MedicationTimingDisplayProps {
  medication: Medication;
  period: 'morning' | 'afternoon' | 'evening';
}

export function MedicationTimingDisplay({ medication, period }: MedicationTimingDisplayProps) {
  const [morning, noon, evening] = getDosingPattern(medication);
  
  const dosesCount = 
    period === 'morning' ? morning : 
    period === 'afternoon' ? noon : 
    evening;
  
  if (dosesCount <= 0) {
    return <div className="text-gray-300">-</div>;
  }
  
  // Get appropriate time label and icon
  let icon;
  if (period === 'morning') {
    icon = <Sun className="h-4 w-4 text-yellow-500" />;
  } else if (period === 'afternoon') {
    icon = <Circle className="h-4 w-4 text-orange-500" />;
  } else {
    icon = <Moon className="h-4 w-4 text-blue-500" />;
  }
  
  // Show timing with pill count
  return (
    <div className="flex items-center">
      {icon}
      <span className="font-medium ml-1">
        {dosesCount > 1 ? `${dosesCount} pills` : '1 pill'}
      </span>
      {medication.timing && period === medication.timing.replace('_', ' ') && (
        <Badge variant="outline" className="ml-2 text-xs">
          {medication.timing.replace('_', ' ')}
        </Badge>
      )}
    </div>
  );
}
