-- This script creates the 'invoice_activity' table to track events related to an invoice.

CREATE TABLE IF NOT EXISTS invoice_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    activity_type VARCHAR(50) NOT NULL, -- e.g., 'invoice_created', 'payment_recorded'
    comments TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add an index for performance
CREATE INDEX IF NOT EXISTS idx_invoice_activity_invoice_id ON invoice_activity(invoice_id);

-- Enable Row Level Security
ALTER TABLE invoice_activity ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view activity for their own invoices
CREATE POLICY "Users can view activity for their own invoices" ON invoice_activity
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM invoices
            WHERE invoices.id = invoice_activity.invoice_id
            AND invoices.owner = auth.uid()
        )
    );
