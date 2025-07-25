import { supabase } from './client';
import type { TopCustomer } from '../types';

export async function getTopCustomers() {
  
  const { data, error } = await supabase.rpc('get_top_customers');
  return { data, error };
}
