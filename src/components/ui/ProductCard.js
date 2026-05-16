"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Star,
  TrendingUp,
  Sparkles,
  ExternalLink,
  ShoppingBag,
} from "lucide-react";
import { cn, formatPrice, formatNumber, getPlatformColor } from "@/lib/utils";
import { useClickTracking } from "@/hooks/useClickTracking";

// Platform-specific buy button (used on both card and detail page)
export function PlatformButton({ link, productId, size = "sm" }) {
  const { trackClick } = useClickTracking();

  const colorMap = {
    Amazon: "bg-orange-500 hover:bg-orange-600 border-orange-500",
    Flipkart: "bg-[#2874F0] hover:bg-blue-700 border-[#2874F0]",
    Meesho: "bg-pink-500 hover:bg-pink-600 border-pink-500",
    Myntra: "bg-purple-600 hover:bg-purple-700 border-purple-600",
    Nykaa: "bg-rose-500 hover:bg-rose-600 border-rose-500",
  };
  const color =
    colorMap[link.platform] || "bg-accent hover:bg-accent-600 border-accent";

  const platformEmoji = {
    Amazon: "🛒",
    Flipkart: "🛍️",
    Meesho: "🏪",
    Myntra: "👗",
    Nykaa: "💄",
  };

  if (!link.inStock) {
    return (
      <div
        className={cn(
          "flex items-center justify-between px-3 py-2 rounded-lg border",
          "border-[var(--border)] opacity-50 cursor-not-allowed",
          size === "lg" && "px-4 py-3",
        )}
      >
        <span className="text-xs text-[var(--text-muted)]">
          {platformEmoji[link.platform]} {link.platform}
        </span>
        <span className="text-xs text-[var(--text-muted)]">Out of stock</span>
      </div>
    );
  }

  return (
    <button
      onClick={() => trackClick(productId, link.platform, link.url)}
      className={cn(
        "flex items-center justify-between w-full px-3 py-2 rounded-lg text-white",
        "transition-all duration-200 active:scale-[0.98]",
        color,
        size === "lg" && "px-4 py-3",
      )}
    >
      <span
        className={cn(
          "font-semibold flex items-center gap-1.5",
          size === "sm" ? "text-xs" : "text-sm",
        )}
      >
        <span>{platformEmoji[link.platform]}</span>
        {link.platform}
      </span>
      <span
        className={cn(
          "font-bold flex items-center gap-1",
          size === "sm" ? "text-xs" : "text-sm",
        )}
      >
        {formatPrice(link.price || 0)}
        <ExternalLink size={size === "sm" ? 10 : 13} />
      </span>
    </button>
  );
}

export default function ProductCard({ product, variant = "default" }) {
  const [imgError, setImgError] = useState(false);
  const { trackClick } = useClickTracking();

  // FIX: Safe affiliate links handling
  const inStockLinks =
    (product.affiliateLinks || product.affiliate_links || []).filter(
      (l) => l && l.inStock !== false && (l.price || 0) > 0,
    ) || [];

  const primaryLink = inStockLinks[0];
  const hasMultiple = inStockLinks.length > 1;

  // FIX: Calculate lowest price safely
  const lowestPrice =
    inStockLinks.length > 0
      ? Math.min(...inStockLinks.map((l) => parseFloat(l.price) || 0))
      : product.best_price || product.price || 0;

  // FIX: Safe discount and original price
  const discount = product.discount || 0;
  const originalPrice =
    product.original_price || product.originalPrice || lowestPrice || 0;

  if (variant === "compact") {
    return (
      <div className="card p-3 flex gap-3 group cursor-pointer hover:scale-[1.01] transition-transform">
        <Link
          href={`/product/${product.slug}`}
          className="flex gap-3 flex-1 min-w-0"
        >
          <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-[var(--bg-secondary)]">
            {!imgError ? (
              <Image
                src={product.images?.[0] || "/placeholder.png"}
                alt={product.shortTitle || "Product"}
                fill
                className="object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">
                📦
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--text)] line-clamp-2 leading-snug">
              {product.shortTitle ||
                product.short_title ||
                product.title ||
                "Untitled Product"}
            </p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-base font-bold text-[var(--text)]">
                {formatPrice(lowestPrice)}
              </span>
              <span className="text-xs text-green-500 font-semibold">
                {discount}% off
              </span>
            </div>
            {hasMultiple && (
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Available on {inStockLinks.length} platforms
              </p>
            )}
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="card group flex flex-col overflow-hidden hover:scale-[1.02] transition-all duration-300">
      {/* Image */}
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-[var(--bg-secondary)]"
      >
        {!imgError ? (
          <Image
            src={product.images?.[0] || "/placeholder.png"}
            alt={product.title || "Product"}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            📦
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discount >= 20 && (
            <span className="badge-discount text-xs font-bold px-2 py-1">
              -{discount}%
            </span>
          )}
          {product.is_trending && (
            <span className="badge-trending text-xs font-bold px-2 py-1">
              <TrendingUp size={10} className="inline mr-1" /> Trending
            </span>
          )}
          {product.is_new && (
            <span className="badge-new text-xs font-bold px-2 py-1">
              <Sparkles size={10} className="inline mr-1" /> New
            </span>
          )}
        </div>

        {/* Multi-platform badge */}
        {hasMultiple && (
          <div
            className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm
            text-white text-xs px-2.5 py-1.5 rounded-full flex items-center gap-1.5 font-bold z-10"
          >
            <ShoppingBag size={11} />
            {inStockLinks.length} stores
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1 gap-2">
        <Link href={`/product/${product.slug}`}>
          <h3
            className="text-sm font-medium text-[var(--text)] line-clamp-2 leading-snug
            group-hover:text-accent transition-colors"
          >
            {product.shortTitle ||
              product.short_title ||
              product.title ||
              "Untitled Product"}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={11}
                className={
                  s <= Math.round(product.rating || 0)
                    ? "text-amber-400 fill-amber-400"
                    : "text-[var(--border)]"
                }
              />
            ))}
          </div>
          <span className="text-xs text-[var(--text-muted)]">
            ({formatNumber(product.reviews || 0)})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-xs text-[var(--text-muted)]">From</span>
          <span className="text-lg font-bold text-[var(--text)]">
            {formatPrice(lowestPrice)}
          </span>
          <span className="text-xs text-[var(--text-muted)] line-through">
            {formatPrice(originalPrice)}
          </span>
        </div>

        {/* Platform buttons */}
        <div className="flex flex-col gap-1.5 mt-auto">
          {inStockLinks.slice(0, 2).map((link) => (
            <PlatformButton
              key={link.platform}
              link={link}
              productId={product.id}
              size="sm"
            />
          ))}
          {inStockLinks.length > 2 && (
            <Link
              href={`/product/${product.slug}`}
              className="text-xs text-center text-accent hover:underline py-1"
            >
              +{inStockLinks.length - 2} more options →
            </Link>
          )}
          {inStockLinks.length === 0 && (
            <div className="text-xs text-center text-[var(--text-muted)] py-2 px-2 bg-[var(--bg-secondary)] rounded-lg">
              No available sellers
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
