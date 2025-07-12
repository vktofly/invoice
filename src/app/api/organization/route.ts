import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

// Helper: Validate org input (basic)
function validateOrgInput(body: any) {
  if (!body.name) return 'Organization name is required';
  if (!body.industry) return 'Industry is required';
  if (!body.country) return 'Country is required';
  if (!body.state) return 'State/Union Territory is required';
  if (!body.currency) return 'Currency is required';
  if (!body.language) return 'Language is required';
  if (!body.timezone) return 'Time zone is required';
  return null;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const error = validateOrgInput(body);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  // Insert into organizations
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .insert({
      name: body.name,
      industry: body.industry,
      country: body.country,
      state: body.state,
      address: body.address || null,
      currency: body.currency,
      language: body.language,
      timezone: body.timezone,
      gst_registered: !!body.gst,
      created_by: user.id,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();
  if (orgError) {
    return NextResponse.json({ error: orgError.message }, { status: 400 });
  }

  // Add user as admin in organization_users
  const { error: joinError } = await supabase
    .from('organization_users')
    .insert({
      user_id: user.id,
      org_id: org.id,
      role: 'admin',
      joined_at: new Date().toISOString(),
    });
  if (joinError) {
    return NextResponse.json({ error: joinError.message }, { status: 400 });
  }

  return NextResponse.json({ organization: org });
}

export async function GET() {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  // Join organization_users and organizations
  const { data, error } = await supabase
    .from('organization_users')
    .select('role, org_id, organizations:org_id(*)')
    .eq('user_id', user.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Flatten response
  const organizations = (data || []).map((row: any) => ({
    ...row.organizations,
    role: row.role,
  }));

  return NextResponse.json({ organizations });
} 