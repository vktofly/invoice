-- Schema for the recurring invoices feature

-- This table stores the definition of a recurring invoice.
CREATE TABLE IF NOT EXISTS recurring_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    organization_id UUID REFERENCES organizations(id) NOT NULL,
    customer_id UUID REFERENCES customers(id) NOT NULL,
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'paused', 'finished'
    frequency TEXT NOT NULL, -- 'daily', 'weekly', 'monthly', 'quarterly', 'yearly'
    start_date DATE NOT NULL,
    end_date DATE,
    next_generation_date DATE NOT NULL,
    invoice_template JSONB NOT NULL, -- Stores the template for generating invoices
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- This table logs the invoices that are generated from a recurring invoice.
CREATE TABLE IF NOT EXISTS generated_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recurring_invoice_id UUID REFERENCES recurring_invoices(id) ON DELETE CASCADE NOT NULL,
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE NOT NULL,
    generation_date TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE recurring_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_invoices ENABLE ROW LEVEL SECURITY;

-- RLS Policies for 'recurring_invoices'
DROP POLICY IF EXISTS "Users can view own recurring invoices" ON recurring_invoices;
CREATE POLICY "Users can view own recurring invoices" ON recurring_invoices
    FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own recurring invoices" ON recurring_invoices;
CREATE POLICY "Users can insert own recurring invoices" ON recurring_invoices
    FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own recurring invoices" ON recurring_invoices;
CREATE POLICY "Users can update own recurring invoices" ON recurring_invoices
    FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own recurring invoices" ON recurring_invoices;
CREATE POLICY "Users can delete own recurring invoices" ON recurring_invoices
    FOR DELETE USING (user_id = auth.uid());

-- RLS Policies for 'generated_invoices'
DROP POLICY IF EXISTS "Users can view own generated invoices" ON generated_invoices;
CREATE POLICY "Users can view own generated invoices" ON generated_invoices
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM recurring_invoices
            WHERE recurring_invoices.id = generated_invoices.recurring_invoice_id
            AND recurring_invoices.user_id = auth.uid()
        )
    );