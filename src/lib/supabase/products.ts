import { createClient } from './client';

export async function getTopProducts() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('get_top_products');
  return { data, error };
}
