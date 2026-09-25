'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/state';
import {
  Receipt,
  Plus,
  TrendingDown,
  DollarSign,
  Calendar,
  Search,
} from 'lucide-react';

export default function ExpensesLedgerPage() {
  const { profile } = useApp();

  const expenses = [
    { title: 'Store Monthly Rent', category: 'Rent', amount: '₹35,000', mode: 'Bank Transfer', date: 'Yesterday', by: 'Rajesh (Owner)' },
    { title: 'Staff Monthly Payroll Advances', category: 'Salaries', amount: '₹48,000', mode: 'UPI', date: '3 days ago', by: 'Rajesh (Owner)' },
    { title: 'Commercial Electricity Bill', category: 'Utilities', amount: '₹8,400', mode: 'Online', date: '5 days ago', by: 'Vikram (Manager)' },
    { title: 'Cooking Gas Cylinders (Commercial)', category: 'Utilities', amount: '₹6,200', mode: 'Cash', date: '6 days ago', by: 'Vikram (Manager)' },
    { title: 'Packaging Containers & Paper Bags', category: 'Packaging', amount: '₹4,500', mode: 'Cash', date: '1 week ago', by: 'Priya (Cashier)' },
  ];

  return (
    <div className="p-8 sm:p-10 max-w-[1400px] mx-auto space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borderLight">
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-semibold text-heading tracking-tight leading-tight">
            Store Expenses & Payouts
          </h1>
          <p className="text-[14px] text-secondary mt-1">
            Log operational costs, supplier payouts, utility bills, and petty cash transactions
          </p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Record Expense</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Total Expenses Month</div>
          <div className="text-[28px] font-semibold text-heading mt-2 leading-none">₹1,02,100</div>
        </div>
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Rent & Facilities</div>
          <div className="text-[28px] font-semibold text-heading mt-2 leading-none">₹49,600</div>
        </div>
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Staff Wages</div>
          <div className="text-[28px] font-semibold text-heading mt-2 leading-none">₹48,000</div>
        </div>
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Petty Cash Used</div>
          <div className="text-[28px] font-semibold text-info mt-2 leading-none">₹4,500</div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="w-full text-left text-[14px]">
          <thead className="bg-surfaceMuted text-muted text-xs font-semibold uppercase tracking-wider border-b border-border">
            <tr>
              <th className="px-6 py-3.5">Expense Item</th>
              <th className="px-6 py-3.5">Category</th>
              <th className="px-6 py-3.5">Amount</th>
              <th className="px-6 py-3.5">Payment Mode</th>
              <th className="px-6 py-3.5">Recorded By</th>
              <th className="px-6 py-3.5 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borderLight">
            {expenses.map((e, idx) => (
              <tr key={idx} className="hover:bg-surfaceMuted/50 transition">
                <td className="px-6 py-4 font-semibold text-heading">{e.title}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-surfaceMuted text-secondary border border-borderLight">
                    {e.category}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-heading">{e.amount}</td>
                <td className="px-6 py-4 text-secondary text-xs">{e.mode}</td>
                <td className="px-6 py-4 text-secondary text-xs">{e.by}</td>
                <td className="px-6 py-4 text-muted text-xs text-right">{e.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
