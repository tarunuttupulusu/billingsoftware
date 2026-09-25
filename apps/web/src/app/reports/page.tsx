'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/state';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Calendar,
  Download,
  Users,
  Award,
} from 'lucide-react';

export default function ReportsAnalyticsPage() {
  const { profile } = useApp();
  const [dateRange, setDateRange] = useState<string>('30D');

  const topDishes = [
    { name: 'Hyderabadi Chicken Dum Biryani', count: 420, revenue: '₹1,34,400' },
    { name: 'Butter Chicken Masala', count: 285, revenue: '₹96,900' },
    { name: 'Butter Garlic Naan', count: 610, revenue: '₹45,750' },
    { name: 'Paneer Tikka Biryani', count: 195, revenue: '₹54,600' },
    { name: 'Gulab Jamun with Rabdi', count: 240, revenue: '₹33,600' },
  ];

  return (
    <div className="p-8 sm:p-10 max-w-[1400px] mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borderLight">
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-semibold text-heading tracking-tight leading-tight">
            Sales & Revenue Analytics
          </h1>
          <p className="text-[14px] text-secondary mt-1">
            Revenue trends, popular item rankings, tax liabilities, and worker sales performance
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-surface border border-border p-1 rounded-xl">
            {['TODAY', '7D', '30D', 'MONTH'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  dateRange === range
                    ? 'bg-primary-light text-primary font-semibold'
                    : 'text-secondary hover:text-main'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <button className="btn-secondary text-xs">
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Gross Revenue</div>
          <div className="text-[28px] font-semibold text-heading mt-2 leading-none">₹8,45,200</div>
        </div>
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Total Orders Billed</div>
          <div className="text-[28px] font-semibold text-primary mt-2 leading-none">1,280</div>
        </div>
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Avg Order Ticket</div>
          <div className="text-[28px] font-semibold text-success mt-2 leading-none">₹660</div>
        </div>
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">GST Tax Collected</div>
          <div className="text-[28px] font-semibold text-info mt-2 leading-none">₹42,260</div>
        </div>
      </div>

      {/* Top Dishes Table */}
      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-borderLight bg-surface flex justify-between items-center">
          <h3 className="font-semibold text-base text-heading">Top Performing Menu Items</h3>
          <span className="text-xs text-muted">Sorted by sales volume</span>
        </div>
        <table className="w-full text-left text-[14px]">
          <thead className="bg-surfaceMuted text-muted text-xs font-semibold uppercase tracking-wider border-b border-border">
            <tr>
              <th className="px-6 py-3.5">Item Name</th>
              <th className="px-6 py-3.5">Units Sold</th>
              <th className="px-6 py-3.5">Gross Revenue</th>
              <th className="px-6 py-3.5 text-right">Contribution</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borderLight">
            {topDishes.map((dish, idx) => (
              <tr key={idx} className="hover:bg-surfaceMuted/50 transition">
                <td className="px-6 py-4 font-semibold text-heading flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-primary-soft text-primary font-bold text-xs flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <span>{dish.name}</span>
                </td>
                <td className="px-6 py-4 text-secondary text-xs">{dish.count} orders</td>
                <td className="px-6 py-4 font-semibold text-heading">{dish.revenue}</td>
                <td className="px-6 py-4 text-muted text-xs text-right">
                  {Math.round((dish.count / 1750) * 100)}% of total
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
