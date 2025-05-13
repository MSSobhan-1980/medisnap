
import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { Medication } from "@/types/medication";
import EditMedicationForm from "./EditMedicationForm";
import { MedicationTable } from "./medication/MedicationTable";
import { MedicationWeeklyView } from "./medication/MedicationWeeklyView";
import { MedicationMonthlyView } from "./medication/MedicationMonthlyView";

interface MedicationScheduleProps {
  medications: Medication[];
  loading: boolean;
  date: Date | undefined;
  onMarkAsTaken: (medicationId: string) => Promise<void>;
  onMarkAsMissed: (medicationId: string) => Promise<void>;
  onDelete?: (medicationId: string) => Promise<void>;
}

export default function MedicationSchedule({ 
  medications, 
  loading, 
  date,
  onMarkAsTaken,
  onMarkAsMissed,
  onDelete
}: MedicationScheduleProps) {
  const [activeTab, setActiveTab] = useState("daily");
  const navigate = useNavigate();
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  
  // Format date for display
  const formattedDate = date ? format(date, "PPP") : "";

  const handleDelete = async (medicationId: string) => {
    if (!onDelete) return;
    
    try {
      await onDelete(medicationId);
      toast.success("Medication deleted successfully");
    } catch (error) {
      toast.error("Failed to delete medication");
    }
  };

  const handleEditClick = (medication: Medication) => {
    setEditingMedication(medication);
  };

  const handleEditComplete = () => {
    setEditingMedication(null);
  };

  return (
    <>
      <Card className="lg:col-span-2">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Medication Schedule</CardTitle>
              <CardDescription>For {formattedDate}</CardDescription>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab}>
            <TabsContent value="daily" className="mt-0">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 py-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[160px]" />
                    </div>
                  </div>
                ))
              ) : medications.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No medications scheduled for this day</p>
                  <Button className="mt-4" onClick={() => navigate("/scan")}>Add Medication</Button>
                </div>
              ) : (
                <MedicationTable 
                  medications={medications}
                  onMarkAsTaken={onMarkAsTaken}
                  onMarkAsMissed={onMarkAsMissed}
                  onDelete={handleDelete}
                  onEdit={handleEditClick}
                />
              )}
            </TabsContent>
            
            <TabsContent value="weekly" className="mt-0">
              <MedicationWeeklyView />
            </TabsContent>
            
            <TabsContent value="monthly" className="mt-0">
              <MedicationMonthlyView />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit medication dialog */}
      <Dialog open={editingMedication !== null} onOpenChange={(open) => !open && setEditingMedication(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Medication</DialogTitle>
          </DialogHeader>
          {editingMedication && (
            <EditMedicationForm medication={editingMedication} onComplete={handleEditComplete} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
