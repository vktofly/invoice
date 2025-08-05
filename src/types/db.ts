export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: number
          target_id: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: number
          target_id?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: number
          target_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      customer_addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string
          country: string
          created_at: string | null
          customer_id: string | null
          id: string
          is_default_billing: boolean | null
          is_default_shipping: boolean | null
          postal_code: string
          state: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city: string
          country: string
          created_at?: string | null
          customer_id?: string | null
          id?: string
          is_default_billing?: boolean | null
          is_default_shipping?: boolean | null
          postal_code: string
          state: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string
          country?: string
          created_at?: string | null
          customer_id?: string | null
          id?: string
          is_default_billing?: boolean | null
          is_default_shipping?: boolean | null
          postal_code?: string
          state?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_addresses_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          allowlogin: boolean | null
          auth_user_id: string | null
          billing_address1: string | null
          billing_address2: string | null
          billing_attention: string | null
          billing_city: string | null
          billing_country: string | null
          billing_fax: string | null
          billing_phone: string | null
          billing_pin: string | null
          billing_state: string | null
          city: string | null
          company_name: string | null
          country: string | null
          created_at: string | null
          currency: Database["public"]["Enums"]["currency_enum"] | null
          customer_type:
            | Database["public"]["Enums"]["customer_type_enum"]
            | null
          department: string | null
          designation: string | null
          display_name: string | null
          email: string
          facebook: string | null
          first_name: string | null
          gstin: number | null
          id: string
          last_name: string | null
          mobile: string | null
          name: string
          organization_id: string | null
          pan: string | null
          payment_terms:
            | Database["public"]["Enums"]["payment_terms_enum"]
            | null
          portal_language: string | null
          salutation: Database["public"]["Enums"]["salutation_enum"] | null
          shipping_address1: string | null
          shipping_address2: string | null
          shipping_attention: string | null
          shipping_city: string | null
          shipping_country: string | null
          shipping_fax: string | null
          shipping_phone: string | null
          shipping_pin: string | null
          shipping_state: string | null
          skype: string | null
          state: string | null
          twitter: string | null
          user_id: string
          website: string | null
          work_phone: string | null
          zip: number | null
        }
        Insert: {
          address?: string | null
          allowlogin?: boolean | null
          auth_user_id?: string | null
          billing_address1?: string | null
          billing_address2?: string | null
          billing_attention?: string | null
          billing_city?: string | null
          billing_country?: string | null
          billing_fax?: string | null
          billing_phone?: string | null
          billing_pin?: string | null
          billing_state?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_enum"] | null
          customer_type?:
            | Database["public"]["Enums"]["customer_type_enum"]
            | null
          department?: string | null
          designation?: string | null
          display_name?: string | null
          email: string
          facebook?: string | null
          first_name?: string | null
          gstin?: number | null
          id?: string
          last_name?: string | null
          mobile?: string | null
          name?: string
          organization_id?: string | null
          pan?: string | null
          payment_terms?:
            | Database["public"]["Enums"]["payment_terms_enum"]
            | null
          portal_language?: string | null
          salutation?: Database["public"]["Enums"]["salutation_enum"] | null
          shipping_address1?: string | null
          shipping_address2?: string | null
          shipping_attention?: string | null
          shipping_city?: string | null
          shipping_country?: string | null
          shipping_fax?: string | null
          shipping_phone?: string | null
          shipping_pin?: string | null
          shipping_state?: string | null
          skype?: string | null
          state?: string | null
          twitter?: string | null
          user_id: string
          website?: string | null
          work_phone?: string | null
          zip?: number | null
        }
        Update: {
          address?: string | null
          allowlogin?: boolean | null
          auth_user_id?: string | null
          billing_address1?: string | null
          billing_address2?: string | null
          billing_attention?: string | null
          billing_city?: string | null
          billing_country?: string | null
          billing_fax?: string | null
          billing_phone?: string | null
          billing_pin?: string | null
          billing_state?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_enum"] | null
          customer_type?:
            | Database["public"]["Enums"]["customer_type_enum"]
            | null
          department?: string | null
          designation?: string | null
          display_name?: string | null
          email?: string
          facebook?: string | null
          first_name?: string | null
          gstin?: number | null
          id?: string
          last_name?: string | null
          mobile?: string | null
          name?: string
          organization_id?: string | null
          pan?: string | null
          payment_terms?:
            | Database["public"]["Enums"]["payment_terms_enum"]
            | null
          portal_language?: string | null
          salutation?: Database["public"]["Enums"]["salutation_enum"] | null
          shipping_address1?: string | null
          shipping_address2?: string | null
          shipping_attention?: string | null
          shipping_city?: string | null
          shipping_country?: string | null
          shipping_fax?: string | null
          shipping_phone?: string | null
          shipping_pin?: string | null
          shipping_state?: string | null
          skype?: string | null
          state?: string | null
          twitter?: string | null
          user_id?: string
          website?: string | null
          work_phone?: string | null
          zip?: number | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string | null
          created_at: string | null
          description: string | null
          expense_date: string
          id: string
          organization_id: string
          receipt_url: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string | null
          description?: string | null
          expense_date: string
          id?: string
          organization_id: string
          receipt_url?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string | null
          description?: string | null
          expense_date?: string
          id?: string
          organization_id?: string
          receipt_url?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_invoices: {
        Row: {
          generation_date: string | null
          id: string
          invoice_id: string
          recurring_invoice_id: string
        }
        Insert: {
          generation_date?: string | null
          id?: string
          invoice_id: string
          recurring_invoice_id: string
        }
        Update: {
          generation_date?: string | null
          id?: string
          invoice_id?: string
          recurring_invoice_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_invoices_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoice_with_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_invoices_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_invoices_recurring_invoice_id_fkey"
            columns: ["recurring_invoice_id"]
            isOneToOne: false
            referencedRelation: "recurring_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_activity: {
        Row: {
          activity_type: string
          comments: string | null
          created_at: string | null
          id: string
          invoice_id: string
          payment_id: string | null
          user_id: string | null
        }
        Insert: {
          activity_type: string
          comments?: string | null
          created_at?: string | null
          id?: string
          invoice_id: string
          payment_id?: string | null
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          comments?: string | null
          created_at?: string | null
          id?: string
          invoice_id?: string
          payment_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_activity_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoice_with_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_activity_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_activity_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_attachments: {
        Row: {
          created_at: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          invoice_id: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          invoice_id: string
          uploaded_by: string
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          invoice_id?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_attachments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoice_with_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_attachments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          amount: number | null
          description: string | null
          discount_amount: number | null
          discount_type:
            | Database["public"]["Enums"]["discount_type_enum"]
            | null
          id: string
          invoice_id: string | null
          line_total: number | null
          quantity: number | null
          tax_rate: number
          unit_price: number | null
        }
        Insert: {
          amount?: number | null
          description?: string | null
          discount_amount?: number | null
          discount_type?:
            | Database["public"]["Enums"]["discount_type_enum"]
            | null
          id?: string
          invoice_id?: string | null
          line_total?: number | null
          quantity?: number | null
          tax_rate?: number
          unit_price?: number | null
        }
        Update: {
          amount?: number | null
          description?: string | null
          discount_amount?: number | null
          discount_type?:
            | Database["public"]["Enums"]["discount_type_enum"]
            | null
          id?: string
          invoice_id?: string | null
          line_total?: number | null
          quantity?: number | null
          tax_rate?: number
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoice_with_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_status_history: {
        Row: {
          changed_at: string | null
          changed_by: string | null
          id: number
          invoice_id: string | null
          new_status: Database["public"]["Enums"]["invoice_status"] | null
          old_status: Database["public"]["Enums"]["invoice_status"] | null
        }
        Insert: {
          changed_at?: string | null
          changed_by?: string | null
          id?: never
          invoice_id?: string | null
          new_status?: Database["public"]["Enums"]["invoice_status"] | null
          old_status?: Database["public"]["Enums"]["invoice_status"] | null
        }
        Update: {
          changed_at?: string | null
          changed_by?: string | null
          id?: never
          invoice_id?: string | null
          new_status?: Database["public"]["Enums"]["invoice_status"] | null
          old_status?: Database["public"]["Enums"]["invoice_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_status_history_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoice_with_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_status_history_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_templates: {
        Row: {
          created_at: string | null
          id: string
          organization_id: string
          template_data: Json
          template_name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          organization_id: string
          template_data: Json
          template_name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          organization_id?: string
          template_data?: Json
          template_name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_templates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          authorized_signature: string | null
          billing_address_id: string | null
          color_theme: string | null
          created_at: string | null
          currency: string
          custom_fields: string | null
          customer_id: string
          discount_amount: number | null
          discount_type:
            | Database["public"]["Enums"]["discount_type_enum"]
            | null
          due_date: string | null
          id: string
          is_recurring: boolean | null
          issue_date: string | null
          logo_url: string | null
          notes: string | null
          number: string | null
          organization_id: string | null
          owner: string
          payment_gateway: string | null
          payment_gateway_order_id: string | null
          payment_gateway_payment_id: string | null
          payment_terms: string | null
          recurring_end_date: string | null
          recurring_frequency: string | null
          recurring_start_date: string | null
          shipping_address_id: string | null
          shipping_cost: number | null
          shipping_method: string | null
          status: Database["public"]["Enums"]["invoice_status"] | null
          subtotal: number
          tax: number
          tax_amount: number
          tax_rate: number
          total: number
          total_amount: number
          tracking_number: string | null
          update_at: string
          updated_at: string | null
          user_address: string | null
          user_company_name: string | null
          user_contact: string | null
        }
        Insert: {
          authorized_signature?: string | null
          billing_address_id?: string | null
          color_theme?: string | null
          created_at?: string | null
          currency?: string
          custom_fields?: string | null
          customer_id: string
          discount_amount?: number | null
          discount_type?:
            | Database["public"]["Enums"]["discount_type_enum"]
            | null
          due_date?: string | null
          id?: string
          is_recurring?: boolean | null
          issue_date?: string | null
          logo_url?: string | null
          notes?: string | null
          number?: string | null
          organization_id?: string | null
          owner: string
          payment_gateway?: string | null
          payment_gateway_order_id?: string | null
          payment_gateway_payment_id?: string | null
          payment_terms?: string | null
          recurring_end_date?: string | null
          recurring_frequency?: string | null
          recurring_start_date?: string | null
          shipping_address_id?: string | null
          shipping_cost?: number | null
          shipping_method?: string | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          subtotal?: number
          tax?: number
          tax_amount?: number
          tax_rate?: number
          total?: number
          total_amount?: number
          tracking_number?: string | null
          update_at?: string
          updated_at?: string | null
          user_address?: string | null
          user_company_name?: string | null
          user_contact?: string | null
        }
        Update: {
          authorized_signature?: string | null
          billing_address_id?: string | null
          color_theme?: string | null
          created_at?: string | null
          currency?: string
          custom_fields?: string | null
          customer_id?: string
          discount_amount?: number | null
          discount_type?:
            | Database["public"]["Enums"]["discount_type_enum"]
            | null
          due_date?: string | null
          id?: string
          is_recurring?: boolean | null
          issue_date?: string | null
          logo_url?: string | null
          notes?: string | null
          number?: string | null
          organization_id?: string | null
          owner?: string
          payment_gateway?: string | null
          payment_gateway_order_id?: string | null
          payment_gateway_payment_id?: string | null
          payment_terms?: string | null
          recurring_end_date?: string | null
          recurring_frequency?: string | null
          recurring_start_date?: string | null
          shipping_address_id?: string | null
          shipping_cost?: number | null
          shipping_method?: string | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          subtotal?: number
          tax?: number
          tax_amount?: number
          tax_rate?: number
          total?: number
          total_amount?: number
          tracking_number?: string | null
          update_at?: string
          updated_at?: string | null
          user_address?: string | null
          user_company_name?: string | null
          user_contact?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_billing_address_id_fkey"
            columns: ["billing_address_id"]
            isOneToOne: false
            referencedRelation: "customer_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_shipping_address_id_fkey"
            columns: ["shipping_address_id"]
            isOneToOne: false
            referencedRelation: "customer_addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          link: string | null
          message: string
          read_status: boolean | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          link?: string | null
          message: string
          read_status?: boolean | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          link?: string | null
          message?: string
          read_status?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
      organization_users: {
        Row: {
          joined_at: string
          org_id: string
          role: string
          user_id: string | null
          status: string
          invited_email: string | null
        }
        Insert: {
          joined_at?: string
          org_id: string
          role?: string
          user_id?: string | null
          status?: string
          invited_email?: string | null
        }
        Update: {
          joined_at?: string
          org_id?: string
          role?: string
          user_id?: string | null
          status?: string
          invited_email?: string | null
        }
        Relationships: []
      }
      organizations: {
        Row: {
          address: string | null
          country: string
          created_at: string | null
          created_by: string | null
          currency: string
          gst: boolean | null
          id: string
          industry: string
          invoicing: string | null
          language: string
          name: string
          owner: string
          state: string
          timezone: string
        }
        Insert: {
          address?: string | null
          country: string
          created_at?: string | null
          created_by?: string | null
          currency: string
          gst?: boolean | null
          id?: string
          industry: string
          invoicing?: string | null
          language: string
          name: string
          owner?: string
          state: string
          timezone: string
        }
        Update: {
          address?: string | null
          country?: string
          created_at?: string | null
          created_by?: string | null
          currency?: string
          gst?: boolean | null
          id?: string
          industry?: string
          invoicing?: string | null
          language?: string
          name?: string
          owner?: string
          state?: string
          timezone?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          invoice_id: string
          method: string | null
          notes: string | null
          payment_date: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          invoice_id: string
          method?: string | null
          notes?: string | null
          payment_date?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          invoice_id?: string
          method?: string | null
          notes?: string | null
          payment_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoice_with_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          organization_id: string
          tax_rate: number | null
          unit_price: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          organization_id: string
          tax_rate?: number | null
          unit_price?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          organization_id?: string
          tax_rate?: number | null
          unit_price?: number | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          currency: string | null
          date_format: string | null
          email: string | null
          full_name: string | null
          id: string
          organization_id: string | null
          role: string | null
          theme: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          currency?: string | null
          date_format?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          organization_id?: string | null
          role?: string | null
          theme?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          currency?: string | null
          date_format?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          organization_id?: string | null
          role?: string | null
          theme?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      recurring_invoices: {
        Row: {
          created_at: string | null
          customer_id: string
          end_date: string | null
          frequency: string
          id: string
          invoice_template: Json
          last_generated_date: string | null
          next_generation_date: string | null
          organization_id: string
          start_date: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          end_date?: string | null
          frequency: string
          id?: string
          invoice_template: Json
          last_generated_date?: string | null
          next_generation_date?: string | null
          organization_id: string
          start_date: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          end_date?: string | null
          frequency?: string
          id?: string
          invoice_template?: Json
          last_generated_date?: string | null
          next_generation_date?: string | null
          organization_id?: string
          start_date?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recurring_invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recurring_invoices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_organizations: {
        Row: {
          created_at: string
          id: string
        }
        Insert: {
          created_at?: string
          id: string
        }
        Update: {
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          role: string
          user_id: string
        }
        Insert: {
          role?: string
          user_id: string
        }
        Update: {
          role?: string
          user_id?: string
        }
        Relationships: []
      },
      time_entries: {
        Row: {
          id: string
          user_id: string
          date: string
          hours: number
          description: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          hours: number
          description: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          hours?: number
          description?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      invoice_with_addresses: {
        Row: {
          authorized_signature: string | null
          billing_address_id: string | null
          billing_address_line1: string | null
          billing_address_line2: string | null
          billing_city: string | null
          billing_country: string | null
          billing_postal_code: string | null
          billing_state: string | null
          color_theme: string | null
          created_at: string | null
          currency: string | null
          custom_fields: string | null
          customer_id: string | null
          discount_amount: number | null
          discount_type:
            | Database["public"]["Enums"]["discount_type_enum"]
            | null
          due_date: string | null
          id: string | null
          issue_date: string | null
          logo_url: string | null
          notes: string | null
          number: string | null
          owner: string | null
          payment_gateway: string | null
          payment_gateway_order_id: string | null
          payment_gateway_payment_id: string | null
          payment_terms: string | null
          shipping_address_id: string | null
          shipping_address_line1: string | null
          shipping_address_line2: string | null
          shipping_city: string | null
          shipping_cost: number | null
          shipping_country: string | null
          shipping_method: string | null
          shipping_postal_code: string | null
          shipping_state: string | null
          status: Database["public"]["Enums"]["invoice_status"] | null
          subtotal: number | null
          tax: number | null
          tax_amount: number | null
          tax_rate: number | null
          total: number | null
          total_amount: number | null
          tracking_number: string | null
          user_address: string | null
          user_company_name: string | null
          user_contact: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_billing_address_id_fkey"
            columns: ["billing_address_id"]
            isOneToOne: false
            referencedRelation: "customer_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_shipping_address_id_fkey"
            columns: ["shipping_address_id"]
            isOneToOne: false
            referencedRelation: "customer_addresses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      current_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_next_invoice_number: {
        Args: { org_id: string }
        Returns: string
      }
      get_recurring_invoices_summary: {
        Args: Record<PropertyKey, never>
        Returns: {
          active_count: number
          next_due_date: string
        }[]
      }
      get_top_customers: {
        Args: Record<PropertyKey, never>
        Returns: {
          customer_id: string
          name: string
          total_invoiced: number
        }[]
      }
      get_top_products: {
        Args: Record<PropertyKey, never>
        Returns: {
          product_id: string
          name: string
          total_sold: number
        }[]
      }
      update_customer_with_addresses: {
        Args: {
          p_customer_id: string
          p_customer_type: string
          p_salutation: string
          p_first_name: string
          p_last_name: string
          p_company_name: string
          p_display_name: string
          p_currency: string
          p_email: string
          p_work_phone: string
          p_mobile: string
          p_gstin: string
          p_pan: string
          p_payment_terms: string
          p_website: string
          p_billing_attention: string
          p_billing_country: string
          p_billing_address1: string
          p_billing_address2: string
          p_billing_city: string
          p_billing_state: string
          p_billing_pin: string
          p_billing_phone: string
          p_billing_fax: string
          p_shipping_attention: string
          p_shipping_country: string
          p_shipping_address1: string
          p_shipping_address2: string
          p_shipping_city: string
          p_shipping_state: string
          p_shipping_pin: string
          p_shipping_phone: string
          p_shipping_fax: string
        }
        Returns: undefined
      }
    }
    Enums: {
      currency_enum: "INR" | "USD" | "EUR" | "GBP"
      customer_type_enum: "Business" | "Individual"
      discount_type_enum: "percentage" | "fixed"
      invoice_status: "draft" | "sent" | "viewed" | "paid" | "overdue" | "void"
      payment_terms_enum: "Due on Receipt" | "Net 15" | "Net 30" | "Net 60"
      salutation_enum: "Mr." | "Mrs." | "Ms."
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      currency_enum: ["INR", "USD", "EUR", "GBP"],
      customer_type_enum: ["Business", "Individual"],
      discount_type_enum: ["percentage", "fixed"],
      invoice_status: ["draft", "sent", "viewed", "paid", "overdue", "void"],
      payment_terms_enum: ["Due on Receipt", "Net 15", "Net 30", "Net 60"],
      salutation_enum: ["Mr.", "Mrs.", "Ms."],
    },
  },
} as const
