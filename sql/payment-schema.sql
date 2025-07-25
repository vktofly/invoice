-- This script sets up the payments table and related database objects.
-- It is designed to be idempotent, meaning it can be run multiple times without causing errors.

-- 1. Create the payments table if it doesn't exist
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add an index for performance if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON payments(invoice_id);

-- 3. Add the payment_id column to the invoice activity table if it doesn't exist
-- This is now handled in the `invoice-activity-schema.sql` file, but we need to ensure
-- the column is added if that script hasn't been run yet.
ALTER TABLE invoice_activity ADD COLUMN IF NOT EXISTS payment_id UUID REFERENCES payments(id) ON DELETE SET NULL;


-- 4. Create or replace the function to update invoice status automatically
CREATE OR REPLACE FUNCTION update_invoice_status_after_payment()
RETURNS TRIGGER AS $$
DECLARE
    total_paid NUMERIC;
    invoice_total NUMERIC;
BEGIN
    -- Calculate the total amount paid for the invoice
    SELECT SUM(amount) INTO total_paid
    FROM payments
    WHERE invoice_id = NEW.invoice_id;

    -- Get the total of the invoice
    SELECT total_amount INTO invoice_total
    FROM invoices
    WHERE id = NEW.invoice_id;

    -- If total paid is greater than or equal to the invoice total, mark as 'paid'
    IF total_paid >= invoice_total THEN
        UPDATE invoices
        SET status = 'paid'
        WHERE id = NEW.invoice_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Create the trigger, ensuring it's not duplicated
DROP TRIGGER IF EXISTS trigger_update_invoice_status ON payments;
CREATE TRIGGER trigger_update_invoice_status
AFTER INSERT ON payments
FOR EACH ROW
EXECUTE FUNCTION update_invoice_status_after_payment();