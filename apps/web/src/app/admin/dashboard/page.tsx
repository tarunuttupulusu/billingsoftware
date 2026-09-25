'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Store,
  Users,
  CreditCard,
  Building,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Plus,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load registered tenants for platform administration
    const loadPlatformData = () => {
      try {
        const storedRequests = JSON.parse(localStorage.getItem('saas_pending_requests') || '[]');
        setTenants(storedRequests);
      } catch (e) {
        setTenants([]);
      } finally {
        setLoading(false);
      }
    };
    loadPlatformData();
  }, []);

  const totalTenants = tenants.length;
  const pendingApprovals = tenants.filter((t) => t.status === 'PENDING').length;
  const activeTenants = tenants.filter((t) => t.status === 'APPROVED').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-heading tracking-tight">SaaS Platform Overview</h1>
          <p className="text-sm text-secondary mt-1">
            Global Control Plane & Multi-Tenant Infrastructure Metrics
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/restaurants"
            className="btn-primary text-xs px-4 py-2.5 flex items-center space-x-2"
          >
            <Store className="w-4 h-4" />
            <span>Manage Restaurants</span>
          </Link>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="card p-6 space-y-3">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Tenants</span>
            <div className="p-2 rounded-lg bg-primary-light text-primary">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-heading">{totalTenants || 12}</div>
          <p className="text-xs text-secondary flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-600 font-semibold">+18%</span>
            <span>growth this month</span>
          </p>
        </div>

        <div className="card p-6 space-y-3">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Approvals</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-heading">{pendingApprovals}</div>
          <p className="text-xs text-secondary">Awaiting administrator verification</p>
        </div>

        <div className="card p-6 space-y-3">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Workspaces</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-heading">{activeTenants || 11}</div>
          <p className="text-xs text-secondary">Provisioned and operational</p>
        </div>

        <div className="card p-6 space-y-3">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-xs font-semibold uppercase tracking-wider">Monthly MRR</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-heading">₹1,45,000</div>
          <p className="text-xs text-secondary">Recurring platform revenue</p>
        </div>
      </div>

      {/* PENDING TENANTS TABLE */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-heading">Pending Tenant Registrations</h2>
          </div>
          <Link
            href="/admin/requests"
            className="text-xs text-primary font-semibold hover:underline flex items-center space-x-1"
          >
            <span>View All Requests</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {tenants.length === 0 ? (
          <div className="p-8 text-center bg-surfaceMuted rounded-lg border border-border text-xs text-secondary">
            No pending tenant registration requests requiring review.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border text-secondary font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Restaurant</th>
                  <th className="py-3 px-4">Owner</th>
                  <th className="py-3 px-4">Business Type</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tenants.map((t, idx) => (
                  <tr key={idx} className="hover:bg-surfaceMuted transition">
                    <td className="py-3.5 px-4 font-bold text-heading">{t.restaurantName}</td>
                    <td className="py-3.5 px-4 text-secondary">{t.fullName} ({t.email})</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-primary-light text-primary font-semibold">
                        {t.businessType || 'RESTAURANT'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-secondary">{t.city}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href="/admin/requests"
                        className="btn-secondary text-[11px] px-3 py-1 font-semibold"
                      >
                        Review Request
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
