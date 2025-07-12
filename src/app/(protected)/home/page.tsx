"use client";

import RoleProtected from '@/components/RoleProtected';
import DashboardPage from './DashboardPage';

export default function HomePage() {
  return (
    <RoleProtected allowedRoles={["user", "vendor"]}>
      <DashboardPage />
    </RoleProtected>
  );
}