
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  status?: 'taken' | 'missed' | 'pending';
  instructions?: string;
  startDate?: string;
  endDate?: string;
  userId: string;
  timing?: 'before_food' | 'with_food' | 'after_food' | 'morning' | 'afternoon' | 'evening';
  notes?: string;
  familyMemberId?: string;
  updated_at?: string;
  created_at?: string;
}

export interface MedicationFormData {
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  instructions?: string;
  startDate: string;
  endDate?: string;
  timing?: 'before_food' | 'with_food' | 'after_food' | 'morning' | 'afternoon' | 'evening';
  notes?: string;
}

// Used to map OCR extracted data to our app format
export interface OcrMedicationData {
  medication_name?: string;
  generic_name?: string;
  dosage?: string;
  dosing_pattern?: string;
  timing?: 'before_food' | 'with_food' | 'after_food';
  instructions?: string;
  start_date?: string;
  end_date?: string;
}
