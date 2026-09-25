'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/state';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Award,
  Calendar,
  X,
  Sparkles,
} from 'lucide-react';

export default function CustomersDirectoryPage() {
  const { profile } = useApp();

  const [customers, setCustomers] = useState([
    { name: 'Rahul Kumar', phone: '+91 98765 88888', email: 'rahul@gmail.com', totalVisits: 14, totalSpend: '₹18,400', lastVisit: 'Yesterday' },
    { name: 'Sneha Reddy', phone: '+91 98765 77777', email: 'sneha@yahoo.com', totalVisits: 9, totalSpend: '₹11,200', lastVisit: '3 days ago' },
    { name: 'Ananya Sharma', phone: '+91 98765 66666', email: 'ananya@outlook.com', totalVisits: 22, totalSpend: '₹29,500', lastVisit: 'Today' },
    { name: 'Karthik Rao', phone: '+91 98765 55555', email: 'karthik@gmail.com', totalVisits: 6, totalSpend: '₹6,800', lastVisit: '1 week ago' },
  ]);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setCustomers([
      { name, phone, email: email || 'customer@gmail.com', totalVisits: 1, totalSpend: '₹0', lastVisit: 'Just now' },
      ...customers,
    ]);
    setName('');
    setPhone('');
    setEmail('');
    setIsAddOpen(false);
  };

  return (
    <div className="p-8 sm:p-10 max-w-[1400px] mx-auto space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borderLight">
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-semibold text-heading tracking-tight leading-tight">
            Customer Directory & CRM
          </h1>
          <p className="text-[14px] text-secondary mt-1">
            Track customer visit frequency, lifetime spend, and loyalty rewards
          </p>
        </div>
        <button onClick={() => setIsAddOpen(true)} className="btn-primary">
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Customer</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Total customers</div>
          <div className="text-[28px] font-semibold text-heading mt-2 leading-none">{customers.length}</div>
        </div>
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">VIP regulars</div>
          <div className="text-[28px] font-semibold text-success mt-2 leading-none">2</div>
        </div>
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Repeat rate</div>
          <div className="text-[28px] font-semibold text-info mt-2 leading-none">68%</div>
        </div>
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Avg spend per visit</div>
          <div className="text-[28px] font-semibold text-heading mt-2 leading-none">₹1,320</div>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-placeholder" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer name or phone..."
          className="search-input w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((c, idx) => (
          <div key={idx} className="card flex flex-col justify-between hover:border-placeholder transition">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary-soft text-primary flex items-center justify-center font-bold text-sm">
                  {c.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-[15px] text-heading leading-tight">{c.name}</h3>
                  <span className="text-xs text-secondary">{c.phone}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs pt-3 border-t border-borderLight text-secondary">
                <div className="flex justify-between">
                  <span className="text-muted">Total Visits:</span>
                  <span className="font-semibold text-heading">{c.totalVisits} times</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Lifetime Spend:</span>
                  <span className="font-semibold text-heading">{c.totalSpend}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Last Visit:</span>
                  <span className="text-secondary">{c.lastVisit}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-borderLight mt-4 flex justify-between items-center text-xs">
              <span className="text-muted truncate max-w-[120px]">{c.email}</span>
              <span className="text-primary font-medium hover:underline cursor-pointer">Order History</span>
            </div>
          </div>
        ))}
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-[20px] shadow-dropdown w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-borderLight">
              <h3 className="font-semibold text-lg text-heading">Add Customer</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-placeholder hover:text-heading">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-main mb-1">Full Name</label>
                <input required value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs font-medium text-main mb-1">Phone Number</label>
                <input required value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field" placeholder="+91 98765 00000" />
              </div>
              <div>
                <label className="block text-xs font-medium text-main mb-1">Email (Optional)</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="john@example.com" />
              </div>
              <div className="flex justify-end space-x-2 pt-3">
                <button type="button" onClick={() => setIsAddOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
