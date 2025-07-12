-- V10__add_custom_fields.sql

ALTER TABLE public.invoices
ADD COLUMN custom_fields JSONB;

COMMENT ON COLUMN public.invoices.custom_fields IS 'Arbitrary key-value pairs for custom data.';
