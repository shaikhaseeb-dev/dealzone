import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const session = cookieStore.get('admin_session');
  const isAdmin = session?.value === 'authenticated';
  return NextResponse.json({ isAdmin });
}
