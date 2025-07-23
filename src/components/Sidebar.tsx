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
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';

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
    name: 'Analysis',
    items: [
      { name: 'Reports', href: '/reports', icon: ChartBarIcon },
    ]
  },
  {
    name: 'Configuration',
    items: [
      { name: 'Profile', href: '/profile', icon: UserCircleIcon },
      { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
    ]
  }
];

const customerNavItems: NavItem[] = [
  { name: 'My Invoices', href: '/customer/invoices', icon: DocumentTextIcon },
  { name: 'Profile', href: '/profile', icon: UserCircleIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

interface SidebarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  userRole: string;
}

export default function Sidebar({ isCollapsed, toggleCollapse, userRole }: SidebarProps) {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (name: string) => {
    setOpenSections(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const itemsToRender = userRole === 'customer' ? [{ name: 'General', items: customerNavItems }] : navGroups;

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 flex h-screen flex-col border-r border-white/10 bg-white/20 p-4 backdrop-blur-xl transition-all duration-300 dark:border-gray-700/50 dark:bg-gray-800/20 ${isCollapsed ? 'w-20' : 'w-72'}`}>
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
            <h3 className={`px-3 text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 ${isCollapsed ? 'hidden' : 'block'}`}>{group.name}</h3>
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isSectionOpen = openSections[item.name] || false;

              const linkClasses = `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-sans transition-all ${
                active
                  ? 'bg-blue-600 text-white font-semibold shadow-lg'
                  : 'text-slate-700 hover:bg-slate-500/10 dark:text-slate-300 dark:hover:bg-slate-700/20 font-normal'
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
                          <Link key={subItem.name} href={subItem.href} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-sans transition-all ${subActive ? 'bg-blue-600 text-white font-semibold shadow-lg' : 'text-slate-700 hover:bg-slate-500/10 dark:text-slate-300 dark:hover:bg-slate-700/20 font-normal'}`}>
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