import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@platform/database';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) {
      return NextResponse.json({ error: 'tenantId is required.' }, { status: 400 });
    }

    const modules = await prisma.tenantModule.findMany({
      where: { tenantId },
    });

    return NextResponse.json({ success: true, modules });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { tenantId, moduleToken, isEnabled } = await req.json();

    if (!tenantId || !moduleToken) {
      return NextResponse.json({ error: 'tenantId and moduleToken are required.' }, { status: 400 });
    }

    const token = String(moduleToken).toUpperCase();

    const record = await prisma.tenantModule.upsert({
      where: {
        tenantId_moduleToken: {
          tenantId,
          moduleToken: token,
        },
      },
      update: { isEnabled: Boolean(isEnabled) },
      create: {
        tenantId,
        moduleToken: token,
        isEnabled: Boolean(isEnabled),
      },
    });

    // Record in audit log
    await prisma.auditLog.create({
      data: {
        tenantId,
        userId: 'super-admin',
        userName: 'Platform Super Admin',
        action: isEnabled ? 'ENABLE_MODULE' : 'DISABLE_MODULE',
        entityType: 'TENANT_MODULE',
        entityId: record.id,
        metadataJson: {
          moduleToken: token,
          isEnabled,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Module "${token}" has been ${isEnabled ? 'enabled' : 'disabled'} for tenant.`,
      module: record,
    });
  } catch (error: any) {
    console.error('Module toggle error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
