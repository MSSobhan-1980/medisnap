
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
          // Refresh the entire list when changes occur
          const updatedMedications = await getMedications(user.id);
          setMedications(updatedMedications);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const markMedicationStatus = async (medicationId: string, status: 'taken' | 'missed' | 'pending') => {
    try {
      await updateMedicationStatus(medicationId, status);
      toast.success(`Medication marked as ${status}`);
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
