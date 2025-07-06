import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function POST(req: NextRequest) {
  const { role } = await req.json();
  if (!role) {
    return NextResponse.json({ error: 'Role is required' }, { status: 400 });
  }

  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  // Update user_metadata.role
  const { error: updateError } = await supabase.auth.updateUser({
    data: { role },
  });
  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
} 