import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
  const supabase = createServerComponentClient({ cookies });
  const { data: maxData } = await supabase
    .from('invoices')
    .select('number')
    .order('number', { ascending: false })
    .limit(1);
  let nextNumber = 1;
  if (maxData && maxData.length > 0 && !isNaN(Number(maxData[0].number))) {
    nextNumber = Number(maxData[0].number) + 1;
  }
  const number = String(nextNumber).padStart(5, '0');
  return NextResponse.json({ number });
} 

