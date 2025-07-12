-- V12__add_payment_gateway_details.sql

ALTER TABLE invoices
ADD COLUMN payment_gateway TEXT,
ADD COLUMN payment_gateway_order_id TEXT,
ADD COLUMN payment_gateway_payment_id TEXT;
