-- Add organization_id to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow individual user access to their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow individual user to update their own profile" ON public.profiles;

-- Recreate policies to include organization_id
CREATE POLICY "Allow individual user access to their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Allow individual user to update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
