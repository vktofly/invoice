import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
  console.error('Missing Supabase environment variables.');
  Deno.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

serve(async (req) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Fetch all active recurring invoices that are due today or overdue
    const { data: recurringInvoices, error: fetchError } = await supabaseAdmin
      .from('recurring_invoices')
      .select('*')
      .eq('status', 'active')
      .lte('next_generation_date', today);

    if (fetchError) {
      throw fetchError;
    }

    if (!recurringInvoices || recurringInvoices.length === 0) {
      return new Response(JSON.stringify({ message: 'No recurring invoices to generate today.' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    const generationPromises = recurringInvoices.map(async (profile) => {
      const { invoice_template, user_id, customer_id, organization_id, frequency, end_date } = profile;

      // 1. Get the next invoice number
      const { data: nextNumberData, error: numberError } = await supabaseAdmin
        .rpc('get_next_invoice_number', { org_id: organization_id });

      if (numberError) throw new Error(`Failed to get next invoice number: ${numberError.message}`);
      
      const newInvoiceNumber = nextNumberData;

      // 2. Create the new invoice from the template
      const newInvoice = {
        ...invoice_template,
        number: newInvoiceNumber,
        user_id,
        customer_id,
        organization_id,
        status: 'draft', // Or 'sent' depending on desired behavior
        issue_date: new Date().toISOString(),
        // Due date can be calculated based on payment terms in the template
      };

      const { error: insertError } = await supabaseAdmin.from('invoices').insert(newInvoice);
      if (insertError) {
        console.error(`Failed to create invoice for profile ${profile.id}:`, insertError);
        return; // Continue to the next profile
      }

      // 3. Calculate the next generation date
      const currentNextDate = new Date(profile.next_generation_date);
      let nextDate = new Date(currentNextDate);

      switch (frequency) {
        case 'daily':
          nextDate.setDate(nextDate.getDate() + 1);
          break;
        case 'weekly':
          nextDate.setDate(nextDate.getDate() + 7);
          break;
        case 'monthly':
          nextDate.setMonth(nextDate.getMonth() + 1);
          break;
        case 'yearly':
          nextDate.setFullYear(nextDate.getFullYear() + 1);
          break;
      }

      // 4. Update the recurring profile
      const newStatus = (end_date && nextDate > new Date(end_date)) ? 'finished' : 'active';
      
      const { error: updateError } = await supabaseAdmin
        .from('recurring_invoices')
        .update({
          last_generated_date: today,
          next_generation_date: nextDate.toISOString().split('T')[0],
          status: newStatus,
        })
        .eq('id', profile.id);

      if (updateError) {
        console.error(`Failed to update recurring profile ${profile.id}:`, updateError);
      }
    });

    await Promise.all(generationPromises);

    return new Response(JSON.stringify({ message: `Successfully processed ${recurringInvoices.length} recurring invoices.` }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error processing recurring invoices:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
