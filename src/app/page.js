import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import DealsSection from '@/components/sections/DealsSection';
import ProductGrid from '@/components/ui/ProductGrid';
import { CategoryChipRow } from '@/components/ui/CategoryChip';
import { DealBanner } from '@/components/ui/DealCard';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Tag } from 'lucide-react';
import { getProducts, getCategories } from '@/lib/supabase';

export const metadata = {
  title: 'DealZone — Best Deals on Trending Products',
  description: 'Hand-picked deals on electronics, fashion, kitchen & more. Verified discounts on Amazon & Flipkart.',
};

export default async function HomePage() {
  const { data: products } = await getProducts();
const { data: categories } = await getCategories();

const formattedProducts = (products || []).map((p) => ({
  ...p,
  shortTitle: p.short_title,
  originalPrice: p.original_price,
  affiliateLinks: p.affiliate_links,
  isTrending: p.is_trending,
  isNew: p.is_new,
  inStock: p.in_stock,
  price: p.best_price,
}));

const featured = formattedProducts.find(p => p.featured);

const trending = formattedProducts.filter(p => p.isTrending);

const under500 = formattedProducts.filter(p => p.price <= 500);

const dealOfDay = trending?.[0];

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 page-enter">

        {/* Hero */}
        <HeroSection product={featured} />

        {/* Categories */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Shop by Category</h2>
          </div>
          <CategoryChipRow categories={categories} />
        </section>

        {/* Deal of the Day banner */}
        <section className="mb-8">
          <DealBanner deal={dealOfDay} />
          <DealsSection
            title="Deals of the Day"
            tag="🔥 Hot"
            products={trending}
            viewAllHref="/deals"
          />
        </section>

        {/* Trending Products */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <h2 className="section-title">Trending Now</h2>
              <span className="badge badge-trending"><TrendingUp size={11} /> Live</span>
            </div>
            <Link href="/deals?filter=trending" className="flex items-center gap-1 text-sm font-medium text-accent hover:underline">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <ProductGrid products={trending} />
        </section>

        {/* Best Under ₹500 */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <h2 className="section-title">Best Under ₹500</h2>
              <span className="badge badge-discount"><Tag size={11} /> Value Picks</span>
            </div>
            <Link href="/best-under-500" className="flex items-center gap-1 text-sm font-medium text-accent hover:underline">
              See all <ArrowRight size={14} />
            </Link>
          </div>
          {under500.length > 0 ? (
            <ProductGrid products={under500} />
          ) : (
            <div className="rounded-xl border border-[var(--border)] p-8 text-center">
              <p className="text-[var(--text-secondary)]">
                Check back soon — we&apos;re adding new under ₹500 deals!
              </p>
            </div>
          )}
        </section>

        {/* All Products */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">All Products</h2>
            <Link href="/deals" className="flex items-center gap-1 text-sm font-medium text-accent hover:underline">
              Browse all <ArrowRight size={14} />
            </Link>
          </div>
          <ProductGrid products={products.slice(0, 8)} />
        </section>

        {/* Newsletter / CTA Banner */}
        <section className="mb-12 rounded-2xl bg-accent p-8 sm:p-12 text-white text-center
          relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-60" />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Never Miss a Deal</h2>
            <p className="text-blue-100 mb-6">Join 50,000+ deal hunters. Get top deals every morning.</p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-xl bg-white/20 border border-white/30
                  placeholder:text-blue-200 text-white focus:outline-none focus:border-white
                  transition-colors text-sm"
              />
              <button className="px-6 py-3 rounded-xl bg-white text-accent font-semibold text-sm
                hover:bg-blue-50 transition-colors active:scale-95 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
