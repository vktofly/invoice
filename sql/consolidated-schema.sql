-- Consolidated Database Schema

-- This file represents the complete and up-to-date schema for the application,
-- consolidated from all the migration scripts.

--
-- Name: customers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    name text NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT now(),
    customer_type public.customer_type_enum,
    salutation public.salutation_enum,
    first_name text,
    last_name text,
    company_name text,
    display_name text,
    currency public.currency_enum,
    work_phone text,
    mobile text,
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
    payment_terms public.payment_terms_enum
);

--
-- Name: customer_addresses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customer_addresses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    customer_id uuid,
    attention text,
    address_line1 text NOT NULL,
    address_line2 text,
    city text NOT NULL,
    state text NOT NULL,
    postal_code text NOT NULL,
    country text NOT NULL,
    phone text,
    fax text,
    is_default_billing boolean DEFAULT false,
    is_default_shipping boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);

--
-- Name: invoices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.invoices (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    owner uuid NOT NULL,
    customer_id uuid NOT NULL,
    billing_address_id uuid,
    shipping_address_id uuid,
    number text NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    issue_date date NOT NULL,
    due_date date NOT NULL,
    total_amount numeric(10,2) DEFAULT 0 NOT NULL,
    subtotal numeric(10,2) DEFAULT 0 NOT NULL,
    tax_amount numeric(10,2) DEFAULT 0 NOT NULL,
    tax_rate numeric(5,2) DEFAULT 0 NOT NULL,
    notes text,
    logo_url text,
    color_theme text,
    user_address text,
    user_contact text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    tax numeric(10,2) DEFAULT 0 NOT NULL,
    total numeric(10,2) DEFAULT 0 NOT NULL,
    user_company_name text,
    currency public.currency_enum DEFAULT 'USD'::public.currency_enum NOT NULL,
    authorized_signature text,
    discount_type public.discount_type_enum,
    discount_amount numeric DEFAULT 0,
    shipping_method text,
    tracking_number text,
    shipping_cost numeric(10,2) DEFAULT 0,
    custom_fields jsonb
);

--
-- Name: invoice_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.invoice_items (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    invoice_id uuid NOT NULL,
    description text NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    tax_rate numeric(5,2) DEFAULT 0,
    line_total numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    discount_type public.discount_type_enum,
    discount_amount numeric DEFAULT 0
);

--
-- Name: invoice_activity; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.invoice_activity (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    invoice_id uuid NOT NULL,
    user_id uuid,
    activity_type character varying(50) NOT NULL,
    comments text,
    created_at timestamp with time zone DEFAULT now(),
    payment_id uuid
);

--
-- Name: payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    invoice_id uuid NOT NULL,
    amount numeric(10,2) NOT NULL,
    payment_date date NOT NULL,
    payment_method character varying(50),
    notes text,
    created_at timestamp with time zone DEFAULT now()
);

--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    organization_id uuid NOT NULL,
    name text NOT NULL,
    description text,
    sku text,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

