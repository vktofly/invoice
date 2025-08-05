import { createSupabaseServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import AuditLogClientPage from './client-page';

export default async function AuditLogPage() {
  const supabase = createSupabaseServerClient();
  const { data: logs, error } = await supabase.from('audit_logs').select('*');

  if (error) {
    return <p>Error loading audit logs.</p>;
  }

  return <AuditLogClientPage logs={logs} />;
}