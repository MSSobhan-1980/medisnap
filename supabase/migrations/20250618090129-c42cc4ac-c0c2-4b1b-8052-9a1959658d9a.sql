
-- Create storage buckets (skip if they already exist)
INSERT INTO storage.buckets (id, name, public) 
SELECT 'prescription-images', 'prescription-images', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'prescription-images');

INSERT INTO storage.buckets (id, name, public)
SELECT 'medication-images', 'medication-images', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'medication-images');

-- Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own prescription images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own prescription images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own prescription images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own prescription images" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own medication images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own medication images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own medication images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own medication images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;

-- Create storage policies for prescription images
CREATE POLICY "Users can view their own prescription images" ON storage.objects
FOR SELECT USING (bucket_id = 'prescription-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own prescription images" ON storage.objects  
FOR INSERT WITH CHECK (bucket_id = 'prescription-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own prescription images" ON storage.objects
FOR UPDATE USING (bucket_id = 'prescription-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own prescription images" ON storage.objects
FOR DELETE USING (bucket_id = 'prescription-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policies for medication images
CREATE POLICY "Users can view their own medication images" ON storage.objects
FOR SELECT USING (bucket_id = 'medication-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own medication images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'medication-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own medication images" ON storage.objects
FOR UPDATE USING (bucket_id = 'medication-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own medication images" ON storage.objects
FOR DELETE USING (bucket_id = 'medication-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policies for avatars (public read, owner write)
CREATE POLICY "Anyone can view avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatars" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatars" ON storage.objects  
FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatars" ON storage.objects
FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create prescription_scans table for storing OCR results
CREATE TABLE IF NOT EXISTS public.prescription_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  ocr_text TEXT,
  ai_analysis JSONB,
  extracted_medications JSONB,
  scan_date TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on prescription_scans
ALTER TABLE public.prescription_scans ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for prescription_scans
CREATE POLICY "Users can view their own prescription scans" ON public.prescription_scans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own prescription scans" ON public.prescription_scans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prescription scans" ON public.prescription_scans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prescription scans" ON public.prescription_scans
  FOR DELETE USING (auth.uid() = user_id);

-- Create medication_logs table for tracking medication status changes
CREATE TABLE IF NOT EXISTS public.medication_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_id UUID REFERENCES public.medications(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  old_status TEXT,
  new_status TEXT NOT NULL,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  notes TEXT
);

-- Enable RLS on medication_logs
ALTER TABLE public.medication_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for medication_logs
CREATE POLICY "Users can view their own medication logs" ON public.medication_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own medication logs" ON public.medication_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_prescription_scans_user_id ON public.prescription_scans(user_id);
CREATE INDEX IF NOT EXISTS idx_prescription_scans_scan_date ON public.prescription_scans(scan_date);
CREATE INDEX IF NOT EXISTS idx_medication_logs_medication_id ON public.medication_logs(medication_id);
CREATE INDEX IF NOT EXISTS idx_medication_logs_user_id ON public.medication_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_medication_logs_logged_at ON public.medication_logs(logged_at);

-- Add full_name column to profiles if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'full_name') THEN
    ALTER TABLE public.profiles ADD COLUMN full_name TEXT GENERATED ALWAYS AS (
      CASE 
        WHEN first_name IS NOT NULL AND last_name IS NOT NULL THEN first_name || ' ' || last_name
        WHEN first_name IS NOT NULL THEN first_name
        WHEN last_name IS NOT NULL THEN last_name
        ELSE ''
      END
    ) STORED;
  END IF;
END
$$;

-- Create function to handle medication status updates and logging
CREATE OR REPLACE FUNCTION public.log_medication_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only log if status actually changed
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.medication_logs (medication_id, user_id, old_status, new_status)
    VALUES (NEW.id, NEW.user_id, OLD.status, NEW.status);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS medication_status_change_trigger ON public.medications;
CREATE TRIGGER medication_status_change_trigger
  AFTER UPDATE ON public.medications
  FOR EACH ROW
  EXECUTE FUNCTION public.log_medication_status_change();
