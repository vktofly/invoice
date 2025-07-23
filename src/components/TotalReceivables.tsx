'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';
import { useEffect, useState } from 'react';
import { TotalReceivablesSkeleton } from './skeletons/TotalReceivablesSkeleton';

async function fetchData() {
  // Simulate a network request
  await new Promise(resolve => setTimeout(resolve, 2000));
  return {
    totalReceivables: 34567.89,
    overdueAmount: 12345.67,
  };
}

export default function TotalReceivables() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData().then(data => {
      setData(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <TotalReceivablesSkeleton />;
  }

  return (
    <Card className="transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Receivables</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">${data.totalReceivables.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground">${data.overdueAmount.toLocaleString()} overdue</p>
      </CardContent>
    </Card>
  );
}
