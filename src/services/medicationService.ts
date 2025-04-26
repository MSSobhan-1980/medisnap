import { supabase } from "@/integrations/supabase/client";
import { Medication, MedicationFormData } from "@/types/medication";

export const getMedications = async (userId: string): Promise<Medication[]> => {
  const { data, error } = await supabase
    .from('medications')
    .select('*')
    .eq('user_id', userId)
    .order('time');

  if (error) throw error;
  
  // Transform the data to match our interface
  return (data || []).map(item => ({
    id: item.id,
    name: item.name,
    dosage: item.dosage,
    frequency: item.frequency,
    time: item.time,
    status: item.status as 'taken' | 'missed' | 'pending',
    instructions: item.instructions || undefined,
    startDate: item.start_date,
    endDate: item.end_date || undefined,
    userId: item.user_id,
    timing: item.timing as 'before_food' | 'with_food' | 'after_food' || undefined,
    notes: item.notes || undefined
  }));
};

export const addMedication = async (userId: string, data: MedicationFormData): Promise<Medication> => {
  const { data: newMedication, error } = await supabase
    .from('medications')
    .insert([{
      user_id: userId,
      status: 'pending',
      name: data.name,
      dosage: data.dosage,
      frequency: data.frequency,
      time: data.time,
      instructions: data.instructions,
      start_date: data.startDate,
      end_date: data.endDate,
      timing: data.timing,
      notes: data.notes
    }])
    .select()
    .single();

  if (error) throw error;
  
  // Transform to match our interface
  return {
    id: newMedication.id,
    name: newMedication.name,
    dosage: newMedication.dosage,
    frequency: newMedication.frequency,
    time: newMedication.time,
    status: newMedication.status as 'taken' | 'missed' | 'pending',
    instructions: newMedication.instructions || undefined,
    startDate: newMedication.start_date,
    endDate: newMedication.end_date || undefined,
    userId: newMedication.user_id,
    timing: newMedication.timing as 'before_food' | 'with_food' | 'after_food' || undefined,
    notes: newMedication.notes || undefined
  };
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
  let timing: 'before_food' | 'with_food' | 'after_food' | undefined = undefined;
  
  // Try to determine timing from instructions
  const instructions = extractedData.instructions || "";
  if (instructions.toLowerCase().includes("before meal") || instructions.toLowerCase().includes("before food")) {
    timing = 'before_food';
  } else if (instructions.toLowerCase().includes("with meal") || instructions.toLowerCase().includes("with food")) {
    timing = 'with_food';
  } else if (instructions.toLowerCase().includes("after meal") || instructions.toLowerCase().includes("after food")) {
    timing = 'after_food';
  }

  return {
    name: extractedData.medication_name || "",
    dosage: extractedData.dosage || "",
    frequency: extractedData.frequency || "once-daily",
    time: extractedData.time || "08:00", // Default time
    instructions: extractedData.instructions || "",
    startDate: new Date().toISOString().split('T')[0],
    endDate: extractedData.end_date || undefined,
    timing: timing,
    notes: extractedData.notes || undefined
  };
};
