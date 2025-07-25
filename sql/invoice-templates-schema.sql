
-- invoice-templates-schema.sql

CREATE TABLE invoice_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  template_name TEXT NOT NULL,
  template_data JSONB NOT NULL, -- Store a template of the invoice
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE invoice_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own invoice templates" ON invoice_templates
  FOR ALL
  USING (auth.uid() = user_id);
