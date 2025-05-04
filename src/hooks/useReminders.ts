
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface MedicationReminder {
  id: string;
  medication_id: string;
  user_id: string;
  family_member_id?: string | null;
  reminder_time: string;
  is_enabled: boolean;
  created_at: string;
}

export function useReminders(family_member_id?: string | null) {
  const { user, activeMember } = useAuth();
  const [reminders, setReminders] = useState<MedicationReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const memberId = family_member_id || activeMember?.id;

  useEffect(() => {
    if (!user) {
      setReminders([]);
      setLoading(false);
      return;
    }

    const fetchReminders = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('medication_reminders')
          .select('*')
          .eq('user_id', user.id);
        
        if (memberId) {
          query = query.eq('family_member_id', memberId);
        } else {
          query = query.is('family_member_id', null);
        }
          
        const { data, error: fetchError } = await query.order('reminder_time', { ascending: true });
        
        if (fetchError) throw fetchError;
        
        console.log("Fetched reminders:", data);
        setReminders(data || []);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching reminders:", err);
        setError(err.message || "Failed to fetch reminders");
        toast.error("Failed to fetch reminders", { description: err.message });
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
    
    // Set up real-time subscription for reminders
    const filter = memberId 
      ? `user_id=eq.${user.id}&family_member_id=eq.${memberId}`
      : `user_id=eq.${user.id}&family_member_id=is.null`;
    
    console.log("Setting up reminders subscription with filter:", filter);
    
    const channel = supabase
      .channel('reminders-changes')
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
            await fetchReminders();
          } catch (err) {
            console.error("Error refreshing reminders after change:", err);
          }
        }
      )
      .subscribe();

    return () => {
      console.log("Cleaning up reminders subscription");
      supabase.removeChannel(channel);
    };
  }, [user, memberId]);

  const addReminder = async (medication_id: string, reminder_time: string): Promise<boolean> => {
    if (!user) return false;
    
    console.log("Adding reminder:", { medication_id, reminder_time, user_id: user.id, family_member_id: memberId });
    
    try {
      const { data, error } = await supabase
        .from('medication_reminders')
        .insert({
          medication_id,
          user_id: user.id,
          family_member_id: memberId,
          reminder_time,
          is_enabled: true
        })
        .select();
      
      if (error) throw error;
      
      console.log("Reminder added:", data);
      toast.success("Reminder set successfully");
      return true;
    } catch (err: any) {
      console.error("Error creating reminder:", err);
      toast.error("Failed to set reminder", { description: err.message });
      return false;
    }
  };

  const updateReminder = async (id: string, data: Partial<Omit<MedicationReminder, 'id' | 'user_id' | 'created_at'>>): Promise<boolean> => {
    if (!user) return false;
    
    console.log("Updating reminder:", { id, ...data });
    
    try {
      const { error } = await supabase
        .from('medication_reminders')
        .update(data)
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      console.log("Reminder updated successfully");
      toast.success("Reminder updated successfully");
      return true;
    } catch (err: any) {
      console.error("Error updating reminder:", err);
      toast.error("Failed to update reminder", { description: err.message });
      return false;
    }
  };

  const deleteReminder = async (id: string): Promise<boolean> => {
    if (!user) return false;
    
    console.log("Deleting reminder:", id);
    
    try {
      const { error } = await supabase
        .from('medication_reminders')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      console.log("Reminder deleted successfully");
      toast.success("Reminder deleted successfully");
      return true;
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
