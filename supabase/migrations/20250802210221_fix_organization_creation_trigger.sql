-- Grant auth admin role to postgres user to allow trigger to read user metadata
GRANT supabase_auth_admin TO postgres;

-- Drop the existing trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create the function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the user's role is 'owner' from the metadata
  IF NEW.raw_user_meta_data->>'role' = 'owner' THEN
    INSERT INTO public.organizations (owner, created_by, name, industry, country, state, currency, language, timezone)
    VALUES (NEW.id, NEW.id, 'My Organization', 'Other', 'United States', 'California', 'USD', 'English', 'UTC');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger to execute the function on new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

SELECT 'Successfully created handle_new_user function and trigger.';
