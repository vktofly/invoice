-- Simple fix for customers table - can be run without authentication

-- First, let's check the current structure
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'customers' 
AND column_name = 'user_id';

-- Drop existing policies (if any)
DROP POLICY IF EXISTS "Users can view own customers" ON customers;
DROP POLICY IF EXISTS "Users can insert own customers" ON customers;
DROP POLICY IF EXISTS "Users can update own customers" ON customers;
DROP POLICY IF EXISTS "Users can delete own customers" ON customers;

-- Create a backup of existing data
CREATE TABLE customers_backup AS SELECT * FROM customers;

-- Drop the existing table
DROP TABLE customers;

-- Recreate the table with TEXT user_id
CREATE TABLE customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL, -- Changed from bigint to text
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    address TEXT,
    city TEXT,
    country TEXT,
    gstin BIGINT,
    state TEXT,
    zip BIGINT
);

-- Restore data with user_id as text
INSERT INTO customers (id, user_id, name, email, created_at, address, city, country, gstin, state, zip)
SELECT 
    id, 
    user_id::text, -- Convert bigint to text
    name, 
    email, 
    created_at, 
    address, 
    city, 
    country, 
    gstin, 
    state, 
    zip
FROM customers_backup;

-- Drop the backup table
DROP TABLE customers_backup;

-- Recreate indexes
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies using text comparison
CREATE POLICY "Users can view own customers" ON customers
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own customers" ON customers
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own customers" ON customers
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own customers" ON customers
    FOR DELETE USING (auth.uid()::text = user_id);

-- Verify the fix
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'customers' 
AND column_name = 'user_id'; 