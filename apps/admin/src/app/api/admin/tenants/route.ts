import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@platform/database';

export async function GET() {
  try {
    const tenants = await prisma.tenant.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        businessProfile: true,
        users: {
          select: {
            id: true,
            email: true,
            fullName: true,
            roleType: true,
            isActive: true,
            lastLoginAt: true,
          },
        },
        modules: true,
        subscriptions: {
          include: {
            plan: true,
          },
        },
        _count: {
          select: {
            tables: true,
            orders: true,
            menuItems: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      tenants: tenants.map((t) => ({
        id: t.id,
        slug: t.slug,
        name: t.name,
        businessType: t.businessType,
        status: t.status,
        createdAt: t.createdAt.toISOString(),
        profile: t.businessProfile,
        users: t.users,
        modules: t.modules.filter((m) => m.isEnabled).map((m) => m.moduleToken),
        subscription: t.subscriptions[0]
          ? {
              planName: t.subscriptions[0].plan.name,
              status: t.subscriptions[0].status,
              expiresAt: t.subscriptions[0].currentPeriodEnd.toISOString(),
            }
          : { planName: 'STARTER', status: 'ACTIVE', expiresAt: '2026-12-31' },
        metrics: {
          tablesCount: t._count.tables,
          ordersCount: t._count.orders,
          menuItemsCount: t._count.menuItems,
        },
      })),
    });
  } catch (error: any) {
    console.error('Fetch tenants error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tenants.', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { tenantId, action } = await req.json();

    if (!tenantId || !action) {
      return NextResponse.json({ error: 'Tenant ID and action required.' }, { status: 400 });
    }

    let newStatus = 'APPROVED';
    if (action === 'SUSPEND') newStatus = 'SUSPENDED';
    if (action === 'ACTIVATE') newStatus = 'APPROVED';

    const updated = await prisma.tenant.update({
      where: { id: tenantId },
      data: { status: newStatus as any },
    });

    await prisma.auditLog.create({
      data: {
        tenantId,
        userId: 'super-admin',
        userName: 'Platform Super Admin',
        action: `${action}_TENANT`,
        entityType: 'TENANT',
        entityId: tenantId,
        metadataJson: { action, newStatus },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Tenant status updated to ${newStatus}.`,
      tenant: updated,
    });
  } catch (error: any) {
    console.error('Update tenant error:', error);
    return NextResponse.json(
      { error: 'Failed to update tenant.', details: error.message },
      { status: 500 }
    );
  }
}
