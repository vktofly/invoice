-- Table for storing customer addresses
CREATE TABLE customer_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    attention TEXT,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL,
    phone TEXT,
    fax TEXT,
    is_default_billing BOOLEAN DEFAULT false,
    is_default_shipping BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Add billing and shipping address foreign keys to invoices table
ALTER TABLE invoices
ADD COLUMN billing_address_id UUID REFERENCES customer_addresses(id),
ADD COLUMN shipping_address_id UUID REFERENCES customer_addresses(id);

-- Optional: Add a view to simplify getting invoice addresses
CREATE OR REPLACE VIEW invoice_with_addresses AS
SELECT
    i.*,
    ba.address_line1 as billing_address_line1,
    ba.address_line2 as billing_address_line2,
    ba.city as billing_city,
    ba.state as billing_state,
    ba.postal_code as billing_postal_code,
    ba.country as billing_country,
    sa.address_line1 as shipping_address_line1,
    sa.address_line2 as shipping_address_line2,
    sa.city as shipping_city,
    sa.state as shipping_state,
    sa.postal_code as shipping_postal_code,
    sa.country as shipping_country
FROM
    invoices i
LEFT JOIN customer_addresses ba ON i.billing_address_id = ba.id
LEFT JOIN customer_addresses sa ON i.shipping_address_id = sa.id;