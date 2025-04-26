
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
}

export interface MedicationFormData {
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  instructions?: string;
  startDate: string;
  endDate?: string;
}
