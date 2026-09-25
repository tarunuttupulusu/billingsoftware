'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/state';
import {
  LayoutGrid,
  Users,
  Plus,
  Clock,
  Receipt,
  QrCode,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { TableStatus } from '@platform/types';

export default function TablesFloorPage() {
  const { tables, profile, updateTableStatus } = useApp();
  const [selectedSection, setSelectedSection] = useState<string>('ALL');

  const statusColors: Record<TableStatus, { bg: string; text: string; border: string }> = {
    AVAILABLE: { bg: 'bg-emerald-50 text-success', text: 'text-success', border: 'border-emerald-200' },
    OCCUPIED: { bg: 'bg-orange-50 text-primary', text: 'text-primary', border: 'border-orange-200' },
    BILLING: { bg: 'bg-blue-50 text-info', text: 'text-info', border: 'border-blue-200' },
    RESERVED: { bg: 'bg-purple-50 text-purple-600', text: 'text-purple-600', border: 'border-purple-200' },
    ORDER_READY: { bg: 'bg-amber-50 text-warning', text: 'text-warning', border: 'border-amber-200' },
    OUT_OF_SERVICE: { bg: 'bg-surfaceMuted text-muted', text: 'text-muted', border: 'border-border' },
  };

  const occupiedCount = tables.filter((t) => t.status === 'OCCUPIED' || t.status === 'BILLING').length;
  const availableCount = tables.filter((t) => t.status === 'AVAILABLE').length;

  return (
    <div className="p-8 sm:p-10 max-w-[1400px] mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borderLight">
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-semibold text-heading tracking-tight leading-tight flex items-center space-x-2">
            <span>Tables & Floor Plan</span>
          </h1>
          <p className="text-[14px] text-secondary mt-1">
            Real-time table occupancy, guest counts, and direct POS terminal access
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-xs bg-surface border border-border p-2 rounded-xl">
          <span className="flex items-center space-x-1.5 text-secondary">
            <span className="w-2.5 h-2.5 rounded-full bg-success" />
            <span>Available</span>
          </span>
          <span className="flex items-center space-x-1.5 text-secondary">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span>Occupied</span>
          </span>
          <span className="flex items-center space-x-1.5 text-secondary">
            <span className="w-2.5 h-2.5 rounded-full bg-info" />
            <span>Billing</span>
          </span>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Total Tables</div>
          <div className="text-[28px] font-semibold text-heading mt-2 leading-none">{tables.length}</div>
        </div>
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Occupied</div>
          <div className="text-[28px] font-semibold text-primary mt-2 leading-none">{occupiedCount}</div>
        </div>
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Available</div>
          <div className="text-[28px] font-semibold text-success mt-2 leading-none">{availableCount}</div>
        </div>
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Occupancy Rate</div>
          <div className="text-[28px] font-semibold text-info mt-2 leading-none">
            {Math.round((occupiedCount / tables.length) * 100)}%
          </div>
        </div>
      </div>

      {/* Table Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {tables.map((t) => {
          const cfg = statusColors[t.status] || statusColors.AVAILABLE;
          return (
            <div
              key={t.id}
              className={`card flex flex-col justify-between hover:border-placeholder transition ${cfg.border}`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase text-muted">T-{t.tableNumber}</span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${cfg.bg}`}>
                    {t.status}
                  </span>
                </div>

                <div className="my-4 text-center">
                  <div className="text-2xl font-bold text-heading">{t.tableName}</div>
                  <div className="text-xs text-muted flex items-center justify-center space-x-1 mt-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{t.capacity} Seats</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-borderLight flex gap-2">
                <Link
                  href="/pos"
                  className="btn-primary flex-1 text-xs py-2"
                >
                  <span>Open POS</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
