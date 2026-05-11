'use client';
import { ExternalLink, CheckCircle, XCircle, TrendingDown } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useClickTracking } from '@/hooks/useClickTracking';
import { cn } from '@/lib/utils';

const PLATFORM_META = {
  Amazon:   { emoji: '🛒', color: 'border-orange-400/40',   badge: 'bg-orange-500',   text: 'text-orange-500',   btn: 'bg-orange-500 hover:bg-orange-600' },
  Flipkart: { emoji: '🛍️', color: 'border-blue-500/40',    badge: 'bg-blue-600',      text: 'text-blue-500',     btn: 'bg-[#2874F0] hover:bg-blue-700'    },
  Meesho:   { emoji: '🏪', color: 'border-pink-400/40',    badge: 'bg-pink-500',      text: 'text-pink-500',     btn: 'bg-pink-500 hover:bg-pink-600'     },
  Myntra:   { emoji: '👗', color: 'border-purple-400/40',  badge: 'bg-purple-600',    text: 'text-purple-500',   btn: 'bg-purple-600 hover:bg-purple-700' },
  Nykaa:    { emoji: '💄', color: 'border-rose-400/40',    badge: 'bg-rose-500',      text: 'text-rose-500',     btn: 'bg-rose-500 hover:bg-rose-600'     },
};

export default function PlatformPriceTable({ productId, affiliateLinks = [] }) {
  const { trackClick } = useClickTracking();

  if (!affiliateLinks.length) return null;

  const inStock = affiliateLinks.filter(l => l.inStock !== false);
  const lowestPrice = inStock.length
    ? Math.min(...inStock.map(l => l.price))
    : null;

  return (
    <div className="rounded-xl border border-[var(--border)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[var(--bg-secondary)] border-b border-[var(--border)]">
        <TrendingDown size={15} className="text-green-500" />
        <span className="text-sm font-semibold text-[var(--text)]">Compare Prices Across Stores</span>
        {lowestPrice && (
          <span className="ml-auto text-xs bg-green-500/10 text-green-600 dark:text-green-400
            font-semibold px-2 py-0.5 rounded-full">
            Best: {formatPrice(lowestPrice)}
          </span>
        )}
      </div>

      {/* Platform rows */}
      <div className="divide-y divide-[var(--border)]">
        {affiliateLinks.map((link, i) => {
          const meta = PLATFORM_META[link.platform] || {
            emoji: '🔗', color: 'border-accent/40', badge: 'bg-accent',
            text: 'text-accent', btn: 'bg-accent hover:bg-accent-600',
          };
          const isLowest = link.inStock !== false && link.price === lowestPrice;

          return (
            <div
              key={link.platform}
              className={cn(
                'flex items-center gap-3 px-4 py-3.5 transition-colors',
                'hover:bg-[var(--bg-secondary)]',
                !link.inStock && 'opacity-60'
              )}
            >
              {/* Platform name */}
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <span className="text-xl leading-none">{meta.emoji}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[var(--text)]">{link.platform}</span>
                    {isLowest && (
                      <span className="text-xs bg-green-500/10 text-green-600 dark:text-green-400
                        font-bold px-1.5 py-0.5 rounded-full leading-none">
                        Lowest
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    {link.inStock !== false ? (
                      <CheckCircle size={11} className="text-green-500" />
                    ) : (
                      <XCircle size={11} className="text-red-400" />
                    )}
                    <span className="text-xs text-[var(--text-muted)]">
                      {link.inStock !== false ? 'In stock' : 'Out of stock'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="text-right mr-3">
                <div className={cn('text-base font-bold', isLowest ? 'text-green-500' : 'text-[var(--text)]')}>
                  {formatPrice(link.price)}
                </div>
              </div>

              {/* CTA */}
              {link.inStock !== false ? (
                <button
                  onClick={() => trackClick(productId, link.platform, link.url)}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-semibold',
                    'transition-all active:scale-95 whitespace-nowrap flex-shrink-0',
                    meta.btn
                  )}
                >
                  <ExternalLink size={13} />
                  Buy
                </button>
              ) : (
                <div className="px-4 py-2 rounded-xl border border-[var(--border)]
                  text-xs text-[var(--text-muted)] flex-shrink-0">
                  Unavailable
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="px-4 py-2.5 bg-[var(--bg-secondary)] border-t border-[var(--border)]">
        <p className="text-xs text-[var(--text-muted)]">
          ℹ️ Prices may vary. We earn a small commission on purchases — no extra cost to you.{' '}
          <a href="/disclosure" className="text-accent hover:underline">Disclosure</a>
        </p>
      </div>
    </div>
  );
}
