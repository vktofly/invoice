
-- invoice-attachments-schema.sql

CREATE TABLE invoice_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID REFERENCES invoices(id) NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL, -- This will store the path in Supabase Storage
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE invoice_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage attachments for their own invoices" ON invoice_attachments
  FOR ALL
  USING (EXISTS (SELECT 1 FROM invoices WHERE invoices.id = invoice_id AND auth.uid() = invoices.owner));
