"use client";
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const InvoiceStatusChart = ({ data }) => {
  const chartData = [
    { name: 'Draft', value: data.draft },
    { name: 'Sent', value: data.sent },
    { name: 'Paid', value: data.paid },
    { name: 'Overdue', value: data.overdue },
  ].filter(item => item.value > 0); // Filter out statuses with 0 invoices

  const COLORS = {
    Draft: '#a0aec0', // gray-500
    Sent: '#4299e1',  // blue-500
    Paid: '#48bb78',  // green-500
    Overdue: '#f56565',// red-500
  };

  if (chartData.length === 0) {
    return (
      <div className="bg-white/40 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg p-6 dark:bg-gray-800/40 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Invoice Status</h3>
        <div className="flex items-center justify-center h-60">
          <p className="text-gray-500 dark:text-gray-400">No invoice data to display.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/40 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg p-6 dark:bg-gray-800/40 dark:border-gray-700">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Invoice Status</h3>
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
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(5px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '0.5rem',
              color: '#333'
            }}
          />
          <Legend iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

