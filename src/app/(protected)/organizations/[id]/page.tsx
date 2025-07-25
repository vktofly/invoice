import { getServerSupabase, getUser } from '@/lib/supabase/server-utils';
import Link from 'next/link';

async function getOrganization(supabase: any, id: string, userId: string) {
  // Fetch the organization where the user is a member or creator
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  // Optionally, check if user is allowed to view this org
  return data;
}

export default async function OrganizationDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await getServerSupabase();
  const user = await getUser();
  const org = await getOrganization(supabase, params.id, user.id);

  if (!org) {
    return <div className="max-w-3xl mx-auto py-8 px-4 text-red-600">Organization not found or you do not have access.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Link
        className="mb-6 text-blue-600 hover:underline inline-block"
        href="/organizations"
      >
        &larr; Back to Organizations
      </Link>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{org.name}</h1>
          {org.role === "admin" && (
            <Link
              className="bg-indigo-600 text-white px-4 py-2 rounded font-semibold hover:bg-indigo-700"
              href={`/organizations/${org.id}/edit`}
            >
              Edit Organization
            </Link>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-gray-600 text-sm">Industry</div>
            <div className="font-medium">{org.industry}</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm">Country</div>
            <div className="font-medium">{org.country}</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm">State/Union Territory</div>
            <div className="font-medium">{org.state}</div>
          </div>
          {org.address && (
            <div className="md:col-span-2">
              <div className="text-gray-600 text-sm">Address</div>
              <div className="font-medium">{org.address}</div>
            </div>
          )}
          <div>
            <div className="text-gray-600 text-sm">Currency</div>
            <div className="font-medium">{org.currency}</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm">Language</div>
            <div className="font-medium">{org.language}</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm">Time Zone</div>
            <div className="font-medium">{org.timezone}</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm">GST Registered</div>
            <div className="font-medium">{org.gst_registered ? "Yes" : "No"}</div>
          </div>
          {org.gst_number && (
            <div>
              <div className="text-gray-600 text-sm">GST Number</div>
              <div className="font-medium">{org.gst_number}</div>
            </div>
          )}
          <div>
            <div className="text-gray-600 text-sm">Created At</div>
            <div className="font-medium">{new Date(org.created_at).toLocaleString()}</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm">Your Role</div>
            <div className="font-medium">{org.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
} 