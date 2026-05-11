import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { productId, platform } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
    }

    // If Supabase is configured, record the click
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && serviceKey) {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, serviceKey);

      // Insert click record
      await supabase.from('clicks').insert({
        product_id: productId,
        platform: platform || 'unknown',
        clicked_at: new Date().toISOString(),
        ip: req.headers.get('x-forwarded-for') || 'unknown',
        user_agent: req.headers.get('user-agent') || 'unknown',
      });

      // Increment product click count
      await supabase.rpc('increment_click_count', { pid: productId });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Track click error:', err);
    // Always return 200 — never break user navigation
    return NextResponse.json({ success: true });
  }
}
