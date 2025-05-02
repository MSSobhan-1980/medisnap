
import { supabase } from "@/integrations/supabase/client";
import { Medication, MedicationFormData } from "@/types/medication";

export async function getMedications(userId: string, familyMemberId?: string | null): Promise<Medication[]> {
  try {
    let query = supabase
      .from('medications')
      .select('*')
      .eq('user_id', userId);
    
    if (familyMemberId) {
      query = query.eq('family_member_id', familyMemberId);
    } else {
      query = query.is('family_member_id', null);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Map the snake_case database fields to camelCase for our application
    const formattedData = data.map(med => ({
      id: med.id,
      userId: med.user_id,
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      time: med.time,
      instructions: med.instructions,
      startDate: med.start_date,
      endDate: med.end_date,
      timing: med.timing as Medication['timing'],
      notes: med.notes,
      familyMemberId: med.family_member_id,
      status: med.status as 'taken' | 'missed' | 'pending',
      updated_at: med.updated_at,
      created_at: med.created_at
    }));
    
    return formattedData;
  } catch (error) {
    console.error("Error getting medications:", error);
    throw error;
  }
}

export async function addMedication(userId: string, medicationData: MedicationFormData, familyMemberId?: string | null): Promise<Medication> {
  try {
    const { name, dosage, frequency, time, instructions, startDate, endDate, timing, notes } = medicationData;

    const { data, error } = await supabase
      .from('medications')
      .insert([
        {
          user_id: userId,
          family_member_id: familyMemberId || null,
          name,
          dosage,
          frequency,
          time,
          instructions,
          start_date: startDate,
          end_date: endDate || null,
          timing,
          notes,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error adding medication:", error);
      throw error;
    }

    // Convert snake_case to camelCase for our frontend
    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      dosage: data.dosage,
      frequency: data.frequency,
      time: data.time,
      instructions: data.instructions,
      startDate: data.start_date,
      endDate: data.end_date,
      timing: data.timing as Medication['timing'],
      notes: data.notes,
      familyMemberId: data.family_member_id,
      status: data.status as 'taken' | 'missed' | 'pending',
      updated_at: data.updated_at,
      created_at: data.created_at
    };
  } catch (error) {
    console.error("Error adding medication:", error);
    throw error;
  }
}

export async function updateMedication(medicationId: string, medicationData: Partial<MedicationFormData>): Promise<Medication | null> {
  try {
    // Convert camelCase to snake_case for database
    const dbData: any = {};
    if (medicationData.startDate !== undefined) dbData.start_date = medicationData.startDate;
    if (medicationData.endDate !== undefined) dbData.end_date = medicationData.endDate;
    
    // Add other fields directly (no name conversion needed)
    for (const [key, value] of Object.entries(medicationData)) {
      if (key !== 'startDate' && key !== 'endDate') {
        dbData[key] = value;
      }
    }

    const { data, error } = await supabase
      .from('medications')
      .update(dbData)
      .eq('id', medicationId)
      .select()
      .single();

    if (error) {
      console.error("Error updating medication:", error);
      throw error;
    }

    if (!data) return null;

    // Convert snake_case to camelCase for our frontend
    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      dosage: data.dosage,
      frequency: data.frequency,
      time: data.time,
      instructions: data.instructions,
      startDate: data.start_date,
      endDate: data.end_date,
      timing: data.timing as Medication['timing'],
      notes: data.notes,
      familyMemberId: data.family_member_id,
      status: data.status as 'taken' | 'missed' | 'pending',
      updated_at: data.updated_at,
      created_at: data.created_at
    };
  } catch (error) {
    console.error("Error updating medication:", error);
    return null;
  }
}

export async function updateMedicationStatus(medicationId: string, status: 'taken' | 'missed' | 'pending') {
  try {
    const { error } = await supabase
      .from('medications')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', medicationId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error updating medication status:", error);
    throw error;
  }
}

export async function deleteMedication(medicationId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('medications')
      .delete()
      .eq('id', medicationId);

    if (error) {
      console.error("Error deleting medication:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error deleting medication:", error);
    return false;
  }
}

// Add the missing functions required by ScanPage.tsx
export async function processAIMedicationData(aiResult: any): Promise<MedicationFormData[]> {
  try {
    // This function processes AI-extracted medication data
    // Convert the AI result into proper medication form data
    let medications: MedicationFormData[] = [];
    
    if (Array.isArray(aiResult)) {
      // If the AI result is already an array of medications
      medications = aiResult.map(med => ({
        name: med.name || "",
        dosage: med.dosage || "",
        frequency: med.frequency || "once-daily",
        time: med.time || "08:00",
        instructions: med.instructions || "",
        startDate: new Date().toISOString().split('T')[0], // Default to today
        endDate: med.endDate || undefined,
        timing: med.timing as Medication['timing'] || undefined,
        notes: med.notes || ""
      }));
    } else if (typeof aiResult === 'object' && aiResult !== null) {
      // If the AI result is a single medication object
      medications = [{
        name: aiResult.name || "",
        dosage: aiResult.dosage || "",
        frequency: aiResult.frequency || "once-daily",
        time: aiResult.time || "08:00",
        instructions: aiResult.instructions || "",
        startDate: new Date().toISOString().split('T')[0], // Default to today
        endDate: aiResult.endDate || undefined,
        timing: aiResult.timing as Medication['timing'] || undefined,
        notes: aiResult.notes || ""
      }];
    }
    
    return medications.filter(med => med.name.trim() !== ""); // Filter out medications without names
  } catch (error) {
    console.error("Error processing AI medication data:", error);
    return [];
  }
}

export async function addMultipleMedications(userId: string, medicationsData: MedicationFormData[], familyMemberId?: string | null): Promise<Medication[]> {
  try {
    // Convert the array of medication data to the database format
    const dbMedications = medicationsData.map(med => ({
      user_id: userId,
      family_member_id: familyMemberId || null,
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      time: med.time,
      instructions: med.instructions || null,
      start_date: med.startDate,
      end_date: med.endDate || null,
      timing: med.timing || null,
      notes: med.notes || null,
      status: 'pending'
    }));

    // Insert all medications at once
    const { data, error } = await supabase
      .from('medications')
      .insert(dbMedications)
      .select();

    if (error) {
      console.error("Error adding multiple medications:", error);
      throw error;
    }

    // Convert the response data to our application format
    return data.map(med => ({
      id: med.id,
      userId: med.user_id,
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      time: med.time,
      instructions: med.instructions,
      startDate: med.start_date,
      endDate: med.end_date,
      timing: med.timing as Medication['timing'],
      notes: med.notes,
      familyMemberId: med.family_member_id,
      status: med.status as 'taken' | 'missed' | 'pending',
      updated_at: med.updated_at,
      created_at: med.created_at
    }));
  } catch (error) {
    console.error("Error adding multiple medications:", error);
    throw error;
  }
}
