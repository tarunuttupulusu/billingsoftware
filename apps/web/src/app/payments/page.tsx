'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/state';
import { CreditCard, Plus, Search, DollarSign, Download, ArrowUpRight, Receipt } from 'lucide-react';

export default function PaymentsPage() {
  const { activeOrders, profile, stats } = useApp();
  const [search, setSearch] = useState('');

  const currencySymbol = profile.currencySymbol || '₹';

  // Extract completed / billed payments from live orders
  const paidOrders = activeOrders.filter((o) => o.status === 'COMPLETED' || o.status === 'BILLED');
  const pendingOrders = activeOrders.filter((o) => o.status !== 'COMPLETED' && o.status !== 'CANCELLED');

  const totalReceived = paidOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0) / 100;
  const totalPending = pendingOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0) / 100;

  const filtered = paidOrders.filter((p) =>
    p.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
    p.tableName?.toLowerCase().includes(search.toLowerCase()) ||
    p.createdByWorkerName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 sm:p-10 max-w-[1400px] mx-auto space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borderLight">
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-semibold text-heading tracking-tight leading-tight">
            Payments & Invoices
          </h1>
          <p className="text-[14px] text-secondary mt-1">
            Track received revenues, outstanding orders, and settlement histories from database
          </p>
        </div>
        <Link href="/pos" className="btn-primary">
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ New Billing Order</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Total Received</div>
          <div className="text-[28px] font-semibold text-success mt-2 leading-none">
            {currencySymbol}{totalReceived.toFixed(2)}
          </div>
        </div>
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Pending Settlements</div>
          <div className="text-[28px] font-semibold text-warning mt-2 leading-none">
            {currencySymbol}{totalPending.toFixed(2)}
          </div>
        </div>
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Settled Bills</div>
          <div className="text-[28px] font-semibold text-heading mt-2 leading-none">{paidOrders.length}</div>
        </div>
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Active Tab Orders</div>
          <div className="text-[28px] font-semibold text-info mt-2 leading-none">{pendingOrders.length}</div>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-placeholder" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search settled invoices..."
          className="search-input w-full"
        />
      </div>

      <div className="card p-0 overflow-hidden">
        {filtered.length > 0 ? (
          <table className="w-full text-left text-[14px]">
            <thead className="bg-surfaceMuted text-muted text-xs font-semibold uppercase tracking-wider border-b border-border">
              <tr>
                <th className="px-6 py-3.5">Order / Invoice #</th>
                <th className="px-6 py-3.5">Table / Counter</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Billed By</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderLight">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-surfaceMuted/50 transition">
                  <td className="px-6 py-4 font-mono text-xs font-medium text-heading">{p.orderNumber}</td>
                  <td className="px-6 py-4 font-semibold text-heading">{p.tableName || 'Takeaway'}</td>
                  <td className="px-6 py-4 font-semibold text-heading">
                    {currencySymbol}{(Number(p.grandTotal || 0) / 100).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-secondary text-xs">{p.createdByWorkerName || 'Staff'}</td>
                  <td className="px-6 py-4 text-muted text-xs">
                    {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'Today'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-success-bg text-success">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center space-y-3">
            <Receipt className="w-10 h-10 text-placeholder mx-auto" />
            <p className="text-sm text-secondary">No settled payments or invoices in this restaurant yet.</p>
            <Link href="/pos" className="btn-primary text-xs py-1.5 px-4 inline-flex items-center space-x-1">
              <Plus className="w-3.5 h-3.5" />
              <span>Generate First Bill</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
