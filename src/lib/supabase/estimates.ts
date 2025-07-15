import { supabase } from './client';
import { Estimate } from '../types';

export const getEstimates = async (): Promise<Estimate[]> => {
  const { data, error } = await supabase.from('estimates').select('*, customers(name)');
  if (error) throw new Error(error.message);
  return data as Estimate[];
};

export const getEstimate = async (id: string): Promise<Estimate | null> => {
  const { data, error } = await supabase
    .from('estimates')
    .select('*, customers(name), estimate_items(*)')
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  return data as Estimate;
};

export const createEstimate = async (estimate: Partial<Estimate>): Promise<Estimate> => {
  const { data, error } = await supabase.from('estimates').insert(estimate).single();
  if (error) throw new Error(error.message);
  return data as Estimate;
};

export const updateEstimate = async (id: string, estimate: Partial<Estimate>): Promise<Estimate> => {
  const { data, error } = await supabase.from('estimates').update(estimate).eq('id', id).single();
  if (error) throw new Error(error.message);
  return data as Estimate;
};

export const deleteEstimate = async (id: string): Promise<void> => {
  const { error } = await supabase.from('estimates').delete().eq('id', id);
  if (error) throw new Error(error.message);
};
