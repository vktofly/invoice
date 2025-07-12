import { supabase } from './client';
import type { TopCustomer } from '../types';

export async function listTopCustomers(): Promise<TopCustomer[]> {
  const { data, error } = await supabase.rpc('get_top_customers');

  if (error) {
    console.error('Error fetching top customers:', error);
    return [];
  }
  return data;
}
