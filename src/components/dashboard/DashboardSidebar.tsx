
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import MedicationReminderList from "@/components/MedicationReminderList";
import DashboardActions from "./DashboardActions";
import MedicationSummary from "./MedicationSummary";
import { Medication } from "@/types/medication";

interface DashboardSidebarProps {
  date: Date | undefined;
  medications: Medication[];
  loading: boolean;
  isAddMedicationOpen: boolean;
  setIsAddMedicationOpen: (isOpen: boolean) => void;
}

export default function DashboardSidebar({ 
  date, 
  medications, 
  loading, 
  isAddMedicationOpen, 
  setIsAddMedicationOpen 
}: DashboardSidebarProps) {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Dashboard</CardTitle>
        <CardDescription>Manage your medications</CardDescription>
      </CardHeader>
      <CardContent>
        <MedicationSummary 
          date={date} 
          medications={medications} 
          loading={loading} 
        />
        
        <DashboardActions 
          isAddMedicationOpen={isAddMedicationOpen} 
          setIsAddMedicationOpen={setIsAddMedicationOpen} 
        />

        <div className="mt-6">
          <MedicationReminderList />
        </div>
      </CardContent>
    </Card>
  );
}
