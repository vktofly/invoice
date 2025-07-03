import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET() {
  // List all users
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  // Filter users with 'customer' role
  const customers = data.users
    .filter(u => u.user_metadata?.role === 'customer')
    .map(u => ({
      id: u.id,
      email: u.email,
      name: u.user_metadata?.name || '',
    }));
  return NextResponse.json({ customers });
}

export async function POST(req) {
  const { name, email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }
  // Create a new user with the 'customer' role
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    user_metadata: { name, role: 'customer' },
    email_confirm: false,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  const customer = {
    id: data.user.id,
    email: data.user.email,
    name: data.user.user_metadata?.name || '',
  };
  return NextResponse.json({ customer }, { status: 201 });
} 