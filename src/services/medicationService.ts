
import { supabase } from "@/integrations/supabase/client";
import { Medication, MedicationFormData } from "@/types/medication";

export const getMedications = async (userId: string): Promise<Medication[]> => {
  const { data, error } = await supabase
    .from('medications')
    .select('*')
    .eq('user_id', userId)
    .order('time');

  if (error) throw error;
  
  console.log("Raw medication data from database:", data);
  
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
  console.log("Adding medication with data:", data);
  
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

  if (error) {
    console.error("Error adding medication:", error);
    throw error;
  }
  
  console.log("Successfully added medication:", newMedication);
  
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
  console.log(`Updating medication ${medicationId} status to ${status}`);
  
  const { error } = await supabase
    .from('medications')
    .update({ status })
    .eq('id', medicationId);

  if (error) {
    console.error("Error updating medication status:", error);
    throw error;
  }
  
  console.log("Successfully updated medication status");
};

export const processAIMedicationData = async (extractedData: any): Promise<MedicationFormData> => {
  console.log("Processing AI extracted data:", extractedData);
  
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
  
  // Extract medication data from the medications array if it exists
  let medicationData = {
    name: "",
    dosage: "",
    frequency: "once-daily",
    instructions: "",
  };
  
  if (extractedData.medications && Array.isArray(extractedData.medications) && extractedData.medications.length > 0) {
    const firstMed = extractedData.medications[0];
    medicationData = {
      name: firstMed.medication_name || "",
      dosage: firstMed.dosage || "",
      frequency: firstMed.frequency || "once-daily",
      instructions: firstMed.instructions || "",
    };
  } else {
    // Fallback to top-level properties
    medicationData = {
      name: extractedData.medication_name || "",
      dosage: extractedData.dosage || "",
      frequency: extractedData.frequency || "once-daily",
      instructions: extractedData.instructions || "",
    };
  }

  const result = {
    name: medicationData.name,
    dosage: medicationData.dosage,
    frequency: medicationData.frequency,
    time: extractedData.time || "08:00", // Default time
    instructions: medicationData.instructions,
    startDate: new Date().toISOString().split('T')[0],
    endDate: extractedData.end_date || undefined,
    timing: timing,
    notes: extractedData.notes || undefined
  };
  
  console.log("Processed medication data:", result);
  return result;
};
