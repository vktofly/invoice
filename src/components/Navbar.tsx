"use client";

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useOrganizationContext } from '@/contexts/OrganizationContext';
import { 
  BellIcon, 
  PlusIcon, 
  UserCircleIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserIcon
} from '@heroicons/react/24/outline';

interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    role?: string;
  };
}

export default function Navbar() {
  const { user, loading, signOut } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const {
    organizations,
    currentOrg,
    setCurrentOrg,
    loading: orgLoading,
  } = useOrganizationContext();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleLogout() {
    try {
      await signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  const getUserDisplayName = () => {
    if (!user) return '';
    return user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  };

  const getUserRole = () => {
    if (!user) return '';
    return user.user_metadata?.role || 'customer';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm">
      {/* Organization Switcher */}
      <div className="flex items-center gap-4">
        {user && !orgLoading && organizations.length > 0 && (
          organizations.length === 1 ? (
            <span className="font-semibold text-indigo-700 text-sm mr-2">{currentOrg?.name}</span>
          ) : (
            <select
              className="font-semibold text-indigo-700 text-sm border rounded px-2 py-1 mr-2 bg-white"
              value={currentOrg?.id || ''}
              onChange={e => {
                const org = organizations.find(o => o.id === e.target.value);
                if (org) setCurrentOrg(org);
              }}
            >
              {organizations.map(org => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
          )
        )}
        {/* Search bar center */}
        <div className="flex-1 flex justify-center">
          <input
            type="text"
            placeholder="Search..."
            className="w-full max-w-md rounded border px-3 py-1.5 text-sm focus:outline-none focus:ring"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4 ml-4">
        <button className="rounded-full p-2 hover:bg-gray-100">
          <PlusIcon className="h-6 w-6 text-indigo-600" />
        </button>
        <button className="rounded-full p-2 hover:bg-gray-100">
          <BellIcon className="h-6 w-6 text-gray-500" />
        </button>

        {/* User Profile Section */}
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        ) : user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-medium text-gray-900">
                  {getUserDisplayName()}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {getUserRole()}
                </div>
              </div>
              <ChevronDownIcon className="h-4 w-4 text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  {/* User Info */}
                  <div className="px-4 py-2 border-b">
                    <div className="text-sm font-medium text-gray-900">
                      {getUserDisplayName()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.email}
                    </div>
                    <div className="text-xs text-gray-400 capitalize mt-1">
                      {getUserRole()}
                    </div>
                  </div>

                  {/* Menu Items */}
                  <Link
                    href="/(protected)/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    <UserIcon className="h-4 w-4 mr-3" />
                    Profile
                  </Link>
                  
                  <Link
                    href="/(protected)/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    <Cog6ToothIcon className="h-4 w-4 mr-3" />
                    Settings
                  </Link>

                  <div className="border-t">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition-colors"
          >
            <UserCircleIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Sign In</span>
          </Link>
        )}
      </div>
    </header>
  );
} 