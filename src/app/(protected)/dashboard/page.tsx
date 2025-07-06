// This is the main dashboard page for the app. It determines the user's role and displays the appropriate dashboard (Vendor or Customer).
// It also provides tab navigation for Dashboard, Announcements, and Recent Updates.

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import RoleProtected from '@/components/RoleProtected';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import TabNav from '@/components/TabNav';

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
  const { user } = useAuth();
  const displayName = user?.user_metadata?.name || user?.email || 'User';
  // The user's role (vendor, customer, or admin)
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();
  // The currently selected tab (for vendors)
  const [tab, setTab] = useState("dashboard");

  // On mount, check the user's role
  useEffect(() => {
    if (user) {
      // Get the user's role from their metadata, default to 'customer' if not set
      const r = (user.user_metadata?.role as string) || 'customer';
      if (r === 'admin') {
        // Redirect admins to the admin dashboard
        router.replace('/admin');
      } else {
        setRole(r);
      }
    }
  }, [user, router]);

  // Show a loading state while determining the user's role
  if (!role)
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <p className="text-gray-600">Loading…</p>
      </div>
    );

  // If the user is a vendor, show the tabbed dashboard
  if (role === 'vendor') return (
    <RoleProtected allowedRoles={["user", "vendor"]}>
      <ProtectedRoute>
        <div className="w-full">
          {/* Personalized Greeting */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-8 pt-8 pb-2">
            <div>
              <h1 className="text-2xl font-semibold flex items-center gap-2">Hello, {displayName} <span className="text-lg font-normal text-gray-400">👋</span></h1>
              <div className="text-gray-500 text-sm">{user?.email}</div>
            </div>
            <div className="flex items-center gap-2">
              <UserCircleIcon className="h-10 w-10 text-gray-300" />
            </div>
          </div>
          {/* Unified TabNav */}
          <TabNav tabs={TABS} value={tab} onChange={setTab} />
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
      </ProtectedRoute>
    </RoleProtected>
  );
  // For customers, show the customer dashboard
  return (
    <RoleProtected allowedRoles={["user", "vendor"]}>
      <ProtectedRoute>
        {/* Personalized Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-8 pt-8 pb-2">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2">Hello, {displayName} <span className="text-lg font-normal text-gray-400">👋</span></h1>
            <div className="text-gray-500 text-sm">{user?.email}</div>
          </div>
          <div className="flex items-center gap-2">
            <UserCircleIcon className="h-10 w-10 text-gray-300" />
          </div>
        </div>
        <CustomerDashboard />
      </ProtectedRoute>
    </RoleProtected>
  );
} 