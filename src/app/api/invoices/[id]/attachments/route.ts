
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  const { attachments } = await req.json();
  const invoiceId = params.id;

  if (!attachments || !Array.isArray(attachments)) {
    return NextResponse.json({ error: 'Invalid attachments data' }, { status: 400 });
  }

  const attachmentData = attachments.map(att => ({
    invoice_id: invoiceId,
    file_name: att.name,
    file_path: att.path,
    file_size: att.size,
    file_type: att.type,
    uploaded_by: user.id,
  }));

  const { error } = await supabaseAdmin
    .from('invoice_attachments')
    .insert(attachmentData);

  if (error) {
    console.error('Error creating attachments:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
