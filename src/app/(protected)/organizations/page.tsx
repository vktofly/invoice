import { getUser, getUserRole, getServerSupabase } from '@/lib/supabase/server-utils';
import Link from 'next/link';

async function getOrganizations(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('user_id', userId);
  if (error) {
    return [];
  }
  return data;
}

export default async function OrganizationsPage() {
  const userRole = await getUserRole();
  const allowedRoles = ["user", "vendor"];
  if (!userRole || !allowedRoles.includes(userRole)) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-2xl font-bold">Not Authorized</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }
  const supabase = await getServerSupabase();
  const user = await getUser();
  const organizations = await getOrganizations(supabase, user.id);
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Organizations</h1>
        <Link
          className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700"
          href="/organization-setup"
        >
          + New Organization
        </Link>
      </div>
      {organizations.length === 0 ? (
        <div>No organizations found. Create one to get started!</div>
      ) : (
        <div className="space-y-4">
          {organizations.map((org: any) => (
            <div key={org.id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between bg-white shadow-sm">
              <div>
                <div className="text-lg font-semibold">{org.name}</div>
                <div className="text-gray-600 text-sm">{org.industry} &bull; {org.country}</div>
                <div className="text-xs text-gray-500 mt-1">Role: <span className="font-medium">{org.role}</span></div>
              </div>
              <div className="mt-4 md:mt-0">
                <Link
                  className="bg-indigo-600 text-white px-4 py-2 rounded font-semibold hover:bg-indigo-700"
                  href={`/organizations/${org.id}`}
                >
                  Go to Organization
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 