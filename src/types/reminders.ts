
export interface MedicationReminder {
  id: string;
  medication_id: string;
  user_id: string;
  family_member_id?: string | null;
  reminder_time: string;
  is_enabled: boolean;
  created_at: string;
}

export interface ReminderOptions {
  family_member_id?: string | null;
}

export interface RemindersState {
  reminders: MedicationReminder[];
  loading: boolean;
  error: string | null;
}
