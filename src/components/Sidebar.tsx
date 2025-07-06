"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  UsersIcon,
  CubeIcon,
  DocumentTextIcon,
  CurrencyRupeeIcon,
  ClipboardDocumentListIcon,
  ReceiptPercentIcon,
  BanknotesIcon,
  ClockIcon,
  ChartBarIcon,
  WrenchScrewdriverIcon,
  Cog6ToothIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';


const navItems = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Customers', href: '/customers', icon: UsersIcon },
  { name: 'Items', href: '/items', icon: CubeIcon },
  { name: 'Quotes', href: '/quotes', icon: ClipboardDocumentListIcon },
  { name: 'Delivery Challans', href: '/challans', icon: ReceiptPercentIcon },
  { name: 'Invoices', href: '/invoices', icon: DocumentTextIcon },
  { name: 'Payments Received', href: '/payments', icon: CurrencyRupeeIcon },
  { name: 'Expenses', href: '/expenses', icon: BanknotesIcon },
  { name: 'Time Tracking', href: '/timetracking', icon: ClockIcon },
  { name: 'Reports', href: '/reports', icon: ChartBarIcon },
  { name: 'Advanced Billing', href: '/advanced-billing', icon: WrenchScrewdriverIcon },
  { name: 'Configure Features', href: '/features', icon: AdjustmentsHorizontalIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const role = user?.user_metadata?.role;

  let filteredNavItems: typeof navItems = [];
  if (role === 'customer') {
    filteredNavItems = [
      { name: 'My Invoices', href: '/customer/invoices', icon: DocumentTextIcon },
      { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
    ];
  } else if (role === 'vendor' || role === 'user') {
    filteredNavItems = navItems;
  } // else: show nothing

  if (!role) return null;

  return (
    <aside className="fixed inset-y-0 left-0 z-20 w-64 flex flex-col border-r bg-white p-4 shadow-sm h-screen overflow-y-auto">
      <div className="mb-6 text-xl font-bold text-indigo-600">InvoiceApp</div>
      <nav className="flex flex-1 flex-col gap-1 text-sm font-medium">
        {filteredNavItems.map((item, idx) => {
          const Icon = item.icon;
          const active = pathname?.startsWith(item.href);
          const dividerAfter = [0, 2, 5, 7, 9, 11].includes(idx);
          return (
            <React.Fragment key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 rounded px-3 py-2 hover:bg-indigo-50 ${
                  active ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-gray-700'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
              {dividerAfter && <div className="my-2 border-t" />}
            </React.Fragment>
          );
        })}
      </nav>
    </aside>
  );
} 