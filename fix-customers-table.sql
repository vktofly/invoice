-- Fix customers table to use TEXT for user_id to avoid UUID/bigint casting issues

-- First, drop existing policies
DROP POLICY IF EXISTS "Users can view own customers" ON customers;
DROP POLICY IF EXISTS "Users can insert own customers" ON customers;
DROP POLICY IF EXISTS "Users can update own customers" ON customers;
DROP POLICY IF EXISTS "Users can delete own customers" ON customers;

-- Create a temporary table with the correct structure
CREATE TABLE customers_new (
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

-- Copy data from old table to new table
INSERT INTO customers_new (id, user_id, name, email, created_at, address, city, country, gstin, state, zip)
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
FROM customers;

-- Drop the old table
DROP TABLE customers;

-- Rename the new table
ALTER TABLE customers_new RENAME TO customers;

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