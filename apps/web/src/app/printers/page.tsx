'use client';

import React, { useState } from 'react';
import {
  Printer,
  Plus,
  CheckCircle,
  Wifi,
  HardDrive,
  RefreshCw,
  Sliders,
} from 'lucide-react';

const PRINTER_TABS = [
  { id: 'printers', name: 'All Printers' },
  { id: 'thermal', name: 'Thermal Printers' },
  { id: 'kot', name: 'KOT Printers' },
  { id: 'network', name: 'Network Printers' },
  { id: 'devices', name: 'Connected Devices' },
  { id: 'test', name: 'Test Print' },
];

export default function PrintersAndDevicesSectionPage() {
  const [activeTab, setActiveTab] = useState('printers');
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleTestPrint = (name: string) => {
    setTestResult(`Test receipt sent to ${name} via ESC/POS driver! (182 bytes spooled)`);
    setTimeout(() => setTestResult(null), 3000);
  };

  const printerList = [
    { name: 'Front Cashier Thermal (EPSON TM-T82X)', type: 'Thermal Receipt (80mm)', interface: 'USB / ESC-POS', location: 'Main Billing Counter', status: 'Online' },
    { name: 'Kitchen KOT Hot Line (TVS RP-3160)', type: 'KOT Thermal (58mm)', interface: 'Ethernet IP: 192.168.1.120', location: 'Main Hot Line & Curry', status: 'Online' },
    { name: 'Tandoor & Grill Station Printer', type: 'KOT Thermal (58mm)', interface: 'Ethernet IP: 192.168.1.121', location: 'Outdoor Tandoor Station', status: 'Online' },
    { name: 'Bar & Mocktail Thermal Printer', type: 'Receipt (80mm)', interface: 'Bluetooth / BLE', location: 'Bar Counter', status: 'Standby' },
  ];

  return (
    <div className="p-8 sm:p-10 max-w-[1400px] mx-auto space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borderLight">
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-semibold text-heading tracking-tight leading-tight">
            Printers & Devices
          </h1>
          <p className="text-[14px] text-secondary mt-1">
            Configure POS thermal bill printers, kitchen station KOT printers, and network hardware
          </p>
        </div>

        <button className="btn-primary">
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Printer</span>
        </button>
      </div>

      {testResult && (
        <div className="p-3 bg-success-bg border border-emerald-200 text-success text-xs font-semibold rounded-xl flex items-center space-x-2">
          <CheckCircle className="w-4 h-4" />
          <span>{testResult}</span>
        </div>
      )}

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Configured Printers</div>
          <div className="text-[28px] font-semibold text-heading mt-2 leading-none">4</div>
        </div>
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Online & Ready</div>
          <div className="text-[28px] font-semibold text-success mt-2 leading-none">3</div>
        </div>
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Paper Status</div>
          <div className="text-[28px] font-semibold text-info mt-2 leading-none">Adequate</div>
        </div>
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Total Print Jobs Today</div>
          <div className="text-[28px] font-semibold text-heading mt-2 leading-none">184</div>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto bg-surface border border-border p-1 rounded-xl">
        {PRINTER_TABS.map((tab) => (
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {printerList.map((p, idx) => (
          <div key={idx} className="card space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
                    <Printer className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-heading">{p.name}</h3>
                    <span className="text-xs text-muted">{p.type}</span>
                  </div>
                </div>
                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-success-bg text-success">
                  {p.status}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-borderLight space-y-1.5 text-xs text-secondary">
                <div className="flex justify-between">
                  <span className="text-muted">Port / Protocol:</span>
                  <span className="font-mono text-heading">{p.interface}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Routing Station:</span>
                  <span className="text-heading font-medium">{p.location}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-borderLight flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => handleTestPrint(p.name)}
                className="btn-secondary text-xs py-1.5 px-3"
              >
                <span>Test Print</span>
              </button>
              <button className="btn-secondary text-xs py-1.5 px-3">
                <span>Configure</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
