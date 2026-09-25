'use client';

import React, { useState } from 'react';
import { CreditCard, Plus, Search, DollarSign, Download, ArrowUpRight } from 'lucide-react';

interface Payment {
  id: string;
  invoiceNumber: string;
  client: string;
  amount: string;
  date: string;
  method: string;
  status: 'Paid' | 'Pending' | 'Overdue';
}

const INITIAL_PAYMENTS: Payment[] = [
  { id: '1', invoiceNumber: 'INV-2026-081', client: 'Apex Digital Labs', amount: '$6,500.00', date: 'Sep 24, 2026', method: 'Stripe Wire', status: 'Paid' },
  { id: '2', invoiceNumber: 'INV-2026-080', client: 'Nexus Brands & Media', amount: '$12,000.00', date: 'Sep 22, 2026', method: 'Direct ACH', status: 'Paid' },
  { id: '3', invoiceNumber: 'INV-2026-079', client: 'Vanguard FinTech Group', amount: '$4,800.00', date: 'Sep 18, 2026', method: 'Credit Card', status: 'Paid' },
  { id: '4', invoiceNumber: 'INV-2026-078', client: 'Solaria Tech', amount: '$4,250.00', date: 'Due Sep 30', method: 'Pending Transfer', status: 'Pending' },
];

export default function PaymentsPage() {
  const [payments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [search, setSearch] = useState('');

  const filtered = payments.filter((p) =>
    p.client.toLowerCase().includes(search.toLowerCase()) ||
    p.invoiceNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 sm:p-10 max-w-[1400px] mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borderLight">
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-semibold text-heading tracking-tight leading-tight">
            Payments & Invoices
          </h1>
          <p className="text-[14px] text-secondary mt-1">
            Track received revenues, outstanding invoices, and payout histories
          </p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Invoice</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Received this month</div>
          <div className="text-[28px] font-semibold text-success mt-2 leading-none">$23,300</div>
        </div>
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Pending invoices</div>
          <div className="text-[28px] font-semibold text-warning mt-2 leading-none">$4,250</div>
        </div>
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Overdue invoices</div>
          <div className="text-[28px] font-semibold text-danger mt-2 leading-none">$0</div>
        </div>
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Avg settlement time</div>
          <div className="text-[28px] font-semibold text-info mt-2 leading-none">1.8 days</div>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-placeholder" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search invoices or clients..."
          className="search-input w-full"
        />
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="w-full text-left text-[14px]">
          <thead className="bg-surfaceMuted text-muted text-xs font-semibold uppercase tracking-wider border-b border-border">
            <tr>
              <th className="px-6 py-3.5">Invoice #</th>
              <th className="px-6 py-3.5">Client</th>
              <th className="px-6 py-3.5">Amount</th>
              <th className="px-6 py-3.5">Settlement Method</th>
              <th className="px-6 py-3.5">Date</th>
              <th className="px-6 py-3.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borderLight">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-surfaceMuted/50 transition">
                <td className="px-6 py-4 font-mono text-xs font-medium text-heading">{p.invoiceNumber}</td>
                <td className="px-6 py-4 font-semibold text-heading">{p.client}</td>
                <td className="px-6 py-4 font-semibold text-heading">{p.amount}</td>
                <td className="px-6 py-4 text-secondary text-xs">{p.method}</td>
                <td className="px-6 py-4 text-muted text-xs">{p.date}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                      p.status === 'Paid'
                        ? 'bg-success-bg text-success'
                        : 'bg-warning-bg text-warning'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
