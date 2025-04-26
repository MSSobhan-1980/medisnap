
import { supabase } from "@/integrations/supabase/client";
import { Medication, MedicationFormData } from "@/types/medication";
import { v4 as uuidv4 } from "uuid";

// Mock storage until we implement the database
let medicationsCache: Medication[] = [];

export const getMedications = async (userId: string): Promise<Medication[]> => {
  // In a future update, this would fetch from the database
  return medicationsCache.filter(med => med.userId === userId);
};

export const addMedication = async (userId: string, data: MedicationFormData): Promise<Medication> => {
  const newMedication: Medication = {
    id: uuidv4(),
    userId,
    status: 'pending',
    ...data,
  };
  
  medicationsCache.push(newMedication);
  return newMedication;
};

export const updateMedicationStatus = async (medicationId: string, status: 'taken' | 'missed' | 'pending'): Promise<void> => {
  const index = medicationsCache.findIndex(med => med.id === medicationId);
  if (index !== -1) {
    medicationsCache[index].status = status;
  }
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
