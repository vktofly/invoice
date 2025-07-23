import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('full_name, address')
    .eq('id', user.id)
    .single();

  if (error) {
    // If no profile is found, it's not a server error, just no data yet.
    if (error.code === 'PGRST116') {
        return NextResponse.json({ profile: { full_name: '', address: '' } });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile });
}

export async function PUT(request: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
  
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    const { full_name, address } = await request.json();
  
    const { data, error } = await supabase
      .from('profiles')
      .update({ 
        full_name, 
        address,
        updated_at: new Date().toISOString() 
      })
      .eq('id', user.id)
      .select()
      .single();
  
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  
    return NextResponse.json({ profile: data });
  }
