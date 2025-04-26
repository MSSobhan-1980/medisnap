
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Medication } from '@/types/medication';
import { getMedications, updateMedicationStatus } from '@/services/medicationService';

export function useMedications() {
  const { user } = useAuth();
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
        const data = await getMedications(user.id);
        setMedications(data);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching medications:", err);
        setError(err.message || "Failed to fetch medications");
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, [user]);

  const markMedicationStatus = async (medicationId: string, status: 'taken' | 'missed' | 'pending') => {
    try {
      await updateMedicationStatus(medicationId, status);
      setMedications(prev => 
        prev.map(med => med.id === medicationId ? { ...med, status } : med)
      );
      return true;
    } catch (err) {
      console.error("Error updating medication status:", err);
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
