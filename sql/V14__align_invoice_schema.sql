-- V14__align_invoice_schema.sql
-- This script aligns the 'invoices' and 'invoice_items' tables with the InvoiceForm.tsx schema.
-- It is idempotent and can be run safely multiple times.

-- Align 'invoices' table
ALTER TABLE public.invoices
    ADD COLUMN IF NOT EXISTS "number" TEXT,
    ADD COLUMN IF NOT EXISTS customer_id UUID,
    ADD COLUMN IF NOT EXISTS issue_date DATE,
    ADD COLUMN IF NOT EXISTS due_date DATE,
    ADD COLUMN IF NOT EXISTS notes TEXT,
    ADD COLUMN IF NOT EXISTS logo_url TEXT,
    ADD COLUMN IF NOT EXISTS color_theme TEXT,
    ADD COLUMN IF NOT EXISTS user_company_name TEXT,
    ADD COLUMN IF NOT EXISTS user_address TEXT,
    ADD COLUMN IF NOT EXISTS user_contact TEXT,
    ADD COLUMN IF NOT EXISTS currency TEXT,
    ADD COLUMN IF NOT EXISTS authorized_signature TEXT,
    ADD COLUMN IF NOT EXISTS billing_address_id UUID,
    ADD COLUMN IF NOT EXISTS shipping_address_id UUID,
    ADD COLUMN IF NOT EXISTS discount_type TEXT,
    ADD COLUMN IF NOT EXISTS discount_amount NUMERIC,
    ADD COLUMN IF NOT EXISTS shipping_method TEXT,
    ADD COLUMN IF NOT EXISTS tracking_number TEXT,
    ADD COLUMN IF NOT EXISTS shipping_cost NUMERIC,
    ADD COLUMN IF NOT EXISTS custom_fields JSONB,
    ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN,
    ADD COLUMN IF NOT EXISTS recurring_frequency TEXT,
    ADD COLUMN IF NOT EXISTS recurring_start_date DATE,
    ADD COLUMN IF NOT EXISTS recurring_end_date DATE;

-- Align 'invoice_items' table
ALTER TABLE public.invoice_items
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS quantity INTEGER,
    ADD COLUMN IF NOT EXISTS unit_price NUMERIC,
    ADD COLUMN IF NOT EXISTS tax_rate NUMERIC,
    ADD COLUMN IF NOT EXISTS discount_type TEXT,
    ADD COLUMN IF NOT EXISTS discount_amount NUMERIC;
