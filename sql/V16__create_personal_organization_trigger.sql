-- Create the function to be called by the trigger
CREATE OR REPLACE FUNCTION public.create_personal_organization()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert a new organization for the new user
  INSERT INTO public.organizations (created_by, name, currency)
  VALUES (
    NEW.id,
    NEW.email || '''s Workspace', -- e.g., "user@example.com's Workspace"
    'USD' -- Default currency
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger that fires after a new user is created
CREATE TRIGGER on_new_user_create_personal_organization
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.create_personal_organization();
