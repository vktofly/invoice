'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import { ModernRevenueChartSkeleton } from './skeletons/ModernRevenueChartSkeleton';

async function fetchData() {
  // Simulate a network request
  await new Promise(resolve => setTimeout(resolve, 3000));
  return [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 5000 },
    { name: 'Apr', revenue: 4500 },
    { name: 'May', revenue: 6000 },
    { name: 'Jun', revenue: 5500 },
  ];
}

export default function ModernRevenueChart() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData().then(data => {
      setData(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <ModernRevenueChartSkeleton />;
  }

  return (
    <div className="bg-card text-card-foreground rounded-lg border p-6 shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
      <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="name"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={value => `${value / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              background: 'hsl(var(--popover))',
              color: 'hsl(var(--popover-foreground))',
              borderRadius: 'var(--radius)',
              border: '1px solid hsl(var(--border))',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '14px', color: 'hsl(var(--muted-foreground))' }} />
          <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
