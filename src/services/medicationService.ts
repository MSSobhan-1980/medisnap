
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
    const dbData: Record<string, any> = {};
    
    if (medicationData.name !== undefined) dbData.name = medicationData.name;
    if (medicationData.dosage !== undefined) dbData.dosage = medicationData.dosage;
    if (medicationData.frequency !== undefined) dbData.frequency = medicationData.frequency;
    if (medicationData.time !== undefined) dbData.time = medicationData.time;
    if (medicationData.instructions !== undefined) dbData.instructions = medicationData.instructions;
    if (medicationData.startDate !== undefined) dbData.start_date = medicationData.startDate;
    if (medicationData.endDate !== undefined) dbData.end_date = medicationData.endDate;
    if (medicationData.timing !== undefined) dbData.timing = medicationData.timing;
    if (medicationData.notes !== undefined) dbData.notes = medicationData.notes;
    
    // Set updated_at timestamp
    dbData.updated_at = new Date().toISOString();

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
    throw error;
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
    let extractedData: any[] = [];
    
    // Check if there's a JSON array in the raw text (from OCR response)
    if (typeof aiResult === 'string') {
      // Try to extract JSON from the string (it might be wrapped in markdown code blocks)
      const jsonMatch = aiResult.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          extractedData = JSON.parse(jsonMatch[1]);
        } catch (e) {
          console.error("Error parsing JSON from OCR result:", e);
        }
      }
    } else if (aiResult.raw && typeof aiResult.raw === 'string') {
      // Try to extract JSON from the raw property
      const jsonMatch = aiResult.raw.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          extractedData = JSON.parse(jsonMatch[1]);
        } catch (e) {
          console.error("Error parsing JSON from aiResult.raw:", e);
        }
      }
    } else if (Array.isArray(aiResult)) {
      // Direct array
      extractedData = aiResult;
    } else if (aiResult && typeof aiResult === 'object') {
      // Single object or wrapper object
      if (Array.isArray(aiResult.result)) {
        extractedData = aiResult.result;
      } else if (aiResult.result && typeof aiResult.result === 'object') {
        extractedData = [aiResult.result];
      }
    }
    
    if (extractedData && extractedData.length > 0) {
      medications = extractedData.map((med: any) => {
        // Map dosing pattern to frequency
        let frequency = "once-daily";
        const dosingPattern = med.dosing_pattern || '';
        
        if (dosingPattern === "1+0+0") frequency = "once-daily";
        else if (dosingPattern === "0+1+0") frequency = "once-daily";
        else if (dosingPattern === "0+0+1") frequency = "once-daily";
        else if (dosingPattern === "1+1+0") frequency = "twice-daily";
        else if (dosingPattern === "1+0+1") frequency = "twice-daily";
        else if (dosingPattern === "0+1+1") frequency = "twice-daily";
        else if (dosingPattern === "1+1+1") frequency = "three-times-daily";
        
        // Determine default time based on dosing pattern
        let defaultTime = "08:00";
        if (dosingPattern === "0+1+0") defaultTime = "13:00";
        else if (dosingPattern === "0+0+1") defaultTime = "20:00";
        
        return {
          name: med.medication_name || "",
          dosage: med.dosage || "",
          frequency: frequency,
          time: defaultTime,
          instructions: med.instructions || "",
          startDate: new Date().toISOString().split('T')[0], // Default to today
          endDate: med.end_date || undefined,
          timing: med.timing as Medication['timing'] || undefined,
          notes: `Original name: ${med.medication_name || ""}\nGeneric name: ${med.generic_name || ""}\nDosing pattern: ${dosingPattern}`
        };
      });
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
