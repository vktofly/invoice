"use client";
import { useState } from "react";
import { QuestionMarkCircleIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import TotalReceivables from '@/components/TotalReceivables';
import SalesExpensesChart from '@/components/SalesExpensesChart';
import ProjectsCard from '@/components/ProjectsCard';
import TopExpensesCard from '@/components/TopExpensesCard';
import SalesReceiptsDuesTable from '@/components/SalesReceiptsDuesTable';
import RoleProtected from '@/components/RoleProtected';
import { useAuth } from '@/contexts/AuthContext';
import TabNav from '@/components/TabNav';

/**
 * HelpIcon component
 * Renders a help icon with a tooltip for additional context.
 * @param tooltip - The text to display in the tooltip
 */
function HelpIcon({ tooltip }: { tooltip: string }) {
  return (
    <span className="relative group ml-1 align-middle">
      <QuestionMarkCircleIcon className="h-5 w-5 text-gray-400 inline" aria-label="Help" />
      {/* Tooltip appears on hover/focus */}
      <span className="absolute left-1/2 z-10 hidden w-40 -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block group-focus:block">
        {tooltip}
      </span>
    </span>
  );
}

// Tab definitions for the home page navigation
const TABS = [
  { label: "Dashboard", value: "dashboard" },
  { label: "Announcements", value: "announcements" },
  { label: "Recent Updates", value: "updates" },
];

/**
 * HomePage component
 * Main landing page for the user after login.
 * Displays a dashboard with widgets, tab navigation, and a floating help button.
 */
export default function HomePage() {
  const { user } = useAuth();
  const displayName = user?.user_metadata?.name || user?.email || 'User';
  // State for the currently selected tab
  const [tab, setTab] = useState("dashboard");

  return (
    <RoleProtected allowedRoles={["user", "vendor"]}>
      <div className="w-full">
        {/* Header section with greeting and user avatar */}
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
          {/* Dashboard Tab */}
          {tab === "dashboard" && (
            <div className="max-w-7xl mx-auto space-y-8 p-4 sm:p-8">
              {/* Total Receivables Widget */}
              <TotalReceivables />

              {/* Sales and Expenses + Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-2">
                  <SalesExpensesChart />
                </div>
                <div>
                  {/* You can create a separate summary card if needed */}
                  {/* Placeholder for summary card, or move this to SalesExpensesChart */}
                </div>
              </div>

              {/* Projects and Top Expenses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProjectsCard />
                <TopExpensesCard />
              </div>

              {/* Sales, Receipts, and Dues Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SalesReceiptsDuesTable />
              </div>
            </div>
          )}
          {/* Announcements Tab */}
          {tab === "announcements" && (
            <div className="p-8">
              <h2 className="text-xl font-semibold mb-4">Announcements</h2>
              <div className="rounded bg-white p-6 shadow text-gray-500">No announcements yet.</div>
            </div>
          )}
          {/* Recent Updates Tab */}
          {tab === "updates" && (
            <div className="p-8">
              <h2 className="text-xl font-semibold mb-4">Recent Updates</h2>
              <div className="rounded bg-white p-6 shadow text-gray-500">No recent updates.</div>
            </div>
          )}
        </div>

        {/* Floating Need Assistance Button */}
        <button
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-lg border border-indigo-200 hover:bg-indigo-50 transition-colors"
          aria-label="Need Assistance?"
        >
          <span className="inline-block h-3 w-3 rounded-full bg-pink-400 animate-pulse" />
          <span className="font-medium text-indigo-700">Need Assistance?</span>
        </button>
      </div>
    </RoleProtected>
  );
} 