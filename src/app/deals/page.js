"use client";
import { useState, useMemo, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/ui/ProductGrid";
import { DealBanner } from "@/components/ui/DealCard";
import { getProducts } from "@/lib/supabase";
import { Flame, TrendingUp, Tag, Star, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const TAGS = [
  { value: "all", label: "All Deals", icon: Zap },
  { value: "hot", label: "Hot 🔥", icon: Flame },
  { value: "trending", label: "Trending", icon: TrendingUp },
  { value: "under-500", label: "Under ₹500", icon: Tag },
  { value: "best-seller", label: "Best Sellers", icon: Star },
];

export default function DealsPage() {
  const [activeTag, setActiveTag] = useState("all");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data } = await getProducts();

    const formatted = (data || []).map((p) => ({
      ...p,
      shortTitle: p.short_title,
      originalPrice: p.original_price,
      affiliateLinks: p.affiliate_links,
      isTrending: p.is_trending,
      isNew: p.is_new,
      inStock: p.in_stock,
      price: p.best_price,
    }));

    setProducts(formatted);
  }

  const filtered = useMemo(() => {
    if (activeTag === "all") return products;
    if (activeTag === "hot") return products.filter((p) => p.discount >= 60);
    if (activeTag === "trending") return products.filter((p) => p.isTrending);
    if (activeTag === "under-500")
      return products.filter((p) => p.price <= 500);
    if (activeTag === "best-seller")
      return products.filter((p) => p.tags?.includes("best-seller"));
    return products;
  }, [activeTag, products]);

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 page-enter">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text)] mb-2">
            All Deals
          </h1>
          <p className="text-[var(--text-secondary)]">
            Handpicked discounts updated daily
          </p>
        </div>

        {/* Featured deal banners */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {products.slice(0, 3).map((deal) => (
            <DealBanner key={deal.id} deal={deal} />
          ))}
        </div>

        {/* Tag filters */}
        <div className="flex gap-2 flex-wrap mb-8">
          {TAGS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setActiveTag(value)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                activeTag === value
                  ? "bg-accent text-white border-accent"
                  : "border-[var(--border)] text-[var(--text-secondary)] hover:border-accent/50 bg-[var(--bg-card)]",
              )}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        <p className="text-sm text-[var(--text-muted)] mb-5">
          Showing {filtered.length} deals
        </p>

        <ProductGrid
          products={filtered}
          emptyMessage="No deals match this filter right now."
        />

        <div className="h-12" />
      </main>
      <Footer />
    </>
  );
}
