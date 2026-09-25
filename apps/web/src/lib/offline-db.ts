import Dexie, { Table as DexieTable } from 'dexie';
import {
  Order,
  OrderItem,
  Table as FloorTable,
  Category,
  MenuItem,
  SyncOperation,
  BusinessProfile,
  ModuleToken,
} from '@platform/types';

export interface LocalPrintJob {
  id: string; // UUIDv7
  tenantId: string;
  type: 'BILL' | 'KOT';
  title: string;
  orderNumber: string;
  tableNumber?: string;
  rawEscPosHex: string;
  status: 'PENDING' | 'PRINTED' | 'FAILED';
  retryCount: number;
  lastError?: string;
  createdAt: string;
}

export interface CachedTenantConfig {
  tenantId: string;
  profile: BusinessProfile;
  enabledModules: ModuleToken[];
  cachedAt: number;
}

export class RestaurantOfflineDatabase extends Dexie {
  public orders!: DexieTable<Order, string>;
  public orderItems!: DexieTable<OrderItem, string>;
  public diningTables!: DexieTable<FloorTable, string>;
  public categories!: DexieTable<Category, string>;
  public menuItems!: DexieTable<MenuItem, string>;
  public syncQueue!: DexieTable<SyncOperation, string>;
  public printJobs!: DexieTable<LocalPrintJob, string>;
  public tenantConfigs!: DexieTable<CachedTenantConfig, string>;

  constructor() {
    super('RestaurantOfflineDB');

    this.version(1).stores({
      orders: 'id, tenantId, orderNumber, tableId, status, createdAt',
      orderItems: 'id, orderId, menuItemId, status',
      diningTables: 'id, tenantId, tableNumber, status',
      categories: 'id, tenantId, sortOrder',
      menuItems: 'id, tenantId, categoryId, isAvailable',
      syncQueue: 'operationId, tenantId, status, localTimestamp, idempotencyKey',
      printJobs: 'id, tenantId, status, createdAt',
      tenantConfigs: 'tenantId',
    });
  }
}

export const offlineDb = new RestaurantOfflineDatabase();
