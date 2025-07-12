
-- recurring-invoices-schema.sql

CREATE TABLE recurring_invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  customer_id UUID REFERENCES customers(id) NOT NULL,
  frequency TEXT NOT NULL, -- 'daily', 'weekly', 'monthly', 'yearly'
  start_date DATE NOT NULL,
  end_date DATE,
  last_generated_date DATE,
  next_generation_date DATE,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'paused', 'finished'
  invoice_template JSONB NOT NULL, -- Store a template of the invoice to be created
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE recurring_invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own recurring invoices" ON recurring_invoices
  FOR ALL
  USING (auth.uid() = user_id);
