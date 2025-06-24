"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  DocumentTextIcon,
  UsersIcon,
  CubeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Invoices', href: '/invoices', icon: DocumentTextIcon },
  { name: 'Clients', href: '/clients', icon: UsersIcon },
  { name: 'Products', href: '/products', icon: CubeIcon },
  { name: 'Reports', href: '/reports', icon: ChartBarIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r bg-white p-4 shadow-sm lg:flex">
      <div className="mb-6 text-xl font-bold text-indigo-600">InvoiceApp</div>
      <nav className="flex flex-1 flex-col gap-1 text-sm font-medium">
        {navItems.map((item) => {
          const active = pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded px-3 py-2 hover:bg-indigo-50 ${
                active ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-gray-700'
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
} 