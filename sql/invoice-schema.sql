-- This script defines the schema for the 'invoices' and 'invoice_items' tables.
-- It is based on the fields and data types inferred from the application's API routes and components.

-- It is recommended to run this in a development environment first.
-- If these tables already exist, you may need to use 'ALTER TABLE' instead
-- or drop the existing tables if they do not contain critical data.

-- Create the 'invoices' table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner UUID REFERENCES auth.users(id) NOT NULL,
    customer_id UUID REFERENCES customers(id) NOT NULL,
    billing_address_id UUID REFERENCES customer_addresses(id),
    shipping_address_id UUID REFERENCES customer_addresses(id),
    number TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft', -- e.g., 'draft', 'sent', 'paid', 'overdue'
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    subtotal NUMERIC(10, 2),
    tax_amount NUMERIC(10, 2),
    tax_rate NUMERIC(5, 2),
    notes TEXT,
    logo_url TEXT,
    color_theme TEXT,
    user_address TEXT,
    user_contact TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the 'invoice_items' table
CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE NOT NULL,
    description TEXT NOT NULL,
    quantity INT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    tax_rate NUMERIC(5, 2) DEFAULT 0,
    line_total NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on the new tables
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for 'invoices' table
-- These policies should already be in your 'fix-rls-schema.sql' file,
-- but are included here for completeness.

DROP POLICY IF EXISTS "Users can view own invoices" ON invoices;
CREATE POLICY "Users can view own invoices" ON invoices
    FOR SELECT USING (owner = auth.uid());

DROP POLICY IF EXISTS "Users can insert own invoices" ON invoices;
CREATE POLICY "Users can insert own invoices" ON invoices
    FOR INSERT WITH CHECK (owner = auth.uid());

DROP POLICY IF EXISTS "Users can update own invoices" ON invoices;
CREATE POLICY "Users can update own invoices" ON invoices
    FOR UPDATE USING (owner = auth.uid());

DROP POLICY IF EXISTS "Users can delete own invoices" ON invoices;
CREATE POLICY "Users can delete own invoices" ON invoices
    FOR DELETE USING (owner = auth.uid());


-- RLS Policies for 'invoice_items' table
-- These policies should also be in your 'fix-rls-schema.sql' file.

DROP POLICY IF EXISTS "Users can view own invoice items" ON invoice_items;
CREATE POLICY "Users can view own invoice items" ON invoice_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM invoices
            WHERE invoices.id = invoice_items.invoice_id
            AND invoices.owner = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert own invoice items" ON invoice_items;
CREATE POLICY "Users can insert own invoice items" ON invoice_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM invoices
            WHERE invoices.id = invoice_items.invoice_id
            AND invoices.owner = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update own invoice items" ON invoice_items;
CREATE POLICY "Users can update own invoice items" ON invoice_items
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM invoices
            WHERE invoices.id = invoice_items.invoice_id
            AND invoices.owner = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete own invoice items" ON invoice_items;
CREATE POLICY "Users can delete own invoice items" ON invoice_items
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM invoices
            WHERE invoices.id = invoice_items.invoice_id
            AND invoices.owner = auth.uid()
        )
    );
