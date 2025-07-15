import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import AuditLogClientPage from './client-page';

export default async function AuditLogPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: logs, error } = await supabase.from('audit_log').select('*');

  if (error) {
    return <p>Error loading audit logs.</p>;
  }

  return <AuditLogClientPage logs={logs} />;
}