'use client';

import React from 'react';
import { Store, Plus, Search, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function AdminRestaurantsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading tracking-tight">Restaurant Tenants</h1>
          <p className="text-sm text-secondary mt-1">
            Global tenant provisioning, module toggles, and business workspace management
          </p>
        </div>
        <button className="btn-primary text-xs px-4 py-2.5 flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Provision New Tenant</span>
        </button>
      </div>

      <div className="card p-6 space-y-4">
        <div className="flex items-center space-x-3 bg-surfaceMuted px-3.5 py-2 rounded-lg border border-border max-w-md">
          <Search className="w-4 h-4 text-placeholder" />
          <input
            type="text"
            placeholder="Search tenant by name, slug, or owner email..."
            className="bg-transparent text-xs text-heading placeholder-placeholder focus:outline-none w-full"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border text-secondary font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Restaurant Name</th>
                <th className="py-3 px-4">Domain / Slug</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Plan</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-surfaceMuted transition">
                <td className="py-3.5 px-4 font-bold text-heading">Spice Garden Bistro</td>
                <td className="py-3.5 px-4 text-secondary font-mono">spice-garden</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded bg-primary-light text-primary font-semibold">
                    RESTAURANT
                  </span>
                </td>
                <td className="py-3.5 px-4 font-semibold text-heading">Enterprise Pro</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                    ACTIVE
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button className="btn-secondary text-[11px] px-3 py-1 font-semibold">
                    Manage Tenant
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-surfaceMuted transition">
                <td className="py-3.5 px-4 font-bold text-heading">Royal Bakeries</td>
                <td className="py-3.5 px-4 text-secondary font-mono">royal-bakeries</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold">
                    BAKERY
                  </span>
                </td>
                <td className="py-3.5 px-4 font-semibold text-heading">Growth Tier</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                    ACTIVE
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button className="btn-secondary text-[11px] px-3 py-1 font-semibold">
                    Manage Tenant
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
