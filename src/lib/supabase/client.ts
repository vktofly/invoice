import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
console.log({supabaseUrl, supabaseKey});
export const supabase = createClient(supabaseUrl, supabaseKey); 