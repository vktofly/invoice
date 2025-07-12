'use client';

import dynamic from 'next/dynamic';

export const DashboardStats = dynamic(() => import('@/components/DashboardStats'), { ssr: false });
export const RevenueTrendChart = dynamic(() => import('@/components/RevenueTrendChart'), { ssr: false });
export const OutstandingAgingChart = dynamic(() => import('@/components/OutstandingAgingChart'), { ssr: false });
export const TopCustomers = dynamic(() => import('@/components/TopCustomers').then(mod => mod.TopCustomers), { ssr: false });
export const TopProducts = dynamic(() => import('@/components/TopProducts').then(mod => mod.TopProducts), { ssr: false });
export const RecentInvoices = dynamic(() => import('@/components/RecentInvoices'), { ssr: false });
