import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const requiredFields = [
    'name', 'industry', 'country', 'state', 'currency', 'language', 'timezone'
  ];
  for (const field of requiredFields) {
    if (!body[field]) {
      return NextResponse.json({ error: `${field} is required` }, { status: 400 });
    }
  }

  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const insertPayload = {
    ...body,
    owner: user.id,
  };

  const { data, error } = await supabase
    .from('organizations')
    .insert(insertPayload)
    .select('*');

  if (error || !data || data.length === 0) {
    return NextResponse.json({ error: error?.message || 'Failed to create organization' }, { status: 500 });
  }

  return NextResponse.json(data[0], { status: 201 });
} 