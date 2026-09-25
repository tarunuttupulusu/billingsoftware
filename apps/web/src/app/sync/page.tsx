'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/state';
import {
  RefreshCw,
  Wifi,
  WifiOff,
  CheckCircle,
  AlertTriangle,
  History,
  Database,
} from 'lucide-react';

const SYNC_TABS = [
  { id: 'status', name: 'Connection Status' },
  { id: 'pending', name: 'Pending Sync' },
  { id: 'history', name: 'Sync History' },
  { id: 'failed', name: 'Failed Sync' },
];

export default function OfflineSyncSectionPage() {
  const [activeTab, setActiveTab] = useState('status');
  const { isOnline, setIsOnline, pendingSyncCount, triggerSync } = useApp();
  const [syncing, setSyncing] = useState(false);

  const handleManualSync = async () => {
    setSyncing(true);
    await triggerSync();
    setSyncing(false);
  };

  return (
    <div className="p-8 sm:p-10 max-w-[1400px] mx-auto space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borderLight">
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-semibold text-heading tracking-tight leading-tight">
            Offline & Sync Reconciliation
          </h1>
          <p className="text-[14px] text-secondary mt-1">
            IndexedDB persistence, background sync queue, and conflict resolution
          </p>
        </div>

        <button
          onClick={handleManualSync}
          disabled={!isOnline || syncing}
          className="btn-primary"
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          <span>Force Sync Now</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Connection Status</div>
          <div className="text-[28px] font-semibold mt-2 leading-none flex items-center space-x-2">
            <span className={`w-3 h-3 rounded-full ${isOnline ? 'bg-success' : 'bg-danger'}`} />
            <span className={isOnline ? 'text-success' : 'text-danger'}>
              {isOnline ? 'Cloud Synced' : 'Offline Mode'}
            </span>
          </div>
        </div>
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Pending Sync Items</div>
          <div className="text-[28px] font-semibold text-heading mt-2 leading-none">{pendingSyncCount}</div>
        </div>
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">IndexedDB Cache</div>
          <div className="text-[28px] font-semibold text-info mt-2 leading-none">Healthy</div>
        </div>
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Idempotency Validation</div>
          <div className="text-[28px] font-semibold text-success mt-2 leading-none">100%</div>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto bg-surface border border-border p-1 rounded-xl">
        {SYNC_TABS.map((tab) => (
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

      {/* Status Card */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                isOnline ? 'bg-success-bg text-success' : 'bg-danger-bg text-danger'
              }`}
            >
              {isOnline ? <Wifi className="w-6 h-6 stroke-[2]" /> : <WifiOff className="w-6 h-6 stroke-[2]" />}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-heading">
                {isOnline ? 'Cloud Connected & Live' : 'Working Completely Offline'}
              </h2>
              <p className="text-xs text-secondary mt-0.5">
                {isOnline
                  ? 'All bills, KOTs, and table mutations are synchronizing with Postgres instantly.'
                  : 'Orders, payments, and print jobs will continue locally without internet.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOnline(!isOnline)}
            className="btn-secondary text-xs py-2 px-3"
          >
            Simulate {isOnline ? 'Disconnect' : 'Connect'}
          </button>
        </div>
      </div>
    </div>
  );
}
