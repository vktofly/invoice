-- This script updates the handle_new_user function to do nothing,
-- effectively disabling the problematic logic without removing the trigger.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- This function is now a no-op.
  -- The user will be redirected to an organization setup page after sign-up.
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- The trigger on_auth_user_created will still fire, but it will now execute
-- this empty function, preventing any database errors during user creation.

SELECT 'Successfully updated the handle_new_user function to be a no-op.';
