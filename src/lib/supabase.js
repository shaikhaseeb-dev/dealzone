import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create client only if env vars exist
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// ── Products ───────────────────────────────────────────────
export async function getProducts(filters = {}) {
  if (!supabase) return { data: null, error: 'Supabase not configured' };

  let query = supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false });

  if (filters.category) query = query.eq('category', filters.category);
  if (filters.trending) query = query.eq('is_trending', true);
  if (filters.featured) query = query.eq('featured', true);
  if (filters.maxPrice) query = query.lte('best_price', filters.maxPrice);
  if (filters.limit) query = query.limit(filters.limit);

  return query;
}

export async function getProductBySlug(slug) {
  if (!supabase) return { data: null, error: 'Supabase not configured' };
  return supabase.from('products').select('*').eq('slug', slug).single();
}

export async function createProduct(product) {
  if (!supabase) return { data: null, error: 'Supabase not configured' };
  return supabase.from('products').insert([product]).select().single();
}

export async function updateProduct(id, updates) {
  if (!supabase) return { data: null, error: 'Supabase not configured' };
  return supabase.from('products').update(updates).eq('id', id).select().single();
}

export async function deleteProduct(id) {
  if (!supabase) return { data: null, error: 'Supabase not configured' };
  return supabase.from('products').delete().eq('id', id);
}

// ── Click Tracking ─────────────────────────────────────────
export async function trackClick({ productId, platform, referrer }) {
  if (!supabase) return;

  await supabase.from('clicks').insert([{
    product_id: productId,
    platform,
    referrer: referrer || document.referrer,
    user_agent: navigator.userAgent,
    clicked_at: new Date().toISOString(),
  }]);

  // Increment click count on product
  await supabase.rpc('increment_click_count', { product_id: productId });
}

// ── Analytics ──────────────────────────────────────────────
export async function getAnalytics() {
  if (!supabase) return { data: null, error: 'Supabase not configured' };

  const [totalClicks, todayClicks, topProducts] = await Promise.all([
    supabase.from('clicks').select('id', { count: 'exact', head: true }),
    supabase
      .from('clicks')
      .select('id', { count: 'exact', head: true })
      .gte('clicked_at', new Date().toISOString().split('T')[0]),
    supabase
      .from('products')
      .select('id, title, clicks, slug')
      .order('clicks', { ascending: false })
      .limit(5),
  ]);

  return {
    data: {
      totalClicks: totalClicks.count || 0,
      todayClicks: todayClicks.count || 0,
      topProducts: topProducts.data || [],
    },
  };
}

// ── Categories ─────────────────────────────────────────────
export async function getCategories() {
  if (!supabase) return { data: null, error: 'Supabase not configured' };
  return supabase.from('categories').select('*').order('name');
}
