
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
  Plus
} from "lucide-react";

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
  const [newReminderTime, setNewReminderTime] = useState("08:00");
  const [error, setError] = useState("");
  
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
    
    const success = await addReminder(medicationId, newReminderTime);
    if (success) {
      setNewReminderTime("08:00");
    }
  };
  
  const handleToggleReminder = async (id: string, isEnabled: boolean) => {
    await updateReminder(id, { is_enabled: isEnabled });
  };
  
  const handleDeleteReminder = async (id: string) => {
    await deleteReminder(id);
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <AlarmClock className="mr-2 h-4 w-4" />
            Medication Reminders
          </DialogTitle>
          <DialogDescription>
            Set reminders for when to take this medication
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
            <h4 className="text-sm font-medium">Existing reminders</h4>
            {loading ? (
              <p className="text-sm text-gray-500">Loading reminders...</p>
            ) : medicationReminders.length === 0 ? (
              <p className="text-sm text-gray-500">No reminders set for this medication</p>
            ) : (
              <div className="space-y-2">
                {medicationReminders.map((reminder) => (
                  <div key={reminder.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-blue-500" />
                      <span>{formatTime(reminder.reminder_time)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={reminder.is_enabled} 
                        onCheckedChange={(checked) => handleToggleReminder(reminder.id, checked)} 
                      />
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteReminder(reminder.id)}
                      >
                        Remove
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
