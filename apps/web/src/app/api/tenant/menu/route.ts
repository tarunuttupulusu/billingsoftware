import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@platform/database';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId') || 'tenant-spice-garden';

    const categories = await prisma.category.findMany({
      where: { tenantId },
      include: {
        menuItems: {
          include: { variants: true },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      tenantId,
      name,
      categoryName,
      basePrice,
      foodType = 'VEG',
      taxRatePercent = 5,
      description,
    } = body;

    if (!tenantId || !name || !basePrice) {
      return NextResponse.json(
        { error: 'tenantId, name, and basePrice are required.' },
        { status: 400 }
      );
    }

    // 1. Ensure category exists
    const category = await prisma.category.upsert({
      where: {
        tenantId_name: {
          tenantId,
          name: categoryName || 'Main Menu',
        },
      },
      update: {},
      create: {
        tenantId,
        name: categoryName || 'Main Menu',
      },
    });

    // 2. Create MenuItem
    const menuItem = await prisma.menuItem.create({
      data: {
        tenantId,
        categoryId: category.id,
        name,
        description: description || null,
        basePrice: Math.round(Number(basePrice) * 100), // convert to paise
        foodType: foodType as any,
        taxRatePercent: Number(taxRatePercent) || 5,
        isAvailable: true,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ success: true, menuItem });
  } catch (error: any) {
    console.error('Menu item creation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
