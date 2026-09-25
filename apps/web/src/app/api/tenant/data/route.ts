import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@platform/database';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId') || 'tenant-spice-garden';

    // 1. Fetch Tenant & Business Profile
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        businessProfile: true,
        modules: true,
      },
    });

    if (!tenant) {
      return NextResponse.json(
        { error: `Tenant ${tenantId} not found.` },
        { status: 404 }
      );
    }

    // 2. Fetch Tables
    const tables = await prisma.table.findMany({
      where: { tenantId },
      orderBy: { sortOrder: 'asc' },
    });

    // 3. Fetch Categories with Menu Items
    const categories = await prisma.category.findMany({
      where: { tenantId },
      include: {
        menuItems: {
          where: { isAvailable: true },
          include: {
            variants: true,
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });

    // 4. Fetch All Menu Items Flat
    const menuItems = await prisma.menuItem.findMany({
      where: { tenantId },
      include: {
        category: true,
        variants: true,
      },
      orderBy: { sortOrder: 'asc' },
    });

    // 5. Fetch Orders
    const orders = await prisma.order.findMany({
      where: { tenantId },
      include: {
        items: true,
        table: true,
        invoice: {
          include: {
            payments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    // 6. Fetch Customers
    const customers = await prisma.customer.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    // 7. Fetch Expenses
    const expenses = await prisma.expense.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    // 8. Fetch Inventory Items
    const inventory = await prisma.inventoryItem.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' },
      take: 50,
    });

    // 9. Fetch Staff Members
    const staff = await prisma.user.findMany({
      where: { tenantId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        roleType: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });

    // 10. Compute Real Live Statistics from Database Orders
    const totalOrdersCount = orders.length;
    const completedOrders = orders.filter((o) => o.status === 'COMPLETED' || o.status === 'BILLED');
    const totalRevenuePaise = completedOrders.reduce((acc, o) => acc + (o.grandTotal || 0), 0);
    const activeOrdersCount = orders.filter(
      (o) => o.status !== 'COMPLETED' && o.status !== 'CANCELLED'
    ).length;
    const occupiedTablesCount = tables.filter((t) => t.status === 'OCCUPIED' || t.status === 'BILLING').length;

    const stats = {
      totalRevenue: totalRevenuePaise / 100,
      totalOrders: totalOrdersCount,
      activeOrders: activeOrdersCount,
      occupiedTables: occupiedTablesCount,
      totalTables: tables.length,
      totalMenuItems: menuItems.length,
      totalCustomers: customers.length,
      totalStaff: staff.length,
    };

    return NextResponse.json({
      success: true,
      tenantId,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        businessType: tenant.businessType,
        status: tenant.status,
      },
      profile: tenant.businessProfile,
      tables,
      categories,
      menuItems,
      orders,
      customers,
      expenses,
      inventory,
      staff,
      stats,
    });
  } catch (error: any) {
    console.error('Tenant data fetching error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dynamic tenant data.', details: error.message },
      { status: 500 }
    );
  }
}
