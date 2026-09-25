'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  Zap,
  Shield,
  HelpCircle,
} from 'lucide-react';

export default function SubscriptionPlansPage() {
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');

  const plans = [
    {
      name: 'Starter',
      priceMonthly: 0,
      priceYearly: 0,
      desc: 'Ideal for small cafes, food trucks, and small bakeries',
      features: [
        'Up to 10 Tables',
        '3 Staff Members',
        '2 Worker Devices',
        'Standard Touch POS',
        'Local ESC/POS Thermal Printing',
        'IndexedDB Offline Resilience',
      ],
      isPopular: false,
      buttonText: 'Current Plan',
    },
    {
      name: 'Pro',
      priceMonthly: 999,
      priceYearly: 899,
      desc: 'Designed for high-throughput dine-in restaurants and bars',
      features: [
        'Unlimited Tables & Sections',
        'Unlimited Staff & Roles',
        'Multi-Station Kitchen Display (KDS)',
        'AI Menu Card OCR Ingestion',
        'Recipe BOM & Raw Material Inventory',
        'Contactless QR Table Ordering',
        'Daily Financial & Worker Activity Reports',
      ],
      isPopular: true,
      buttonText: 'Upgrade to Pro',
    },
    {
      name: 'Enterprise',
      priceMonthly: 2499,
      priceYearly: 2199,
      desc: 'For multi-location restaurant chains, hotels, and franchises',
      features: [
        'Everything in Pro Plan',
        'Multi-Outlet Centralized Governance',
        'Custom Roles & Granular Permission Matrix',
        'Dedicated Cloud PostgreSQL Cluster',
        'Automated Hourly Offsite Backups',
        '24/7 Dedicated Account Manager',
      ],
      isPopular: false,
      buttonText: 'Contact Sales',
    },
  ];

  return (
    <div className="p-8 sm:p-10 max-w-[1400px] mx-auto space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borderLight">
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-semibold text-heading tracking-tight leading-tight">
            Subscription Plans & Quotas
          </h1>
          <p className="text-[14px] text-secondary mt-1">
            Choose the right operational tier for your dining or retail setup
          </p>
        </div>

        {/* Cycle Toggle */}
        <div className="flex items-center space-x-1.5 bg-surface border border-border p-1 rounded-xl">
          <button
            onClick={() => setBillingCycle('MONTHLY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              billingCycle === 'MONTHLY'
                ? 'bg-primary-light text-primary font-semibold'
                : 'text-secondary hover:text-main'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('YEARLY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              billingCycle === 'YEARLY'
                ? 'bg-primary-light text-primary font-semibold'
                : 'text-secondary hover:text-main'
            }`}
          >
            Yearly (Save 15%)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p, idx) => (
          <div
            key={idx}
            className={`card flex flex-col justify-between transition-all duration-150 ${
              p.isPopular ? 'border-primary ring-1 ring-primary/30 shadow-card' : 'hover:border-placeholder'
            }`}
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-xl text-heading">{p.name}</h3>
                {p.isPopular && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-soft text-primary">
                    Most Popular
                  </span>
                )}
              </div>

              <p className="text-xs text-secondary mb-4">{p.desc}</p>

              <div className="mb-6 pb-4 border-b border-borderLight flex items-baseline space-x-1">
                <span className="text-3xl font-bold text-heading">
                  ₹{billingCycle === 'MONTHLY' ? p.priceMonthly : p.priceYearly}
                </span>
                <span className="text-xs text-muted">/month</span>
              </div>

              <div className="space-y-2.5 text-xs text-secondary">
                {p.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-start space-x-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-borderLight mt-6">
              <button
                className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs transition ${
                  p.isPopular
                    ? 'btn-primary'
                    : 'btn-secondary'
                }`}
              >
                {p.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
