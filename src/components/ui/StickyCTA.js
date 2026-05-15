"use client";
import { useState, useEffect, useRef } from "react";
import { ExternalLink } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useClickTracking } from "@/hooks/useClickTracking";
import { cn } from "@/lib/utils";

const PLATFORM_BTN = {
  Amazon: "bg-orange-500 hover:bg-orange-600",
  Flipkart: "bg-[#2874F0] hover:bg-blue-700",
  Meesho: "bg-pink-500 hover:bg-pink-600",
  Myntra: "bg-purple-600 hover:bg-purple-700",
  Nykaa: "bg-rose-500 hover:bg-rose-600",
};

export default function StickyCTA({ product }) {
  const [visible, setVisible] = useState(false);
  const { trackClick } = useClickTracking();
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);

  // Only show in-stock affiliate links, max 2
  const inStockLinks = (product.affiliateLinks || [])
    .filter((l) => l.inStock !== false)
    .slice(0, 2);

  const lowestPrice = inStockLinks.length
    ? Math.min(...inStockLinks.map((l) => l.price))
    : product.price;

  return (
    <>
      {/* Sentinel — placed just below the hero price block */}
      <div ref={sentinelRef} />

      {/* Sticky bar */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300",
          "bg-[var(--bg-card)]/95 backdrop-blur-md border-t border-[var(--border)]",
          visible ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="max-w-3xl mx-auto flex items-center gap-3 px-4 py-3">
          {/* Product summary */}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[var(--text-secondary)] truncate leading-tight">
              {product.shortTitle}
            </p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="font-bold text-[var(--text)] text-sm">
                From {formatPrice(lowestPrice)}
              </span>
              <span className="text-xs font-semibold text-green-500">
                {product.discount}% off
              </span>
            </div>
          </div>

          {/* Platform CTAs */}
          <div className="flex gap-2 flex-shrink-0">
            {inStockLinks.map((link) => (
              <button
                key={link.platform}
                onClick={() => trackClick(product.id, link.platform, link.url)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white",
                  "text-xs sm:text-sm font-bold transition-all active:scale-95",
                  PLATFORM_BTN[link.platform] ||
                    "bg-accent hover:bg-accent-600",
                )}
              >
                <ExternalLink size={13} />
                <span className="hidden sm:inline">{link.platform}</span>
                <span className="sm:hidden">
                  {link.platform === "Amazon"
                    ? "Amzn"
                    : link.platform === "Flipkart"
                      ? "Flip"
                      : (link.platform || "").slice(0, 4)}
                </span>
                <span className="font-normal opacity-80 hidden md:inline">
                  {" "}
                  · {formatPrice(link.price)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
