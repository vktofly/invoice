-- This script creates a new organization for a new user.
-- It is intended to be used as a Supabase function.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.organizations (owner, name, industry, country, state, currency, language, timezone)
  VALUES (NEW.id, 'My Organization', 'Other', 'United States', 'California', 'USD', 'English', 'UTC');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger to execute the function on new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

SELECT 'Successfully created handle_new_user function and trigger.';
