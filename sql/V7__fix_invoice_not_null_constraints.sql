-- V7: Final script to fix all NOT NULL constraint issues for the 'invoices' table.
-- This script is comprehensive and idempotent. It can be run safely multiple times.

-- Step 1: Ensure all required columns exist.
-- This adds any columns that might be missing from previous partial migrations.
ALTER TABLE invoices
ADD COLUMN IF NOT EXISTS subtotal NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS tax_amount NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS total_amount NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS tax NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS total NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS tax_rate NUMERIC(5, 2),
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS color_theme TEXT,
ADD COLUMN IF NOT EXISTS user_company_name TEXT,
ADD COLUMN IF NOT EXISTS user_address TEXT,
ADD COLUMN IF NOT EXISTS user_contact TEXT,
ADD COLUMN IF NOT EXISTS currency TEXT,
ADD COLUMN IF NOT EXISTS authorized_signature TEXT,
ADD COLUMN IF NOT EXISTS billing_address_id UUID REFERENCES customer_addresses(id),
ADD COLUMN IF NOT EXISTS shipping_address_id UUID REFERENCES customer_addresses(id);

-- Step 2: Update all existing NULL values to a default of 0 for all critical numeric columns.
-- This is the crucial step to prevent the 'contains null values' error during the next step.
UPDATE invoices
SET
    subtotal = COALESCE(subtotal, 0),
    tax_amount = COALESCE(tax_amount, 0),
    total_amount = COALESCE(total_amount, 0),
    tax = COALESCE(tax, 0),
    total = COALESCE(total, 0),
    tax_rate = COALESCE(tax_rate, 0);

-- Step 3: Apply NOT NULL constraints and set default values for all critical numeric columns.
-- This ensures that any future invoice insertions will not fail if these fields are omitted.
ALTER TABLE invoices
ALTER COLUMN subtotal SET DEFAULT 0,
ALTER COLUMN subtotal SET NOT NULL;

ALTER TABLE invoices
ALTER COLUMN tax_amount SET DEFAULT 0,
ALTER COLUMN tax_amount SET NOT NULL;

ALTER TABLE invoices
ALTER COLUMN total_amount SET DEFAULT 0,
ALTER COLUMN total_amount SET NOT NULL;

ALTER TABLE invoices
ALTER COLUMN tax SET DEFAULT 0,
ALTER COLUMN tax SET NOT NULL;

ALTER TABLE invoices
ALTER COLUMN total SET DEFAULT 0,
ALTER COLUMN total SET NOT NULL;

ALTER TABLE invoices
ALTER COLUMN tax_rate SET DEFAULT 0,
ALTER COLUMN tax_rate SET NOT NULL;
