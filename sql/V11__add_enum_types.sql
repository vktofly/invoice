-- V11__add_enum_types.sql

-- Create ENUM types
CREATE TYPE customer_type_enum AS ENUM ('Business', 'Individual');
CREATE TYPE salutation_enum AS ENUM ('Mr.', 'Mrs.', 'Ms.');
CREATE TYPE currency_enum AS ENUM ('INR', 'USD', 'EUR', 'GBP');
CREATE TYPE payment_terms_enum AS ENUM ('Due on Receipt', 'Net 15', 'Net 30', 'Net 60');
CREATE TYPE discount_type_enum AS ENUM ('percentage', 'fixed');

-- Alter customers table
ALTER TABLE public.customers
    ALTER COLUMN customer_type TYPE customer_type_enum USING customer_type::customer_type_enum,
    ALTER COLUMN salutation TYPE salutation_enum USING salutation::salutation_enum,
    ALTER COLUMN currency TYPE currency_enum USING currency::currency_enum,
    ALTER COLUMN payment_terms TYPE payment_terms_enum USING payment_terms::payment_terms_enum;

-- Alter invoices table
ALTER TABLE public.invoices
    ALTER COLUMN discount_type TYPE discount_type_enum USING discount_type::discount_type_enum;

-- Alter invoice_items table
ALTER TABLE public.invoice_items
    ALTER COLUMN discount_type TYPE discount_type_enum USING discount_type::discount_type_enum;
