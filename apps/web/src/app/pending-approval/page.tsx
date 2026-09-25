'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/state';
import {
  Clock,
  CheckCircle2,
  Building,
  Store,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  LogOut,
} from 'lucide-react';

export default function PendingApprovalPage() {
  const router = useRouter();
  const { profile } = useApp();

  const [status, setStatus] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [checking, setChecking] = useState(false);

  const checkStatus = () => {
    setChecking(true);
    setTimeout(() => {
      try {
        const stored = JSON.parse(localStorage.getItem('saas_pending_requests') || '[]');
        const current = stored.find(
          (r: any) => r.restaurantName === profile.businessName || r.email === profile.email
        );
        if (current && current.status === 'APPROVED') {
          setStatus('APPROVED');
        } else if (current && current.status === 'REJECTED') {
          setStatus('REJECTED');
        }
      } catch (e) {
        console.error(e);
      }
      setChecking(false);
    }, 300);
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background text-main flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-xl w-full mx-auto space-y-6">
        <div className="card p-8 sm:p-10 text-center space-y-6">
          {status === 'PENDING' ? (
            <>
              <div className="w-14 h-14 rounded-2xl bg-warning-bg border border-amber-200 text-warning mx-auto flex items-center justify-center">
                <Clock className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-warning-bg text-warning border border-amber-200">
                  <span className="w-2 h-2 rounded-full bg-warning animate-ping" />
                  <span>Status: Pending Approval</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-heading">
                  Registration Submitted
                </h1>
                <p className="text-sm text-secondary max-w-md mx-auto leading-relaxed">
                  Your restaurant registration for <strong className="text-heading">{profile.businessName || 'Your Restaurant'}</strong> has been submitted and is waiting for SaaS platform administrator approval.
                </p>
              </div>

              {/* Registration Summary Card */}
              <div className="p-4 rounded-xl bg-surfaceMuted border border-border text-left space-y-2 text-xs">
                <div className="flex justify-between items-center text-secondary">
                  <span>Restaurant:</span>
                  <span className="text-heading font-medium">{profile.businessName || 'Royal Tandoor'}</span>
                </div>
                <div className="flex justify-between items-center text-secondary">
                  <span>Location:</span>
                  <span className="text-heading font-medium">{profile.city || 'Bengaluru'}, {profile.country || 'India'}</span>
                </div>
                <div className="flex justify-between items-center text-secondary">
                  <span>Submitted On:</span>
                  <span className="text-muted font-mono">Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={checkStatus}
                  disabled={checking}
                  className="w-full btn-secondary py-2.5 flex items-center justify-center space-x-2"
                >
                  <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
                  <span>{checking ? 'Checking Status...' : 'Refresh Status'}</span>
                </button>

                {/* Instant Approval Simulator for Testing */}
                <div className="pt-3 border-t border-borderLight">
                  <span className="text-[11px] text-muted block mb-2">Developer / Tester Shortcut:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setStatus('APPROVED');
                        try {
                          const stored = JSON.parse(localStorage.getItem('saas_pending_requests') || '[]');
                          const updated = stored.map((r: any) =>
                            r.restaurantName === profile.businessName ? { ...r, status: 'APPROVED' } : r
                          );
                          localStorage.setItem('saas_pending_requests', JSON.stringify(updated));
                        } catch (e) {}
                      }}
                      className="py-2 px-3 rounded-xl bg-success-bg text-success border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition"
                    >
                      Instant Simulate Approve
                    </button>
                    <a
                      href="http://localhost:3001/admin/dashboard"
                      target="_blank"
                      rel="noreferrer"
                      className="py-2 px-3 rounded-xl bg-surfaceMuted text-heading border border-border text-xs font-semibold hover:bg-surface transition flex items-center justify-center space-x-1"
                    >
                      <span>Admin Portal (3001)</span>
                      <ExternalLink className="w-3 h-3 text-placeholder" />
                    </a>
                  </div>
                </div>

                <Link
                  href="/"
                  className="inline-flex items-center space-x-1 text-xs text-muted hover:text-heading pt-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout / Back to Portal Home</span>
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* APPROVED STATE */}
              <div className="w-14 h-14 rounded-2xl bg-success-bg border border-emerald-200 text-success mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-success-bg text-success border border-emerald-200">
                  <span>Status: APPROVED</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-heading">
                  Congratulations! Restaurant Approved
                </h1>
                <p className="text-sm text-secondary max-w-md mx-auto leading-relaxed">
                  Your tenant workspace has been provisioned. Launch the Smart Onboarding Wizard to configure your tables, kitchen stations, menu, and POS.
                </p>
              </div>

              <div className="pt-4">
                <Link
                  href="/onboarding"
                  className="w-full btn-primary py-2.5 flex items-center justify-center space-x-2"
                >
                  <span>Launch Smart Onboarding Wizard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
