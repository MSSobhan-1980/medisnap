
-- Add status column to medications table
ALTER TABLE public.medications ADD COLUMN status TEXT DEFAULT 'pending' CHECK (status IN ('taken', 'missed', 'pending'));
