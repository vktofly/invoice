-- This migration removes the trigger and function responsible for automatic profile creation on user sign-up.
-- This functionality is being replaced by a guided onboarding flow after registration.

-- Drop the function and any dependent triggers (like on_auth_signup or on_auth_user_created)
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

SELECT 'Successfully removed handle_new_user function and dependent triggers.'; 