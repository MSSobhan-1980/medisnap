import { supabase } from "@/integrations/supabase/client";
import { Medication, MedicationFormData } from "@/types/medication";

export async function getMedications(userId: string, familyMemberId?: string | null): Promise<any[]> {
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
    
    return data || [];
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

    return data as Medication;
  } catch (error) {
    console.error("Error adding medication:", error);
    throw error;
  }
}

export async function updateMedication(medicationId: string, medicationData: Partial<MedicationFormData>): Promise<Medication | null> {
  try {
    const { data, error } = await supabase
      .from('medications')
      .update(medicationData)
      .eq('id', medicationId)
      .select()
      .single();

    if (error) {
      console.error("Error updating medication:", error);
      throw error;
    }

    return data as Medication;
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
