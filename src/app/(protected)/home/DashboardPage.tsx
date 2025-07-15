"use client";
import React, { useState, useEffect } from 'react';
import {
  PlusCircleIcon,
  DocumentChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { listInvoices } from '@/lib/supabase/invoices';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardSkeleton } from '@/components/DashboardSkeleton';
import ModernRevenueChart from '@/components/ModernRevenueChart';

import { InvoicePDFDownloader } from '@/components/invoice/InvoicePDFDownloader';
import { InvoiceStatusChart } from '@/components/InvoiceStatusChart';
import { TopCustomers } from '@/components/TopCustomers';
import RecurringInvoicesSummaryWidget from '@/components/RecurringInvoicesSummary';
import { TopProducts } from '@/components/TopProducts';
import { QuickActionsCard } from '@/components/QuickActionsCard';
import { InvoiceList } from '@/components/InvoiceList';
import { StatCard } from '@/components/StatCard';
import DashboardStats from '@/components/DashboardStats';
import ModernOutstandingAgingChart from '@/components/ModernOutstandingAgingChart';
import RecentInvoices from '@/components/RecentInvoices';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <DashboardStats />
      <RecurringInvoicesSummaryWidget />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ModernRevenueChart />
        </div>
        <div className="lg:col-span-1">
          <ModernOutstandingAgingChart />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TopCustomers />
        <TopProducts />
      </div>
      <RecentInvoices />
    </div>
  );
}