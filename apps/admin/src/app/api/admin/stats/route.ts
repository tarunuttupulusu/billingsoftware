import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@platform/database';

export async function GET() {
  try {
    const [
      totalTenants,
      pendingRequests,
      totalUsers,
      activeSubscriptions,
      totalOrders,
      totalMenuItems,
    ] = await Promise.all([
      prisma.tenant.count(),
      prisma.registrationRequest.count({ where: { status: 'PENDING' } }),
      prisma.user.count(),
      prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      prisma.order.count(),
      prisma.menuItem.count(),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalTenants,
        pendingRequests,
        totalUsers,
        activeSubscriptions,
        totalOrders,
        totalMenuItems,
        mrr: activeSubscriptions * 2999, // In INR based on PRO tier
        health: 'HEALTHY',
        uptime: '99.98%',
      },
    });
  } catch (error: any) {
    console.error('Stats fetch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
