'use client';

import dynamic from 'next/dynamic';

export const DashboardStats = dynamic(() => import('@/components/DashboardStats'), { ssr: false });
export const RevenueTrendChart = dynamic(() => import('@/components/ModernRevenueChart'), { ssr: false });
export const OutstandingAgingChart = dynamic(() => import('@/components/ModernOutstandingAgingChart'), { ssr: false });
export const TopCustomers = dynamic(() => import('@/components/TopCustomers'), { ssr: false });
export const TopProducts = dynamic(() => import('@/components/TopProducts'), { ssr: false });
export const RecentInvoices = dynamic(() => import('@/components/RecentInvoices'), { ssr: false });
