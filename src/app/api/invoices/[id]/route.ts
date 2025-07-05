import Supabase from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/invoices/[id]
 * Fetch a single invoice by ID, including its items.
 * Returns 404 if not found or on error.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = Supabase;
  // Fetch the invoice and its items by id
  const { data: invoice, error } = await supabase
    .from('invoices')
    .select('*, invoice_items(*)')
    .eq('id', params.id)
    .single();

  // Handle error or not found
  if (error)
    return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(invoice);
}

/**
 * PATCH /api/invoices/[id]
 * Update an invoice and its items by ID.
 * Expects a JSON body with invoice fields and an optional items array.
 * Replaces all invoice items if provided.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Parse the request body
  const payload = await request.json();
  const { items = [], ...invoiceData } = payload;

  const supabase = Supabase;

  // Update the invoice fields
  const { data: invoice, error: invError } = await supabase
    .from('invoices')
    .update(invoiceData)
    .eq('id', params.id)
    .select('*')
    .single();

  // Handle update error
  if (invError)
    return NextResponse.json({ error: invError.message }, { status: 400 });

  // If items are provided, replace all invoice items
  if (Array.isArray(items)) {
    // Delete existing items for this invoice
    await supabase.from('invoice_items').delete().eq('invoice_id', params.id);
    // Prepare new items payload
    const itemsPayload = items.map((item: any) => ({
      ...item,
      line_total:
        item.line_total ?? item.quantity * item.unit_price * (1 + item.tax_rate / 100),
      invoice_id: params.id,
    }));
    // Insert new items if any
    if (itemsPayload.length > 0) {
      const { error: insertErr } = await supabase.from('invoice_items').insert(itemsPayload);
      if (insertErr)
        return NextResponse.json({ error: insertErr.message }, { status: 400 });
    }
  }

  return NextResponse.json(invoice);
}

/**
 * DELETE /api/invoices/[id]
 * Delete an invoice by ID.
 * Returns success: true if deleted, or error message on failure.
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = Supabase;
  // Delete the invoice by id
  const { error } = await supabase.from('invoices').delete().eq('id', params.id);

  // Handle delete error
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
} 