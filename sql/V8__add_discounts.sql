-- V8__add_discounts.sql

-- Add discount columns to the 'invoices' table
-- This allows for an overall discount on the entire invoice
ALTER TABLE public.invoices
ADD COLUMN discount_type TEXT,
ADD COLUMN discount_amount NUMERIC(10, 2) DEFAULT 0;

-- Add discount columns to the 'invoice_items' table
-- This allows for discounts on individual line items
ALTER TABLE public.invoice_items
ADD COLUMN discount_type TEXT,
ADD COLUMN discount_amount NUMERIC(10, 2) DEFAULT 0;

-- Add a comment to explain the new columns
COMMENT ON COLUMN public.invoices.discount_type IS 'The type of discount, e.g., ''percentage'' or ''fixed''.';
COMMENT ON COLUMN public.invoices.discount_amount IS 'The value of the discount.';
COMMENT ON COLUMN public.invoice_items.discount_type IS 'The type of discount for the line item, e.g., ''percentage'' or ''fixed''.';
COMMENT ON COLUMN public.invoice_items.discount_amount IS 'The value of the discount for the line item.';
