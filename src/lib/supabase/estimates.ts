import { supabase } from './client';
import { Estimate } from '../types';

export async function getEstimates() {
  
  const { data, error } = await supabase.from('estimates').select('*, customers(name)');
  return { data, error };
}

export async function getEstimateById(id: string) {
  
  const { data, error } = await supabase
    .from('estimates')
    .select('*, customers(name)')
    .eq('id', id)
    .single();
  return { data, error };
}

export async function insertEstimate(estimate: any) {
  
  const { data, error } = await supabase.from('estimates').insert(estimate).single();
  return { data, error };
}

export async function updateEstimate(id: string, estimate: any) {
  
  const { data, error } = await supabase.from('estimates').update(estimate).eq('id', id).single();
  return { data, error };
}

export async function deleteEstimate(id: string) {
  
  const { error } = await supabase.from('estimates').delete().eq('id', id);
  return { error };
}
