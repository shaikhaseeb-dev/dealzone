import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    const { key } = await req.json();
    const secretKey = process.env.ADMIN_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        { error: 'ADMIN_SECRET_KEY not configured on server' },
        { status: 500 }
      );
    }

    if (!key || key !== secretKey) {
      return NextResponse.json({ error: 'Invalid key' }, { status: 401 });
    }

    // Set a secure, httpOnly session cookie
    const cookieStore = cookies();
    cookieStore.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