--
-- Name: recurring_invoices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.recurring_invoices (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    organization_id uuid NOT NULL,
    customer_id uuid NOT NULL,
    frequency text NOT NULL,
    start_date date NOT NULL,
    end_date date,
    last_generated_date date,
    next_generation_date date,
    status text DEFAULT 'active'::text NOT NULL,
    invoice_template jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

--
-- Name: time_entries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.time_entries (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    organization_id uuid NOT NULL,
    project_id uuid,
    task_description text NOT NULL,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone,
    duration_minutes integer,
    is_billable boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

--
-- Name: expenses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.expenses (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    organization_id uuid NOT NULL,
    vendor_name text NOT NULL,
    description text,
    amount numeric(10,2) NOT NULL,
    expense_date date NOT NULL,
    category text,
    receipt_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

--
-- Primary Keys
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.customer_addresses
    ADD CONSTRAINT customer_addresses_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT invoice_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.invoice_activity
    ADD CONSTRAINT invoice_activity_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.recurring_invoices
    ADD CONSTRAINT recurring_invoices_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.time_entries
    ADD CONSTRAINT time_entries_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_pkey PRIMARY KEY (id);

--
-- Foreign Keys
--

ALTER TABLE ONLY public.customer_addresses
    ADD CONSTRAINT customer_addresses_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_billing_address_id_fkey FOREIGN KEY (billing_address_id) REFERENCES public.customer_addresses(id);

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_shipping_address_id_fkey FOREIGN KEY (shipping_address_id) REFERENCES public.customer_addresses(id);

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_owner_fkey FOREIGN KEY (owner) REFERENCES auth.users(id);

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT invoice_items_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.invoice_activity
    ADD CONSTRAINT invoice_activity_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.invoice_activity
    ADD CONSTRAINT invoice_activity_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);

ALTER TABLE ONLY public.invoice_activity
    ADD CONSTRAINT invoice_activity_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payments(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);

ALTER TABLE ONLY public.recurring_invoices
    ADD CONSTRAINT recurring_invoices_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);

ALTER TABLE ONLY public.recurring_invoices
    ADD CONSTRAINT recurring_invoices_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);

ALTER TABLE ONLY public.time_entries
    ADD CONSTRAINT time_entries_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);

--
-- RLS Policies
--

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own customers" ON public.customers FOR SELECT USING ((auth.uid() = user_id));
CREATE POLICY "Users can insert own customers" ON public.customers FOR INSERT WITH CHECK ((auth.uid() = user_id));
CREATE POLICY "Users can update own customers" ON public.customers FOR UPDATE USING ((auth.uid() = user_id));
CREATE POLICY "Users can delete own customers" ON public.customers FOR DELETE USING ((auth.uid() = user_id));

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own invoices" ON public.invoices FOR SELECT USING ((auth.uid() = owner));
CREATE POLICY "Users can insert own invoices" ON public.invoices FOR INSERT WITH CHECK ((auth.uid() = owner));
CREATE POLICY "Users can update own invoices" ON public.invoices FOR UPDATE USING ((auth.uid() = owner));
CREATE POLICY "Users can delete own invoices" ON public.invoices FOR DELETE USING ((auth.uid() = owner));

ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own invoice items" ON public.invoice_items FOR SELECT USING (EXISTS ( SELECT 1 FROM public.invoices WHERE ((invoices.id = invoice_items.invoice_id) AND (invoices.owner = auth.uid()))));
CREATE POLICY "Users can insert own invoice items" ON public.invoice_items FOR INSERT WITH CHECK (EXISTS ( SELECT 1 FROM public.invoices WHERE ((invoices.id = invoice_items.invoice_id) AND (invoices.owner = auth.uid()))));
CREATE POLICY "Users can update own invoice items" ON public.invoice_items FOR UPDATE USING (EXISTS ( SELECT 1 FROM public.invoices WHERE ((invoices.id = invoice_items.invoice_id) AND (invoices.owner = auth.uid()))));
CREATE POLICY "Users can delete own invoice items" ON public.invoice_items FOR DELETE USING (EXISTS ( SELECT 1 FROM public.invoices WHERE ((invoices.id = invoice_items.invoice_id) AND (invoices.owner = auth.uid()))));

ALTER TABLE public.invoice_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view activity for their own invoices" ON public.invoice_activity FOR SELECT USING (EXISTS ( SELECT 1 FROM public.invoices WHERE ((invoices.id = invoice_activity.invoice_id) AND (invoices.owner = auth.uid()))));

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own products" ON public.products FOR ALL USING ((auth.uid() = user_id));

ALTER TABLE public.recurring_invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own recurring invoices" ON public.recurring_invoices FOR ALL USING ((auth.uid() = user_id));

ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own time entries" ON public.time_entries FOR ALL USING ((auth.uid() = user_id));

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own expenses" ON public.expenses FOR ALL USING ((auth.uid() = user_id));
