
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AddMedicationForm from "@/components/AddMedicationForm";
import { useNavigate } from "react-router-dom";

interface DashboardActionsProps {
  isAddMedicationOpen: boolean;
  setIsAddMedicationOpen: (isOpen: boolean) => void;
}

export default function DashboardActions({ isAddMedicationOpen, setIsAddMedicationOpen }: DashboardActionsProps) {
  const navigate = useNavigate();

  return (
    <div className="mt-6">
      <Dialog open={isAddMedicationOpen} onOpenChange={setIsAddMedicationOpen}>
        <DialogTrigger asChild>
          <Button className="w-full flex items-center gap-2">
            <Plus size={16} />
            Add Medication Manually
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Medication</DialogTitle>
            <DialogDescription>
              Enter medication details to add it to your schedule
            </DialogDescription>
          </DialogHeader>
          <AddMedicationForm onComplete={() => setIsAddMedicationOpen(false)} />
        </DialogContent>
      </Dialog>
      
      <Button 
        variant="outline" 
        className="w-full mt-2"
        onClick={() => navigate("/scan")}
      >
        Scan Prescription
      </Button>
    </div>
  );
}
