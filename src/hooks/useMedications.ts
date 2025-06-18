
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Medication } from '@/types/medication';
import { getMedications, updateMedicationStatus, deleteMedication as deleteUserMedication } from '@/services/medicationService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useMedications() {
  const { user, activeMember } = useAuth();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedications = async () => {
      if (!user) {
        setMedications([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await getMedications(user.id, activeMember?.id);
        console.log("Fetched medications:", data);
        setMedications(data);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching medications:", err);
        setError(err.message || "Failed to fetch medications");
        toast.error("Failed to fetch medications", { description: err.message });
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, [user, activeMember]);

  useEffect(() => {
    if (!user) return;

    // Create a unique channel name to avoid conflicts
    const channelName = `medications-${user.id}-${activeMember?.id || 'self'}-${Date.now()}`;
    const filter = activeMember 
      ? `user_id=eq.${user.id}&family_member_id=eq.${activeMember.id}`
      : `user_id=eq.${user.id}&family_member_id=is.null`;

    console.log("Setting up real-time subscription for medications with filter:", filter);
    
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'medications',
          filter
        }, 
        async (payload) => {
          console.log("Received real-time update:", payload);
          try {
            const updatedMedications = await getMedications(user.id, activeMember?.id);
            console.log("Updated medications after change:", updatedMedications);
            setMedications(updatedMedications);
          } catch (err) {
            console.error("Error refreshing medications after change:", err);
          }
        }
      )
      .subscribe();

    return () => {
      console.log("Cleaning up real-time subscription");
      channel.unsubscribe();
    };
  }, [user, activeMember]);

  const markMedicationStatus = async (medicationId: string, status: 'taken' | 'missed' | 'pending') => {
    try {
      await updateMedicationStatus(medicationId, status);
      toast.success(`Medication marked as ${status}`);
      
      setMedications(prev => 
        prev.map(med => 
          med.id === medicationId ? { ...med, status } : med
        )
      );
      
      return true;
    } catch (err: any) {
      console.error("Error updating medication status:", err);
      toast.error("Failed to update medication status", { description: err.message });
      return false;
    }
  };

  const deleteMedication = async (medicationId: string) => {
    try {
      await deleteUserMedication(medicationId);
      
      setMedications(prev => prev.filter(med => med.id !== medicationId));
      
      return true;
    } catch (err: any) {
      console.error("Error deleting medication:", err);
      toast.error("Failed to delete medication", { description: err.message });
      return false;
    }
  };

  return {
    medications,
    loading,
    error,
    markMedicationStatus,
    deleteMedication
  };
}
