import { z } from 'zod';

export const ExpenseUpdateSchema = z.object({
  category: z.string().optional(),
  description: z.string().optional(),
  amount: z.number().positive().optional(),
  expense_date: z.string().nonempty().optional(),
  receipt_url: z.string().url().optional(),
});

export const ExpenseSchema = z.object({
  category: z.string().optional(),
  description: z.string().optional(),
  amount: z.number().positive(),
  expense_date: z.string().nonempty(),
  receipt_url: z.string().url().optional(),
});

export const InvoiceTemplateSchema = z.object({
  template_name: z.string(),
  template_data: z.any(), // Keep template data flexible
});

export const RecurringInvoiceSchema = z.object({
  organization_id: z.string(),
  customer_id: z.string(),
  recurring_frequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']),
  recurring_start_date: z.string(),
  recurring_end_date: z.string().optional().nullable(),
  items: z.array(z.any()), // Keep items flexible for the template
  // Add other relevant fields from the invoice form that should be part of the template
  notes: z.string().optional(),
  currency: z.string().optional(),
  // etc.
});

export const ItemSchema = z.object({
  description: z.string().nonempty('Description is required'),
  quantity: z.number().positive('Quantity must be positive'),
  unit_price: z.number().nonnegative('Price cannot be negative'),
  tax_rate: z.number().min(0).max(100, 'Tax rate must be between 0-100'),
  discount_type: z.enum(['percentage', 'fixed']).optional().default('fixed'),
  discount_amount: z.number().nonnegative('Discount cannot be negative').optional(),
});

export const AddressSchema = z.object({
  id: z.string(),
  address_line1: z.string(),
  address_line2: z.string().optional(),
  city: z.string(),
  state: z.string(),
  postal_code: z.string(),
  country: z.string(),
  is_default_billing: z.boolean().optional(),
  is_default_shipping: z.boolean().optional(),
  created_at: z.string().optional(),
});

export const InvoiceSchema = z.object({
  number: z.string(),
  customer_id: z.string().nonempty('Customer is required'),
  issue_date: z.string(),
  due_date: z.string(),
  items: z.array(ItemSchema).min(1, 'Invoice must have at least one item'),
  notes: z.string().optional(),
  logo_url: z.string().url().or(z.literal('')).optional(),
  color_theme: z.string().optional(),
  user_company_name: z.string().optional(),
  user_address: z.string().optional(),
  user_contact: z.string().optional(),
  currency: z.string().optional(),
  authorized_signature: z.string().optional(),
  billing_address_id: z.string().nullable().optional(),
  shipping_address_id: z.string().nullable().optional(),
  billing_address: AddressSchema.nullable().optional(),
  shipping_address: AddressSchema.nullable().optional(),
  discount_type: z.enum(['percentage', 'fixed']).optional(),
  discount_amount: z.number().nonnegative('Discount cannot be negative').optional(),
  shipping_method: z.string().optional(),
  tracking_number: z.string().optional(),
  shipping_cost: z.number().nonnegative('Shipping cost cannot be negative').optional(),
  custom_fields: z.array(z.object({
    key: z.string(),
    value: z.string(),
  })).optional(),
  is_recurring: z.boolean().optional(),
  recurring_frequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']).optional(),
  recurring_start_date: z.string().optional(),
  recurring_end_date: z.string().optional().nullable(),
});

export const CustomerSchema = z.object({
  customer_type: z.string(),
  salutation: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  company_name: z.string().optional(),
  currency: z.string(),
  email: z.string().email(),
  work_phone: z.string().optional(),
  mobile: z.string().optional(),
  billing_attention: z.string().optional(),
  billing_country: z.string().optional(),
  billing_address1: z.string().optional(),
  billing_address2: z.string().optional(),
  billing_city: z.string().optional(),
  billing_state: z.string().optional(),
  billing_pin: z.string().optional(),
  billing_phone: z.string().optional(),
  billing_fax: z.string().optional(),
  shipping_attention: z.string().optional(),
  shipping_country: z.string().optional(),
  shipping_address1: z.string().optional(),
  shipping_address2: z.string().optional(),
  shipping_city: z.string().optional(),
  shipping_state: z.string().optional(),
  shipping_pin: z.string().optional(),
  shipping_phone: z.string().optional(),
  shipping_fax: z.string().optional(),
  gstin: z.string().optional(),
  pan: z.string().optional(),
  payment_terms: z.string().optional(),
  website: z.string().optional(),
});
