'use client';

import React from 'react';
import { Receipt, Check, CreditCard, Sparkles } from 'lucide-react';

export default function BillingPage() {
  return (
    <div className="p-8 sm:p-10 max-w-[1400px] mx-auto space-y-8">
      <div className="pb-2 border-b border-borderLight">
        <h1 className="text-[28px] sm:text-[32px] font-semibold text-heading tracking-tight leading-tight">
          Subscription & Agency Billing
        </h1>
        <p className="text-[14px] text-secondary mt-1">
          Manage your Agency CRM workspace plan, seat quotas, and payment methods
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CURRENT PLAN CARD */}
        <div className="card space-y-4 md:col-span-2">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-light text-primary">
                Active Subscription
              </span>
              <h3 className="text-xl font-semibold text-heading mt-2">Agency Scale Plan</h3>
              <p className="text-xs text-muted">Billed annually • Next renewal on Oct 01, 2027</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-heading">$199<span className="text-sm font-normal text-muted">/mo</span></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-borderLight text-xs">
            <div>
              <span className="text-muted block">Client Portals:</span>
              <span className="font-semibold text-heading text-sm">Unlimited</span>
            </div>
            <div>
              <span className="text-muted block">Team Seats:</span>
              <span className="font-semibold text-heading text-sm">10 Included (4 Active)</span>
            </div>
            <div>
              <span className="text-muted block">Payment Method:</span>
              <span className="font-semibold text-heading text-sm">Mastercard ending in 4421</span>
            </div>
            <div>
              <span className="text-muted block">Billing Contact:</span>
              <span className="font-semibold text-heading text-sm">billing@agency.com</span>
            </div>
          </div>

          <div className="pt-4 border-t border-borderLight flex gap-3">
            <button className="btn-primary">
              <span>Change Plan</span>
            </button>
            <button className="btn-secondary">
              <span>Update Card</span>
            </button>
          </div>
        </div>

        {/* INVOICE SUMMARY CARD */}
        <div className="card space-y-4">
          <h3 className="font-semibold text-heading text-base">Past Invoices</h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-2 border-b border-borderLight">
              <div>
                <div className="font-semibold text-heading">INV-2026-SEP</div>
                <div className="text-muted">Sep 01, 2026</div>
              </div>
              <span className="font-semibold text-heading">$199.00</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-borderLight">
              <div>
                <div className="font-semibold text-heading">INV-2026-AUG</div>
                <div className="text-muted">Aug 01, 2026</div>
              </div>
              <span className="font-semibold text-heading">$199.00</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <div>
                <div className="font-semibold text-heading">INV-2026-JUL</div>
                <div className="text-muted">Jul 01, 2026</div>
              </div>
              <span className="font-semibold text-heading">$199.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
