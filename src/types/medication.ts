
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
  timing?: 'before_food' | 'with_food' | 'after_food';
  notes?: string;
}

export interface MedicationFormData {
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  instructions?: string;
  startDate: string;
  endDate?: string;
  timing?: 'before_food' | 'with_food' | 'after_food';
  notes?: string;
}
