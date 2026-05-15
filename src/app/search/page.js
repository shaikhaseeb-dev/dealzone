"use client";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/ui/ProductGrid";
import { getProducts } from "@/lib/supabase";
import { Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // FIX: Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await getProducts();
        setProducts(data || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // FIX: Search with safe property access
  const results = useMemo(() => {
    if (!query.trim() || loading) return [];
    const q = query.toLowerCase();
    return (products || []).filter((p) => {
      const title = p.title?.toLowerCase() || "";
      const shortTitle =
        p.short_title?.toLowerCase() || p.shortTitle?.toLowerCase() || "";
      const category = p.category?.toLowerCase() || "";
      const tags = (p.tags || []).map((t) => t.toLowerCase());
      const description = p.description?.toLowerCase() || "";

      return (
        title.includes(q) ||
        shortTitle.includes(q) ||
        category.includes(q) ||
        tags.some((t) => t.includes(q)) ||
        description.includes(q)
      );
    });
  }, [query, products, loading]);

  if (loading && !query) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 page-enter py-10">
        <div className="flex items-center gap-3 mb-8">
          <Search size={22} className="text-accent" />
          <div className="h-8 w-48 bg-[var(--bg-secondary)] rounded-lg animate-pulse" />
        </div>
        <ProductGrid loading columns={4} />
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 page-enter">
      {/* Header */}
      <div className="py-10 sm:py-14">
        <div className="flex items-center gap-3 mb-2">
          <Search size={22} className="text-accent" />
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text)]">
            {query ? (
              <>
                Results for{" "}
                <span className="text-accent">&ldquo;{query}&rdquo;</span>
              </>
            ) : (
              "Search Products"
            )}
          </h1>
        </div>
        {query && (
          <p className="text-sm text-[var(--text-secondary)] ml-9">
            {results.length === 0
              ? "No products found"
              : `${results.length} product${results.length !== 1 ? "s" : ""} found`}
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
            {["headphones", "smartwatch", "shoes", "mixer", "backpack"].map(
              (term) => (
                <Link
                  key={term}
                  href={`/search?q=${term}`}
                  className="px-4 py-2 rounded-xl border border-[var(--border)] text-sm
                  text-[var(--text-secondary)] hover:border-accent/50 hover:text-accent
                  bg-[var(--bg-card)] transition-all"
                >
                  {term}
                </Link>
              ),
            )}
          </div>
        </div>
      )}

      {/* No results */}
      {query && results.length === 0 && !loading && (
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
              <div className="h-8 w-48 bg-[var(--bg-secondary)] rounded-lg animate-pulse" />
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
