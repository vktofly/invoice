-- Database Schema for Invoice Application (Fixed for UUID/bigint mismatch)

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL, -- Use TEXT to handle both UUID and bigint
    name TEXT,
    email TEXT NOT NULL,
    address TEXT,
    city TEXT,
    state TEXT,
    zip TEXT,
    country TEXT,
    gstin TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Additional fields for full customer registration
    customer_type TEXT, -- Business or Individual
    salutation TEXT,
    first_name TEXT,
    last_name TEXT,
    company_name TEXT,
    display_name TEXT,
    currency TEXT,
    work_phone TEXT,
    mobile TEXT,
    pan TEXT,
    payment_terms TEXT,
    portal_language TEXT,
    -- Address fields
    billing_attention TEXT,
    billing_country TEXT,
    billing_address1 TEXT,
    billing_address2 TEXT,
    billing_city TEXT,
    billing_state TEXT,
    billing_pin TEXT,
    billing_phone TEXT,
    billing_fax TEXT,
    shipping_attention TEXT,
    shipping_country TEXT,
    shipping_address1 TEXT,
    shipping_address2 TEXT,
    shipping_city TEXT,
    shipping_state TEXT,
    shipping_pin TEXT,
    shipping_phone TEXT,
    shipping_fax TEXT,
    -- Other details fields
    website TEXT,
    department TEXT,
    designation TEXT,
    twitter TEXT,
    skype TEXT,
    facebook TEXT
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- Enable Row Level Security (RLS)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own customers
CREATE POLICY "Users can view own customers" ON customers
    FOR SELECT USING (auth.uid()::text = user_id);

-- RLS Policy: Users can insert their own customers
CREATE POLICY "Users can insert own customers" ON customers
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- RLS Policy: Users can update their own customers
CREATE POLICY "Users can update own customers" ON customers
    FOR UPDATE USING (auth.uid()::text = user_id);

-- RLS Policy: Users can delete their own customers
CREATE POLICY "Users can delete own customers" ON customers
    FOR DELETE USING (auth.uid()::text = user_id);

-- Invoices table (if not already exists)
CREATE TABLE IF NOT EXISTS invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    number TEXT,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    owner TEXT NOT NULL, -- Use TEXT to handle both UUID and bigint
    issue_date DATE,
    due_date DATE,
    status TEXT DEFAULT 'draft',
    subtotal DECIMAL(10,2) DEFAULT 0,
    tax DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) DEFAULT 0,
    payment_terms TEXT,
    notes TEXT,
    place_of_supply TEXT,
    po_number TEXT,
    ship_to_name TEXT,
    ship_to_address TEXT,
    ship_to_city TEXT,
    ship_to_state TEXT,
    ship_to_zip TEXT,
    ship_to_country TEXT,
    ship_to_gstin TEXT,
    subject TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoice items table (if not already exists)
CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    tax_rate DECIMAL(5,2) DEFAULT 0,
    line_total DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for invoices
CREATE INDEX IF NOT EXISTS idx_invoices_owner ON invoices(owner);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

-- Create indexes for invoice_items
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);

-- Enable RLS on invoices
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own invoices
CREATE POLICY "Users can view own invoices" ON invoices
    FOR SELECT USING (auth.uid()::text = owner);

-- RLS Policy: Users can insert their own invoices
CREATE POLICY "Users can insert own invoices" ON invoices
    FOR INSERT WITH CHECK (auth.uid()::text = owner);

-- RLS Policy: Users can update their own invoices
CREATE POLICY "Users can update own invoices" ON invoices
    FOR UPDATE USING (auth.uid()::text = owner);

-- RLS Policy: Users can delete their own invoices
CREATE POLICY "Users can delete own invoices" ON invoices
    FOR DELETE USING (auth.uid()::text = owner);

-- Enable RLS on invoice_items
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see invoice items for their own invoices
CREATE POLICY "Users can view own invoice items" ON invoice_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM invoices 
            WHERE invoices.id = invoice_items.invoice_id 
            AND invoices.owner = auth.uid()::text
        )
    );

-- RLS Policy: Users can insert invoice items for their own invoices
CREATE POLICY "Users can insert own invoice items" ON invoice_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM invoices 
            WHERE invoices.id = invoice_items.invoice_id 
            AND invoices.owner = auth.uid()::text
        )
    );

-- RLS Policy: Users can update invoice items for their own invoices
CREATE POLICY "Users can update own invoice items" ON invoice_items
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM invoices 
            WHERE invoices.id = invoice_items.invoice_id 
            AND invoices.owner = auth.uid()::text
        )
    );

-- RLS Policy: Users can delete invoice items for their own invoices
CREATE POLICY "Users can delete own invoice items" ON invoice_items
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM invoices 
            WHERE invoices.id = invoice_items.invoice_id 
            AND invoices.owner = auth.uid()::text
        )
    ); 