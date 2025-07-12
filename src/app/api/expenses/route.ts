import supabase from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const ExpenseSchema = z.object({
  category: z.string().optional(),
  description: z.string().optional(),
  amount: z.number().positive(),
  expense_date: z.string().nonempty(),
  receipt_url: z.string().url().optional(),
});

export async function POST(req: Request) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  const body = await req.json();
  const result = ExpenseSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  // Fetch the user's primary organization
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .select('id')
    .eq('created_by', user.id) // This might need adjustment based on your org logic
    .limit(1)
    .single();

  if (orgError || !org) {
    return NextResponse.json({ error: 'Could not determine organization.' }, { status: 500 });
  }

  const { error } = await supabase.from('expenses').insert([
    { ...result.data, user_id: user.id, organization_id: org.id },
  ]);

  if (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Expense created successfully' }, { status: 201 });
}

export async function GET(req: Request) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ expenses: data }, { status: 200 });
}