-- V9__add_shipping_details.sql

-- Add shipping details columns to the 'invoices' table
ALTER TABLE public.invoices
ADD COLUMN shipping_method TEXT,
ADD COLUMN tracking_number TEXT,
ADD COLUMN shipping_cost NUMERIC(10, 2) DEFAULT 0;

-- Add comments to explain the new columns
COMMENT ON COLUMN public.invoices.shipping_method IS 'The shipping method, e.g., ''FedEx'', ''UPS''.';
COMMENT ON COLUMN public.invoices.tracking_number IS 'The tracking number for the shipment.';
COMMENT ON COLUMN public.invoices.shipping_cost IS 'The cost of shipping.';
