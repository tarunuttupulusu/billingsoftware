'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/state';
import {
  Package,
  AlertTriangle,
  Plus,
  Search,
  Scale,
  RefreshCw,
  TrendingDown,
  ArrowUpRight,
} from 'lucide-react';

interface StockItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minThreshold: number;
  unit: string;
  costPerUnit: number;
}

export default function InventoryPage() {
  const { profile } = useApp();
  const [stock] = useState<StockItem[]>([
    { id: 'i1', name: 'Basmati Rice (Daawat)', category: 'Grains', currentStock: 50, minThreshold: 15, unit: 'kg', costPerUnit: 9500 },
    { id: 'i2', name: 'Fresh Farm Chicken', category: 'Poultry', currentStock: 25, minThreshold: 10, unit: 'kg', costPerUnit: 18000 },
    { id: 'i3', name: 'Fresh Tomatoes', category: 'Vegetables', currentStock: 18, minThreshold: 5, unit: 'kg', costPerUnit: 3500 },
    { id: 'i4', name: 'Red Onions', category: 'Vegetables', currentStock: 4, minThreshold: 10, unit: 'kg', costPerUnit: 3000 },
    { id: 'i5', name: 'Pure Cow Ghee', category: 'Dairy', currentStock: 12, minThreshold: 4, unit: 'L', costPerUnit: 55000 },
    { id: 'i6', name: 'Refined Cooking Oil', category: 'Oils', currentStock: 15, minThreshold: 8, unit: 'L', costPerUnit: 12000 },
  ]);

  const lowStockCount = stock.filter((i) => i.currentStock <= i.minThreshold).length;

  return (
    <div className="p-8 sm:p-10 max-w-[1400px] mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borderLight">
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-semibold text-heading tracking-tight leading-tight">
            Inventory & Ingredients
          </h1>
          <p className="text-[14px] text-secondary mt-1">
            Real-time stock tracking, minimum thresholds, and automatic recipe consumption
          </p>
        </div>

        <button className="btn-primary">
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Ingredient</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Tracked Items</div>
          <div className="text-[28px] font-semibold text-heading mt-2 leading-none">{stock.length}</div>
        </div>
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Healthy Stock</div>
          <div className="text-[28px] font-semibold text-success mt-2 leading-none">
            {stock.length - lowStockCount}
          </div>
        </div>
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Low Stock Alerts</div>
          <div className="text-[28px] font-semibold text-danger mt-2 leading-none">{lowStockCount}</div>
        </div>
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Inventory Value</div>
          <div className="text-[28px] font-semibold text-heading mt-2 leading-none">₹24,850</div>
        </div>
      </div>

      {/* Stock Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stock.map((item) => {
          const isLow = item.currentStock <= item.minThreshold;
          return (
            <div
              key={item.id}
              className={`card flex flex-col justify-between hover:border-placeholder transition ${
                isLow ? 'border-red-200 bg-red-50/10' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted font-medium">{item.category}</span>
                  {isLow ? (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-danger-bg text-danger">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Low Stock</span>
                    </span>
                  ) : (
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-success-bg text-success">
                      Adequate
                    </span>
                  )}
                </div>

                <h3 className="font-semibold text-[15px] text-heading">{item.name}</h3>
                <div className="mt-3 flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-heading">
                    {item.currentStock} {item.unit}
                  </span>
                  <span className="text-xs text-muted">
                    (Min: {item.minThreshold} {item.unit})
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-borderLight flex items-center justify-between text-xs text-secondary">
                <span>Unit Cost: ₹{(item.costPerUnit / 100).toFixed(2)}/{item.unit}</span>
                <button className="text-primary hover:underline font-semibold text-xs">+ Adjust</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
