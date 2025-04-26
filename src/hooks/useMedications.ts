
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Medication } from '@/types/medication';
import { getMedications, updateMedicationStatus } from '@/services/medicationService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useMedications() {
  const { user } = useAuth();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initial fetch of medications
  useEffect(() => {
    const fetchMedications = async () => {
      if (!user) {
        setMedications([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await getMedications(user.id);
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
  }, [user]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    console.log("Setting up real-time subscription for medications for user:", user.id);
    const channel = supabase
      .channel('medications-changes')
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'medications',
          filter: `user_id=eq.${user.id}`
        }, 
        async (payload) => {
          console.log("Received real-time update:", payload);
          // Refresh the entire list when changes occur
          try {
            const updatedMedications = await getMedications(user.id);
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
      supabase.removeChannel(channel);
    };
  }, [user]);

  const markMedicationStatus = async (medicationId: string, status: 'taken' | 'missed' | 'pending') => {
    try {
      await updateMedicationStatus(medicationId, status);
      toast.success(`Medication marked as ${status}`);
      
      // Update the local state immediately for better UX
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

  return {
    medications,
    loading,
    error,
    markMedicationStatus
  };
}
