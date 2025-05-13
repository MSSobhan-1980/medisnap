
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useMedications } from "@/hooks/useMedications";
import { useAuth } from "@/hooks/useAuth";
import { isWithinInterval, startOfDay } from "date-fns";
import MedicationSchedule from "@/components/MedicationSchedule";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardMetrics from "@/components/dashboard/DashboardMetrics";

export default function DashboardPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activePatient, setActivePatient] = useState("self");
  const [isAddMedicationOpen, setIsAddMedicationOpen] = useState(false);
  const { user, profile } = useAuth();
  const { medications, loading, error, markMedicationStatus, deleteMedication } = useMedications();

  const filteredMedications = medications.filter(med => {
    if (!date) return false;
    
    const selectedDate = startOfDay(date);
    
    const startDate = med.startDate ? startOfDay(new Date(med.startDate)) : null;
    const endDate = med.endDate ? startOfDay(new Date(med.endDate)) : null;
    
    if (!startDate) return false;
    
    if (endDate) {
      return isWithinInterval(selectedDate, { start: startDate, end: endDate });
    }
    
    return selectedDate >= startDate;
  });

  const handleMarkAsTaken = async (medicationId: string) => {
    await markMedicationStatus(medicationId, 'taken');
  };

  const handleMarkAsMissed = async (medicationId: string) => {
    await markMedicationStatus(medicationId, 'missed');
  };

  const handleDelete = async (medicationId: string) => {
    await deleteMedication(medicationId);
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <DashboardHeader 
        activePatient={activePatient}
        setActivePatient={setActivePatient}
        date={date}
        setDate={setDate}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <DashboardSidebar 
          date={date}
          medications={filteredMedications}
          loading={loading}
          isAddMedicationOpen={isAddMedicationOpen}
          setIsAddMedicationOpen={setIsAddMedicationOpen}
        />
        
        <MedicationSchedule 
          medications={filteredMedications}
          loading={loading}
          date={date}
          onMarkAsTaken={handleMarkAsTaken}
          onMarkAsMissed={handleMarkAsMissed}
          onDelete={handleDelete}
        />
      </div>
      
      <DashboardMetrics 
        medications={medications}
        loading={loading}
        activePatient={activePatient}
      />
    </div>
  );
}
