'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  BusinessType,
  BusinessProfile,
  ModuleToken,
  UserSession,
  Table as FloorTable,
  Order,
  Category,
  MenuItem,
  DevicePlatform,
} from '@platform/types';
import { resolveDynamicNavigation, NavItem, getDefaultModulesForBusinessType } from '@platform/config-engine';
import { offlineDb } from './offline-db';
import { generateUUIDv7, createIdempotencyKey } from '@platform/offline-sync';

import { ROLE_DEFAULT_PERMISSIONS } from './permission-engine';

// Default Demo State for Spice Garden
const DEMO_PROFILE: BusinessProfile = {
  id: 'demo-profile-1',
  tenantId: 'tenant-spice-garden',
  businessName: 'The Royal Biryani & Cafe',
  phone: '+91 98765 43210',
  email: 'owner@spicegarden.com',
  address: '104 Brigade Road',
  city: 'Bengaluru',
  state: 'Karnataka',
  country: 'IN',
  currencyCode: 'INR',
  currencySymbol: '₹',
  timezone: 'Asia/Kolkata',
  onboardingCompleted: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const DEMO_SESSION: UserSession = {
  userId: 'usr-owner-01',
  tenantId: 'tenant-spice-garden',
  email: 'owner@spicegarden.com',
  fullName: 'Rajesh Sharma',
  roleName: 'OWNER',
  permissions: ['*'],
  deviceId: 'dev-terminal-01',
  isSuperAdmin: false,
};

const DEMO_TABLES: FloorTable[] = [
  { id: 't1', tenantId: 'tenant-spice-garden', tableNumber: '1', tableName: 'Table 1', capacity: 4, status: 'AVAILABLE', createdAt: '', updatedAt: '' },
  { id: 't2', tenantId: 'tenant-spice-garden', tableNumber: '2', tableName: 'Table 2', capacity: 2, status: 'OCCUPIED', activeOrderTotal: 84000, currentGuests: 2, createdAt: '', updatedAt: '' },
  { id: 't3', tenantId: 'tenant-spice-garden', tableNumber: '3', tableName: 'Table 3', capacity: 6, status: 'BILLING', activeOrderTotal: 156000, currentGuests: 4, createdAt: '', updatedAt: '' },
  { id: 't4', tenantId: 'tenant-spice-garden', tableNumber: '4', tableName: 'Table 4', capacity: 4, status: 'AVAILABLE', createdAt: '', updatedAt: '' },
  { id: 't5', tenantId: 'tenant-spice-garden', tableNumber: '5', tableName: 'VIP 1', capacity: 8, status: 'RESERVED', createdAt: '', updatedAt: '' },
  { id: 't6', tenantId: 'tenant-spice-garden', tableNumber: '6', tableName: 'Terrace 1', capacity: 4, status: 'AVAILABLE', createdAt: '', updatedAt: '' },
];

const DEMO_CATEGORIES: Category[] = [
  { id: 'c1', tenantId: 'tenant-spice-garden', name: 'Biryani Specials', sortOrder: 1, isActive: true },
  { id: 'c2', tenantId: 'tenant-spice-garden', name: 'Starters & Tandoor', sortOrder: 2, isActive: true },
  { id: 'c3', tenantId: 'tenant-spice-garden', name: 'Curries & Breads', sortOrder: 3, isActive: true },
  { id: 'c4', tenantId: 'tenant-spice-garden', name: 'Beverages & Desserts', sortOrder: 4, isActive: true },
];

const DEMO_MENU_ITEMS: MenuItem[] = [
  { id: 'm1', tenantId: 'tenant-spice-garden', categoryId: 'c1', name: 'Hyderabadi Chicken Dum Biryani', basePrice: 32000, taxRatePercent: 5, foodType: 'NON_VEG', isAvailable: true, createdAt: '', updatedAt: '' },
  { id: 'm2', tenantId: 'tenant-spice-garden', categoryId: 'c1', name: 'Mutton Ghee Roast Biryani', basePrice: 42000, taxRatePercent: 5, foodType: 'NON_VEG', isAvailable: true, createdAt: '', updatedAt: '' },
  { id: 'm3', tenantId: 'tenant-spice-garden', categoryId: 'c1', name: 'Paneer Tikka Biryani', basePrice: 28000, taxRatePercent: 5, foodType: 'VEG', isAvailable: true, createdAt: '', updatedAt: '' },
  { id: 'm4', tenantId: 'tenant-spice-garden', categoryId: 'c2', name: 'Chicken Tikka Kebab (6 pcs)', basePrice: 29000, taxRatePercent: 5, foodType: 'NON_VEG', isAvailable: true, createdAt: '', updatedAt: '' },
  { id: 'm5', tenantId: 'tenant-spice-garden', categoryId: 'c2', name: 'Crispy Corn Salt & Pepper', basePrice: 22000, taxRatePercent: 5, foodType: 'VEG', isAvailable: true, createdAt: '', updatedAt: '' },
  { id: 'm6', tenantId: 'tenant-spice-garden', categoryId: 'c3', name: 'Butter Chicken Masala', basePrice: 34000, taxRatePercent: 5, foodType: 'NON_VEG', isAvailable: true, createdAt: '', updatedAt: '' },
  { id: 'm7', tenantId: 'tenant-spice-garden', categoryId: 'c3', name: 'Butter Garlic Naan', basePrice: 7500, taxRatePercent: 5, foodType: 'VEG', isAvailable: true, createdAt: '', updatedAt: '' },
  { id: 'm8', tenantId: 'tenant-spice-garden', categoryId: 'c4', name: 'Gulab Jamun with Rabdi', basePrice: 14000, taxRatePercent: 5, foodType: 'VEG', isAvailable: true, createdAt: '', updatedAt: '' },
  { id: 'm9', tenantId: 'tenant-spice-garden', categoryId: 'c4', name: 'Masala Chai', basePrice: 4000, taxRatePercent: 5, foodType: 'BEVERAGE', isAvailable: true, createdAt: '', updatedAt: '' },
];

interface AppContextType {
  profile: BusinessProfile;
  setProfile: (p: BusinessProfile) => void;
  businessType: BusinessType;
  setBusinessType: (b: BusinessType) => void;
  enabledModules: ModuleToken[];
  toggleModule: (token: ModuleToken) => void;
  session: UserSession;
  setSession: (s: UserSession) => void;
  isOnline: boolean;
  setIsOnline: (status: boolean) => void;
  navigation: {
    sidebarItems: NavItem[];
    bottomNavItems: NavItem[];
    defaultRoute: string;
  };
  tables: FloorTable[];
  setTables: React.Dispatch<React.SetStateAction<FloorTable[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  activeOrders: Order[];
  createOrderOffline: (orderData: Partial<Order>) => Promise<Order>;
  updateTableStatus: (tableId: string, status: FloorTable['status']) => void;
  pendingSyncCount: number;
  triggerSync: () => Promise<void>;
  resetToDemo: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<BusinessProfile>(DEMO_PROFILE);
  const [businessType, setBusinessTypeState] = useState<BusinessType>('RESTAURANT');
  const [enabledModules, setEnabledModules] = useState<ModuleToken[]>(
    getDefaultModulesForBusinessType('RESTAURANT')
  );
  const [session, setSessionState] = useState<UserSession>(DEMO_SESSION);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [devicePlatform] = useState<DevicePlatform>('DESKTOP');
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);

  const [tables, setTables] = useState<FloorTable[]>(DEMO_TABLES);
  const [categories, setCategories] = useState<Category[]>(DEMO_CATEGORIES);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(DEMO_MENU_ITEMS);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);

  // Persistent storage wrappers
  const setProfile = (newProfile: BusinessProfile) => {
    setProfileState(newProfile);
    if (typeof window !== 'undefined') {
      localStorage.setItem('saas_active_profile', JSON.stringify(newProfile));
    }
  };

  const setSession = (newSession: UserSession) => {
    setSessionState(newSession);
    if (typeof window !== 'undefined') {
      localStorage.setItem('saas_active_session', JSON.stringify(newSession));
    }
  };

  const setBusinessType = (newType: BusinessType) => {
    setBusinessTypeState(newType);
    setEnabledModules(getDefaultModulesForBusinessType(newType));
    if (typeof window !== 'undefined') {
      localStorage.setItem('saas_active_business_type', newType);
    }
  };

  const resetToDemo = () => {
    setProfile(DEMO_PROFILE);
    setSession(DEMO_SESSION);
    setBusinessType('RESTAURANT');
    setTables(DEMO_TABLES);
    setCategories(DEMO_CATEGORIES);
    setMenuItems(DEMO_MENU_ITEMS);
    setActiveOrders([]);
  };

  // Hydrate session & profile on initial browser load
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedProfile = localStorage.getItem('saas_active_profile');
      const savedSession = localStorage.getItem('saas_active_session');
      const savedBType = localStorage.getItem('saas_active_business_type');

      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        setProfileState(parsed);
      }
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        setSessionState(parsed);
      }
      if (savedBType) {
        setBusinessTypeState(savedBType as BusinessType);
        setEnabledModules(getDefaultModulesForBusinessType(savedBType as BusinessType));
      }
    } catch (e) {
      console.error('Failed to hydrate local session:', e);
    }
  }, []);

  // Isolate tenant floor tables and menu when switching tenant
  useEffect(() => {
    if (!profile.tenantId || profile.tenantId === 'tenant-spice-garden') {
      setTables(DEMO_TABLES);
      setCategories(DEMO_CATEGORIES);
      setMenuItems(DEMO_MENU_ITEMS);
    } else {
      // Clean isolated store for newly registered accounts
      const customTablesKey = `saas_tables_${profile.tenantId}`;
      const savedTables = typeof window !== 'undefined' ? localStorage.getItem(customTablesKey) : null;
      if (savedTables) {
        try {
          setTables(JSON.parse(savedTables));
        } catch {
          setTables([]);
        }
      } else {
        // Starter initial clean tables for new restaurant
        setTables([
          { id: `t1-${profile.tenantId}`, tenantId: profile.tenantId, tableNumber: '1', tableName: 'Table 1', capacity: 4, status: 'AVAILABLE', createdAt: '', updatedAt: '' },
          { id: `t2-${profile.tenantId}`, tenantId: profile.tenantId, tableNumber: '2', tableName: 'Table 2', capacity: 2, status: 'AVAILABLE', createdAt: '', updatedAt: '' },
          { id: `t3-${profile.tenantId}`, tenantId: profile.tenantId, tableNumber: '3', tableName: 'Table 3', capacity: 6, status: 'AVAILABLE', createdAt: '', updatedAt: '' },
        ]);
      }

      setCategories([
        { id: `c1-${profile.tenantId}`, tenantId: profile.tenantId, name: 'Main Menu', sortOrder: 1, isActive: true },
        { id: `c2-${profile.tenantId}`, tenantId: profile.tenantId, name: 'Beverages', sortOrder: 2, isActive: true },
      ]);

      setMenuItems([
        { id: `m1-${profile.tenantId}`, tenantId: profile.tenantId, categoryId: `c1-${profile.tenantId}`, name: 'Special Dish', basePrice: 25000, taxRatePercent: 5, foodType: 'NON_VEG', isAvailable: true, createdAt: '', updatedAt: '' },
        { id: `m2-${profile.tenantId}`, tenantId: profile.tenantId, categoryId: `c2-${profile.tenantId}`, name: 'Fresh Juice', basePrice: 8000, taxRatePercent: 5, foodType: 'BEVERAGE', isAvailable: true, createdAt: '', updatedAt: '' },
      ]);
    }
  }, [profile.tenantId]);

  // Listen to browser network changes
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      setIsOnline(navigator.onLine);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, []);

  // Update Pending Sync Count from IndexedDB
  const refreshPendingCount = async () => {
    try {
      const count = await offlineDb.syncQueue.where('status').equals('PENDING').count();
      setPendingSyncCount(count);
    } catch {
      // IndexedDB fallback in non-browser env
    }
  };

  useEffect(() => {
    refreshPendingCount();
  }, []);

  const toggleModule = (token: ModuleToken) => {
    setEnabledModules((prev) =>
      prev.includes(token) ? prev.filter((t) => t !== token) : [...prev, token]
    );
  };

  const updateTableStatus = (tableId: string, status: FloorTable['status']) => {
    setTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, status, updatedAt: new Date().toISOString() } : t))
    );
  };

  // Transactional Offline Order Creation
  const createOrderOffline = async (orderData: Partial<Order>): Promise<Order> => {
    const orderId = generateUUIDv7();
    const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      id: orderId,
      tenantId: profile.tenantId,
      orderNumber,
      orderType: orderData.orderType || 'DINE_IN',
      tableId: orderData.tableId,
      tableName: orderData.tableName,
      status: 'PLACED',
      guestCount: orderData.guestCount || 2,
      subtotal: orderData.subtotal || 0,
      taxAmount: orderData.taxAmount || 0,
      discountAmount: 0,
      serviceChargeAmount: 0,
      roundOffAmount: 0,
      grandTotal: (orderData.subtotal || 0) + (orderData.taxAmount || 0),
      createdByWorkerId: session.userId,
      createdByWorkerName: session.fullName,
      deviceId: session.deviceId || 'device-local',
      items: orderData.items || [],
      createdAt: now,
      updatedAt: now,
    };

    // 1. Commit to in-memory state
    setActiveOrders((prev) => [newOrder, ...prev]);

    // 2. Commit to persistent IndexedDB
    try {
      await offlineDb.orders.add(newOrder);

      // 3. Push to offline sync queue with deterministic idempotency key
      const idempotencyKey = createIdempotencyKey({
        deviceId: session.deviceId || 'local',
        tenantId: profile.tenantId,
        entityType: 'ORDER',
        action: 'CREATE',
        localTimestamp: Date.now(),
      });

      await offlineDb.syncQueue.add({
        operationId: generateUUIDv7(),
        tenantId: profile.tenantId,
        deviceId: session.deviceId || 'local',
        workerId: session.userId,
        entityType: 'ORDER',
        action: 'CREATE',
        localTimestamp: Date.now(),
        idempotencyKey,
        payloadJson: newOrder,
        status: 'PENDING',
        retryCount: 0,
      });

      await refreshPendingCount();
    } catch (e) {
      console.error('Local IndexedDB write error:', e);
    }

    return newOrder;
  };

  const triggerSync = async () => {
    if (!isOnline) return;
    try {
      const pendingOps = await offlineDb.syncQueue.where('status').equals('PENDING').toArray();
      if (pendingOps.length === 0) return;

      // Simulate network sync reconciliation
      await new Promise((r) => setTimeout(r, 600));

      for (const op of pendingOps) {
        await offlineDb.syncQueue.update(op.operationId, {
          status: 'SYNCED',
          syncedAt: new Date().toISOString(),
        });
      }
      await refreshPendingCount();
    } catch (e) {
      console.error('Sync reconciliation error:', e);
    }
  };

  const navigation = resolveDynamicNavigation({
    businessType,
    enabledModules,
    userRole: session.roleName as any,
    permissions: session.permissions,
    devicePlatform,
  });

  return (
    <AppContext.Provider
      value={{
        profile,
        setProfile,
        businessType,
        setBusinessType,
        enabledModules,
        toggleModule,
        session,
        setSession,
        isOnline,
        setIsOnline,
        navigation,
        tables,
        setTables,
        categories,
        setCategories,
        menuItems,
        setMenuItems,
        activeOrders,
        createOrderOffline,
        updateTableStatus,
        pendingSyncCount,
        triggerSync,
        resetToDemo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
}
