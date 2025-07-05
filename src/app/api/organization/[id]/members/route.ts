import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

// GET: List all members
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const orgId = params.id;
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
  // Check if user is a member
  const { data: membership } = await supabase
    .from('organization_users')
    .select('role')
    .eq('user_id', user.id)
    .eq('org_id', orgId)
    .single();
  if (!membership) {
    return NextResponse.json({ error: 'You do not have access to this organization.' }, { status: 403 });
  }
  // List all members (join users)
  const { data, error } = await supabase
    .from('organization_users')
    .select('user_id, role, status, invited_email, users: user_id(email, id)')
    .eq('org_id', orgId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  // Map to clean output
  const members = (data || []).map((row: any) => ({
    id: row.user_id,
    email: row.users?.email || row.invited_email,
    role: row.role,
    status: row.status,
    invited_email: row.invited_email,
  }));
  return NextResponse.json({ members });
}

// PATCH: Update member role or remove member (admin only)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const orgId = params.id;
  const { user_id, action, role } = await req.json();
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
  if (action === 'remove') {
    // Remove member
    const { error } = await supabase
      .from('organization_users')
      .delete()
      .eq('user_id', user_id)
      .eq('org_id', orgId);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  } else if (action === 'update_role' && role) {
    // Update role
    const { error } = await supabase
      .from('organization_users')
      .update({ role })
      .eq('user_id', user_id)
      .eq('org_id', orgId);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  } else {
    return NextResponse.json({ error: 'Invalid action or missing role.' }, { status: 400 });
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