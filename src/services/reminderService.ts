
import { supabase } from '@/integrations/supabase/client';
import { MedicationReminder } from '@/types/reminders';
import { apiRequestLimiter, withRateLimiting } from '@/utils/security/rateLimiting';

export const fetchRemindersForUser = async (userId: string, familyMemberId?: string | null): Promise<MedicationReminder[]> => {
  return await withRateLimiting(
    apiRequestLimiter,
    async () => {
      let query = supabase
        .from('medication_reminders')
        .select('*')
        .eq('user_id', userId);
      
      if (familyMemberId) {
        query = query.eq('family_member_id', familyMemberId);
      } else {
        query = query.is('family_member_id', null);
      }
        
      const { data, error } = await query.order('reminder_time', { ascending: true });
      
      if (error) throw error;
      
      console.log("Fetched reminders:", data);
      return data || [];
    },
    "Too many API requests. Please try again in a moment."
  );
};

export const addReminderToMedication = async (
  userId: string, 
  medicationId: string, 
  reminderTime: string, 
  familyMemberId?: string | null
): Promise<boolean> => {
  return await withRateLimiting(
    apiRequestLimiter,
    async () => {
      const { data, error } = await supabase
        .from('medication_reminders')
        .insert({
          medication_id: medicationId,
          user_id: userId,
          family_member_id: familyMemberId,
          reminder_time: reminderTime,
          is_enabled: true
        })
        .select();
      
      if (error) throw error;
      
      console.log("Reminder added:", data);
      return true;
    },
    "Too many reminder requests. Please try again in a moment."
  );
};

export const updateReminderSettings = async (
  userId: string,
  reminderId: string, 
  data: Partial<Omit<MedicationReminder, 'id' | 'user_id' | 'created_at'>>
): Promise<boolean> => {
  return await withRateLimiting(
    apiRequestLimiter,
    async () => {
      const { error } = await supabase
        .from('medication_reminders')
        .update(data)
        .eq('id', reminderId)
        .eq('user_id', userId);
      
      if (error) throw error;
      
      console.log("Reminder updated successfully");
      return true;
    },
    "Too many update requests. Please try again in a moment."
  );
};

export const deleteReminderById = async (
  userId: string,
  reminderId: string
): Promise<boolean> => {
  return await withRateLimiting(
    apiRequestLimiter,
    async () => {
      const { error } = await supabase
        .from('medication_reminders')
        .delete()
        .eq('id', reminderId)
        .eq('user_id', userId);
      
      if (error) throw error;
      
      console.log("Reminder deleted successfully");
      return true;
    },
    "Too many delete requests. Please try again in a moment."
  );
};
