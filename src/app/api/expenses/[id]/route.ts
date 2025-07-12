import supabase from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const ExpenseUpdateSchema = z.object({
  category: z.string().optional(),
  description: z.string().optional(),
  amount: z.number().positive().optional(),
  expense_date: z.string().nonempty().optional(),
  receipt_url: z.string().url().optional(),
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  const { id } = params;
  const body = await req.json();
  const result = ExpenseUpdateSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  const { error } = await supabase
    .from('expenses')
    .update(result.data)
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error(`Error updating expense ${id}:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Expense updated successfully' });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  const { id } = params;

  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error(`Error deleting expense ${id}:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Expense deleted successfully' });
}