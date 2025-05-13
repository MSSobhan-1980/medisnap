
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useReminders } from "@/hooks/useReminders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { 
  AlarmClock,
  Bell,
  Plus,
  Clock,
  Calendar,
  X
} from "lucide-react";
import { toast } from "sonner";
import { useMedications } from "@/hooks/useMedications";

interface MedicationReminderFormProps {
  medicationId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MedicationReminderForm({ 
  medicationId,
  open,
  onOpenChange
}: MedicationReminderFormProps) {
  const { user, activeMember } = useAuth();
  const { reminders, loading, addReminder, updateReminder, deleteReminder } = useReminders(activeMember?.id);
  const { medications } = useMedications();
  const [newReminderTime, setNewReminderTime] = useState("08:00");
  const [error, setError] = useState("");
  
  // Get the medication details
  const medication = medications.find(m => m.id === medicationId);
  
  // Filter reminders for this medication
  const medicationReminders = reminders.filter(r => r.medication_id === medicationId);
  
  const handleAddReminder = async () => {
    setError("");
    
    // Validate time format
    if (!newReminderTime.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      setError("Please enter a valid time in HH:MM format");
      return;
    }
    
    // Check if reminder with this time already exists
    if (medicationReminders.some(r => r.reminder_time === newReminderTime)) {
      setError("A reminder at this time already exists");
      return;
    }
    
    try {
      const success = await addReminder(medicationId, newReminderTime);
      if (success) {
        toast.success("Reminder added successfully");
        setNewReminderTime("08:00");
      }
    } catch (error) {
      toast.error("Failed to add reminder");
      console.error("Error adding reminder:", error);
    }
  };
  
  const handleToggleReminder = async (id: string, isEnabled: boolean) => {
    try {
      await updateReminder(id, { is_enabled: isEnabled });
      toast.success(isEnabled ? "Reminder enabled" : "Reminder disabled");
    } catch (error) {
      toast.error("Failed to update reminder");
      console.error("Error toggling reminder:", error);
    }
  };
  
  const handleDeleteReminder = async (id: string) => {
    try {
      await deleteReminder(id);
      toast.success("Reminder deleted");
    } catch (error) {
      toast.error("Failed to delete reminder");
      console.error("Error deleting reminder:", error);
    }
  };
  
  // Format time for display (24h to 12h format)
  const formatTime = (time24h: string) => {
    const [hour, minute] = time24h.split(":");
    const hourNum = parseInt(hour, 10);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum % 12 || 12;
    return `${hour12}:${minute} ${period}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <AlarmClock className="mr-2 h-4 w-4" />
            Medication Reminders
          </DialogTitle>
          <DialogDescription>
            Set reminders for {medication?.name || "this medication"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4">
            <Label htmlFor="new-reminder">Add new reminder time</Label>
            <div className="flex items-center mt-1 gap-2">
              <Input
                id="new-reminder"
                type="time"
                value={newReminderTime}
                onChange={(e) => setNewReminderTime(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAddReminder} disabled={!user}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Existing reminders
              </h4>
              {medicationReminders.length > 0 && (
                <span className="text-xs text-gray-500">
                  {medicationReminders.filter(r => r.is_enabled).length} active
                </span>
              )}
            </div>
            
            {loading ? (
              <p className="text-sm text-gray-500">Loading reminders...</p>
            ) : medicationReminders.length === 0 ? (
              <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-md">
                <Bell className="h-10 w-10 mx-auto mb-2 opacity-40" />
                <p>No reminders set for this medication</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {medicationReminders
                  .sort((a, b) => a.reminder_time.localeCompare(b.reminder_time))
                  .map((reminder) => (
                    <div key={reminder.id} className={`flex items-center justify-between ${
                      reminder.is_enabled ? 'bg-white' : 'bg-gray-50 text-gray-500'
                    } p-2 rounded-md border`}>
                      <div className="flex items-center gap-2">
                        <Clock className={`h-4 w-4 ${reminder.is_enabled ? 'text-blue-500' : 'text-gray-400'}`} />
                        <span className="font-medium">{formatTime(reminder.reminder_time)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {reminder.is_enabled ? 'Enabled' : 'Disabled'}
                          </span>
                          <Switch 
                            checked={reminder.is_enabled} 
                            onCheckedChange={(checked) => handleToggleReminder(reminder.id, checked)} 
                          />
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-0 h-8 w-8"
                          onClick={() => handleDeleteReminder(reminder.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
