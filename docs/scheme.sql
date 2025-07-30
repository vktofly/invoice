-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.audit_logs (
  id integer NOT NULL DEFAULT nextval('audit_logs_id_seq'::regclass),
  action text NOT NULL,
  user_id uuid,
  target_id text,
  details jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT audit_logs_pkey PRIMARY KEY (id)
);
CREATE TABLE public.customer_addresses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  customer_id uuid,
  address_line1 text NOT NULL,
  address_line2 text,
  city text NOT NULL,
  state text NOT NULL,
  postal_code text NOT NULL,
  country text NOT NULL,
  is_default_billing boolean DEFAULT false,
  is_default_shipping boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT customer_addresses_pkey PRIMARY KEY (id),
  CONSTRAINT customer_addresses_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id)
);
CREATE TABLE public.customers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL DEFAULT ''::text,
  email text NOT NULL,
  created_at timestamp without time zone,
  address text,
  city text,
  country text,
  gstin bigint,
  state text,
  zip bigint,
  auth_user_id uuid,
  salutation USER-DEFINED,
  first_name text,
  last_name text,
  display_name text,
  currency USER-DEFINED,
  work_phone text,
  mobile text,
  pan text,
  payment_terms USER-DEFINED,
  portal_language text,
  billing_attention text,
  billing_country text,
  billing_address1 text,
  billing_address2 text,
  billing_city text,
  billing_state text,
  billing_pin text,
  billing_phone text,
  billing_fax text,
  shipping_attention text,
  shipping_country text,
  shipping_address1 text,
  shipping_address2 text,
  shipping_city text,
  shipping_state text,
  shipping_pin text,
  shipping_phone text,
  shipping_fax text,
  website text,
  department text,
  designation text,
  twitter text,
  skype text,
  facebook text,
  allowlogin boolean DEFAULT false,
  customer_type USER-DEFINED,
  company_name text,
  CONSTRAINT customers_pkey PRIMARY KEY (id),
  CONSTRAINT customers_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT fk_auth_users FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.expenses (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  organization_id uuid NOT NULL,
  category text,
  description text,
  amount numeric NOT NULL,
  expense_date date NOT NULL,
  receipt_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT expenses_pkey PRIMARY KEY (id),
  CONSTRAINT expenses_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id),
  CONSTRAINT expenses_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.generated_invoices (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  recurring_invoice_id uuid NOT NULL,
  invoice_id uuid NOT NULL,
  generation_date timestamp with time zone DEFAULT now(),
  CONSTRAINT generated_invoices_pkey PRIMARY KEY (id),
  CONSTRAINT generated_invoices_recurring_invoice_id_fkey FOREIGN KEY (recurring_invoice_id) REFERENCES public.recurring_invoices(id),
  CONSTRAINT generated_invoices_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id)
);
CREATE TABLE public.invoice_activity (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL,
  user_id uuid,
  activity_type character varying NOT NULL,
  comments text,
  created_at timestamp with time zone DEFAULT now(),
  payment_id uuid,
  CONSTRAINT invoice_activity_pkey PRIMARY KEY (id),
  CONSTRAINT invoice_activity_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payments(id),
  CONSTRAINT invoice_activity_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT invoice_activity_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id)
);
CREATE TABLE public.invoice_attachments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  invoice_id uuid NOT NULL,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint NOT NULL,
  file_type text NOT NULL,
  uploaded_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT invoice_attachments_pkey PRIMARY KEY (id),
  CONSTRAINT invoice_attachments_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES auth.users(id),
  CONSTRAINT invoice_attachments_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id)
);
CREATE TABLE public.invoice_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  invoice_id uuid,
  description text,
  quantity numeric,
  unit_price numeric,
  amount numeric,
  line_total double precision,
  tax_rate numeric NOT NULL DEFAULT 0,
  discount_type USER-DEFINED,
  discount_amount numeric DEFAULT 0,
  CONSTRAINT invoice_items_pkey PRIMARY KEY (id),
  CONSTRAINT invoice_items_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id)
);
CREATE TABLE public.invoice_status_history (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  invoice_id uuid,
  old_status USER-DEFINED,
  new_status USER-DEFINED,
  changed_by uuid,
  changed_at timestamp without time zone DEFAULT now(),
  CONSTRAINT invoice_status_history_pkey PRIMARY KEY (id),
  CONSTRAINT invoice_status_history_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id),
  CONSTRAINT invoice_status_history_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES auth.users(id)
);
CREATE TABLE public.invoice_templates (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  organization_id uuid NOT NULL,
  template_name text NOT NULL,
  template_data jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT invoice_templates_pkey PRIMARY KEY (id),
  CONSTRAINT invoice_templates_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT invoice_templates_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id)
);
CREATE TABLE public.invoices (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  owner uuid NOT NULL,
  customer_id uuid NOT NULL,
  number text UNIQUE,
  issue_date date DEFAULT CURRENT_DATE,
  due_date date,
  status USER-DEFINED DEFAULT 'draft'::invoice_status,
  subtotal numeric NOT NULL DEFAULT 0,
  tax numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  notes text,
  created_at timestamp without time zone DEFAULT now(),
  payment_terms text,
  currency text NOT NULL DEFAULT 'USD'::text,
  billing_address_id uuid,
  shipping_address_id uuid,
  user_company_name text,
  authorized_signature text,
  color_theme text,
  logo_url text,
  user_address text,
  user_contact text,
  tax_amount numeric NOT NULL DEFAULT 0,
  total_amount numeric NOT NULL DEFAULT 0,
  tax_rate numeric NOT NULL DEFAULT 0,
  shipping_method text,
  tracking_number text,
  shipping_cost numeric DEFAULT 0,
  discount_type USER-DEFINED,
  discount_amount numeric DEFAULT 0,
  custom_fields text,
  payment_gateway text,
  payment_gateway_order_id text,
  payment_gateway_payment_id text,
  is_recurring boolean,
  recurring_frequency text,
  recurring_start_date date,
  recurring_end_date date,
  update_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT invoices_pkey PRIMARY KEY (id),
  CONSTRAINT invoices_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id),
  CONSTRAINT invoices_shipping_address_id_fkey FOREIGN KEY (shipping_address_id) REFERENCES public.customer_addresses(id),
  CONSTRAINT invoices_billing_address_id_fkey FOREIGN KEY (billing_address_id) REFERENCES public.customer_addresses(id),
  CONSTRAINT invoices_owner_fkey FOREIGN KEY (owner) REFERENCES auth.users(id)
);
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  message text NOT NULL,
  link text,
  read_status boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.organization_users (
  user_id uuid NOT NULL,
  org_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'member'::text,
  joined_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT organization_users_pkey PRIMARY KEY (user_id, org_id),
  CONSTRAINT organization_users_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.organizations(id)
);
CREATE TABLE public.organizations (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  owner uuid NOT NULL,
  name text NOT NULL,
  industry text NOT NULL,
  country text NOT NULL,
  state text NOT NULL,
  address text,
  currency text NOT NULL,
  language text NOT NULL,
  timezone text NOT NULL,
  gst boolean DEFAULT false,
  invoicing text,
  created_at timestamp with time zone DEFAULT now(),
  created_by uuid,
  CONSTRAINT organizations_pkey PRIMARY KEY (id),
  CONSTRAINT fk_organizations_created_by FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT organizations_owner_fkey FOREIGN KEY (owner) REFERENCES auth.users(id)
);
CREATE TABLE public.payments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  invoice_id uuid NOT NULL,
  amount numeric NOT NULL,
  payment_date date,
  method text,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT payments_pkey PRIMARY KEY (id),
  CONSTRAINT payments_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id)
);
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  unit_price numeric,
  tax_rate numeric,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  full_name text,
  address text,
  updated_at timestamp with time zone,
  theme text DEFAULT 'light'::text,
  currency text DEFAULT 'USD'::text,
  date_format text DEFAULT 'MM/DD/YYYY'::text,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.recurring_invoices (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  organization_id uuid NOT NULL,
  customer_id uuid NOT NULL,
  frequency text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  last_generated_date date,
  next_generation_date date,
  status text NOT NULL DEFAULT 'active'::text,
  invoice_template jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT recurring_invoices_pkey PRIMARY KEY (id),
  CONSTRAINT recurring_invoices_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id),
  CONSTRAINT recurring_invoices_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id),
  CONSTRAINT recurring_invoices_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.user_organizations (
  id text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_organizations_pkey PRIMARY KEY (id)
);
CREATE TABLE public.user_roles (
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'user'::text CHECK (role = ANY (ARRAY['user'::text, 'manager'::text, 'admin'::text])),
  CONSTRAINT user_roles_pkey PRIMARY KEY (user_id),
  CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);