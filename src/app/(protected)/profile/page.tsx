import { getUser, getUserRole, getServerSupabase } from '@/lib/supabase/server-utils';
import ProfileForm from './ProfileForm';

async function getProfile(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  return data;
}

export default async function ProfilePage() {
  const userRole = await getUserRole();
  const allowedRoles = ["user", "vendor", "customer"];

  if (!userRole || !allowedRoles.includes(userRole)) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold">Not Authorized</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  const user = await getUser();
  const supabase = await getServerSupabase();
  const profile = await getProfile(supabase, user.id);

  return <ProfileForm user={user} profile={profile} />;
}