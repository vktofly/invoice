CREATE OR REPLACE FUNCTION get_next_invoice_number(org_id UUID)
RETURNS TEXT AS $$
DECLARE
    last_number_str TEXT;
    last_number INT;
    new_number INT;
    prefix TEXT;
BEGIN
    -- Find the latest invoice number for the given organization
    SELECT number INTO last_number_str
    FROM invoices
    WHERE organization_id = org_id
    ORDER BY created_at DESC
    LIMIT 1;

    -- Default prefix if none exists
    prefix := 'INV-';

    IF last_number_str IS NOT NULL THEN
        -- Extract prefix and number part
        prefix := substring(last_number_str from '^([A-Z]+-?)');
        last_number := CAST(substring(last_number_str from '[0-9]+$') AS INTEGER);
        new_number := last_number + 1;
    ELSE
        -- If no previous invoice, start from 1
        new_number := 1;
    END IF;

    -- Return the new invoice number with leading zeros
    RETURN prefix || LPAD(new_number::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;
