import { createClient } from './client';
import type { TopCustomer } from '../types';

export async function getTopCustomers() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('get_top_customers');
  return { data, error };
}
