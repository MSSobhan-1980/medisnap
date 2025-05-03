
import { useState } from "react";
import { Bell, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReminders, MedicationReminder } from "@/hooks/useReminders";
import { useMedications } from "@/hooks/useMedications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { toast } from "sonner";

export function MedicationReminderList() {
  const { reminders, loading: remindersLoading, updateReminder, deleteReminder, addReminder } = useReminders();
  const { medications } = useMedications();
  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState("");
  const [reminderTime, setReminderTime] = useState("08:00");

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

    setIsAddingReminder(true);

    try {
      const success = await addReminder(selectedMedication, reminderTime);
      if (success) {
        toast.success("Reminder added successfully");
        setSelectedMedication("");
        setReminderTime("08:00");
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
    } catch (error) {
      console.error("Error toggling reminder:", error);
    }
  };

  const handleDeleteReminder = async (reminder: MedicationReminder) => {
    try {
      await deleteReminder(reminder.id);
    } catch (error) {
      console.error("Error deleting reminder:", error);
    }
  };

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
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-medsnap-blue focus:ring focus:ring-medsnap-blue focus:ring-opacity-50 bg-white p-2 text-sm border"
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
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-medsnap-blue focus:ring focus:ring-medsnap-blue focus:ring-opacity-50 bg-white p-2 text-sm border"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                />
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full mt-2"
              onClick={handleAddReminder}
              disabled={isAddingReminder || !selectedMedication}
            >
              {isAddingReminder ? "Adding..." : "Add Reminder"}
            </Button>

            <div className="mt-4">
              <h3 className="font-medium mb-2">Scheduled Reminders</h3>
              {reminders.length === 0 ? (
                <p className="text-sm text-gray-500">No reminders set</p>
              ) : (
                <div className="divide-y">
                  {reminders.map((reminder) => (
                    <div key={reminder.id} className="py-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium">
                          {medicationMap[reminder.medication_id] || "Unknown medication"}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {reminder.reminder_time}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={reminder.is_enabled ? "text-green-500" : "text-gray-400"}
                          onClick={() => handleToggleReminder(reminder)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500"
                          onClick={() => handleDeleteReminder(reminder)}
                        >
                          &times;
                        </Button>
                      </div>
                    </div>
                  ))}
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
