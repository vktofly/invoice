import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: organizations, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('created_by', user.id);

  if (error) {
    console.error('Error fetching organizations:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ organizations });
}

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  const { data: organization, error } = await supabase
    .from('organizations')
    .insert([{ ...body, created_by: user.id }])
    .select()
    .single();

  if (error) {
    console.error('Error creating organization:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ organization });
}

export async function PUT(request: NextRequest) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
  
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    const body = await request.json();
    const { id, ...updateData } = body;
  
    if (!id) {
      return NextResponse.json({ error: 'Organization ID is required for an update' }, { status: 400 });
    }
  
    const { data: organization, error } = await supabase
      .from('organizations')
      .update(updateData)
      .eq('id', id)
      .eq('created_by', user.id)
      .select()
      .single();
  
    if (error) {
      console.error('Error updating organization:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  
    return NextResponse.json({ organization });
  }