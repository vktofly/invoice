import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
  }

  const supabase = createRouteHandlerClient({ cookies });
  const searchQuery = `%${query}%`;

  try {
    const [invoicesRes, customersRes, productsRes] = await Promise.all([
      supabase
        .from('invoices')
        .select('id, number, total_amount, customer:customers(name)')
        .or(`number.ilike.${searchQuery}`),
      supabase
        .from('customers')
        .select('id, name, email')
        .or(`name.ilike.${searchQuery},email.ilike.${searchQuery}`),
      supabase
        .from('products')
        .select('id, name, description')
        .or(`name.ilike.${searchQuery},description.ilike.${searchQuery}`),
    ]);

    const results = [];

    if (invoicesRes.data) {
      results.push(...invoicesRes.data.map(invoice => ({
        type: 'invoice',
        id: invoice.id,
        title: `Invoice #${invoice.number}`,
        description: `Customer: ${invoice.customer[0]?.name || 'N/A'} - Total: ${invoice.total_amount}`,
        url: `/invoices/${invoice.id}`,
      })));
    }

    if (customersRes.data) {
      results.push(...customersRes.data.map(customer => ({
        type: 'customer',
        id: customer.id,
        title: customer.name,
        description: customer.email,
        url: `/customer/${customer.id}`,
      })));
    }

    if (productsRes.data) {
      results.push(...productsRes.data.map(product => ({
        type: 'product',
        id: product.id,
        title: product.name,
        description: product.description,
        url: `/products/${product.id}`,
      })));
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'An error occurred during the search.' }, { status: 500 });
  }
}