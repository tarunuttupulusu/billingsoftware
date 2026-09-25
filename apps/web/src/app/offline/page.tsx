'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/state';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Database,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Layers,
} from 'lucide-react';

export default function OfflineSyncStatusPage() {
  const { isOnline, setIsOnline, pendingSyncCount, triggerSync } = useApp();
  const [syncing, setSyncing] = useState<boolean>(false);

  const handleSync = async () => {
    setSyncing(true);
    await triggerSync();
    setSyncing(false);
  };

  return (
    <div className="p-8 sm:p-10 max-w-[1400px] mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borderLight">
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-semibold text-heading tracking-tight leading-tight">
            Offline-First Engine & Sync Protocol
          </h1>
          <p className="text-[14px] text-secondary mt-1">
            Persistent local IndexedDB store, RFC 9562 UUIDv7 ordering, and idempotent queue reconciliation
          </p>
        </div>

        {/* Network Toggle Button */}
        <button
          type="button"
          onClick={() => setIsOnline(!isOnline)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold border transition ${
            isOnline
              ? 'bg-success-bg text-success border-emerald-200'
              : 'bg-danger-bg text-danger border-red-200'
          }`}
        >
          {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          <span>Simulate: {isOnline ? 'Network Connected' : 'Network Disconnected'}</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Connection State</div>
          <div className="text-[28px] font-semibold mt-2 leading-none flex items-center space-x-2">
            <span className={`w-3 h-3 rounded-full ${isOnline ? 'bg-success' : 'bg-danger'}`} />
            <span className={isOnline ? 'text-success' : 'text-danger'}>
              {isOnline ? 'Cloud Synced' : 'Offline Mode'}
            </span>
          </div>
        </div>
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Pending Mutations</div>
          <div className="text-[28px] font-semibold text-heading mt-2 leading-none">
            {pendingSyncCount}
          </div>
        </div>
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">IndexedDB Storage</div>
          <div className="text-[28px] font-semibold text-info mt-2 leading-none">Healthy</div>
        </div>
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Idempotency Status</div>
          <div className="text-[28px] font-semibold text-success mt-2 leading-none">100%</div>
        </div>
      </div>

      {/* Status Details Card */}
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
                {isOnline ? 'System is fully synchronized with Cloud' : 'Operating in Standalone Offline Mode'}
              </h2>
              <p className="text-xs text-secondary mt-0.5">
                {isOnline
                  ? 'Changes are mirrored instantaneously to cloud database.'
                  : 'Orders, KOTs, and bills will continue generating without interruption. Queued changes auto-sync when network returns.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSync}
            disabled={!isOnline || syncing}
            className="btn-primary text-xs py-2 px-3.5 disabled:opacity-40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Synchronizing...' : 'Force Sync Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
