
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MedicationReminder } from '@/types/reminders';

type ReminderUpdateCallback = (reminders: MedicationReminder[]) => void;

export const useReminderSubscription = (
  userId: string | undefined | null,
  familyMemberId: string | undefined | null,
  onUpdate: ReminderUpdateCallback
) => {
  useEffect(() => {
    if (!userId) return;

    // Create a unique channel name to avoid conflicts
    const channelName = `reminders-${userId}-${familyMemberId || 'null'}-${Date.now()}`;
    const filter = familyMemberId 
      ? `user_id=eq.${userId}&family_member_id=eq.${familyMemberId}`
      : `user_id=eq.${userId}&family_member_id=is.null`;
    
    console.log("Setting up reminders subscription with filter:", filter);
    
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'medication_reminders',
          filter
        }, 
        async (payload) => {
          console.log("Reminder change detected:", payload);
          try {
            // Fetch the updated data
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
            
            onUpdate(data || []);
          } catch (err) {
            console.error("Error refreshing reminders after change:", err);
          }
        }
      )
      .subscribe();

    return () => {
      console.log("Cleaning up reminders subscription");
      channel.unsubscribe();
    };
  }, [userId, familyMemberId, onUpdate]);
};
