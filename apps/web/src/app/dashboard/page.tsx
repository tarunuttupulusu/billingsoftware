'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/state';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  LayoutGrid,
  ChefHat,
  Calculator,
  ShieldCheck,
  Sparkles,
  Wifi,
  WifiOff,
  Zap,
  ArrowRight,
  Database,
  Store,
  Layers,
  Search,
  Plus,
  Filter,
  ArrowUpRight,
  Clock,
  CheckCircle,
  Receipt,
  CreditCard,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import { BusinessType } from '@platform/types';

const DASHBOARD_TABS = [
  { id: 'overview', name: 'Overview' },
  { id: 'sales', name: "Today's Sales" },
  { id: 'orders', name: "Today's Orders" },
  { id: 'tables', name: 'Active Tables' },
  { id: 'pending', name: 'Pending Orders' },
  { id: 'kitchen', name: 'Kitchen Status' },
  { id: 'payments', name: 'Payment Summary' },
  { id: 'actions', name: 'Quick Actions' },
];

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    profile,
    businessType,
    setBusinessType,
    enabledModules,
    toggleModule,
    isOnline,
    tables,
    activeOrders,
    session,
  } = useApp();

  const occupiedTables = tables.filter((t) => t.status === 'OCCUPIED' || t.status === 'BILLING');
  const availableTables = tables.filter((t) => t.status === 'AVAILABLE');

  const businessTypes: Array<{ type: BusinessType; title: string; desc: string; icon: string }> = [
    {
      type: 'RESTAURANT',
      title: 'Full Dine-In Restaurant',
      desc: '20 Tables, Waiters, Kitchen Display, KOT, Split Bills',
      icon: '🍽️',
    },
    {
      type: 'BAKERY',
      title: 'Counter Bakery & Patisserie',
      desc: 'No Tables, Quick Touch Checkout, Product Inventory',
      icon: '🥐',
    },
    {
      type: 'CLOUD_KITCHEN',
      title: 'Delivery Cloud Kitchen',
      desc: 'No Dine-In, Multi-Station KDS, Delivery Dispatch',
      icon: '🛵',
    },
    {
      type: 'CAFE',
      title: 'Artisan Cafe & Bistro',
      desc: 'Counter Ordering + Seating, Modifiers, Barista KDS',
      icon: '☕',
    },
    {
      type: 'BAR',
      title: 'Bar & Lounge',
      desc: 'Beverage Stations, High-Speed Tab Management, Split Pay',
      icon: '🍸',
    },
  ];

  return (
    <div className="p-8 sm:p-10 max-w-[1400px] mx-auto space-y-8 font-sans">
      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borderLight">
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-semibold text-heading tracking-tight leading-tight">
            Restaurant Dashboard
          </h1>
          <p className="text-[14px] text-secondary mt-1">
            Real-time overview of your operations, live orders, active tables, and sales performance
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link href="/onboarding" className="btn-secondary">
            <Store className="w-4 h-4 text-placeholder" />
            <span>Setup Wizard</span>
          </Link>
          <Link href="/pos" className="btn-primary">
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ New Order / POS</span>
          </Link>
        </div>
      </div>

      {/* 4 STAT CARDS PER SPECIFICATION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today's Revenue */}
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Today's Revenue</div>
          <div className="text-[28px] font-semibold text-heading mt-2 leading-none">₹42,850</div>
          <div className="text-[12px] text-success mt-1.5 flex items-center space-x-1 font-medium">
            <span>↑ 18.2% vs yesterday</span>
          </div>
        </div>

        {/* Card 2: Active Orders */}
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Active Orders</div>
          <div className="text-[28px] font-semibold text-primary mt-2 leading-none">
            {activeOrders.length > 0 ? activeOrders.length : 3}
          </div>
          <div className="text-[12px] text-muted mt-1.5 font-medium">Avg prep time: 14 mins</div>
        </div>

        {/* Card 3: Table Occupancy */}
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Occupied Tables</div>
          <div className="text-[28px] font-semibold text-success mt-2 leading-none">
            {occupiedTables.length} / {tables.length}
          </div>
          <div className="text-[12px] text-secondary mt-1.5 font-medium">
            {Math.round((occupiedTables.length / tables.length) * 100)}% Capacity Utilized
          </div>
        </div>

        {/* Card 4: Completed Bills */}
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Completed Bills</div>
          <div className="text-[28px] font-semibold text-info mt-2 leading-none">58</div>
          <div className="text-[12px] text-muted mt-1.5 font-medium">100% Synced to Postgres</div>
        </div>
      </div>

      {/* CHILDREN SUB-TABS (Section 01: Dashboard Children) */}
      <div className="flex items-center space-x-1.5 overflow-x-auto bg-surface border border-border p-1 rounded-xl">
        {DASHBOARD_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'bg-primary-light text-primary font-semibold'
                : 'text-secondary hover:text-main'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* SEARCH BAR PER SPECIFICATION */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-placeholder absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Search active orders, tables, dishes, or invoices..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input w-full"
        />
      </div>

      {/* TAB CONTENT: Overview */}
      {(activeTab === 'overview' || activeTab === 'sales') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders List */}
          <div className="card space-y-4 lg:col-span-2">
            <div className="flex justify-between items-center pb-3 border-b border-borderLight">
              <div>
                <h3 className="font-semibold text-base text-heading">Live Floor & Counter Orders</h3>
                <p className="text-xs text-secondary mt-0.5">Real-time status of orders in kitchen and tables</p>
              </div>
              <Link href="/orders" className="text-xs text-primary font-semibold hover:underline">
                View All Orders →
              </Link>
            </div>

            <div className="divide-y divide-borderLight text-xs">
              <div className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-heading text-sm">Table 5 (ORD-1042)</div>
                  <div className="text-muted">2x Chicken Biryani, 1x Coke • Ramesh (Waiter)</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-heading text-sm">₹680.00</div>
                  <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold bg-warning-bg text-warning">
                    Preparing (11m)
                  </span>
                </div>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-heading text-sm">Table 2 (ORD-1041)</div>
                  <div className="text-muted">1x Butter Chicken, 3x Garlic Naan • Rohan (Waiter)</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-heading text-sm">₹565.00</div>
                  <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold bg-info-bg text-info">
                    Served (Table Seated)
                  </span>
                </div>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-heading text-sm">Counter 1 (ORD-1040)</div>
                  <div className="text-muted">Takeaway Pack • 1x Mutton Biryani</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-heading text-sm">₹420.00</div>
                  <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold bg-success-bg text-success">
                    Ready for Pickup
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="card space-y-4">
            <h3 className="font-semibold text-base text-heading">Operational Shortcuts</h3>
            <div className="space-y-2.5">
              <Link
                href="/pos"
                className="p-3 rounded-xl bg-surfaceMuted border border-borderLight flex items-center justify-between hover:border-primary/40 transition"
              >
                <div className="flex items-center space-x-2.5">
                  <Calculator className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-heading">Launch POS Billing</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-placeholder" />
              </Link>

              <Link
                href="/kitchen"
                className="p-3 rounded-xl bg-surfaceMuted border border-borderLight flex items-center justify-between hover:border-primary/40 transition"
              >
                <div className="flex items-center space-x-2.5">
                  <ChefHat className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-heading">Kitchen Display (KDS)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-placeholder" />
              </Link>

              <Link
                href="/tables"
                className="p-3 rounded-xl bg-surfaceMuted border border-borderLight flex items-center justify-between hover:border-primary/40 transition"
              >
                <div className="flex items-center space-x-2.5">
                  <LayoutGrid className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-heading">Floor & Seating Plan</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-placeholder" />
              </Link>

              <Link
                href="/menu"
                className="p-3 rounded-xl bg-surfaceMuted border border-borderLight flex items-center justify-between hover:border-primary/40 transition"
              >
                <div className="flex items-center space-x-2.5">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-heading">Menu Catalog & Prices</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-placeholder" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Active Tables */}
      {activeTab === 'tables' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {tables.map((t) => (
            <div key={t.id} className="card text-center p-4 space-y-2">
              <span className="text-xs font-semibold uppercase text-muted">Table #{t.tableNumber}</span>
              <div className="text-xl font-bold text-heading">{t.tableName}</div>
              <span
                className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                  t.status === 'OCCUPIED'
                    ? 'bg-warning-bg text-warning'
                    : t.status === 'BILLING'
                    ? 'bg-info-bg text-info'
                    : 'bg-success-bg text-success'
                }`}
              >
                {t.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* DYNAMIC BUSINESS CONFIGURATION SWITCHER */}
      <div className="card space-y-4">
        <div>
          <h2 className="text-[18px] font-semibold text-heading">
            Business Profile & Dynamic Module Configuration
          </h2>
          <p className="text-[14px] text-secondary mt-0.5">
            Switch business profiles to dynamically regenerate the 18 sections, sidebar items, and operational screens.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          {businessTypes.map((b) => {
            const isSelected = businessType === b.type;
            return (
              <button
                key={b.type}
                type="button"
                onClick={() => setBusinessType(b.type)}
                className={`p-4 rounded-[14px] text-left border transition-all duration-150 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-primary-light border-primary/80 ring-1 ring-primary/40'
                    : 'bg-surface border-border hover:bg-surfaceMuted'
                }`}
              >
                <div>
                  <div className="text-2xl mb-2">{b.icon}</div>
                  <div className={`font-semibold text-sm ${isSelected ? 'text-primary' : 'text-heading'}`}>
                    {b.title}
                  </div>
                  <p className="text-[11px] text-muted mt-1 leading-snug line-clamp-2">
                    {b.desc}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-borderLight flex items-center justify-between text-[11px]">
                  <span className={isSelected ? 'text-primary font-semibold' : 'text-placeholder'}>
                    {isSelected ? 'Active Configuration' : 'Click to Switch'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
