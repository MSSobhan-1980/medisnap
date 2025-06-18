
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MedicationReminder } from '@/types/reminders';

type ReminderUpdateCallback = (reminders: MedicationReminder[]) => void;

export const useReminderSubscription = (
  userId: string | undefined | null,
  familyMemberId: string | undefined | null,
  onUpdate: ReminderUpdateCallback
) => {
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);

  useEffect(() => {
    if (!userId || isSubscribedRef.current) return;

    // Create a unique channel name to avoid conflicts
    const channelName = `reminders-${userId}-${familyMemberId || 'null'}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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
      .subscribe((status) => {
        console.log("Reminder subscription status:", status);
        if (status === 'SUBSCRIBED') {
          isSubscribedRef.current = true;
        }
      });

    channelRef.current = channel;

    return () => {
      console.log("Cleaning up reminders subscription");
      if (channelRef.current && isSubscribedRef.current) {
        channelRef.current.unsubscribe();
        isSubscribedRef.current = false;
        channelRef.current = null;
      }
    };
  }, [userId, familyMemberId, onUpdate]);
};
