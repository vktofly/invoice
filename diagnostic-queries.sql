-- Diagnostic Queries to understand your Supabase setup

-- 1. Check the data type of auth.users.id
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'auth' 
AND table_name = 'users' 
AND column_name = 'id';

-- 2. Check what auth.uid() returns
SELECT 
    auth.uid() as current_user_id,
    pg_typeof(auth.uid()) as user_id_type;

-- 3. Check if you're authenticated
SELECT 
    CASE 
        WHEN auth.uid() IS NOT NULL THEN 'Authenticated'
        ELSE 'Not authenticated'
    END as auth_status;

-- 4. Check existing tables structure (if any)
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('customers', 'invoices', 'invoice_items')
ORDER BY table_name, ordinal_position; 