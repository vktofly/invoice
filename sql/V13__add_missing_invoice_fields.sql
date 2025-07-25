-- Add missing columns to the 'invoices' table
ALTER TABLE invoices
ADD COLUMN IF NOT EXISTS user_company_name TEXT,
ADD COLUMN IF NOT EXISTS currency TEXT,
ADD COLUMN IF NOT EXISTS authorized_signature TEXT,
ADD COLUMN IF NOT EXISTS discount_type TEXT,
ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS shipping_method TEXT,
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS shipping_cost NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS custom_fields JSONB,
ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN,
ADD COLUMN IF NOT EXISTS recurring_frequency TEXT,
ADD COLUMN IF NOT EXISTS recurring_start_date DATE,
ADD COLUMN IF NOT EXISTS recurring_end_date DATE;

-- Add missing columns to the 'invoice_items' table
ALTER TABLE invoice_items
ADD COLUMN IF NOT EXISTS discount_type TEXT,
ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(10, 2);
