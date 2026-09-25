'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/state';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Printer,
  CreditCard,
  Banknote,
  QrCode,
  CheckCircle,
  AlertCircle,
  X,
  ChefHat,
  Receipt,
  User,
  ArrowLeft,
} from 'lucide-react';
import { MenuItem, OrderItem, PaymentMethod } from '@platform/types';
import { buildReceiptPrintJob, buildKotPrintJob } from '@platform/print-engine';

export default function PosPage() {
  const {
    profile,
    enabledModules,
    categories,
    menuItems,
    tables,
    session,
    createOrderOffline,
    updateTableStatus,
    isOnline,
  } = useApp();

  const isDineIn = enabledModules.includes('operations.tables') || enabledModules.includes('pos.dine_in');

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTableId, setSelectedTableId] = useState<string>(isDineIn ? tables[0]?.id || '' : '');
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [paymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('UPI');
  const [cashTendered, setCashTendered] = useState<string>('');
  const [lastPrintedInvoice, setLastPrintedInvoice] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const selectedTable = tables.find((t) => t.id === selectedTableId);

  // Filter Menu Items
  const filteredItems = menuItems.filter((item) => {
    const matchesCat = selectedCategory === 'ALL' || item.categoryId === selectedCategory;
    const matchesQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery && item.isAvailable;
  });

  // Cart operations
  const addToCart = (item: MenuItem) => {
    setCartItems((prev) => {
      const existing = prev.find((ci) => ci.menuItemId === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.menuItemId === item.id
            ? { ...ci, quantity: ci.quantity + 1, subtotal: (ci.quantity + 1) * ci.unitPrice }
            : ci
        );
      }
      const newItem: OrderItem = {
        id: `oi-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        orderId: '',
        menuItemId: item.id,
        itemName: item.name,
        unitPrice: item.basePrice,
        quantity: 1,
        subtotal: item.basePrice,
        status: 'PLACED',
        addedByWorkerId: session.userId,
        addedByWorkerName: session.fullName,
        createdAt: new Date().toISOString(),
      };
      return [...prev, newItem];
    });
  };

  const updateQuantity = (menuItemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((ci) => {
          if (ci.menuItemId === menuItemId) {
            const nextQty = ci.quantity + delta;
            return nextQty > 0
              ? { ...ci, quantity: nextQty, subtotal: nextQty * ci.unitPrice }
              : null;
          }
          return ci;
        })
        .filter(Boolean) as OrderItem[]
    );
  };

  const removeFromCart = (menuItemId: string) => {
    setCartItems((prev) => prev.filter((ci) => ci.menuItemId !== menuItemId));
  };

  const clearCart = () => setCartItems([]);

  // Computed totals
  const cartSubtotal = cartItems.reduce((acc, ci) => acc + ci.subtotal, 0);
  const cartTax = Math.round(cartSubtotal * 0.05); // 5% GST
  const cartGrandTotal = cartSubtotal + cartTax;

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  // Dispatch Kitchen Order Ticket (KOT)
  const handleSendKot = async () => {
    if (cartItems.length === 0) return;
    const order = await createOrderOffline({
      tableId: isDineIn ? selectedTableId : undefined,
      tableName: isDineIn ? selectedTable?.tableName : 'Counter',
      items: cartItems,
      subtotal: cartSubtotal,
      taxAmount: cartTax,
      grandTotal: cartGrandTotal,
    });

    if (isDineIn && selectedTableId) {
      updateTableStatus(selectedTableId, 'OCCUPIED');
    }

    const kotBytes = buildKotPrintJob({
      id: `kot-${Date.now()}`,
      tenantId: profile.tenantId,
      ticketNumber: `KOT-${Math.floor(100 + Math.random() * 900)}`,
      orderId: order.id,
      orderNumber: order.orderNumber,
      tableNumber: isDineIn ? selectedTable?.tableNumber : 'Counter',
      orderType: isDineIn ? 'Dine In' : 'Takeaway',
      status: 'PENDING',
      waiterName: session.fullName,
      createdAt: new Date().toISOString(),
      items: cartItems.map((ci) => ({
        id: `ki-${ci.id}`,
        kitchenTicketId: '',
        orderItemId: ci.id,
        itemName: ci.itemName,
        quantity: ci.quantity,
        status: 'PENDING',
      })),
    });

    showToast(`KOT dispatched for ${order.orderNumber}! (${kotBytes.length} ESC/POS bytes spooled)`);
    clearCart();
  };

  // Complete Payment & Generate Bill
  const handleCompletePayment = async () => {
    if (cartItems.length === 0) return;
    const order = await createOrderOffline({
      tableId: isDineIn ? selectedTableId : undefined,
      tableName: isDineIn ? selectedTable?.tableName : 'Counter',
      items: cartItems,
      subtotal: cartSubtotal,
      taxAmount: cartTax,
      grandTotal: cartGrandTotal,
    });

    const invoiceNumber = `INV-${Math.floor(10000 + Math.random() * 90000)}`;

    const receiptBytes = buildReceiptPrintJob({
      business: profile,
      invoice: {
        id: `inv-${Date.now()}`,
        tenantId: profile.tenantId,
        invoiceNumber,
        orderId: order.id,
        orderNumber: order.orderNumber,
        subtotal: cartSubtotal,
        taxAmount: cartTax,
        discountAmount: 0,
        serviceChargeAmount: 0,
        roundOffAmount: 0,
        grandTotal: cartGrandTotal,
        status: 'PAID',
        paidAmount: cartGrandTotal,
        dueAmount: 0,
        generatedByWorkerId: session.userId,
        generatedByWorkerName: session.fullName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      order,
    });

    if (isDineIn && selectedTableId) {
      updateTableStatus(selectedTableId, 'AVAILABLE');
    }

    setLastPrintedInvoice(invoiceNumber);
    setPaymentModalOpen(false);
    clearCart();
    showToast(`Bill ${invoiceNumber} settled & printed successfully! (${receiptBytes.length} bytes ESC/POS)`);
  };

  return (
    <div className="flex h-full w-full overflow-hidden select-none font-sans bg-background">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-8 z-50 bg-success text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center space-x-2 text-sm font-semibold">
          <CheckCircle className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* LEFT / CENTER: MENU CATALOG & CATEGORIES */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-border bg-background">
        {/* TOP BAR: TABLE PICKER (If Dine-In) + SEARCH */}
        <div className="p-3.5 border-b border-border bg-surface flex flex-wrap items-center gap-3">
          {isDineIn ? (
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-secondary uppercase">Table:</span>
              <select
                value={selectedTableId}
                onChange={(e) => setSelectedTableId(e.target.value)}
                className="bg-surfaceMuted border border-border text-heading text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-primary"
              >
                {tables.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.tableName} ({t.status})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-xs font-semibold text-primary bg-primary-light px-3 py-1.5 rounded-xl border border-primary/20">
              <span>⚡ Quick Walk-in Counter POS</span>
            </div>
          )}

          {/* Search Box */}
          <div className="flex-1 min-w-[200px] relative">
            <Search className="w-4 h-4 text-placeholder absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search dishes or type SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input w-full h-[40px] text-xs pl-9"
            />
          </div>
        </div>

        {/* CATEGORIES HORIZONTAL BAR */}
        <div className="px-3.5 py-2.5 border-b border-border bg-surface flex items-center space-x-2 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === 'ALL'
                ? 'bg-primary text-white shadow-button'
                : 'bg-surfaceMuted text-secondary hover:text-main'
            }`}
          >
            All Items ({menuItems.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-primary text-white shadow-button'
                  : 'bg-surfaceMuted text-secondary hover:text-main'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* ITEMS GRID */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {filteredItems.map((item) => {
            const inCart = cartItems.find((ci) => ci.menuItemId === item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => addToCart(item)}
                className={`p-3.5 rounded-[16px] border text-left flex flex-col justify-between transition-all relative ${
                  inCart
                    ? 'bg-primary-light border-primary/60 shadow-sm'
                    : 'bg-surface border-border hover:border-placeholder shadow-sm hover:shadow-card'
                }`}
              >
                {inCart && (
                  <span className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center shadow-button">
                    {inCart.quantity}
                  </span>
                )}
                <div>
                  <div className="flex items-center space-x-1.5 mb-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.foodType === 'VEG'
                          ? 'bg-emerald-500'
                          : item.foodType === 'NON_VEG'
                          ? 'bg-rose-500'
                          : 'bg-amber-500'
                      }`}
                    />
                    <span className="text-[10px] uppercase font-bold text-muted">
                      {item.foodType}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm text-heading line-clamp-2 leading-snug">
                    {item.name}
                  </h4>
                </div>
                <div className="mt-3 pt-2.5 border-t border-borderLight flex items-center justify-between">
                  <span className="font-semibold text-sm text-heading">
                    {profile.currencySymbol} {(item.basePrice / 100).toFixed(2)}
                  </span>
                  <span className="text-[11px] text-primary font-semibold">+ Add</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT SIDEBAR: CURRENT ORDER & BILLING PANEL */}
      <div className="w-80 sm:w-96 flex flex-col bg-surface border-l border-border h-full">
        {/* Cart Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-[15px] text-heading flex items-center space-x-2">
              <Receipt className="w-4 h-4 text-primary" />
              <span>Current Order</span>
            </h3>
            <span className="text-xs text-muted">
              {isDineIn ? selectedTable?.tableName : 'Walk-in Counter'} • {session.fullName}
            </span>
          </div>
          {cartItems.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="text-xs text-danger hover:underline font-semibold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Cart Line Items */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-2">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-surfaceMuted border border-borderLight flex items-center justify-center mb-3">
                <Receipt className="w-6 h-6 stroke-[1.8]" />
              </div>
              <p className="text-sm font-semibold text-heading">Cart is empty</p>
              <p className="text-xs text-muted mt-1">Tap items on the left to add to order</p>
            </div>
          ) : (
            cartItems.map((ci) => (
              <div
                key={ci.id}
                className="p-3 rounded-xl bg-surfaceMuted border border-borderLight flex items-center justify-between space-x-2"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-xs text-heading truncate">{ci.itemName}</div>
                  <div className="text-[11px] text-muted">
                    {profile.currencySymbol} {(ci.unitPrice / 100).toFixed(2)} each
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-1.5 bg-surface border border-border rounded-lg p-0.5">
                  <button
                    type="button"
                    onClick={() => updateQuantity(ci.menuItemId, -1)}
                    className="p-1 rounded text-secondary hover:bg-surfaceMuted"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-bold text-xs text-heading px-1">
                    {ci.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(ci.menuItemId, 1)}
                    className="p-1 rounded text-secondary hover:bg-surfaceMuted"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <div className="text-right">
                  <div className="font-semibold text-xs text-heading">
                    {profile.currencySymbol} {(ci.subtotal / 100).toFixed(2)}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(ci.menuItemId)}
                  className="p-1 text-placeholder hover:text-danger"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Cart Totals & Checkout Panel */}
        <div className="p-4 border-t border-border bg-surface space-y-3">
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-secondary">
              <span>Subtotal:</span>
              <span className="font-medium">{profile.currencySymbol} {(cartSubtotal / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-secondary">
              <span>GST / Taxes (5%):</span>
              <span className="font-medium">{profile.currencySymbol} {(cartTax / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-heading pt-2 border-t border-borderLight">
              <span>Grand Total:</span>
              <span className="text-base text-primary font-bold">
                {profile.currencySymbol} {(cartGrandTotal / 100).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {enabledModules.includes('operations.kitchen_kds') && (
              <button
                type="button"
                onClick={handleSendKot}
                disabled={cartItems.length === 0}
                className="btn-secondary text-xs py-2.5 disabled:opacity-40"
              >
                <ChefHat className="w-4 h-4 text-primary" />
                <span>Send KOT</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setPaymentModalOpen(true)}
              disabled={cartItems.length === 0}
              className={`btn-primary text-xs py-2.5 disabled:opacity-40 ${
                !enabledModules.includes('operations.kitchen_kds') ? 'col-span-2' : ''
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>Settle & Pay</span>
            </button>
          </div>
        </div>
      </div>

      {/* PAYMENT & SETTLEMENT MODAL */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-[20px] bg-surface border border-border p-6 shadow-dropdown space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-borderLight">
              <div>
                <h3 className="font-semibold text-lg text-heading">Settle & Generate Bill</h3>
                <p className="text-xs text-secondary mt-0.5">
                  Total Due: <strong className="text-heading text-sm font-bold">{profile.currencySymbol} {(cartGrandTotal / 100).toFixed(2)}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPaymentModalOpen(false)}
                className="p-1 rounded-lg text-placeholder hover:text-heading"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Payment Modes */}
            <div className="grid grid-cols-3 gap-2">
              {(['UPI', 'CASH', 'CARD'] as PaymentMethod[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setSelectedPaymentMethod(mode)}
                  className={`p-3 rounded-xl border text-center font-semibold text-xs transition ${
                    selectedPaymentMethod === mode
                      ? 'bg-primary-light text-primary border-primary shadow-sm'
                      : 'bg-surface text-secondary border-border hover:bg-surfaceMuted'
                  }`}
                >
                  {mode === 'UPI' && <QrCode className="w-5 h-5 mx-auto mb-1 stroke-[1.8]" />}
                  {mode === 'CASH' && <Banknote className="w-5 h-5 mx-auto mb-1 stroke-[1.8]" />}
                  {mode === 'CARD' && <CreditCard className="w-5 h-5 mx-auto mb-1 stroke-[1.8]" />}
                  <span>{mode}</span>
                </button>
              ))}
            </div>

            {/* Cash Tendered Input */}
            {selectedPaymentMethod === 'CASH' && (
              <div className="p-3.5 rounded-xl bg-surfaceMuted border border-borderLight space-y-2">
                <label className="text-xs text-secondary font-medium">Cash Received:</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                    {profile.currencySymbol}
                  </span>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={cashTendered}
                    onChange={(e) => setCashTendered(e.target.value)}
                    className="input-field pl-8"
                  />
                </div>
                {Number(cashTendered) * 100 >= cartGrandTotal && (
                  <div className="text-xs text-success font-medium">
                    Change to return: {profile.currencySymbol} {((Number(cashTendered) * 100 - cartGrandTotal) / 100).toFixed(2)}
                  </div>
                )}
              </div>
            )}

            {/* Settle Action */}
            <button
              type="button"
              onClick={handleCompletePayment}
              className="w-full btn-primary py-3"
            >
              <Printer className="w-4 h-4" />
              <span>Confirm Payment & Print Receipt</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
