"use client";

import { ReactNode, useState } from 'react';
import { User } from '@supabase/supabase-js';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

interface ProtectedPageWrapperProps {
  user: User;
  children: ReactNode;
}

export default function ProtectedPageWrapper({ user, children }: ProtectedPageWrapperProps) {
  const [isCollapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    setCollapsed(!isCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        isCollapsed={isCollapsed}
        toggleCollapse={toggleCollapse}
        userRole={user.user_metadata.role || 'customer'}
      />
      <div className={`flex flex-col transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <Navbar
          user={user}
          onMenuButtonClick={toggleCollapse}
          isCollapsed={isCollapsed}
        />
        <main className="flex-grow p-4 sm:p-6 md:p-8 lg:p-10 pt-20">
          {children}
        </main>
      </div>
    </div>
  );
}