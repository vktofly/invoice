-- Add the 'created_by' column to the 'organizations' table
ALTER TABLE public.organizations
ADD COLUMN created_by UUID;

-- Add a foreign key constraint to link 'created_by' to the 'auth.users' table
ALTER TABLE public.organizations
ADD CONSTRAINT fk_organizations_created_by
FOREIGN KEY (created_by)
REFERENCES auth.users(id)
ON DELETE SET NULL;

-- Enable Row-Level Security (RLS) on the 'organizations' table
ALTER TABLE public.organizations
ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to see only their own organizations
CREATE POLICY "Users can view their own organizations"
ON public.organizations
FOR SELECT
USING (auth.uid() = created_by);

-- Create a policy that allows users to insert new organizations for themselves
CREATE POLICY "Users can create organizations"
ON public.organizations
FOR INSERT
WITH CHECK (auth.uid() = created_by);

-- Create a policy that allows users to update their own organizations
CREATE POLICY "Users can update their own organizations"
ON public.organizations
FOR UPDATE
USING (auth.uid() = created_by);
