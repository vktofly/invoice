-- This migration removes the trigger and function for creating an organization on new user signup.
-- This logic will be moved to the application layer.

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
