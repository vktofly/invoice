-- Test queries to understand auth.uid() behavior

-- 1. Check what auth.uid() returns
SELECT 
    auth.uid() as current_user_id,
    pg_typeof(auth.uid()) as user_id_type;

-- 2. Try to convert auth.uid() to bigint
SELECT 
    auth.uid() as original_uid,
    auth.uid()::text as uid_as_text,
    CASE 
        WHEN auth.uid() IS NOT NULL THEN 
            (SELECT substring(auth.uid()::text from 1 for 8)::bigint)
        ELSE NULL 
    END as uid_as_bigint;

-- 3. Alternative approach - use text comparison
SELECT 
    auth.uid() as current_uid,
    auth.uid()::text as uid_text;

-- 4. Check if we can use a different approach for RLS
SELECT 
    CASE 
        WHEN auth.uid() IS NOT NULL THEN 'Authenticated'
        ELSE 'Not authenticated'
    END as auth_status; 