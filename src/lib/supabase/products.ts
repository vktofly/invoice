import { supabase } from './client';

export async function listTopProducts() {
  const { data, error } = await supabase.rpc('get_top_products');

  if (error) {
    console.error('Error fetching top products:', error);
    return [];
  }
  return data;
}
