"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  UsersIcon,
  CubeIcon,
  DocumentTextIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ClockIcon,
  ShoppingCartIcon,
  ArrowPathIcon,
  PlusCircleIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  name: string;
  href: string;
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement> & { title?: string; titleId?: string; } & React.RefAttributes<SVGSVGElement>>;
  subItems?: NavItem[];
}

interface NavGroup {
  name:string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    name: 'General',
    items: [
      { name: 'Home', href: '/home', icon: HomeIcon },
    ]
  },
  {
    name: 'Sales',
    items: [
      { name: 'Invoices', href: '/invoices', icon: DocumentTextIcon, subItems: [
        { name: 'New Invoice', href: '/invoices/new', icon: PlusCircleIcon },
      ]},
      { name: 'Recurring', href: '/recurring-invoices', icon: ArrowPathIcon, subItems: [
        { name: 'New Recurring', href: '/recurring-invoices/new', icon: PlusCircleIcon },
      ]},
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
      { name: 'Estimates', href: '/estimates', icon: DocumentTextIcon },
    ]
  },
  {
    name: 'Configuration',
    items: [
      { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
    ]
  }
];

const customerNavItems: NavItem[] = [
  { name: 'My Invoices', href: '/customer/invoices', icon: DocumentTextIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

interface SidebarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

export default function Sidebar({ isCollapsed, toggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const role = user?.user_metadata?.role;
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (name: string) => {
    setOpenSections(prev => ({ ...prev, [name]: !prev[name] }));
  };

  if (!role) return null;

  const itemsToRender = role === 'customer' ? [{ name: 'General', items: customerNavItems }] : navGroups;

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 flex h-screen flex-col border-r border-white/20 bg-white/40 p-4 backdrop-blur-lg transition-all duration-300 dark:border-gray-700 dark:bg-gray-800/40 ${isCollapsed ? 'w-20' : 'w-64'}`}>
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
          <span className={`text-xl font-bold text-gray-800 dark:text-gray-100 ${isCollapsed ? 'hidden' : 'block'}`}>Invoicer</span>
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-y-2">
        {itemsToRender.map((group) => (
          <div key={group.name}>
            <div className={`my-2 border-t border-white/20 dark:border-gray-700 ${isCollapsed ? 'mx-auto w-10' : ''}`} />
            <h3 className={`px-3 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 ${isCollapsed ? 'hidden' : 'block'}`}>{group.name}</h3>
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isSectionOpen = openSections[item.name] || false;

              const linkClasses = `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? 'bg-white/60 text-gray-900 dark:bg-gray-700/60 dark:text-white'
                  : 'text-gray-700 hover:bg-white/50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white'
              } ${isCollapsed ? 'justify-center' : ''}`;

              return (
                <div key={item.name}>
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      className={`${linkClasses} flex-grow`}
                      title={isCollapsed ? item.name : ''}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span className={isCollapsed ? 'hidden' : 'block'}>{item.name}</span>
                    </Link>
                    {hasSubItems && !isCollapsed && (
                      <button onClick={() => toggleSection(item.name)} className="p-1 rounded-md hover:bg-white/50 dark:hover:bg-gray-700/50">
                        <ChevronDownIcon className={`h-5 w-5 transition-transform ${isSectionOpen ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>
                  {!isCollapsed && isSectionOpen && hasSubItems && (
                    <div className="ml-4 mt-1">
                      {item.subItems.map(subItem => {
                        const SubIcon = subItem.icon;
                        const subActive = pathname === subItem.href;
                        return (
                          <Link key={subItem.name} href={subItem.href} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${subActive ? 'bg-white/60 text-gray-900 dark:bg-gray-700/60 dark:text-white' : 'text-gray-700 hover:bg-white/50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white'}`}>
                            <SubIcon className="h-4 w-4" />
                            <span>{subItem.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="mt-auto flex justify-center border-t border-white/20 pt-4 dark:border-gray-700">
        <button
          onClick={toggleCollapse}
          className="flex items-center justify-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-white/50 dark:text-gray-300 dark:hover:bg-gray-700/50"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronDoubleRightIcon className="h-6 w-6" /> : <ChevronDoubleLeftIcon className="h-6 w-6" />}
        </button>
      </div>
    </aside>
  );
} 