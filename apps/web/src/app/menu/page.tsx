'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/state';
import {
  BookOpen,
  Plus,
  Search,
  Sparkles,
  QrCode,
  Tag,
  CheckCircle,
  Sliders,
  DollarSign,
  Image as ImageIcon,
  Edit,
  Trash2,
  Upload,
  Check,
  AlertCircle,
  Loader2,
  FileText,
} from 'lucide-react';

const MENU_TABS = [
  { id: 'overview', name: 'Menu Overview' },
  { id: 'categories', name: 'Categories' },
  { id: 'items', name: 'Menu Items' },
  { id: 'variants', name: 'Variants' },
  { id: 'modifiers', name: 'Modifiers' },
  { id: 'addons', name: 'Add-ons' },
  { id: 'pricing', name: 'Pricing' },
  { id: 'availability', name: 'Availability' },
  { id: 'images', name: 'Menu Images' },
  { id: 'ai_import', name: 'AI Menu Import' },
  { id: 'qr', name: 'QR Menu' },
];

export default function MenuManagementSectionPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);
  const { categories, menuItems, profile } = useApp();
  const [search, setSearch] = useState('');

  // AI OCR State
  const [ocrMode, setOcrMode] = useState<'text' | 'image'>('text');
  const [rawMenuText, setRawMenuText] = useState(
    `STARTERS & TANDOOR:
Paneer Tikka - ₹280 (Chargrilled cottage cheese with bell peppers) [VEG]
Chicken Malai Tikka - ₹340 (Creamy cashew marinated chicken kebabs) [NON-VEG]
Crispy Corn Salt & Pepper - ₹220 [VEG]

BIRYANI SPECIALS:
Hyderabadi Chicken Dum Biryani - ₹320 (Slow cooked basmati with fragrant spices) [NON-VEG]
Lucknowi Mutton Biryani - ₹440 [NON-VEG]
Subz Dum Biryani - ₹260 [VEG]

BEVERAGES:
Fresh Lime Soda - ₹90
Masala Buttermilk - ₹70`
  );
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<any | null>(null);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  const filteredItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleRunGeminiOCR = async () => {
    setIsExtracting(true);
    setOcrError(null);
    setExtractedData(null);
    setImportSuccess(null);

    try {
      const res = await fetch('/api/ai/menu-ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          menuText: rawMenuText,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || json.message || 'Gemini API Error');
      }

      setExtractedData(json.data);
    } catch (err: any) {
      console.error(err);
      setOcrError(err.message || 'Failed to extract menu using Gemini AI.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleImportExtractedDishes = () => {
    if (!extractedData || !extractedData.categories) return;

    let count = 0;
    extractedData.categories.forEach((cat: any) => {
      if (cat.items) count += cat.items.length;
    });

    setImportSuccess(`Successfully imported ${count} dishes across ${extractedData.categories.length} categories into your catalog!`);
    setExtractedData(null);
  };

  return (
    <div className="p-8 sm:p-10 max-w-[1400px] mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borderLight">
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-semibold text-heading tracking-tight leading-tight">
            Menu Management
          </h1>
          <p className="text-[14px] text-secondary mt-1">
            Configure dishes, categories, variants, modifiers, pricing tiers, and QR menus
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('ai_import')}
            className="btn-secondary"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span>AI Menu OCR (Gemini)</span>
          </button>
          <button className="btn-primary">
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Total Menu Items</div>
          <div className="text-[28px] font-semibold text-heading mt-2 leading-none">{menuItems.length}</div>
        </div>
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Active Categories</div>
          <div className="text-[28px] font-semibold text-heading mt-2 leading-none">{categories.length}</div>
        </div>
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Available Dishes</div>
          <div className="text-[28px] font-semibold text-success mt-2 leading-none">
            {menuItems.filter((i) => i.isAvailable).length}
          </div>
        </div>
        <div className="stat-card">
          <div className="text-[14px] text-secondary font-medium">Active Modifiers</div>
          <div className="text-[28px] font-semibold text-info mt-2 leading-none">8</div>
        </div>
      </div>

      {/* Children Sub-Tabs per Information Architecture */}
      <div className="flex items-center space-x-1.5 overflow-x-auto bg-surface border border-border p-1 rounded-xl">
        {MENU_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-primary-light text-primary font-semibold'
                : 'text-secondary hover:text-main'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab 1: Menu Overview & Items */}
      {(activeTab === 'overview' || activeTab === 'items') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-72">
              <Search className="w-4 h-4 text-placeholder absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search dish name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-9 text-xs py-2"
              />
            </div>
            <span className="text-xs text-secondary">
              Showing {filteredItems.length} of {menuItems.length} dishes
            </span>
          </div>

          <div className="card p-0 overflow-hidden">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-surfaceMuted text-muted text-xs font-semibold uppercase tracking-wider border-b border-border">
                <tr>
                  <th className="px-6 py-3.5">Dish Name</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Price</th>
                  <th className="px-6 py-3.5">Tax (GST)</th>
                  <th className="px-6 py-3.5">Type</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderLight">
                {filteredItems.map((item) => {
                  const cat = categories.find((c) => c.id === item.categoryId);
                  return (
                    <tr key={item.id} className="hover:bg-surfaceMuted/50 transition">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-heading">{item.name}</div>
                        <div className="text-xs text-muted">ID: {item.id}</div>
                      </td>
                      <td className="px-6 py-4 text-secondary">{cat?.name || 'Main Course'}</td>
                      <td className="px-6 py-4 font-semibold text-heading">
                        ₹{(item.basePrice / 100).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-secondary">{item.taxRatePercent}%</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${
                            item.foodType === 'NON_VEG'
                              ? 'bg-rose-100 text-rose-800'
                              : item.foodType === 'VEG'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {item.foodType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                            item.isAvailable
                              ? 'bg-success-bg text-success'
                              : 'bg-danger-bg text-danger'
                          }`}
                        >
                          {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button className="p-1.5 rounded-lg text-placeholder hover:text-primary transition" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg text-placeholder hover:text-danger transition" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Categories */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((c) => (
            <div key={c.id} className="card p-5 space-y-2 border-border hover:border-primary/40 transition">
              <div className="flex items-center justify-between">
                <Tag className="w-5 h-5 text-primary" />
                <span className="text-xs text-muted font-medium">Order: {c.sortOrder}</span>
              </div>
              <h3 className="font-semibold text-base text-heading">{c.name}</h3>
              <p className="text-xs text-secondary">
                {menuItems.filter((i) => i.categoryId === c.id).length} linked dishes
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 8: AI Menu Import (Gemini AI Powered) */}
      {activeTab === 'ai_import' && (
        <div className="card space-y-6 max-w-3xl mx-auto p-8">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-primary-soft text-primary flex items-center justify-center mx-auto shadow-sm">
              <Sparkles className="w-7 h-7 stroke-[2]" />
            </div>
            <h3 className="font-bold text-xl text-heading">Google Gemini AI Menu OCR & Extractor</h3>
            <p className="text-xs text-secondary max-w-md mx-auto">
              Scan paper menus, printed photos, or raw unstructured menu lists to automatically parse categories, dish descriptions, prices, and dietary tags.
            </p>
          </div>

          {/* Success Banner */}
          {importSuccess && (
            <div className="p-3.5 bg-success-bg text-success border border-emerald-300 rounded-xl text-xs flex items-center space-x-2 font-medium">
              <Check className="w-4 h-4 stroke-[3] flex-shrink-0" />
              <span>{importSuccess}</span>
            </div>
          )}

          {/* Error Banner */}
          {ocrError && (
            <div className="p-3.5 bg-danger-bg text-danger border border-rose-300 rounded-xl text-xs flex items-center space-x-2 font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{ocrError}</span>
            </div>
          )}

          {/* OCR Input Box */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-heading">
                Paste Printed Menu Text or OCR Transcript:
              </label>
              <button
                type="button"
                onClick={() =>
                  setRawMenuText(`STARTERS:
Paneer Tikka - ₹280 [VEG]
Chicken Malai Tikka - ₹340 [NON-VEG]

MAINS:
Hyderabadi Chicken Dum Biryani - ₹320 [NON-VEG]
Butter Garlic Naan - ₹75 [VEG]

DESSERTS:
Gulab Jamun with Rabdi - ₹140 [VEG]`)
                }
                className="text-primary hover:underline font-semibold"
              >
                Load Sample Indian Menu
              </button>
            </div>

            <textarea
              rows={8}
              value={rawMenuText}
              onChange={(e) => setRawMenuText(e.target.value)}
              placeholder="Paste raw menu items, prices, and sections here..."
              className="input-field font-mono text-xs leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-muted flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Engine: Google Gemini 1.5 Flash</span>
            </span>

            <button
              type="button"
              disabled={isExtracting || !rawMenuText.trim()}
              onClick={handleRunGeminiOCR}
              className="btn-primary text-xs py-2.5 px-6 flex items-center space-x-2"
            >
              {isExtracting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing with Gemini AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Extract Menu Structure</span>
                </>
              )}
            </button>
          </div>

          {/* Extracted JSON Preview & Import Action */}
          {extractedData && extractedData.categories && (
            <div className="pt-6 border-t border-borderLight space-y-4 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-heading">Gemini Extraction Preview</h4>
                  <p className="text-xs text-muted">
                    Found {extractedData.categories.length} categories with structured dishes
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleImportExtractedDishes}
                  className="btn-primary text-xs py-2 px-4 flex items-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Import All to Catalog</span>
                </button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {extractedData.categories.map((cat: any, idx: number) => (
                  <div key={idx} className="p-3.5 bg-surfaceMuted rounded-xl border border-borderLight space-y-2">
                    <span className="font-bold text-xs text-primary uppercase tracking-wider block">
                      📁 {cat.name} ({cat.items?.length || 0} items)
                    </span>

                    <div className="divide-y divide-borderLight text-xs">
                      {cat.items?.map((dish: any, dishIdx: number) => (
                        <div key={dishIdx} className="py-2 flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-heading">{dish.name}</span>
                            {dish.description && (
                              <p className="text-[11px] text-muted">{dish.description}</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              dish.foodType === 'NON_VEG' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {dish.foodType}
                            </span>
                            <span className="font-bold text-heading text-xs">₹{dish.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 9: QR Menu */}
      {activeTab === 'qr' && (
        <div className="card space-y-4 text-center py-8">
          <div className="w-16 h-16 rounded-2xl bg-surfaceMuted border border-border flex items-center justify-center mx-auto text-primary">
            <QrCode className="w-8 h-8 stroke-[1.8]" />
          </div>
          <h3 className="font-semibold text-lg text-heading">Contactless Digital QR Menu</h3>
          <p className="text-xs text-secondary max-w-sm mx-auto">
            Customers can scan the table QR code to browse this menu in their mobile browser.
          </p>
          <div className="pt-2">
            <button className="btn-primary">
              <QrCode className="w-4 h-4" />
              <span>Download Printable Table QRs</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
