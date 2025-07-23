import { getUser, getUserRole } from '@/lib/supabase/server-utils';
import SettingsForm from './SettingsForm';

export default async function SettingsPage() {
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

  return <SettingsForm user={user} />;
}