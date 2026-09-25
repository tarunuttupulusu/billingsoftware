'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/state';
import { SYSTEM_PERMISSIONS, ROLE_DEFAULT_PERMISSIONS } from '@/lib/permission-engine';
import {
  Users,
  Shield,
  Smartphone,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Key,
  ShieldCheck,
  Check,
  Sparkles,
} from 'lucide-react';

interface CustomRole {
  id: string;
  name: string;
  description: string;
  modules: string[];
  permissions: string[];
  userCount: number;
}

export default function StaffAndSecurityPage() {
  const { profile, session, setSession } = useApp();
  const [activeTab, setActiveTab] = useState<'DIRECTORY' | 'ROLES' | 'ACTIVITY' | 'DEVICES'>('DIRECTORY');

  // Custom Role Wizard State
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1);
  const [roleName, setRoleName] = useState('');
  const [roleDesc, setRoleDesc] = useState('');
  const [selectedModules, setSelectedModules] = useState<string[]>(['pos', 'tables', 'orders']);
  const [selectedActions, setSelectedActions] = useState<string[]>([
    'pos.view',
    'pos.create',
    'tables.view',
    'tables.transfer',
    'orders.view',
    'orders.create',
  ]);

  const [customRoles, setCustomRoles] = useState<CustomRole[]>([
    {
      id: 'role-senior-waiter',
      name: 'Senior Waiter',
      description: 'Front-of-house order taker with table transfer and discount approval',
      modules: ['pos', 'tables', 'orders', 'menu', 'customers'],
      permissions: ['pos.*', 'tables.*', 'orders.*', 'menu.view', 'customers.view', 'billing.split'],
      userCount: 3,
    },
    {
      id: 'role-floor-manager',
      name: 'Floor Manager',
      description: 'Oversees dining room flow, seating reservations, and staff shifts',
      modules: ['dashboard', 'pos', 'tables', 'orders', 'kitchen', 'customers', 'reports'],
      permissions: ['dashboard.view', 'pos.*', 'tables.*', 'orders.*', 'kitchen.view', 'customers.*', 'reports.sales'],
      userCount: 2,
    },
    {
      id: 'role-kitchen-manager',
      name: 'Kitchen Manager',
      description: 'Expedites tickets, assigns cooking stations, and manages 86 menu items',
      modules: ['kitchen', 'orders', 'menu', 'inventory'],
      permissions: ['kitchen.*', 'orders.view', 'orders.details', 'menu.availability', 'inventory.view'],
      userCount: 1,
    },
    {
      id: 'role-billing-manager',
      name: 'Billing Manager',
      description: 'Handles high-value cashier settlements, refunds, and daily reports',
      modules: ['dashboard', 'billing', 'payments', 'reports', 'customers'],
      permissions: ['dashboard.view', 'billing.*', 'payments.*', 'reports.*', 'customers.view'],
      userCount: 1,
    },
  ]);

  const staffList = [
    { id: 'u1', name: 'Rajesh Kumar', email: 'rajesh@spicegarden.com', role: 'Owner', status: 'Active', phone: '+91 98765 43210' },
    { id: 'u2', name: 'Vikram Sharma', email: 'vikram@spicegarden.com', role: 'Manager', status: 'Active', phone: '+91 98765 11111' },
    { id: 'u3', name: 'Ramesh Patel', email: 'ramesh@spicegarden.com', role: 'Senior Waiter', status: 'Active', phone: '+91 98765 22222' },
    { id: 'u4', name: 'Priya Nair', email: 'priya@spicegarden.com', role: 'Cashier', status: 'Active', phone: '+91 98765 33333' },
    { id: 'u5', name: 'Chef Anand', email: 'anand@spicegarden.com', role: 'Kitchen', status: 'Active', phone: '+91 98765 44444' },
  ];

  const workerActivities = [
    { worker: 'Ramesh (Senior Waiter)', action: 'Merged Table 3 with Table 4', table: 'Table 3 & 4', device: 'Android Phone (DEV-RAM-01)', time: '9:12 PM' },
    { worker: 'Ramesh (Senior Waiter)', action: 'Sent KOT to Grill Station', table: 'Table 5', device: 'Android Phone (DEV-RAM-01)', time: '9:08 PM' },
    { worker: 'Vikram (Manager)', action: 'Approved 10% Loyalty Discount', table: 'Table 2', device: 'iPad Terminal', time: '8:55 PM' },
    { worker: 'Priya (Cashier)', action: 'Settled Bill #INV-1039 (₹1,560 Cash)', table: 'Table 3', device: 'POS Counter 01', time: '8:45 PM' },
    { worker: 'Chef Anand (Kitchen)', action: 'Marked KOT #42 READY for Table 2', table: 'Table 2', device: 'Kitchen Touch Display', time: '8:30 PM' },
  ];

  const devices = [
    { name: 'POS Counter Terminal 01', type: 'Desktop POS', user: 'Priya (Cashier)', platform: 'Windows / Web', status: 'Online', lastActive: 'Just now' },
    { name: 'Server Android Tablet', type: 'Tablet', user: 'Ramesh (Senior Waiter)', platform: 'Android 14', status: 'Online', lastActive: '2m ago' },
    { name: 'Manager iPad Air', type: 'Tablet', user: 'Vikram (Manager)', platform: 'iPadOS', status: 'Online', lastActive: '5m ago' },
    { name: 'Kitchen Touch KDS', type: 'KDS Terminal', user: 'Chef Anand', platform: 'ChromeOS', status: 'Online', lastActive: 'Just now' },
  ];

  const allAvailableModules = [
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'pos', name: 'POS' },
    { id: 'tables', name: 'Tables' },
    { id: 'orders', name: 'Orders' },
    { id: 'kitchen', name: 'Kitchen' },
    { id: 'menu', name: 'Menu' },
    { id: 'billing', name: 'Billing' },
    { id: 'payments', name: 'Payments' },
    { id: 'inventory', name: 'Inventory' },
    { id: 'customers', name: 'Customers' },
    { id: 'staff', name: 'Staff' },
    { id: 'expenses', name: 'Expenses' },
    { id: 'reports', name: 'Reports' },
    { id: 'qr', name: 'QR & Digital' },
    { id: 'printers', name: 'Printers' },
    { id: 'sync', name: 'Offline & Sync' },
    { id: 'settings', name: 'Settings' },
  ];

  const toggleModuleSelection = (modId: string) => {
    setSelectedModules((prev) =>
      prev.includes(modId) ? prev.filter((m) => m !== modId) : [...prev, modId]
    );
  };

  const toggleActionSelection = (permCode: string) => {
    setSelectedActions((prev) =>
      prev.includes(permCode) ? prev.filter((p) => p !== permCode) : [...prev, permCode]
    );
  };

  const handleSaveCustomRole = () => {
    if (!roleName.trim()) return;

    const newRole: CustomRole = {
      id: `role-${roleName.toLowerCase().replace(/\s+/g, '-')}`,
      name: roleName,
      description: roleDesc || `Custom role with ${selectedModules.length} modules configured.`,
      modules: selectedModules,
      permissions: selectedActions,
      userCount: 0,
    };

    setCustomRoles([newRole, ...customRoles]);
    setShowRoleModal(false);
    setWizardStep(1);
    setRoleName('');
    setRoleDesc('');
  };

  return (
    <div className="p-8 sm:p-10 max-w-[1400px] mx-auto space-y-8 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borderLight">
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-semibold text-heading tracking-tight leading-tight">
            Staff & Role Permissions
          </h1>
          <p className="text-[14px] text-secondary mt-1">
            Role-Based Access Control (RBAC), custom roles configurator, and immutable micro-action audit trail
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setWizardStep(1);
              setShowRoleModal(true);
            }}
            className="btn-secondary"
          >
            <ShieldCheck className="w-4 h-4 stroke-[2]" />
            <span>Create Custom Role</span>
          </button>
          <button className="btn-primary">
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Staff Member</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1.5 bg-surface border border-border p-1 rounded-xl max-w-fit">
        {(['DIRECTORY', 'ROLES', 'ACTIVITY', 'DEVICES'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === tab
                ? 'bg-primary-light text-primary font-semibold'
                : 'text-secondary hover:text-main'
            }`}
          >
            {tab === 'DIRECTORY' && 'Staff Directory'}
            {tab === 'ROLES' && 'Custom Roles & RBAC'}
            {tab === 'ACTIVITY' && 'Audit Trail'}
            {tab === 'DEVICES' && 'Registered Terminals'}
          </button>
        ))}
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Total Staff</div>
          <div className="text-[28px] font-semibold text-heading mt-2 leading-none">{staffList.length}</div>
        </div>
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Custom Roles</div>
          <div className="text-[28px] font-semibold text-primary mt-2 leading-none">{customRoles.length}</div>
        </div>
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Terminals Online</div>
          <div className="text-[28px] font-semibold text-info mt-2 leading-none">{devices.length}</div>
        </div>
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Audit Logs Recorded</div>
          <div className="text-[28px] font-semibold text-heading mt-2 leading-none">1,420</div>
        </div>
      </div>

      {/* Directory Tab */}
      {activeTab === 'DIRECTORY' && (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-left text-[14px]">
            <thead className="bg-surfaceMuted text-muted text-xs font-semibold uppercase tracking-wider border-b border-border">
              <tr>
                <th className="px-6 py-3.5">Name</th>
                <th className="px-6 py-3.5">Assigned Role</th>
                <th className="px-6 py-3.5">Contact</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderLight">
              {staffList.map((s) => (
                <tr key={s.id} className="hover:bg-surfaceMuted/50 transition">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-heading">{s.name}</div>
                    <div className="text-xs text-muted">{s.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-light text-primary">
                      {s.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-secondary text-xs">{s.phone}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-success-bg text-success">
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:underline text-xs font-semibold">Edit Permissions</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Custom Roles & RBAC Tab */}
      {activeTab === 'ROLES' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customRoles.map((role) => (
              <div key={role.id} className="card p-5 space-y-3 border-border hover:border-primary/40 transition">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-heading">{role.name}</h3>
                    <p className="text-xs text-secondary mt-0.5">{role.description}</p>
                  </div>
                  <span className="text-xs font-bold text-primary bg-primary-light px-2.5 py-0.5 rounded-full">
                    {role.userCount} assigned
                  </span>
                </div>

                <div className="pt-2 border-t border-borderLight">
                  <span className="text-[11px] font-semibold text-muted uppercase tracking-wider block mb-1.5">
                    Authorized Modules ({role.modules.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {role.modules.map((m) => (
                      <span key={m} className="px-2 py-0.5 rounded bg-surfaceMuted text-heading text-[11px] font-medium border border-borderLight capitalize">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-muted">{role.permissions.length} granular permissions</span>
                  <button
                    onClick={() => {
                      setSession({
                        ...session,
                        roleName: role.name.toUpperCase().replace(/\s+/g, '_'),
                        permissions: role.permissions,
                      });
                    }}
                    className="text-primary hover:underline font-semibold"
                  >
                    Test This Role
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'ACTIVITY' && (
        <div className="card p-0 overflow-hidden">
          <div className="divide-y divide-borderLight">
            {workerActivities.map((act, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between hover:bg-surfaceMuted transition">
                <div>
                  <div className="font-semibold text-sm text-heading">{act.worker}</div>
                  <div className="text-xs text-secondary mt-0.5">{act.action} on <strong className="text-heading">{act.table}</strong></div>
                  <div className="text-[11px] text-muted mt-0.5">{act.device}</div>
                </div>
                <span className="text-xs text-muted font-medium">{act.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Devices Tab */}
      {activeTab === 'DEVICES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {devices.map((d, idx) => (
            <div key={idx} className="card flex flex-col justify-between space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-sm text-heading">{d.name}</h3>
                  <span className="text-xs text-muted">{d.type} • {d.platform}</span>
                </div>
                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-success-bg text-success">
                  {d.status}
                </span>
              </div>
              <div className="pt-3 border-t border-borderLight flex justify-between items-center text-xs text-secondary">
                <span>Active User: <strong className="text-heading">{d.user}</strong></span>
                <span className="text-muted">{d.lastActive}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          CUSTOM ROLE CONFIGURATION WIZARD MODAL
          Per Specification:
          Step 1: Enter Role Name
          Step 2: Select Modules
          Step 3: Select Actions
          Step 4: Save Role
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl border border-border max-w-xl w-full shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-borderLight flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-heading text-lg">Custom Role Configurator</h3>
                <p className="text-xs text-muted">Step {wizardStep} of 4: Role definition and access control</p>
              </div>
              <button
                onClick={() => setShowRoleModal(false)}
                className="p-1 rounded-lg text-placeholder hover:text-heading"
              >
                ✕
              </button>
            </div>

            {/* Step Wizard Progress Bar */}
            <div className="grid grid-cols-4 border-b border-borderLight text-center text-xs font-semibold">
              <div className={`py-2 border-b-2 ${wizardStep === 1 ? 'border-primary text-primary' : 'border-transparent text-muted'}`}>
                1. Role Name
              </div>
              <div className={`py-2 border-b-2 ${wizardStep === 2 ? 'border-primary text-primary' : 'border-transparent text-muted'}`}>
                2. Modules
              </div>
              <div className={`py-2 border-b-2 ${wizardStep === 3 ? 'border-primary text-primary' : 'border-transparent text-muted'}`}>
                3. Actions
              </div>
              <div className={`py-2 border-b-2 ${wizardStep === 4 ? 'border-primary text-primary' : 'border-transparent text-muted'}`}>
                4. Confirm & Save
              </div>
            </div>

            {/* Step Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-heading mb-1.5">
                      Role Name *
                    </label>
                    <input
                      type="text"
                      value={roleName}
                      onChange={(e) => setRoleName(e.target.value)}
                      placeholder="e.g. Senior Waiter, Floor Manager, Inventory Specialist"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-heading mb-1.5">
                      Role Description
                    </label>
                    <textarea
                      value={roleDesc}
                      onChange={(e) => setRoleDesc(e.target.value)}
                      rows={3}
                      placeholder="Describe the operational responsibilities of this role..."
                      className="input-field"
                    />
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-3">
                  <p className="text-xs text-secondary">
                    Select the high-level platform modules this role can access:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {allAvailableModules.map((mod) => {
                      const isSelected = selectedModules.includes(mod.id);
                      return (
                        <button
                          key={mod.id}
                          type="button"
                          onClick={() => toggleModuleSelection(mod.id)}
                          className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition flex items-center justify-between ${
                            isSelected
                              ? 'border-primary bg-primary-light text-primary'
                              : 'border-border bg-surfaceMuted text-secondary hover:bg-borderLight'
                          }`}
                        >
                          <span>{mod.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-3">
                  <p className="text-xs text-secondary">
                    Select granular Level 2 Action permissions for the chosen modules:
                  </p>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {SYSTEM_PERMISSIONS.filter((p) => selectedModules.includes(p.module)).map((perm) => {
                      const isChecked = selectedActions.includes(perm.code);
                      return (
                        <div
                          key={perm.code}
                          onClick={() => toggleActionSelection(perm.code)}
                          className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between text-xs transition ${
                            isChecked
                              ? 'border-primary bg-primary-light text-heading'
                              : 'border-border bg-surface text-secondary hover:bg-surfaceMuted'
                          }`}
                        >
                          <div>
                            <div className="font-semibold">{perm.name}</div>
                            <div className="text-[11px] text-muted font-mono">{perm.code}</div>
                          </div>
                          <span className={`w-4 h-4 rounded border flex items-center justify-center ${isChecked ? 'bg-primary border-primary text-white' : 'border-border'}`}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {wizardStep === 4 && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-surfaceMuted rounded-xl border border-borderLight space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted">Role Name:</span>
                      <strong className="text-heading">{roleName || 'Unnamed Role'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Modules Enabled:</span>
                      <strong className="text-primary">{selectedModules.length} Modules</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Granular Actions:</span>
                      <strong className="text-heading">{selectedActions.length} Actions</strong>
                    </div>
                  </div>

                  <div>
                    <span className="text-muted block mb-1 font-semibold">Enabled Modules:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedModules.map((m) => (
                        <span key={m} className="px-2 py-0.5 rounded bg-surfaceMuted text-heading text-[11px] font-medium border border-borderLight capitalize">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 border-t border-borderLight bg-surfaceMuted flex items-center justify-between">
              {wizardStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setWizardStep((prev) => (prev - 1) as any)}
                  className="btn-secondary text-xs py-1.5 px-4"
                >
                  Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowRoleModal(false)}
                  className="btn-secondary text-xs py-1.5 px-4"
                >
                  Cancel
                </button>
              )}

              {wizardStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setWizardStep((prev) => (prev + 1) as any)}
                  className="btn-primary text-xs py-1.5 px-5"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSaveCustomRole}
                  className="btn-primary text-xs py-1.5 px-6 font-semibold"
                >
                  Save & Activate Role
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
