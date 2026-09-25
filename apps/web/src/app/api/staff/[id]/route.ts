import { NextRequest, NextResponse } from 'next/server';
import { authorizeRequest } from '@/lib/server-auth';

// DELETE /api/staff/:id
// Enforces staff.delete action permission and returns 403 FORBIDDEN if unauthorized
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await authorizeRequest(req, {
    requiredPermission: 'staff.delete',
    enforceTenantOwnership: true,
  });

  if (!auth.authorized) {
    return auth.response;
  }

  // Authorized execution
  return NextResponse.json({
    success: true,
    message: `Staff member ${params.id} deactivated successfully.`,
    executedBy: auth.context.userId,
    tenantId: auth.context.tenantId,
  });
}

// GET /api/staff/:id
// Enforces staff.view permission
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await authorizeRequest(req, {
    requiredPermission: 'staff.view',
    enforceTenantOwnership: true,
  });

  if (!auth.authorized) {
    return auth.response;
  }

  return NextResponse.json({
    id: params.id,
    name: 'Staff Member Details',
    tenantId: auth.context.tenantId,
  });
}
