import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@platform/database';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      email,
      password,
      restaurantName,
      businessType = 'RESTAURANT',
      phone,
      address,
      city,
      state,
      country = 'India',
    } = body;

    if (!email || !restaurantName || !fullName) {
      return NextResponse.json(
        { error: 'Full name, email, and restaurant name are required.' },
        { status: 400 }
      );
    }

    // 1. Create User in Supabase Auth (auth.users)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: password || 'DefaultSecurePassword123!',
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        phone: phone || '',
      },
    });

    if (authError || !authData.user) {
      console.warn('Supabase auth creation note:', authError?.message);
      // If user already exists in auth.users, check if they exist in DB
      if (authError?.message?.includes('already been registered')) {
        return NextResponse.json(
          { error: 'An account with this email already exists. Please login instead.' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: authError?.message || 'Failed to create authentication account.' },
        { status: 400 }
      );
    }

    const authUserId = authData.user.id;

    // 2. Generate tenant slug
    const baseSlug = restaurantName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 30);
    const slug = `${baseSlug}-${Date.now().toString(36)}`;

    // 3. Create Tenant, BusinessProfile, User record, and RegistrationRequest in PostgreSQL
    const result = await prisma.$transaction(async (tx) => {
      // Create Tenant
      const tenant = await tx.tenant.create({
        data: {
          slug,
          name: restaurantName,
          businessType: businessType as any,
          status: 'PENDING',
        },
      });

      // Update owner_user_id on Tenant
      await tx.$executeRawUnsafe(
        `UPDATE public."Tenant" SET owner_user_id = $1::uuid WHERE id = $2`,
        authUserId,
        tenant.id
      );

      // Create BusinessProfile
      const profile = await tx.businessProfile.create({
        data: {
          tenantId: tenant.id,
          businessName: restaurantName,
          phone: phone || '',
          email,
          address: address || '',
          city: city || 'Bengaluru',
          state: state || 'Karnataka',
          country: country || 'IN',
          currencyCode: 'INR',
          currencySymbol: '₹',
          timezone: 'Asia/Kolkata',
          onboardingCompleted: false,
        },
      });

      // Update user_id on BusinessProfile
      await tx.$executeRawUnsafe(
        `UPDATE public."BusinessProfile" SET user_id = $1::uuid WHERE id = $2`,
        authUserId,
        profile.id
      );

      // Create Default Owner Role if not exists
      let ownerRole = await tx.role.findFirst({
        where: { tenantId: tenant.id, name: 'OWNER' },
      });
      if (!ownerRole) {
        ownerRole = await tx.role.create({
          data: {
            tenantId: tenant.id,
            name: 'OWNER',
            description: 'Restaurant Owner with full administrative control',
            isSystem: true,
            permissions: [
              'dashboard.view', 'pos.create', 'tables.manage', 'orders.manage',
              'kitchen.view', 'menu.manage', 'billing.create', 'payments.manage',
              'inventory.manage', 'customers.manage', 'staff.manage', 'expenses.manage',
              'reports.view', 'settings.manage', 'qr.generate', 'printers.manage'
            ],
          },
        });
      }

      // Create User with id = authUserId
      const user = await tx.user.create({
        data: {
          id: authUserId,
          tenantId: tenant.id,
          email,
          passwordHash: password || 'DefaultSecurePassword123!',
          fullName,
          phone: phone || null,
          roleType: 'OWNER',
          roleId: ownerRole.id,
          isActive: true,
        },
      });

      // Create RegistrationRequest
      const registration = await tx.registrationRequest.create({
        data: {
          tenantId: tenant.id,
          applicantName: fullName,
          applicantEmail: email,
          applicantPhone: phone || '',
          businessType: businessType as any,
          status: 'PENDING',
          intendedModules: [
            'POS', 'Tables', 'Orders', 'Kitchen', 'Menu', 'Billing',
            'Payments', 'Inventory', 'Customers', 'Staff', 'Expenses', 'Reports'
          ],
        },
      });

      // Record Audit Log
      await tx.auditLog.create({
        data: {
          tenantId: tenant.id,
          userId: user.id,
          userName: fullName,
          action: 'REGISTER_RESTAURANT',
          entityType: 'TENANT',
          entityId: tenant.id,
          metadataJson: {
            restaurantName,
            businessType,
            email,
            authUserId,
          },
        },
      });

      return { tenant, profile, user, registration };
    });

    return NextResponse.json({
      success: true,
      message: 'Account created with isolated environment and pending admin approval.',
      userId: authUserId,
      tenantId: result.tenant.id,
      registrationId: result.registration.id,
      status: 'PENDING',
    });
  } catch (error: any) {
    console.error('Registration API error:', error);
    return NextResponse.json(
      { error: 'Failed to process registration request.', details: error.message },
      { status: 500 }
    );
  }
}
