-- Create the table only if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_roles (
    user_id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL
);

-- Enable RLS if it's not already enabled
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow all access to service_role" ON public.user_roles;
DROP POLICY IF EXISTS "Allow individual user read access" ON public.user_roles;

-- Recreate policies to ensure they are correct
CREATE POLICY "Allow all access to service_role"
ON public.user_roles
FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow individual user read access"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);