"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCountdown } from "@/hooks/useCountdown";
import { useClickTracking } from "@/hooks/useClickTracking";

export default function DealCard({ product }) {
  const { trackClick } = useClickTracking();
  const primaryLink = product.affiliateLinks?.[0];

  const [isLoading, setIsLoading] = useState(false);

  const handleBuy = async (e) => {
    e.preventDefault();
    if (!primaryLink) return;

    setIsLoading(true);
    try {
      await trackClick(product.id, primaryLink.platform, primaryLink.url);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="card flex-shrink-0 w-44 sm:w-52 flex flex-col overflow-hidden
      hover:scale-[1.03] transition-all duration-300 cursor-pointer group"
    >
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-[var(--bg-secondary)]">
          <Image
            src={product.images?.[0] || "/placeholder.png"}
            alt={product.shortTitle || "Product"}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div
            className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold
            px-2 py-0.5 rounded-full"
          >
            -{product.discount || 0}%
          </div>
        </div>
      </Link>
      <div className="p-3 flex flex-col gap-2">
        <Link href={`/product/${product.slug}`}>
          <p
            className="text-xs font-medium text-[var(--text)] line-clamp-2 leading-snug
            group-hover:text-accent transition-colors"
          >
            {product.shortTitle || product.title || "Untitled Product"}
          </p>
        </Link>
        <div className="flex items-baseline gap-1.5">
          <span className="text-base font-bold text-[var(--text)]">
            {formatPrice(product.price || product.best_price || 0)}
          </span>
          <span className="text-xs text-[var(--text-muted)] line-through">
            {formatPrice(product.originalPrice || 0)}
          </span>
        </div>
        <button
          onClick={handleBuy}
          disabled={isLoading}
          className="flex items-center justify-center gap-1 text-xs font-semibold py-2
    rounded-lg bg-accent text-white hover:bg-accent-600 transition-colors active:scale-95 disabled:opacity-50"
        >
          {isLoading ? "⏳ Opening..." : "Buy Now"} <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}

export function DealBanner({ deal }) {
  if (!deal) {
    return (
      <div className="rounded-xl p-4 bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700 mb-4">
        <p className="text-center text-sm font-medium">
          No active deals right now
        </p>
      </div>
    );
  }

  const countdown = useCountdown(
    deal.endsAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  );

  return (
    <div
      className={`rounded-xl p-4 bg-gradient-to-r ${deal.color || "from-red-500 to-orange-500"} text-white mb-4`}
    >
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full mb-1 inline-block">
            {deal.tag || "🔥 Hot Deal"}
          </span>
          <h3 className="font-bold text-lg leading-tight">
            {deal.title || "Amazing Deal"}
          </h3>
        </div>
        {deal.endsAt && (
          <div className="text-right">
            <div className="flex items-center gap-1 text-xs text-white/80 mb-1">
              <Clock size={12} /> Ends in
            </div>
            <div className="font-mono font-bold text-lg">{countdown}</div>
          </div>
        )}
      </div>
    </div>
  );
}
