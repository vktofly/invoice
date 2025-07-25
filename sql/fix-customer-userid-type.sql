-- Step 1: Drop the old RLS policies for the 'customers' table that use a cast.
DROP POLICY IF EXISTS "Users can view own customers" ON customers;
DROP POLICY IF EXISTS "Users can insert own customers" ON customers;
DROP POLICY IF EXISTS "Users can update own customers" ON customers;
DROP POLICY IF EXISTS "Users can delete own customers" ON customers;

-- Step 2: Alter the column type. 
-- This assumes you have a way to correctly map old bigint IDs to new UUIDs if needed.
-- For a clean setup, we are setting the type and adding a proper foreign key.
ALTER TABLE customers
  ALTER COLUMN user_id TYPE UUID USING user_id::uuid;

-- Step 3: Add a foreign key constraint to auth.users to ensure integrity.
-- This might fail if there are user_id values in 'customers' that don't exist in 'auth.users'.
ALTER TABLE customers
  ADD CONSTRAINT fk_auth_users
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 4: Recreate the RLS policies without the cast, which is now unnecessary and more robust.
CREATE POLICY "Users can view their own customers" ON customers
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own customers" ON customers
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own customers" ON customers
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own customers" ON customers
  FOR DELETE USING (user_id = auth.uid());

-- A comment to explain the change for future reference.
COMMENT ON COLUMN customers.user_id IS 'Changed from bigint to UUID to directly reference auth.users.id. RLS policies updated accordingly.';
