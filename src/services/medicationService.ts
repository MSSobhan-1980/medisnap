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

export const addMultipleMedications = async (userId: string, data: MedicationFormData[]): Promise<Medication[]> => {
  console.log("Adding multiple medications with data:", data);
  
  const medicationsToInsert = data.map(med => ({
    user_id: userId,
    status: 'pending',
    name: med.name,
    dosage: med.dosage,
    frequency: med.frequency,
    time: med.time,
    instructions: med.instructions,
    start_date: med.startDate,
    end_date: med.endDate,
    timing: med.timing,
    notes: med.notes
  }));
  
  const { data: newMedications, error } = await supabase
    .from('medications')
    .insert(medicationsToInsert)
    .select();

  if (error) {
    console.error("Error adding medications:", error);
    throw error;
  }
  
  console.log("Successfully added medications:", newMedications);
  
  return (newMedications || []).map(med => ({
    id: med.id,
    name: med.name,
    dosage: med.dosage,
    frequency: med.frequency,
    time: med.time,
    status: med.status as 'taken' | 'missed' | 'pending',
    instructions: med.instructions || undefined,
    startDate: med.start_date,
    endDate: med.end_date || undefined,
    userId: med.user_id,
    timing: med.timing as 'before_food' | 'with_food' | 'after_food' || undefined,
    notes: med.notes || undefined
  }));
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

export const processAIMedicationData = async (extractedData: any): Promise<MedicationFormData[]> => {
  console.log("Processing AI extracted data:", extractedData);
  
  try {
    let parsedData = extractedData;
    
    if (extractedData.raw) {
      try {
        const jsonMatch = extractedData.raw.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
          const jsonData = JSON.parse(jsonMatch[1]);
          console.log("Parsed JSON from raw:", jsonData);
          parsedData = Array.isArray(jsonData) ? jsonData : [jsonData];
        }
      } catch (e) {
        console.error("Error parsing raw JSON:", e);
        return [];
      }
    }

    const medicationsArray = Array.isArray(parsedData) ? parsedData : [parsedData];
    
    console.log("Processing medications array:", medicationsArray);

    return medicationsArray.map(med => {
      let timing: 'before_food' | 'with_food' | 'after_food' | undefined = undefined;
      
      const instructions = (med.instructions || "").toLowerCase();
      if (instructions.includes("before meal") || instructions.includes("before food")) {
        timing = 'before_food';
      } else if (instructions.includes("with meal") || instructions.includes("with food")) {
        timing = 'with_food';
      } else if (instructions.includes("after meal") || instructions.includes("after food")) {
        timing = 'after_food';
      }
      
      let frequency = "once-daily";
      const freqText = (med.frequency || "").toLowerCase();
      if (freqText.includes("twice") || freqText.includes("2 times") || freqText.includes("two times")) {
        frequency = "twice-daily";
      } else if (freqText.includes("three") || freqText.includes("3 times")) {
        frequency = "three-times-daily";
      } else if (freqText.includes("four") || freqText.includes("4 times")) {
        frequency = "four-times-daily";
      } else if (freqText.includes("as needed") || freqText.includes("when needed")) {
        frequency = "as-needed";
      }
      
      let time = "08:00";
      if (instructions.includes("evening") || instructions.includes("night")) {
        time = "20:00";
      } else if (instructions.includes("afternoon")) {
        time = "14:00";
      }
      
      return {
        name: med.medication_name || "",
        dosage: med.dosage || "",
        frequency: frequency,
        time: med.time || time,
        instructions: med.instructions || "",
        startDate: new Date().toISOString().split('T')[0],
        endDate: med.end_date || undefined,
        timing: timing,
        notes: med.notes || undefined
      };
    });
  } catch (error) {
    console.error("Error processing AI data:", error);
    return [];
  }
};

export const deleteMedication = async (medicationId: string): Promise<void> => {
  console.log("Deleting medication:", medicationId);
  
  const { error } = await supabase
    .from('medications')
    .delete()
    .eq('id', medicationId);

  if (error) {
    console.error("Error deleting medication:", error);
    throw error;
  }
  
  console.log("Successfully deleted medication");
};
