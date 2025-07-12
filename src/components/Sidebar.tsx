"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  HomeIcon,
  UsersIcon,
  CubeIcon,
  DocumentTextIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  ShoppingCartIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const navGroups = [
  {
    name: 'General',
    items: [
      { name: 'Home', href: '/home', icon: HomeIcon },
    ]
  },
  {
    name: 'Sales',
    items: [
      { name: 'Invoices', href: '/invoices', icon: DocumentTextIcon },
      { name: 'Recurring', href: '/recurring-invoices', icon: ArrowPathIcon },
      { name: 'Customers', href: '/customer', icon: UsersIcon },
      { name: 'Products', href: '/products', icon: CubeIcon },
    ]
  },
  {
    name: 'Purchases',
    items: [
      { name: 'Expenses', href: '/expenses', icon: ShoppingCartIcon },
    ]
  },
  {
    name: 'Productivity',
    items: [
      { name: 'Time Tracking', href: '/time-tracking', icon: ClockIcon },
    ]
  },
  {
    name: 'Analysis',
    items: [
      { name: 'Reports', href: '/reports', icon: ChartBarIcon },
    ]
  },
  {
    name: 'Configuration',
    items: [
      { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
    ]
  }
];

const customerNavItems = [
  { name: 'My Invoices', href: '/customer/invoices', icon: DocumentTextIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const role = user?.user_metadata?.role;
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  if (!role) return null;

  const itemsToRender = role === 'customer' ? [{ name: 'General', items: customerNavItems }] : navGroups;

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex h-screen w-64 flex-col border-r border-white/20 bg-white/40 p-4 backdrop-blur-lg dark:bg-gray-800/40 dark:border-gray-700">
      <div className="flex items-center gap-3 px-2 py-4">
        <Link href="/home" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="App Logo"
            width={32}
            height={32}
            className="rounded-lg"
            priority
          />
          <span className="text-xl font-bold text-gray-800 dark:text-gray-100">Invoicer</span>
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-y-2">
        {itemsToRender.map((group) => (
          <div key={group.name}>
            <div className="my-2 border-t border-white/20 dark:border-gray-700" />
            <h3 className="px-3 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">{group.name}</h3>
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all
                    ${
                      active
                        ? 'bg-white/60 text-gray-900 dark:bg-gray-700/60 dark:text-white'
                        : 'text-gray-700 hover:bg-white/50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white'
                    }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
} 