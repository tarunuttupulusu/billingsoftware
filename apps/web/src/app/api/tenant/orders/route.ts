import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@platform/database';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId') || 'tenant-spice-garden';

    const orders = await prisma.order.findMany({
      where: { tenantId },
      include: {
        items: true,
        table: true,
        invoice: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      tenantId,
      orderType = 'DINE_IN',
      tableId,
      guestCount = 2,
      subtotal = 0,
      taxAmount = 0,
      discountAmount = 0,
      grandTotal = 0,
      items = [],
      status = 'PLACED',
      createdByWorkerId,
      createdByWorkerName,
      deviceId = 'device-pos-01',
    } = body;

    if (!tenantId) {
      return NextResponse.json({ error: 'tenantId is required.' }, { status: 400 });
    }

    const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await prisma.order.create({
      data: {
        tenantId,
        orderNumber,
        orderType: orderType as any,
        tableId: tableId || null,
        guestCount: Number(guestCount),
        subtotal: Math.round(Number(subtotal)),
        taxAmount: Math.round(Number(taxAmount)),
        discountAmount: Math.round(Number(discountAmount)),
        grandTotal: Math.round(Number(grandTotal)),
        status: status as any,
        createdByWorkerId: createdByWorkerId || 'usr-worker-01',
        createdByWorkerName: createdByWorkerName || 'Server',
        deviceId: deviceId || 'dev-terminal-01',
        items: {
          create: items.map((item: any) => ({
            menuItemId: item.menuItemId || item.id || 'm-item-generic',
            itemName: item.name || item.itemName || 'Item',
            quantity: Number(item.quantity) || 1,
            unitPrice: Math.round(Number(item.price || item.unitPrice || 0)),
            subtotal: Math.round(Number(item.subtotal || (item.quantity * (item.price || item.unitPrice || 0)))),
            notes: item.notes || null,
            status: 'PLACED',
            addedByWorkerId: createdByWorkerId || 'usr-worker-01',
            addedByWorkerName: createdByWorkerName || 'Server',
          })),
        },
      },
      include: {
        items: true,
        table: true,
      },
    });

    // If table assigned, update table status to OCCUPIED
    if (tableId) {
      await prisma.table.update({
        where: { id: tableId },
        data: { status: 'OCCUPIED' },
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
