
-- Create family_members table for managing family members
CREATE TABLE public.family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  primary_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create medications table for storing medication information
CREATE TABLE public.medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  time TEXT NOT NULL,
  instructions TEXT,
  start_date DATE,
  end_date DATE,
  timing TEXT CHECK (timing IN ('before_food', 'with_food', 'after_food', 'morning', 'afternoon', 'evening')),
  notes TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  family_member_id UUID REFERENCES public.family_members(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create medication_reminders table for storing medication reminders
CREATE TABLE public.medication_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_id UUID REFERENCES public.medications(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  family_member_id UUID REFERENCES public.family_members(id) ON DELETE CASCADE,
  reminder_time TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_reminders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for family_members
CREATE POLICY "Users can view their own family members" ON public.family_members
  FOR SELECT USING (auth.uid() = primary_user_id);

CREATE POLICY "Users can insert their own family members" ON public.family_members
  FOR INSERT WITH CHECK (auth.uid() = primary_user_id);

CREATE POLICY "Users can update their own family members" ON public.family_members
  FOR UPDATE USING (auth.uid() = primary_user_id);

CREATE POLICY "Users can delete their own family members" ON public.family_members
  FOR DELETE USING (auth.uid() = primary_user_id);

-- Create RLS policies for medications
CREATE POLICY "Users can view their own medications" ON public.medications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own medications" ON public.medications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own medications" ON public.medications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own medications" ON public.medications
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for medication_reminders
CREATE POLICY "Users can view their own medication reminders" ON public.medication_reminders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own medication reminders" ON public.medication_reminders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own medication reminders" ON public.medication_reminders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own medication reminders" ON public.medication_reminders
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_family_members_primary_user_id ON public.family_members(primary_user_id);
CREATE INDEX idx_medications_user_id ON public.medications(user_id);
CREATE INDEX idx_medications_family_member_id ON public.medications(family_member_id);
CREATE INDEX idx_medication_reminders_user_id ON public.medication_reminders(user_id);
CREATE INDEX idx_medication_reminders_medication_id ON public.medication_reminders(medication_id);
