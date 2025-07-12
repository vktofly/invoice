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
import { InvoicePDFDownloader } from '@/components/invoice/InvoicePDFDownloader';
import { InvoiceStatusChart } from '@/components/InvoiceStatusChart';
import { TopCustomers } from '@/components/TopCustomers';
import { RecurringInvoicesSummary } from '@/components/RecurringInvoicesSummary';
import { TopProducts } from '@/components/TopProducts';
import { QuickActionsCard } from '@/components/QuickActionsCard';
import { InvoiceList } from '@/components/InvoiceList';
import { StatCard } from '@/components/StatCard';


export default function DashboardPage() {
    const { user } = useAuth();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                setLoading(true);
                const invoiceData = await listInvoices();
                setInvoices(invoiceData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchInvoices();
        }
    }, [user]);

    if (loading) {
        return <DashboardSkeleton />;
    }

    if (error) {
        return <div className="text-center py-10">Error: {error}</div>;
    }
    
    const invoiceSummary = {
        draft: invoices.filter(inv => inv.status === 'draft').length,
        sent: invoices.filter(inv => inv.status === 'sent').length,
        paid: invoices.filter(inv => inv.status === 'paid').length,
        overdue: invoices.filter(inv => inv.status === 'overdue').length,
    };

    const recentInvoices = invoices.slice(0, 5);
    const overdueInvoices = invoices.filter(inv => inv.status === 'overdue');

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back! Here’s a summary of your business.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Draft" value={invoiceSummary.draft} icon={DocumentChartBarIcon} />
          <StatCard title="Sent" value={invoiceSummary.sent} icon={ClockIcon} />
          <StatCard title="Paid" value={invoiceSummary.paid} icon={CheckCircleIcon} />
          <StatCard title="Overdue" value={invoiceSummary.overdue} icon={ExclamationCircleIcon} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <InvoiceStatusChart data={invoiceSummary} />
                <TopProducts />
                <InvoiceList title="Recent Invoices" invoices={recentInvoices} />
            </div>

            <div className="space-y-8">
                <QuickActionsCard />
                <TopCustomers />
                <RecurringInvoicesSummary />
                <InvoiceList title="Overdue Invoices" invoices={overdueInvoices} />
            </div>
        </div>
      </main>
    </div>
  );
}