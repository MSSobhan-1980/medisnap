
import { useState, useEffect } from "react";
import { Bell, Clock, AlarmClock, CheckCircle, X, Calendar, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReminders, MedicationReminder } from "@/hooks/useReminders";
import { useMedications } from "@/hooks/useMedications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import MedicationReminderForm from "./MedicationReminderForm";

export function MedicationReminderList() {
  const { reminders, loading: remindersLoading, updateReminder, deleteReminder, addReminder } = useReminders();
  const { medications } = useMedications();
  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [openMedicationId, setOpenMedicationId] = useState<string | null>(null);

  // Map medication IDs to medication names
  const medicationMap = medications.reduce((acc, med) => {
    acc[med.id] = med.name;
    return acc;
  }, {} as Record<string, string>);

  const handleAddReminder = async () => {
    if (!selectedMedication) {
      toast.error("Please select a medication");
      return;
    }

    if (!reminderTime) {
      toast.error("Please enter a reminder time");
      return;
    }

    setIsAddingReminder(true);

    try {
      const success = await addReminder(selectedMedication, reminderTime);
      if (success) {
        toast.success("Reminder added successfully");
        setSelectedMedication("");
        setReminderTime("");
      }
    } catch (error) {
      console.error("Error adding reminder:", error);
    } finally {
      setIsAddingReminder(false);
    }
  };

  const handleToggleReminder = async (reminder: MedicationReminder) => {
    try {
      await updateReminder(reminder.id, { is_enabled: !reminder.is_enabled });
      toast.success(reminder.is_enabled ? "Reminder disabled" : "Reminder enabled");
    } catch (error) {
      console.error("Error toggling reminder:", error);
      toast.error("Failed to toggle reminder");
    }
  };

  const handleDeleteReminder = async (reminder: MedicationReminder) => {
    try {
      await deleteReminder(reminder.id);
      toast.success("Reminder deleted");
    } catch (error) {
      console.error("Error deleting reminder:", error);
      toast.error("Failed to delete reminder");
    }
  };

  // Format time for display (24h to 12h format)
  const formatTime = (time24h: string) => {
    const [hours, minutes] = time24h.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${period}`;
  };

  // Group reminders by medication
  const remindersByMedication = reminders.reduce((acc, reminder) => {
    const medId = reminder.medication_id;
    if (!acc[medId]) {
      acc[medId] = [];
    }
    acc[medId].push(reminder);
    return acc;
  }, {} as Record<string, MedicationReminder[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Bell className="h-4 w-4 mr-2" />
          Medication Reminders
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {remindersLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex items-center space-x-4 py-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="medication" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Medication
                </label>
                <select
                  id="medication"
                  className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 bg-white p-2 text-sm"
                  value={selectedMedication}
                  onChange={(e) => setSelectedMedication(e.target.value)}
                >
                  <option value="">Select a medication</option>
                  {medications.map((med) => (
                    <option key={med.id} value={med.id}>
                      {med.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                  Reminder Time
                </label>
                <input
                  id="time"
                  type="time"
                  className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 bg-white p-2 text-sm"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                />
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full mt-2"
              onClick={handleAddReminder}
              disabled={isAddingReminder || !selectedMedication || !reminderTime}
            >
              {isAddingReminder ? "Adding..." : "Add Reminder"}
            </Button>

            <div className="mt-4">
              <h3 className="font-medium mb-2 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Scheduled Reminders
              </h3>
              
              {Object.keys(remindersByMedication).length === 0 ? (
                <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-md">
                  <AlarmClock className="h-10 w-10 mx-auto mb-2 opacity-40" />
                  <p>No reminders set</p>
                  <p className="text-sm">Add reminders above to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(remindersByMedication).map(([medicationId, medicationReminders]) => {
                    const medication = medications.find(med => med.id === medicationId);
                    
                    return (
                      <div key={medicationId} className="bg-gray-50 rounded-md p-3">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium text-gray-900">
                            {medication?.name || medicationMap[medicationId] || "Unknown medication"}
                          </div>
                          <div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8"
                                  onClick={() => setOpenMedicationId(medicationId)}
                                >
                                  Manage
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Manage Reminders</DialogTitle>
                                </DialogHeader>
                                <MedicationReminderForm 
                                  medicationId={medicationId} 
                                  open={openMedicationId === medicationId}
                                  onOpenChange={(open) => {
                                    if (!open) setOpenMedicationId(null);
                                  }}
                                />
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {medicationReminders.map(reminder => (
                            <div 
                              key={reminder.id} 
                              className={`flex justify-between items-center p-2 rounded-md ${
                                reminder.is_enabled ? 'bg-white border border-gray-200' : 'bg-gray-100 text-gray-500'
                              }`}
                            >
                              <div className="flex items-center">
                                <Clock className={`h-4 w-4 mr-2 ${reminder.is_enabled ? 'text-blue-500' : 'text-gray-400'}`} />
                                <span>{formatTime(reminder.reminder_time)}</span>
                                {!reminder.is_enabled && <Badge variant="outline" className="ml-2">Disabled</Badge>}
                              </div>
                              
                              <div className="flex items-center space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={reminder.is_enabled ? "text-green-500 hover:text-green-700" : "text-gray-400 hover:text-gray-600"}
                                  onClick={() => handleToggleReminder(reminder)}
                                  title={reminder.is_enabled ? "Disable reminder" : "Enable reminder"}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => handleDeleteReminder(reminder)}
                                  title="Delete reminder"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default MedicationReminderList;
