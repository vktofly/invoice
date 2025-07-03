// This is the main dashboard page for the app. It determines the user's role and displays the appropriate dashboard (Vendor or Customer).
// It also provides tab navigation for Dashboard, Announcements, and Recent Updates.

'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import the Vendor and Customer dashboards to avoid SSR issues
const VendorDashboard = dynamic(() => import('@/components/VendorDashboard'), { ssr: false });
const CustomerDashboard = dynamic(() => import('@/components/CustomerDashboard'), { ssr: false });

/**
 * Announcements tab panel component.
 * Displays announcements for the user (currently a placeholder).
 */
function Announcements() {
  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-4">Announcements</h2>
      <div className="rounded bg-white p-6 shadow text-gray-500">No announcements yet.</div>
    </div>
  );
}

/**
 * Recent Updates tab panel component.
 * Displays recent updates for the user (currently a placeholder).
 */
function RecentUpdates() {
  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-4">Recent Updates</h2>
      <div className="rounded bg-white p-6 shadow text-gray-500">No recent updates.</div>
    </div>
  );
}

// Tab definitions for the dashboard navigation
const TABS = [
  { label: "Dashboard", value: "dashboard" },
  { label: "Announcements", value: "announcements" },
  { label: "Recent Updates", value: "updates" },
];

/**
 * DashboardPage component
 * Determines the user's role and displays the appropriate dashboard.
 * Shows tab navigation for vendors, and redirects admins to the admin dashboard.
 */
export default function DashboardPage() {
  // The user's role (vendor, customer, or admin)
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();
  // The currently selected tab (for vendors)
  const [tab, setTab] = useState("dashboard");

  // On mount, check the user's session and role
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      // Get the user's role from their metadata, default to 'customer' if not set
      const r = (data.session?.user.user_metadata?.role as string) || 'customer';
      if (r === 'admin') {
        // Redirect admins to the admin dashboard
        router.replace('/admin');
      } else {
        setRole(r);
      }
    });
  }, [router]);

  // Show a loading state while determining the user's role
  if (!role)
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <p className="text-gray-600">Loading…</p>
      </div>
    );

  // If the user is a vendor, show the tabbed dashboard
  if (role === 'vendor') return (
    <div className="w-full">
      {/* Tabs for navigation between dashboard sections */}
      <div className="flex gap-2 border-b bg-white px-8 pt-6">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-4 py-2 -mb-px border-b-2 font-medium transition-colors duration-150 focus:outline-none ${
              tab === t.value
                ? "border-indigo-600 text-indigo-700"
                : "border-transparent text-gray-500 hover:text-indigo-600"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {/* Tab Panels: Render the selected tab's content */}
      <div className="min-h-[60vh] bg-gray-50">
        {tab === "dashboard" && (
          <div className="max-w-7xl mx-auto">
            <VendorDashboard />
          </div>
        )}
        {tab === "announcements" && <Announcements />}
        {tab === "updates" && <RecentUpdates />}
      </div>
    </div>
  );
  // For customers, show the customer dashboard
  return <CustomerDashboard />;
} 