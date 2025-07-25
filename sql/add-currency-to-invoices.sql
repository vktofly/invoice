-- Add currency to invoices table
ALTER TABLE invoices
ADD COLUMN currency TEXT NOT NULL DEFAULT 'USD';

-- Add a comment to describe the change
COMMENT ON COLUMN invoices.currency IS 'The currency code for the invoice, e.g., USD, EUR, INR.';
