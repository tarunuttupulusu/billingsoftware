'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
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

// Initial Empty State
const INITIAL_PROFILE: BusinessProfile = {
  id: '',
  tenantId: '',
  businessName: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  state: '',
  country: 'IN',
  currencyCode: 'INR',
  currencySymbol: '₹',
  timezone: 'Asia/Kolkata',
  onboardingCompleted: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const INITIAL_SESSION: UserSession = {
  userId: '',
  tenantId: '',
  email: '',
  fullName: '',
  roleName: 'OWNER',
  permissions: ['*'],
  deviceId: 'dev-terminal-01',
  isSuperAdmin: false,
};

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
  setActiveOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  customers: any[];
  setCustomers: React.Dispatch<React.SetStateAction<any[]>>;
  expenses: any[];
  setExpenses: React.Dispatch<React.SetStateAction<any[]>>;
  stats: {
    totalRevenue: number;
    totalOrders: number;
    activeOrders: number;
    occupiedTables: number;
    totalTables: number;
    totalMenuItems: number;
    totalCustomers: number;
    totalStaff: number;
  };
  isLoadingData: boolean;
  refreshTenantData: () => Promise<void>;
  createOrderOffline: (orderData: Partial<Order>) => Promise<Order>;
  updateTableStatus: (tableId: string, status: FloorTable['status']) => void;
  pendingSyncCount: number;
  triggerSync: () => Promise<void>;
  resetToDemo: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<BusinessProfile>(INITIAL_PROFILE);
  const [businessType, setBusinessTypeState] = useState<BusinessType>('RESTAURANT');
  const [enabledModules, setEnabledModules] = useState<ModuleToken[]>(
    getDefaultModulesForBusinessType('RESTAURANT')
  );
  const [session, setSessionState] = useState<UserSession>(INITIAL_SESSION);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [devicePlatform] = useState<DevicePlatform>('DESKTOP');
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);

  const [tables, setTables] = useState<FloorTable[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeOrders: 0,
    occupiedTables: 0,
    totalTables: 0,
    totalMenuItems: 0,
    totalCustomers: 0,
    totalStaff: 0,
  });
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);

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
    setProfile(INITIAL_PROFILE);
    setSession(INITIAL_SESSION);
    setBusinessType('RESTAURANT');
  };

  // Dynamic Database Fetcher
  const refreshTenantData = useCallback(async () => {
    const activeTenantId = profile.tenantId || session.tenantId || 'tenant-spice-garden';
    setIsLoadingData(true);
    try {
      const res = await fetch(`/api/tenant/data?tenantId=${activeTenantId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.tables) setTables(data.tables);
        if (data.categories) setCategories(data.categories);
        if (data.menuItems) setMenuItems(data.menuItems);
        if (data.orders) setActiveOrders(data.orders);
        if (data.customers) setCustomers(data.customers);
        if (data.expenses) setExpenses(data.expenses);
        if (data.stats) setStats(data.stats);
        if (data.profile) {
          setProfileState(data.profile);
        }
      }
    } catch (err) {
      console.error('Error loading dynamic database data:', err);
    } finally {
      setIsLoadingData(false);
    }
  }, [profile.tenantId, session.tenantId]);

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

  // Whenever tenantId changes, dynamically fetch data from the database
  useEffect(() => {
    refreshTenantData();
  }, [profile.tenantId, session.tenantId, refreshTenantData]);

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

  // Transactional Offline/Online Order Creation
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

    // 2. Post to Database if online
    if (isOnline) {
      try {
        await fetch('/api/tenant/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tenantId: profile.tenantId,
            orderType: newOrder.orderType,
            tableId: newOrder.tableId,
            tableName: newOrder.tableName,
            guestCount: newOrder.guestCount,
            subtotal: newOrder.subtotal,
            taxAmount: newOrder.taxAmount,
            grandTotal: newOrder.grandTotal,
            items: newOrder.items,
            createdByWorkerId: session.userId,
            createdByWorkerName: session.fullName,
          }),
        });
      } catch (err) {
        console.warn('Could not post order immediately to cloud API, queued locally:', err);
      }
    }

    // 3. Commit to persistent IndexedDB
    try {
      await offlineDb.orders.add(newOrder);

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
        setActiveOrders,
        customers,
        setCustomers,
        expenses,
        setExpenses,
        stats,
        isLoadingData,
        refreshTenantData,
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
