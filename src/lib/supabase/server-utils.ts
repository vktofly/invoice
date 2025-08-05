import { createSupabaseServerClient } from '@/lib/supabase/server';
import { User } from '@supabase/supabase-js';

export const getServerSupabase = createSupabaseServerClient;

export async function getUser(): Promise<User | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Error getting user:', error.message);
    return null;
  }

  return data.user;
}

export async function getUserRole(): Promise<string | null> {
  const user = await getUser();
  if (!user) return null;

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Error getting user role:', error.message);
    return null;
  }

  return data.role;
}
