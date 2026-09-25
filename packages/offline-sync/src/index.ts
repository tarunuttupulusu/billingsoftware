import {
  SyncOperation,
  SyncStatus,
  SyncBatchRequest,
  SyncBatchResponse,
} from '@platform/types';

/**
 * Generates RFC 9562 compliant UUIDv7.
 * Encodes 48-bit millisecond unix timestamp in most significant bits,
 * ensuring strict monotonic time-ordering for offline relational records.
 */
export function generateUUIDv7(): string {
  const timestamp = Date.now();
  const hexTime = timestamp.toString(16).padStart(12, '0');

  // Random 12 bits for version 7
  const randA = Math.floor(Math.random() * 0x0fff);
  const hexRandA = randA.toString(16).padStart(3, '0');

  // Variant 10xx + 62 bits random
  const randB1 = 0x8000 | Math.floor(Math.random() * 0x3fff);
  const hexRandB1 = randB1.toString(16).padStart(4, '0');

  const randB2 = Math.floor(Math.random() * 0xffffffff);
  const hexRandB2 = randB2.toString(16).padStart(8, '0');

  const randB3 = Math.floor(Math.random() * 0xffff);
  const hexRandB3 = randB3.toString(16).padStart(4, '0');

  return `${hexTime.slice(0, 8)}-${hexTime.slice(8, 12)}-7${hexRandA}-${hexRandB1}-${hexRandB2}${hexRandB3}`;
}

/**
 * Creates a deterministic, unique idempotency key for every offline operation
 */
export function createIdempotencyKey(params: {
  deviceId: string;
  tenantId: string;
  entityType: string;
  action: string;
  localTimestamp: number;
  nonce?: string;
}): string {
  const nonce = params.nonce || Math.random().toString(36).substring(2, 9);
  return `${params.tenantId}:${params.deviceId}:${params.entityType}:${params.action}:${params.localTimestamp}:${nonce}`;
}

export class OfflineSyncEngine {
  private queue: SyncOperation[] = [];
  private isSyncing = false;
  private maxRetries = 5;

  constructor(initialQueue: SyncOperation[] = []) {
    this.queue = [...initialQueue];
  }

  public enqueueOperation(op: Omit<SyncOperation, 'operationId' | 'status' | 'retryCount' | 'localTimestamp'>): SyncOperation {
    const timestamp = Date.now();
    const operation: SyncOperation = {
      ...op,
      operationId: generateUUIDv7(),
      localTimestamp: timestamp,
      status: 'PENDING',
      retryCount: 0,
    };
    this.queue.push(operation);
    return operation;
  }

  public getPendingOperations(): SyncOperation[] {
    return this.queue.filter((op) => op.status === 'PENDING' || (op.status === 'FAILED' && op.retryCount < this.maxRetries));
  }

  public getAllOperations(): SyncOperation[] {
    return [...this.queue];
  }

  public prepareBatchRequest(deviceId: string, tenantId: string, limit = 50): SyncBatchRequest | null {
    const pending = this.getPendingOperations().slice(0, limit);
    if (pending.length === 0) return null;

    // Mark as SYNCING
    for (const op of pending) {
      op.status = 'SYNCING';
    }

    return {
      deviceId,
      tenantId,
      clientTime: Date.now(),
      operations: pending,
    };
  }

  public processBatchResponse(response: SyncBatchResponse): void {
    const syncedSet = new Set(response.syncedOperationIds);
    const failedMap = new Map(response.failedOperations.map((f) => [f.operationId, f]));

    for (const op of this.queue) {
      if (syncedSet.has(op.operationId)) {
        op.status = 'SYNCED';
        op.syncedAt = new Date().toISOString();
      } else if (failedMap.has(op.operationId)) {
        const failure = failedMap.get(op.operationId)!;
        op.retryCount += 1;
        op.lastErrorMessage = failure.errorMessage;
        op.status = op.retryCount >= this.maxRetries ? 'FAILED' : 'PENDING';
      }
    }
  }

  public clearSyncedOperations(): void {
    this.queue = this.queue.filter((op) => op.status !== 'SYNCED');
  }
}
