'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, TrendingUp, Sparkles, ExternalLink, ShoppingBag } from 'lucide-react';
import { cn, formatPrice, formatNumber, getPlatformColor } from '@/lib/utils';
import { useClickTracking } from '@/hooks/useClickTracking';

// Platform-specific buy button (used on both card and detail page)
export function PlatformButton({ link, productId, size = 'sm' }) {
  const { trackClick } = useClickTracking();

  const colorMap = {
    Amazon:   'bg-orange-500 hover:bg-orange-600 border-orange-500',
    Flipkart: 'bg-[#2874F0] hover:bg-blue-700 border-[#2874F0]',
    Meesho:   'bg-pink-500 hover:bg-pink-600 border-pink-500',
    Myntra:   'bg-purple-600 hover:bg-purple-700 border-purple-600',
    Nykaa:    'bg-rose-500 hover:bg-rose-600 border-rose-500',
  };
  const color = colorMap[link.platform] || 'bg-accent hover:bg-accent-600 border-accent';

  const platformEmoji = {
    Amazon: '🛒', Flipkart: '🛍️', Meesho: '🏪', Myntra: '👗', Nykaa: '💄',
  };

  if (!link.inStock) {
    return (
      <div className={cn(
        'flex items-center justify-between px-3 py-2 rounded-lg border',
        'border-[var(--border)] opacity-50 cursor-not-allowed',
        size === 'lg' && 'px-4 py-3'
      )}>
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
        'flex items-center justify-between w-full px-3 py-2 rounded-lg text-white',
        'transition-all duration-200 active:scale-[0.98]',
        color,
        size === 'lg' && 'px-4 py-3'
      )}
    >
      <span className={cn('font-semibold flex items-center gap-1.5', size === 'sm' ? 'text-xs' : 'text-sm')}>
        <span>{platformEmoji[link.platform]}</span>
        {link.platform}
      </span>
      <span className={cn('font-bold flex items-center gap-1', size === 'sm' ? 'text-xs' : 'text-sm')}>
        {formatPrice(link.price)}
        <ExternalLink size={size === 'sm' ? 10 : 13} />
      </span>
    </button>
  );
}

export default function ProductCard({ product, variant = 'default' }) {
  const [imgError, setImgError] = useState(false);
  const { trackClick } = useClickTracking();

  const inStockLinks = product.affiliateLinks?.filter(l => l.inStock !== false) || [];
  const primaryLink  = inStockLinks[0];
  const hasMultiple  = inStockLinks.length > 1;

  // Lowest price across in-stock platforms
  const lowestPrice = inStockLinks.reduce(
    (min, l) => (l.price < min ? l.price : min),
    inStockLinks[0]?.price || product.price
  );

  if (variant === 'compact') {
    return (
      <div className="card p-3 flex gap-3 group cursor-pointer hover:scale-[1.01] transition-transform">
        <Link href={`/product/${product.slug}`} className="flex gap-3 flex-1 min-w-0">
          <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-[var(--bg-secondary)]">
            {!imgError ? (
              <Image src={product.images[0]} alt={product.shortTitle} fill
                className="object-cover" onError={() => setImgError(true)} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--text)] line-clamp-2 leading-snug">
              {product.shortTitle}
            </p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-base font-bold text-[var(--text)]">{formatPrice(lowestPrice)}</span>
              <span className="text-xs text-green-500 font-semibold">{product.discount}% off</span>
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
      <Link href={`/product/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-[var(--bg-secondary)]">
        {!imgError ? (
          <Image
            src={product.images[0]} alt={product.title} fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)} loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">📦</div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.discount >= 50 && (
            <span className="badge-discount text-xs">-{product.discount}%</span>
          )}
          {product.isTrending && (
            <span className="badge-trending text-xs">
              <TrendingUp size={10} /> Trending
            </span>
          )}
          {product.isNew && (
            <span className="badge-new text-xs">
              <Sparkles size={10} /> New
            </span>
          )}
        </div>

        {/* Multi-platform badge */}
        {hasMultiple && (
          <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm
            text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <ShoppingBag size={10} />
            {inStockLinks.length} stores
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1 gap-2">
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-medium text-[var(--text)] line-clamp-2 leading-snug
            group-hover:text-accent transition-colors">
            {product.shortTitle}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex">
            {[1, 2, 3, 4, 5].map(s => (
              <Star key={s} size={11}
                className={s <= Math.round(product.rating)
                  ? 'text-amber-400 fill-amber-400' : 'text-[var(--border)]'} />
            ))}
          </div>
          <span className="text-xs text-[var(--text-muted)]">({formatNumber(product.reviews)})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-xs text-[var(--text-muted)]">From</span>
          <span className="text-lg font-bold text-[var(--text)]">{formatPrice(lowestPrice)}</span>
          <span className="text-xs text-[var(--text-muted)] line-through">{formatPrice(product.originalPrice)}</span>
        </div>

        {/* Platform buttons */}
        <div className="flex flex-col gap-1.5 mt-auto">
          {inStockLinks.slice(0, 2).map(link => (
            <PlatformButton key={link.platform} link={link} productId={product.id} size="sm" />
          ))}
          {inStockLinks.length > 2 && (
            <Link href={`/product/${product.slug}`}
              className="text-xs text-center text-accent hover:underline py-1">
              +{inStockLinks.length - 2} more options →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
