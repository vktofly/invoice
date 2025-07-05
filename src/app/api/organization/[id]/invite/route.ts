import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const orgId = params.id;
  const { email, role } = await req.json();
  if (!email || !role) {
    return NextResponse.json({ error: 'Email and role are required.' }, { status: 400 });
  }
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
  // Check if user is admin
  const { data: membership } = await supabase
    .from('organization_users')
    .select('role')
    .eq('user_id', user.id)
    .eq('org_id', orgId)
    .single();
  if (!membership || membership.role !== 'admin') {
    return NextResponse.json({ error: 'You do not have permission.' }, { status: 403 });
  }
  // Check if user already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id, email')
    .eq('email', email)
    .single();
  if (existingUser) {
    // Check if already a member
    const { data: existingMembership } = await supabase
      .from('organization_users')
      .select('user_id')
      .eq('user_id', existingUser.id)
      .eq('org_id', orgId)
      .single();
    if (existingMembership) {
      return NextResponse.json({ error: 'User is already a member or invited.' }, { status: 400 });
    }
    // Add as active member
    const { error } = await supabase
      .from('organization_users')
      .insert({
        user_id: existingUser.id,
        org_id: orgId,
        role,
        status: 'active',
        joined_at: new Date().toISOString(),
      });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  } else {
    // Check for duplicate invite
    const { data: existingInvite } = await supabase
      .from('organization_users')
      .select('invited_email')
      .eq('invited_email', email)
      .eq('org_id', orgId)
      .single();
    if (existingInvite) {
      return NextResponse.json({ error: 'User is already invited.' }, { status: 400 });
    }
    // Add as invited
    const { error } = await supabase
      .from('organization_users')
      .insert({
        user_id: null,
        org_id: orgId,
        role,
        status: 'invited',
        invited_email: email,
        joined_at: new Date().toISOString(),
      });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }
  // Return updated member list
  const { data, error: listError } = await supabase
    .from('organization_users')
    .select('user_id, role, status, invited_email, users: user_id(email, id)')
    .eq('org_id', orgId);
  if (listError) {
    return NextResponse.json({ error: listError.message }, { status: 500 });
  }
  const members = (data || []).map((row: any) => ({
    id: row.user_id,
    email: row.users?.email || row.invited_email,
    role: row.role,
    status: row.status,
    invited_email: row.invited_email,
  }));
  return NextResponse.json({ members });
} 