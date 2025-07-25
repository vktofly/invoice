'use client';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import { InvoiceStatusChartSkeleton } from './skeletons/InvoiceStatusChartSkeleton';

async function fetchData() {
  // Simulate a network request
  await new Promise(resolve => setTimeout(resolve, 2500));
  return {
    draft: 15,
    sent: 45,
    paid: 250,
    overdue: 20,
  };
}

export function InvoiceStatusChart() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData().then(data => {
      setData(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <InvoiceStatusChartSkeleton />;
  }

  const chartData = [
    { name: 'Paid', value: data.paid },
    { name: 'Pending', value: data.sent },
    { name: 'Overdue', value: data.overdue },
    { name: 'Draft', value: data.draft },
  ].filter(item => item.value > 0);

  const COLORS = {
    Paid: 'hsl(var(--status-paid))',
    Pending: 'hsl(var(--status-pending))',
    Overdue: 'hsl(var(--status-overdue))',
    Draft: 'hsl(var(--status-draft))',
  };

  return (
    <div className="bg-card text-card-foreground rounded-lg border p-6 shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
      <h3 className="text-lg font-semibold text-foreground mb-4">Invoice Status</h3>
      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">No invoice data to display.</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={110}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [value, name]}
              contentStyle={{
                background: 'hsl(var(--popover))',
                color: 'hsl(var(--popover-foreground))',
                borderRadius: 'var(--radius)',
                border: '1px solid hsl(var(--border))',
              }}
            />
            <Legend iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

