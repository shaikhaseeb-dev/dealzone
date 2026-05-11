import { NextResponse } from 'next/server';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  const { createClient } = require('@supabase/supabase-js');
  return createClient(url, key);
}

// GET /api/products — list all
export async function GET(req) {
  const supabase = getSupabase();
  if (!supabase) {
    // Fallback to mock data
    const { products } = await import('@/lib/mockData');
    return NextResponse.json({ data: products });
  }

  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const limit = parseInt(searchParams.get('limit') || '50');

  let query = supabase.from('products').select('*').order('created_at', { ascending: false }).limit(limit);
  if (category) query = query.eq('category', category);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// POST /api/products — create
export async function POST(req) {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });

  const body = await req.json();
  const { data, error } = await supabase.from('products').insert([body]).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}

// PATCH /api/products — update
export async function PATCH(req) {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });

  const body = await req.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// DELETE /api/products?id=xxx
export async function DELETE(req) {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
