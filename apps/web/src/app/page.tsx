'use client';

import React from 'react';
import Link from 'next/link';
import {
  Store,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Layers,
  ChefHat,
  Calculator,
  LayoutGrid,
  Wifi,
  Database,
  Printer,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-main flex flex-col font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-bold text-white shadow-button">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-semibold text-heading tracking-tight">Restaurant SaaS</span>
              <span className="hidden sm:inline-block ml-2 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-primary-light text-primary border border-orange-200">
                Multi-Tenant Platform
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-[14px] font-medium text-secondary">
            <a href="#features" className="hover:text-heading transition">
              Features
            </a>
            <a href="#architecture" className="hover:text-heading transition">
              Architecture
            </a>
            <a href="#pricing" className="hover:text-heading transition">
              Pricing
            </a>
            <a href="#contact" className="hover:text-heading transition">
              Contact
            </a>
          </nav>

          <div className="flex items-center space-x-3">
            <Link
              href="/login"
              className="text-[14px] font-medium text-secondary hover:text-heading px-3 py-2 transition"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="btn-primary"
            >
              <span>Get Started</span>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1">
        <section className="pt-16 pb-24 md:pt-24 md:pb-32">
          <div className="max-w-7xl mx-auto px-6 text-center space-y-8">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-surface border border-border text-xs font-semibold text-primary shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Tenant • Offline-First • Configuration-Driven</span>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              <h1 className="text-4xl sm:text-6xl font-bold text-heading tracking-tight leading-[1.15]">
                Run Your Restaurant <span className="text-primary">Smarter</span>
              </h1>
              <p className="text-lg sm:text-xl text-secondary max-w-2xl mx-auto leading-relaxed">
                Complete POS, billing, tables, kitchen, staff, inventory and restaurant management from one powerful platform.
              </p>
            </div>

            {/* PORTAL SELECTION: Clear Dual Entry Separation per Specification */}
            <div className="pt-8 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {/* USER / RESTAURANT PORTAL CARD */}
              <div className="card p-8 hover:border-primary/50 transition duration-150 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center font-bold mb-6">
                    <Store className="w-6 h-6" />
                  </div>
                  <div className="space-y-2 mb-8">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-heading tracking-tight">Restaurant Portal</h2>
                      <span className="text-xs uppercase bg-primary-light text-primary border border-orange-200 px-2.5 py-0.5 rounded-md font-semibold">
                        Tenant App
                      </span>
                    </div>
                    <p className="text-sm text-secondary leading-relaxed">
                      Login or create an account to manage your restaurant, run POS terminals, dispatch kitchen orders, and track revenue.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/login"
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                  >
                    <span>Login as Restaurant User</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/register"
                    className="w-full btn-secondary flex items-center justify-center space-x-2"
                  >
                    <span>Create Restaurant Account</span>
                  </Link>

                  <div className="pt-2 text-center">
                    <Link
                      href="/dashboard"
                      className="text-xs text-primary hover:underline font-medium inline-flex items-center space-x-1"
                    >
                      <span>Direct Live POS Demo Sandbox</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* SAAS SUPER ADMIN PORTAL CARD */}
              <div className="card p-8 hover:border-secondary/40 transition duration-150 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-surfaceMuted text-secondary flex items-center justify-center font-bold mb-6 border border-border">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div className="space-y-2 mb-8">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-heading tracking-tight">Admin Portal</h2>
                      <span className="text-xs uppercase bg-surfaceMuted text-secondary border border-border px-2.5 py-0.5 rounded-md font-semibold">
                        Super Admin
                      </span>
                    </div>
                    <p className="text-sm text-secondary leading-relaxed">
                      Authorized SaaS administrators can manage the platform here: review registrations, tenant approvals, subscriptions, and system health.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/admin/login"
                    className="w-full btn-secondary flex items-center justify-center space-x-2"
                  >
                    <span>SaaS Admin Login</span>
                    <ArrowRight className="w-4 h-4 text-placeholder" />
                  </Link>

                  <div className="pt-2 text-center text-xs text-muted">
                    Restricted to platform owners & SaaS admins
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section id="features" className="py-20 bg-surface border-y border-border">
          <div className="max-w-7xl mx-auto px-6 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Core Capabilities</span>
              <h2 className="text-3xl font-bold text-heading">
                Everything Your Hospitality Business Needs
              </h2>
              <p className="text-secondary text-base">
                Dynamically configured per business type: Full-service restaurants, quick bakeries, high-volume cloud kitchens, and cafes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card space-y-4">
                <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold">
                  <Calculator className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-heading">Touchscreen POS & Split Billing</h3>
                <p className="text-sm text-secondary">
                  Sub-second item additions, table transfers, modifiers, discounts, and split billing with instant thermal receipt generation.
                </p>
              </div>

              <div className="card space-y-4">
                <div className="w-10 h-10 rounded-xl bg-warning-bg text-warning flex items-center justify-center font-bold">
                  <ChefHat className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-heading">Kitchen Display Station (KDS)</h3>
                <p className="text-sm text-secondary">
                  Live color-coded status progression (Pending → Preparing → Ready → Served) per kitchen station with automated KOT triggers.
                </p>
              </div>

              <div className="card space-y-4">
                <div className="w-10 h-10 rounded-xl bg-success-bg text-success flex items-center justify-center font-bold">
                  <Wifi className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-heading">Offline-First IndexedDB Engine</h3>
                <p className="text-sm text-secondary">
                  Never stop billing. Complete orders and accept payments even when internet drops; transactions automatically synchronize upon reconnect.
                </p>
              </div>

              <div className="card space-y-4">
                <div className="w-10 h-10 rounded-xl bg-info-bg text-info flex items-center justify-center font-bold">
                  <LayoutGrid className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-heading">Visual Floor & Table Map</h3>
                <p className="text-sm text-secondary">
                  Multi-section floor layouts (Main Hall, AC VIP, Terrace) with real-time occupancy status and contactless QR menu tokens.
                </p>
              </div>

              <div className="card space-y-4">
                <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-heading">AI Menu Extraction</h3>
                <p className="text-sm text-secondary">
                  Upload photos of paper menus or menus boards; our AI parser extracts categories, item names, prices, and modifiers for rapid setup.
                </p>
              </div>

              <div className="card space-y-4">
                <div className="w-10 h-10 rounded-xl bg-surfaceMuted text-heading flex items-center justify-center font-bold border border-border">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-heading">Multi-Tenant PostgreSQL Isolation</h3>
                <p className="text-sm text-secondary">
                  Strict tenant isolation at the schema, query, and cache levels with shared worker table assignment and full audit logging.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING PLANS */}
        <section id="pricing" className="py-20 max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Transparent Pricing</span>
            <h2 className="text-3xl font-bold text-heading">Predictable Plans for Growing Restaurants</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-heading">Starter</h3>
                <p className="text-xs text-muted mt-1">For Cafes, Bakeries & Food Trucks</p>
                <div className="mt-6 mb-6">
                  <span className="text-3xl font-bold text-heading">₹1,499</span>
                  <span className="text-xs text-muted"> / month</span>
                </div>
                <ul className="space-y-3 text-sm text-secondary">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span>Up to 10 Tables / Counter</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span>POS Terminal & Thermal Bill</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span>Offline-First Sync</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/register"
                className="mt-8 w-full btn-secondary text-center block"
              >
                Get Started
              </Link>
            </div>

            <div className="card p-8 border-primary ring-1 ring-primary/30 flex flex-col justify-between relative bg-surface">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full">
                Most Popular
              </div>
              <div>
                <h3 className="text-lg font-semibold text-heading">Professional Dine-In</h3>
                <p className="text-xs text-muted mt-1">For Full-Service Restaurants & Bars</p>
                <div className="mt-6 mb-6">
                  <span className="text-3xl font-bold text-heading">₹2,999</span>
                  <span className="text-xs text-muted"> / month</span>
                </div>
                <ul className="space-y-3 text-sm text-secondary">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Unlimited Tables & Floors</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Kitchen Display System (KDS)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Shared Worker Access & QR Ordering</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>AI Menu Scanning & Inventory BOM</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/register"
                className="mt-8 w-full btn-primary text-center block"
              >
                Start 14-Day Free Trial
              </Link>
            </div>

            <div className="card p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-heading">Multi-Outlet Enterprise</h3>
                <p className="text-xs text-muted mt-1">For Restaurant Chains & Franchises</p>
                <div className="mt-6 mb-6">
                  <span className="text-3xl font-bold text-heading">Custom</span>
                </div>
                <ul className="space-y-3 text-sm text-secondary">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span>Multi-Branch Central Catalog</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span>Custom Roles & Enterprise RBAC</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span>Dedicated Support & SLA</span>
                  </li>
                </ul>
              </div>
              <a
                href="#contact"
                className="mt-8 w-full btn-secondary text-center block"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer id="contact" className="border-t border-border py-10 bg-surface">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-secondary">
          <div className="flex items-center space-x-2">
            <Store className="w-4 h-4 text-primary" />
            <span className="font-semibold text-heading">Restaurant POS & Billing SaaS</span>
            <span>© 2026. All rights reserved.</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/login" className="hover:text-heading transition">
              Restaurant Login
            </Link>
            <Link href="/register" className="hover:text-heading transition">
              Register Restaurant
            </Link>
            <a href="http://localhost:3001/admin/login" className="hover:text-primary transition font-medium">
              Super Admin Portal
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
