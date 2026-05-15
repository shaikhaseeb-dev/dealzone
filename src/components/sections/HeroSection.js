"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Zap, Shield, Truck, ExternalLink } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useClickTracking } from "@/hooks/useClickTracking";

export default function HeroSection({ product }) {
  const [imgError, setImgError] = useState(false);
  const { trackClick } = useClickTracking();
  const primaryLink =
    product?.affiliateLinks?.[0] || product?.affiliate_links?.[0];

  if (!product) return null;

  // FIX: Safe image access
  const productImage =
    product.images?.[0] || product.image || "/placeholder.png";
  const productTitle =
    product.title || product.short_title || "Featured Product";
  const productDescription =
    product.description || "Check out this amazing deal!";
  const productPrice = product.price || product.best_price || 0;
  const productOriginal =
    product.originalPrice || product.original_price || productPrice;
  const productDiscount = product.discount || 0;
  const productDelivery = product.delivery || "Free Delivery in 2-3 days";
  const productWarranty = product.warranty || "1 Year Warranty";

  return (
    <section className="relative overflow-hidden bg-[var(--bg-secondary)] rounded-2xl mb-12">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/10 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left: Content */}
          <div className="order-2 md:order-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="badge bg-accent/10 text-accent font-semibold text-xs px-3 py-1 rounded-full">
                ⚡ Featured Deal
              </span>
              {product.isTrending ||
                (product.is_trending && (
                  <span className="badge badge-trending text-xs">
                    🔥 Trending
                  </span>
                ))}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text)] leading-tight mb-3">
              {productTitle}
            </h1>

            <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed mb-6 max-w-md">
              {productDescription}
            </p>

            {/* Price block */}
            <div className="flex items-center gap-4 mb-6">
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-[var(--text)]">
                  {formatPrice(productPrice)}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-[var(--text-muted)] line-through">
                    {formatPrice(productOriginal)}
                  </span>
                  <span className="text-sm font-bold text-green-500">
                    {productDiscount}% OFF
                  </span>
                </div>
              </div>
              <div className="w-px h-12 bg-[var(--border)]" />
              <div className="text-sm text-[var(--text-secondary)]">
                <div className="font-semibold text-[var(--text)]">
                  Save{" "}
                  {formatPrice(Math.max(0, productOriginal - productPrice))}
                </div>
                <div>Limited time offer</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-6">
              {(product.affiliateLinks || product.affiliate_links || [])?.map(
                (link) => (
                  <button
                    key={link.platform}
                    onClick={() =>
                      trackClick(product.id, link.platform, link.url)
                    }
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm
                    text-white transition-all active:scale-95 hover:brightness-110
                    ${link.platform === "Amazon" ? "bg-orange-500" : "bg-blue-600"}`}
                  >
                    <ExternalLink size={16} />
                    {link.label || link.platform}
                  </button>
                ),
              )}
              <Link
                href={`/product/${product.slug}`}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm
                  border border-[var(--border)] text-[var(--text)] hover:border-accent/50 transition-all"
              >
                View Details <ArrowRight size={16} />
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 text-xs text-[var(--text-secondary)]">
              <div className="flex items-center gap-1.5">
                <Truck size={14} className="text-accent" />
                {productDelivery}
              </div>
              <div className="flex items-center gap-1.5">
                <Shield size={14} className="text-accent" />
                {productWarranty}
              </div>
              <div className="flex items-center gap-1.5">
                <Zap size={14} className="text-accent" />
                Best Price Guaranteed
              </div>
            </div>
          </div>

          {/* Right: Image */}
          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
              {/* Glow effect */}
              <div className="absolute inset-4 bg-accent/10 rounded-full blur-3xl" />
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border)]">
                {!imgError ? (
                  <Image
                    src={productImage}
                    alt={productTitle}
                    fill
                    sizes="(max-width: 768px) 256px, 384px"
                    className="object-cover"
                    priority
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-8xl bg-[var(--bg-secondary)]">
                    📦
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
