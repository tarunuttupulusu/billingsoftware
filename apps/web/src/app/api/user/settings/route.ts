import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

// Helper to authenticate user from Bearer token
async function getAuthenticatedUser(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Valid Supabase session required.' }, { status: 401 });
    }

    // Query user_settings using service role scoped to authenticated user.id (or directly via RLS client)
    const { data: settings, error } = await supabaseAdmin
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: preferences } = await supabaseAdmin
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    return NextResponse.json({
      success: true,
      userId: user.id,
      settings: settings || {
        user_id: user.id,
        theme: 'system',
        notifications_enabled: true,
        language: 'en',
      },
      preferences: preferences || {
        user_id: user.id,
        dashboard_layout: { density: 'comfortable' },
        favorite_modules: ['POS', 'TABLES', 'ORDERS', 'BILLING'],
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Valid Supabase session required.' }, { status: 401 });
    }

    const body = await req.json();
    const { theme, notifications_enabled, language } = body;

    // Strict rule: NEVER trust user_id from client body. Use authenticated user.id!
    const { data: updated, error } = await supabaseAdmin
      .from('user_settings')
      .upsert({
        user_id: user.id,
        theme: theme ?? 'system',
        notifications_enabled: notifications_enabled ?? true,
        language: language ?? 'en',
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'User settings successfully updated.',
      settings: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
