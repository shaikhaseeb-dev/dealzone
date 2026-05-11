import { NextResponse } from 'next/server';
import { analyticsData } from '@/lib/mockData';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    // Return mock analytics
    return NextResponse.json({ data: analyticsData });
  }

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, serviceKey);

    const [totalResult, todayResult, topProductsResult, clicksByDay] = await Promise.all([
      supabase.from('clicks').select('id', { count: 'exact', head: true }),
      supabase
        .from('clicks')
        .select('id', { count: 'exact', head: true })
        .gte('clicked_at', new Date().toISOString().split('T')[0]),
      supabase
        .from('products')
        .select('id, title, short_title, clicks, slug, images')
        .order('clicks', { ascending: false })
        .limit(5),
      supabase
        .from('clicks')
        .select('clicked_at')
        .gte('clicked_at', new Date(Date.now() - 7 * 86400000).toISOString()),
    ]);

    // Group clicks by day
    const dailyMap = {};
    (clicksByDay.data || []).forEach((c) => {
      const day = c.clicked_at?.split('T')[0] || '';
      dailyMap[day] = (dailyMap[day] || 0) + 1;
    });

    const clicksOverTime = Object.entries(dailyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, clicks]) => ({
        date: new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        clicks,
      }));

    return NextResponse.json({
      data: {
        totalClicks: totalResult.count || 0,
        todayClicks: todayResult.count || 0,
        topProducts: topProductsResult.data || [],
        clicksOverTime,
      },
    });
  } catch (err) {
    console.error('Analytics error:', err);
    return NextResponse.json({ data: analyticsData });
  }
}
