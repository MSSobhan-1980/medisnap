
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/toast';
import { MedicationReminder, ReminderOptions } from '@/types/reminders';
import { 
  fetchRemindersForUser, 
  addReminderToMedication, 
  updateReminderSettings, 
  deleteReminderById 
} from '@/services/reminderService';
import { useReminderSubscription } from './useReminderSubscription';

// Change from "export { MedicationReminder }" to "export type { MedicationReminder }"
export type { MedicationReminder } from '@/types/reminders';

export function useReminders(family_member_id?: string | null) {
  const { user, activeMember, aiLifestyleUserId } = useAuth();
  const [reminders, setReminders] = useState<MedicationReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const memberId = family_member_id || activeMember?.id;
  
  // Get the effective user ID (either from Supabase auth or AILifestyle)
  const effectiveUserId = user?.id || aiLifestyleUserId;

  // Handle real-time updates
  useReminderSubscription(effectiveUserId, memberId, (updatedReminders) => {
    setReminders(updatedReminders);
  });

  useEffect(() => {
    if (!effectiveUserId) {
      setReminders([]);
      setLoading(false);
      return;
    }

    const fetchReminderData = async () => {
      setLoading(true);
      try {
        const data = await fetchRemindersForUser(effectiveUserId, memberId);
        setReminders(data);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching reminders:", err);
        setError(err.message || "Failed to fetch reminders");
        toast.error("Failed to fetch reminders", { description: err.message });
      } finally {
        setLoading(false);
      }
    };

    fetchReminderData();
  }, [effectiveUserId, memberId]);

  const addReminder = async (medication_id: string, reminder_time: string): Promise<boolean> => {
    if (!effectiveUserId) return false;
    
    console.log("Adding reminder:", { medication_id, reminder_time, user_id: effectiveUserId, family_member_id: memberId });
    
    try {
      const success = await addReminderToMedication(effectiveUserId, medication_id, reminder_time, memberId);
      if (success) {
        toast.success("Reminder set successfully");
      }
      return success;
    } catch (err: any) {
      console.error("Error creating reminder:", err);
      toast.error("Failed to set reminder", { description: err.message });
      return false;
    }
  };

  const updateReminder = async (id: string, data: Partial<Omit<MedicationReminder, 'id' | 'user_id' | 'created_at'>>): Promise<boolean> => {
    if (!effectiveUserId) return false;
    
    console.log("Updating reminder:", { id, ...data });
    
    try {
      const success = await updateReminderSettings(effectiveUserId, id, data);
      if (success) {
        toast.success("Reminder updated successfully");
      }
      return success;
    } catch (err: any) {
      console.error("Error updating reminder:", err);
      toast.error("Failed to update reminder", { description: err.message });
      return false;
    }
  };

  const deleteReminder = async (id: string): Promise<boolean> => {
    if (!effectiveUserId) return false;
    
    console.log("Deleting reminder:", id);
    
    try {
      const success = await deleteReminderById(effectiveUserId, id);
      if (success) {
        toast.success("Reminder deleted successfully");
      }
      return success;
    } catch (err: any) {
      console.error("Error deleting reminder:", err);
      toast.error("Failed to delete reminder", { description: err.message });
      return false;
    }
  };

  return { 
    reminders,
    loading,
    error,
    addReminder,
    updateReminder,
    deleteReminder
  };
}
