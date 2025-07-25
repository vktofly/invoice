-- Add settings columns to the profiles table
-- This ensures the settings page can store user preferences.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'light',
  ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS date_format TEXT DEFAULT 'MM/DD/YYYY';
