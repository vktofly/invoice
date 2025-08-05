import { createClient } from './client';
const supabase = createClient();

export async function getTopProducts() {
  
  const { data, error } = await supabase.rpc('get_top_products');
  return { data, error };
}
