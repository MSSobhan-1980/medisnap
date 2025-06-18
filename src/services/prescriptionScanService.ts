
import { supabase } from '@/integrations/supabase/client';
import { uploadImage } from '@/services/secureStorageService';
import { MedicationFormData } from '@/types/medication';
import { Database } from '@/integrations/supabase/types';

// Use the actual Supabase type for prescription scans
export type PrescriptionScan = Database['public']['Tables']['prescription_scans']['Row'];

export const uploadPrescriptionImage = async (file: File, userId: string): Promise<string | null> => {
  try {
    const imageUrl = await uploadImage(file, {
      bucket: 'prescription-images',
      folder: userId,
      isPublic: true,
      maxSizeBytes: 10 * 1024 * 1024 // 10MB max
    });

    return imageUrl;
  } catch (error) {
    console.error('Error uploading prescription image:', error);
    throw error;
  }
};

export const createPrescriptionScan = async (
  userId: string,
  imageUrl: string
): Promise<PrescriptionScan> => {
  try {
    const { data, error } = await supabase
      .from('prescription_scans')
      .insert({
        user_id: userId,
        image_url: imageUrl,
        processing_status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error creating prescription scan:', error);
    throw error;
  }
};

export const processPrescriptionWithOCR = async (
  scanId: string,
  imageUrl: string,
  userId: string
): Promise<any> => {
  try {
    const response = await supabase.functions.invoke('prescription-ocr-gemini', {
      body: {
        scanId,
        imageUrl,
        userId
      }
    });

    if (response.error) {
      throw response.error;
    }

    return response.data;
  } catch (error) {
    console.error('Error processing prescription with OCR:', error);
    throw error;
  }
};

export const getPrescriptionScans = async (userId: string): Promise<PrescriptionScan[]> => {
  try {
    const { data, error } = await supabase
      .from('prescription_scans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching prescription scans:', error);
    throw error;
  }
};

export const deletePrescriptionScan = async (scanId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('prescription_scans')
      .delete()
      .eq('id', scanId);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error deleting prescription scan:', error);
    throw error;
  }
};

export const convertScanToMedications = (scan: PrescriptionScan): MedicationFormData[] => {
  if (!scan.extracted_medications || !Array.isArray(scan.extracted_medications)) {
    return [];
  }

  return scan.extracted_medications.map((med: any) => {
    // Map dosing pattern to frequency
    let frequency = "once-daily";
    const dosingPattern = med.dosing_pattern || '';
    
    if (dosingPattern === "1+0+0" || dosingPattern === "0+1+0" || dosingPattern === "0+0+1") {
      frequency = "once-daily";
    } else if (dosingPattern.includes("1") && dosingPattern.split('+').filter(x => x === '1').length === 2) {
      frequency = "twice-daily";
    } else if (dosingPattern === "1+1+1") {
      frequency = "three-times-daily";
    }
    
    // Determine appropriate time based on dosing pattern
    let defaultTime = "08:00";
    if (dosingPattern === "0+1+0") defaultTime = "13:00";
    else if (dosingPattern === "0+0+1") defaultTime = "20:00";
    
    return {
      name: med.medication_name || "",
      dosage: med.dosage || "",
      frequency: frequency,
      time: defaultTime,
      instructions: med.instructions || "",
      startDate: new Date().toISOString().split('T')[0],
      endDate: undefined,
      timing: med.timing as any || undefined,
      notes: `Extracted from prescription scan\nGeneric: ${med.generic_name || 'N/A'}\nPattern: ${dosingPattern}`
    };
  }).filter(med => med.name.trim() !== "");
};
