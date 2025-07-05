import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

function validateOrgInput(body: any) {
  if (!body.name) return 'Organization name is required';
  if (!body.industry) return 'Industry is required';
  if (!body.country) return 'Country is required';
  if (!body.state) return 'State/Union Territory is required';
  if (!body.currency) return 'Currency is required';
  if (!body.language) return 'Language is required';
  if (!body.timezone) return 'Time zone is required';
  if (body.gst_registered && !body.gst_number) return 'GST Number is required if GST is registered.';
  return null;
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const orgId = params.id;
  const body = await req.json();
  const error = validateOrgInput(body);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  // Check if user is admin of the org
  const { data: membership, error: membershipError } = await supabase
    .from('organization_users')
    .select('role')
    .eq('user_id', user.id)
    .eq('org_id', orgId)
    .single();
  if (membershipError || !membership || membership.role !== 'admin') {
    return NextResponse.json({ error: 'You do not have permission to edit this organization.' }, { status: 403 });
  }

  // Update organization
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .update({
      name: body.name,
      industry: body.industry,
      country: body.country,
      state: body.state,
      address: body.address || null,
      currency: body.currency,
      language: body.language,
      timezone: body.timezone,
      gst_registered: !!body.gst_registered,
      gst_number: body.gst_number || null,
    })
    .eq('id', orgId)
    .select()
    .single();
  if (orgError) {
    return NextResponse.json({ error: orgError.message }, { status: 400 });
  }

  return NextResponse.json({ organization: org });
} 