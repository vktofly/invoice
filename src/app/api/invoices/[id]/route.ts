import { supabaseServer } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = supabaseServer();
  const { data: invoice, error } = await supabase
    .from('invoices')
    .select('*, invoice_items(*)')
    .eq('id', params.id)
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(invoice);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const payload = await request.json();
  const { items = [], ...invoiceData } = payload;

  const supabase = supabaseServer();

  // Update invoice
  const { data: invoice, error: invError } = await supabase
    .from('invoices')
    .update(invoiceData)
    .eq('id', params.id)
    .select('*')
    .single();

  if (invError)
    return NextResponse.json({ error: invError.message }, { status: 400 });

  // Replace items
  if (Array.isArray(items)) {
    // delete existing items
    await supabase.from('invoice_items').delete().eq('invoice_id', params.id);
    const itemsPayload = items.map((item: any) => ({
      ...item,
      line_total:
        item.line_total ?? item.quantity * item.unit_price * (1 + item.tax_rate / 100),
      invoice_id: params.id,
    }));
    if (itemsPayload.length > 0) {
      const { error: insertErr } = await supabase.from('invoice_items').insert(itemsPayload);
      if (insertErr)
        return NextResponse.json({ error: insertErr.message }, { status: 400 });
    }
  }

  return NextResponse.json(invoice);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = supabaseServer();
  const { error } = await supabase.from('invoices').delete().eq('id', params.id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
} 