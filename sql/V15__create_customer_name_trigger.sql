-- V15: Create trigger to automatically update customer name and display_name

-- First, create the function that will be executed by the trigger.
CREATE OR REPLACE FUNCTION public.update_customer_name_and_display_name()
RETURNS TRIGGER AS $$
BEGIN
    -- For 'Individual' customers, concatenate first and last names.
    -- For 'Company' customers, use the company name.
    IF NEW.customer_type = 'Individual' THEN
        NEW.name := TRIM(CONCAT(NEW.first_name, ' ', NEW.last_name));
        NEW.display_name := TRIM(CONCAT(NEW.first_name, ' ', NEW.last_name));
    ELSIF NEW.customer_type = 'Company' THEN
        NEW.name := NEW.company_name;
        NEW.display_name := NEW.company_name;
    END IF;

    -- If display_name is still empty for any reason, fall back to a default.
    IF NEW.display_name IS NULL OR NEW.display_name = '' THEN
        NEW.display_name := NEW.name;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it already exists to ensure a clean setup
DROP TRIGGER IF EXISTS set_customer_name_and_display_name ON public.customers;

-- Then, create the trigger on the customers table.
-- This trigger will fire before any INSERT or UPDATE operation.
CREATE TRIGGER set_customer_name_and_display_name
BEFORE INSERT OR UPDATE ON public.customers
FOR EACH ROW
EXECUTE FUNCTION public.update_customer_name_and_display_name();
