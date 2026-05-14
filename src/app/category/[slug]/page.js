'use client';
import { useState, useMemo, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductGrid from '@/components/ui/ProductGrid';
import { CategoryChipRow } from '@/components/ui/CategoryChip';
import {
  getProducts,
  getCategories,
} from '@/lib/supabase';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const SORT_OPTIONS = [
  { value: 'trending', label: 'Trending' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'discount', label: 'Highest Discount' },
  { value: 'rating', label: 'Top Rated' },
];

const PRICE_FILTERS = [
  { value: null, label: 'All Prices' },
  { value: 500, label: 'Under ₹500' },
  { value: 1000, label: 'Under ₹1000' },
  { value: 2000, label: 'Under ₹2000' },
  { value: 5000, label: 'Under ₹5000' },
];

export default function CategoryPage({ params }) {
  const [sort, setSort] = useState('trending');
  const [maxPrice, setMaxPrice] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const [products, setProducts] = useState([]);
const [categories, setCategories] = useState([]);

useEffect(() => {
  fetchData();
}, []);

async function fetchData() {
  const { data: productsData } = await getProducts();

  const { data: categoriesData } = await getCategories();

  const formattedProducts = (productsData || []).map((p) => ({
    ...p,
    shortTitle: p.short_title,
    originalPrice: p.original_price,
    affiliateLinks: p.affiliate_links,
    isTrending: p.is_trending,
    isNew: p.is_new,
    inStock: p.in_stock,
    price: p.best_price,
  }));

  setProducts(formattedProducts);

  setCategories(categoriesData || []);
}

const category = (categories || []).find(

  
  (c) => c.slug === params.slug
) || {
  name: params.slug.charAt(0).toUpperCase() + params.slug.slice(1),
  slug: params.slug,
  icon: '📦',
};
const allProducts = products.filter(
  (p) => p.category === params.slug
);


  const filtered = useMemo(() => {
    let result = [...allProducts];
    if (maxPrice) result = result.filter(p => p.price <= maxPrice);

    switch (sort) {
      case 'price-asc': return result.sort((a, b) => a.price - b.price);
      case 'price-desc': return result.sort((a, b) => b.price - a.price);
      case 'discount': return result.sort((a, b) => b.discount - a.discount);
      case 'rating': return result.sort((a, b) => b.rating - a.rating);
      default: return result.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0));
    }
  }, [allProducts, sort, maxPrice]);

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 page-enter">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{category.icon}</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text)]">{category.name}</h1>
          </div>
          <p className="text-[var(--text-secondary)] text-sm">
            {filtered.length} products found
          </p>
        </div>

        {/* Categories scroll */}
        <div className="mb-8">
          <CategoryChipRow categories={categories} activeSlug={params.slug} />
        </div>

        {/* Filter / sort bar */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all',
              showFilters
                ? 'bg-accent text-white border-accent'
                : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-accent/50'
            )}
          >
            <SlidersHorizontal size={15} />
            Filters
          </button>

          <div className="flex items-center gap-2 ml-auto">
            <ArrowUpDown size={15} className="text-[var(--text-muted)]" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text)]
                text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-accent/60
                cursor-pointer"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="mb-6 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]
            animate-[fadeIn_0.2s_ease-out]">
            <div>
              <h4 className="text-sm font-semibold text-[var(--text)] mb-3">Price Range</h4>
              <div className="flex flex-wrap gap-2">
                {PRICE_FILTERS.map(f => (
                  <button
                    key={f.label}
                    onClick={() => setMaxPrice(f.value)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium border transition-all',
                      maxPrice === f.value
                        ? 'bg-accent text-white border-accent'
                        : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-accent/50'
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Products */}
        <ProductGrid
          products={filtered}
          emptyMessage={`No products found in ${category.name} with selected filters.`}
        />

        <div className="h-12" />
      </main>
      <Footer />
    </>
  );
}
