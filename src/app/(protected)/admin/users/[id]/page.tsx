import { getServerSupabase } from '@/lib/supabase/server-utils';

async function getUserById(supabase: any, id: string) {
  // Use the admin API if available, otherwise fetch from your users table
  const { data, error } = await supabase.auth.admin.getUserById(id);
  if (error || !data?.user) return null;
  return data.user;
}

export default async function EditUserPage({ params }: { params: { id: string } }) {
  const supabase = await getServerSupabase();
  const user = await getUserById(supabase, params.id);

  if (!user) return <p className="p-8">User not found.</p>;

  // The rest (role change, save, delete) should be handled in a client subcomponent
  return (
    <div className="p-8 space-y-6 max-w-sm">
      <h1 className="text-2xl font-semibold">Edit User</h1>
      <div>
        <p className="mb-2 text-sm">{user.email}</p>
        {/* Client subcomponent for role change, save, and delete actions */}
      </div>
    </div>
  );
} 