
import { supabase } from "@/integrations/supabase/client";
import { Medication, MedicationFormData } from "@/types/medication";

export const getMedications = async (userId: string): Promise<Medication[]> => {
  const { data, error } = await supabase
    .from('medications')
    .select('*')
    .eq('user_id', userId)
    .order('time');

  if (error) throw error;
  return data || [];
};

export const addMedication = async (userId: string, data: MedicationFormData): Promise<Medication> => {
  const { data: newMedication, error } = await supabase
    .from('medications')
    .insert([{
      user_id: userId,
      status: 'pending',
      ...data,
    }])
    .select()
    .single();

  if (error) throw error;
  return newMedication;
};

export const updateMedicationStatus = async (medicationId: string, status: 'taken' | 'missed' | 'pending'): Promise<void> => {
  const { error } = await supabase
    .from('medications')
    .update({ status })
    .eq('id', medicationId);

  if (error) throw error;
};

export const processAIMedicationData = async (extractedData: any): Promise<MedicationFormData> => {
  // Process AI-extracted data into the format we need
  return {
    name: extractedData.medication_name || "",
    dosage: extractedData.dosage || "",
    frequency: extractedData.frequency || "once-daily",
    time: "08:00", // Default time
    instructions: extractedData.instructions || "",
    startDate: new Date().toISOString().split('T')[0],
    endDate: extractedData.end_date || undefined
  };
};
