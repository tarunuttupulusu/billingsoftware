'use client';

import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle2, XCircle, Clock, Store } from 'lucide-react';

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('saas_pending_requests') || '[]');
      setRequests(stored);
    } catch (e) {
      setRequests([]);
    }
  }, []);

  const handleUpdateStatus = (idx: number, newStatus: 'APPROVED' | 'REJECTED') => {
    const updated = [...requests];
    updated[idx].status = newStatus;
    setRequests(updated);
    localStorage.setItem('saas_pending_requests', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      <div>
        <h1 className="text-2xl font-bold text-heading tracking-tight">Partner & Tenant Registration Requests</h1>
        <p className="text-sm text-secondary mt-1">
          Review onboarding submissions, verify business tax IDs, and approve tenant workspaces
        </p>
      </div>

      <div className="card p-6 space-y-4">
        {requests.length === 0 ? (
          <div className="p-8 text-center text-secondary text-xs">
            No registration requests in queue.
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req, i) => (
              <div
                key={i}
                className="p-5 rounded-xl border border-border bg-surface hover:border-primary/40 transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Store className="w-4 h-4 text-primary" />
                    <h3 className="text-base font-bold text-heading">{req.restaurantName}</h3>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-primary-light text-primary">
                      {req.businessType || 'RESTAURANT'}
                    </span>
                  </div>
                  <p className="text-xs text-secondary">
                    Applicant: <strong className="text-heading">{req.fullName}</strong> ({req.email}) • Phone: {req.phone}
                  </p>
                  <p className="text-xs text-secondary">
                    Location: {req.city}, {req.state} • Subscribed Plan: {req.plan || 'PRO'}
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {req.status === 'APPROVED' ? (
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>APPROVED</span>
                    </span>
                  ) : req.status === 'REJECTED' ? (
                    <span className="px-3 py-1.5 rounded-lg bg-red-100 text-red-800 text-xs font-semibold flex items-center space-x-1">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>REJECTED</span>
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(i, 'REJECTED')}
                        className="btn-secondary text-xs px-3.5 py-1.5 text-red-600 hover:bg-red-50"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(i, 'APPROVED')}
                        className="btn-primary text-xs px-4 py-1.5 flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve Workspace</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
