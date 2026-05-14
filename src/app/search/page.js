'use client';
import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductGrid from '@/components/ui/ProductGrid';
import { getProducts } from '@/lib/supabase';
import { Search, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.shortTitle.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.includes(q)) ||
        p.description?.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 page-enter">
      {/* Header */}
      <div className="py-10 sm:py-14">
        <div className="flex items-center gap-3 mb-2">
          <Search size={22} className="text-accent" />
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text)]">
            {query ? (
              <>
                Results for{' '}
                <span className="text-accent">&ldquo;{query}&rdquo;</span>
              </>
            ) : (
              'Search Products'
            )}
          </h1>
        </div>
        {query && (
          <p className="text-sm text-[var(--text-secondary)] ml-9">
            {results.length === 0
              ? 'No products found'
              : `${results.length} product${results.length !== 1 ? 's' : ''} found`}
          </p>
        )}
      </div>

      {/* Empty state — no query */}
      {!query && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold text-[var(--text)] mb-2">
            What are you looking for?
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            Search for electronics, fashion, kitchen gadgets and more.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {['headphones', 'smartwatch', 'shoes', 'mixer', 'backpack'].map((term) => (
              <Link
                key={term}
                href={`/search?q=${term}`}
                className="px-4 py-2 rounded-xl border border-[var(--border)] text-sm
                  text-[var(--text-secondary)] hover:border-accent/50 hover:text-accent
                  bg-[var(--bg-card)] transition-all"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* No results */}
      {query && results.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl font-semibold text-[var(--text)] mb-2">
            No results for &ldquo;{query}&rdquo;
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            Try a different keyword, or browse all deals below.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/deals" className="btn-primary px-5 py-2.5 text-sm">
              Browse All Deals
            </Link>
            <Link href="/" className="btn-secondary px-5 py-2.5 text-sm">
              Go Home
            </Link>
          </div>
        </div>
      )}

      {/* Results grid */}
      {results.length > 0 && (
        <section className="mb-16">
          <ProductGrid products={results} columns={4} />
        </section>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <>
      <Navbar />
      <Suspense
        fallback={
          <main className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
            <div className="flex items-center gap-3 mb-8">
              <Search size={22} className="text-accent" />
              <div className="h-8 w-48 skeleton rounded-lg" />
            </div>
            <ProductGrid loading columns={4} />
          </main>
        }
      >
        <SearchResults />
      </Suspense>
      <Footer />
    </>
  );
}
