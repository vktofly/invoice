// D:\Invoice_app\src\lib\types.ts
import { User } from '@supabase/supabase-js';

export type { User };

export type Organization = {
  id: string;
  name: string;
  industry: string;
  country: string;
  state: string;
  address?: string;
  currency: string;
  language: string;
  timezone: string;
  gst_registered: boolean;
  gst_number?: string;
  created_by: string;
  created_at: string;
  role: string;
};

export type Customer = {
  id: string;
  user_id: string;
  name: string;
  email?: string;
  created_at?: string;
  customer_type?: string;
  salutation?: string;
  first_name?: string;
  last_name?: string;
  company_name?: string;
  currency?: string;
  work_phone?: string;
  mobile?: string;
  billing_attention?: string;
  billing_country?: string;
  billing_address1?: string;
  billing_address2?: string;
  billing_city?: string;
  billing_state?: string;
  billing_pin?: string;
  billing_phone?: string;
  billing_fax?: string;
  shipping_attention?: string;
  shipping_country?: string;
  shipping_address1?: string;
  shipping_address2?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_pin?: string;
  shipping_phone?: string;
  shipping_fax?: string;
  outstanding_balance?: number;
};

export type CustomerAddress = {
  id: string;
  customer_id?: string;
  attention?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
  fax?: string;
  is_default_billing?: boolean;
  is_default_shipping?: boolean;
  created_at?: string;
};

export type Invoice = {
  id: string;
  owner: string;
  organization_id: string;
  customer_id: string;
  billing_address_id?: string;
  shipping_address_id?: string;
  number: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  issue_date: string;
  due_date: string;
  total_amount: number;
  subtotal: number;
  tax_amount: number;
  tax_rate: number;
  notes?: string;
  logo_url?: string;
  color_theme?: string;
  user_address?: string;
  user_contact?: string;
  created_at?: string;
  updated_at?: string;
  tax?: number;
  total?: number;
  user_company_name?: string;
  currency: string;
  authorized_signature?: string;
  discount_type?: 'percentage' | 'fixed';
  discount_amount?: number;
  shipping_method?: string;
  tracking_number?: string;
  shipping_cost?: number;
  custom_fields?: { [key: string]: any };
  // Relations
  customer?: Customer;
  billing_address?: CustomerAddress;
  shipping_address?: CustomerAddress;
  invoice_items?: InvoiceItem[];
};

export type InvoiceItem = {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate?: number;
  line_total: number;
  created_at?: string;
  discount_type?: 'percentage' | 'fixed';
  discount_amount?: number;
};

export type TopCustomer = {
  customer_id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  total_invoiced: number;
};

export type RecurringInvoicesSummary = {
  active_count: number;
  projected_monthly_revenue: number;
  projected_yearly_revenue: number;
};

export type Estimate = {
  id: string;
  owner: string;
  customer_id: string;
  number: string;
  status: 'draft' | 'sent' | 'accepted' | 'declined';
  issue_date: string;
  expiry_date: string;
  total_amount: number;
  subtotal: number;
  tax_amount: number;
  tax_rate: number;
  notes?: string;
  // Relations
  customer?: Customer;
  estimate_items?: EstimateItem[];
};

export type EstimateItem = {
  id: string;
  estimate_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate?: number;
  line_total: number;
};

export type TopProduct = {
  product_id: string;
  name: string;
  total_sold: number;
};

