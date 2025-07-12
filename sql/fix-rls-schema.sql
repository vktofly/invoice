-- This script fixes the "operator does not exist: text = uuid" error
-- by changing the data type of user/owner columns to UUID.
-- This version explicitly drops all known and potential policies before altering columns.

-- IMPORTANT: Before running, ensure that the existing text columns
-- contain valid UUIDs. If not, this script will fail.
-- It is recommended to back up your data before running this script.

-- Step 1: Drop ALL known RLS policies that depend on the columns.
-- Drop policies with specific names that might exist from previous setups.
DROP POLICY IF EXISTS invoice_owner_rw ON invoices;
DROP POLICY IF EXISTS customer_user_rw ON customers; -- Assuming a similar policy exists

-- Drop policies created with the standard names from the project files.
DROP POLICY IF EXISTS "Users can view own customers" ON customers;
DROP POLICY IF EXISTS "Users can insert own customers" ON customers;
DROP POLICY IF EXISTS "Users can update own customers" ON customers;
DROP POLICY IF EXISTS "Users can delete own customers" ON customers;

DROP POLICY IF EXISTS "Users can view own invoices" ON invoices;
DROP POLICY IF EXISTS "Users can insert own invoices" ON invoices;
DROP POLICY IF EXISTS "Users can update own invoices" ON invoices;
DROP POLICY IF EXISTS "Users can delete own invoices" ON invoices;

DROP POLICY IF EXISTS "Users can view own invoice items" ON invoice_items;
DROP POLICY IF EXISTS "Users can insert own invoice items" ON invoice_items;
DROP POLICY IF EXISTS "Users can update own invoice items" ON invoice_items;
DROP POLICY IF EXISTS "Users can delete own invoice items" ON invoice_items;

-- Step 2: Alter the column types from TEXT to UUID.
-- This can now run because the dependent policies have been dropped.
ALTER TABLE customers ALTER COLUMN user_id TYPE UUID USING user_id::uuid;
ALTER TABLE invoices ALTER COLUMN owner TYPE UUID USING owner::uuid;

-- Step 3: Recreate the RLS policies correctly.
-- No more casting is needed because the column types now match auth.uid().

-- RLS Policies for customers table
CREATE POLICY "Users can view own customers" ON customers
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own customers" ON customers
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own customers" ON customers
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own customers" ON customers
    FOR DELETE USING (user_id = auth.uid());

-- RLS Policies for invoices table
CREATE POLICY "Users can view own invoices" ON invoices
    FOR SELECT USING (owner = auth.uid());

CREATE POLICY "Users can insert own invoices" ON invoices
    FOR INSERT WITH CHECK (owner = auth.uid());

CREATE POLICY "Users can update own invoices" ON invoices
    FOR UPDATE USING (owner = auth.uid());

CREATE POLICY "Users can delete own invoices" ON invoices
    FOR DELETE USING (owner = auth.uid());

-- RLS Policies for invoice_items table
CREATE POLICY "Users can view own invoice items" ON invoice_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM invoices
            WHERE invoices.id = invoice_items.invoice_id
            AND invoices.owner = auth.uid()
        )
    );

CREATE POLICY "Users can insert own invoice items" ON invoice_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM invoices
            WHERE invoices.id = invoice_items.invoice_id
            AND invoices.owner = auth.uid()
        )
    );

CREATE POLICY "Users can update own invoice items" ON invoice_items
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM invoices
            WHERE invoices.id = invoice_items.invoice_id
            AND invoices.owner = auth.uid()
        )
    );

CREATE POLICY "Users can delete own invoice items" ON invoice_items
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM invoices
            WHERE invoices.id = invoice_items.invoice_id
            AND invoices.owner = auth.uid()
        )
    );
