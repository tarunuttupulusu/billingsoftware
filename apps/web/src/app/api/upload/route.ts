import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'uploads';

    if (!file) {
      return NextResponse.json({ error: 'No file provided in request.' }, { status: 400 });
    }

    const supabaseUrl = process.env.SUPABASE_URL || 'https://vssuhyoamgxiaybuowra.supabase.co';
    const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseSecretKey) {
      return NextResponse.json({ error: 'SUPABASE_SECRET_KEY not configured.' }, { status: 500 });
    }

    // Extract user from session if available
    let userFolder = folder;
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        userFolder = `users/${user.id}/${folder}`;
      }
    }

    // Generate unique filename
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `${userFolder}/${Date.now()}-${cleanFileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const uploadRes = await fetch(
      `${supabaseUrl}/storage/v1/object/restaurant-assets/${path}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseSecretKey}`,
          'apikey': supabaseSecretKey,
          'Content-Type': file.type || 'application/octet-stream',
          'x-upsert': 'true',
        },
        body: buffer,
      }
    );

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      console.error('Supabase storage upload error:', errText);
      return NextResponse.json(
        { error: 'Failed to upload to Supabase storage.', details: errText },
        { status: uploadRes.status }
      );
    }

    // Public URL
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/restaurant-assets/${path}`;

    return NextResponse.json({
      success: true,
      path,
      publicUrl,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
    });
  } catch (error: any) {
    console.error('Upload exception:', error);
    return NextResponse.json(
      { error: 'Internal server error during upload.', message: error.message },
      { status: 500 }
    );
  }
}
