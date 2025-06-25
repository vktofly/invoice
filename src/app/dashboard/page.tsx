'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const VendorDashboard = dynamic(() => import('@/components/VendorDashboard'), { ssr: false });
const CustomerDashboard = dynamic(() => import('@/components/CustomerDashboard'), { ssr: false });

export default function DashboardPage() {
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const r = (data.session?.user.user_metadata?.role as string) || 'customer';
      if (r === 'admin') {
        router.replace('/admin');
      } else {
        setRole(r);
      }
    });
  }, [router]);

  if (!role)
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <p className="text-gray-600">Loading…</p>
      </div>
    );

  if (role === 'vendor') return <VendorDashboard />;
  return <CustomerDashboard />;
} 