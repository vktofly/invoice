
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { InvoiceTemplateSchema } from '@/lib/schemas';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  const body = await req.json();
  const result = InvoiceTemplateSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  const { template_name, template_data } = result.data;

  // Fetch the user's organizations
  const { data: orgs, error: orgError } = await supabaseAdmin
    .from('organizations')
    .select('id')
    .eq('created_by', user.id)
    .limit(1);

  if (orgError || !orgs || orgs.length === 0) {
    return NextResponse.json({ error: 'Could not determine organization.' }, { status: 500 });
  }

  const organization_id = orgs[0].id;

  const { data, error } = await supabaseAdmin
    .from('invoice_templates')
    .insert([
      {
        user_id: user.id,
        organization_id: organization_id,
        template_name: template_name,
        template_data: template_data,
      },
    ])
    .select();

  if (error) {
    console.error('Error creating invoice template:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  const { data, error } = await supabaseAdmin
    .from('invoice_templates')
    .select('id, template_name')
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching invoice templates:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ templates: data }, { status: 200 });
}
