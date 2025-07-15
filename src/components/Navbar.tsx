"use client";

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BellIcon, 
  PlusIcon, 
  UserCircleIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  DocumentTextIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

export default function Navbar({ onMenuButtonClick }: { onMenuButtonClick: () => void }) {
  const { user, loading, signOut } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]);
  
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const createDropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      try {
        const response = await fetch('/api/notifications');
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();
  }, [user]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
      if (createDropdownRef.current && !createDropdownRef.current.contains(event.target as Node)) {
        setShowCreateDropdown(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleLogout() {
    await signOut();
    router.replace('/login');
  }

  const getUserDisplayName = () => user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const getUserRole = () => user?.user_metadata?.role || 'customer';

  return (
    <header className="fixed top-0 right-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/20 bg-white/40 px-6 backdrop-blur-lg transition-all duration-300 lg:w-[calc(100%-16rem)] dark:bg-gray-800/40 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <button onClick={onMenuButtonClick} className="lg:hidden">
          <Bars3Icon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        </button>
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full rounded-md border-white/30 bg-white/50 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-blue-500"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative" ref={createDropdownRef}>
          <button 
            onClick={() => setShowCreateDropdown(!showCreateDropdown)}
            className="btn-primary flex items-center gap-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            <PlusIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Create</span>
            <ChevronDownIcon className="h-4 w-4" />
          </button>
          {showCreateDropdown && (
            <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md shadow-lg bg-white/80 backdrop-blur-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800/80 dark:ring-white/10">
              <div className="py-1">
                <Link href="/invoices/new" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-white/50 dark:text-gray-300 dark:hover:bg-gray-700/50">
                  <DocumentTextIcon className="h-4 w-4 mr-3" /> New Invoice
                </Link>
                <Link href="/recurring-invoices/new" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-white/50 dark:text-gray-300 dark:hover:bg-gray-700/50">
                  <ArrowPathIcon className="h-4 w-4 mr-3" /> New Recurring Invoice
                </Link>
              </div>
            </div>
          )}
        </div>
        
        <div className="relative" ref={notificationsRef}>
          <button 
            className="rounded-full p-2 text-gray-500 hover:bg-white/50 dark:text-gray-400 dark:hover:bg-gray-700/50"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <BellIcon className="h-6 w-6" />
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-lg shadow-lg bg-white/80 backdrop-blur-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800/80 dark:ring-white/10">
              <div className="p-3 font-semibold border-b border-white/20 dark:border-gray-700">Notifications</div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <Link key={n.id} href={n.link || '#'} className="block px-4 py-3 text-sm hover:bg-white/50 dark:hover:bg-gray-700/50">
                      {n.message}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{new Date(n.created_at).toLocaleString()}</p>
                    </Link>
                  ))
                ) : (
                  <div className="p-4 text-sm text-center text-gray-500 dark:text-gray-400">No new notifications</div>
                )}
              </div>
              <div className="border-t border-white/20 dark:border-gray-700">
                <Link href="/notifications" className="block py-2 text-sm font-medium text-center text-blue-600 hover:bg-white/50 dark:text-blue-400 dark:hover:bg-gray-700/50">View all notifications</Link>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse" />
        ) : user ? (
          <div className="relative" ref={userDropdownRef}>
            <button onClick={() => setShowUserDropdown(!showUserDropdown)} className="flex items-center gap-2">
              <UserCircleIcon className="h-9 w-9 text-gray-500 dark:text-gray-400" />
              <div className="hidden sm:block text-left">
                <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{getUserDisplayName()}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{getUserRole()}</div>
              </div>
              <ChevronDownIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </button>
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md shadow-lg bg-white/80 backdrop-blur-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800/80 dark:ring-white/10">
                <div className="py-1">
                  <div className="px-4 py-3 border-b border-white/20 dark:border-gray-700">
                    <p className="text-sm font-medium truncate">{getUserDisplayName()}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                  </div>
                  <Link href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-white/50 dark:text-gray-300 dark:hover:bg-gray-700/50">
                    <UserIcon className="h-4 w-4 mr-3" /> Profile
                  </Link>
                  <Link href="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-white/50 dark:text-gray-300 dark:hover:bg-gray-700/50">
                    <Cog6ToothIcon className="h-4 w-4 mr-3" /> Settings
                  </Link>
                  <div className="py-1 border-t border-white/20 dark:border-gray-700">
                    <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/50">
                      <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" /> Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" className="btn-primary bg-blue-500 hover:bg-blue-600">Sign In</Link>
        )}
      </div>
    </header>
  );
} 