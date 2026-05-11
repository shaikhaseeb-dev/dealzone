'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCountdown } from '@/hooks/useCountdown';
import { useClickTracking } from '@/hooks/useClickTracking';

export default function DealCard({ product }) {
  const { trackClick } = useClickTracking();
  const primaryLink = product.affiliateLinks?.[0];

  const handleBuy = (e) => {
    e.preventDefault();
    if (primaryLink) trackClick(product.id, primaryLink.platform, primaryLink.url);
  };

  return (
    <div className="card flex-shrink-0 w-44 sm:w-52 flex flex-col overflow-hidden
      hover:scale-[1.03] transition-all duration-300 cursor-pointer group">
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-[var(--bg-secondary)]">
          <Image
            src={product.images[0]}
            alt={product.shortTitle}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold
            px-2 py-0.5 rounded-full">
            -{product.discount}%
          </div>
        </div>
      </Link>
      <div className="p-3 flex flex-col gap-2">
        <Link href={`/product/${product.slug}`}>
          <p className="text-xs font-medium text-[var(--text)] line-clamp-2 leading-snug
            group-hover:text-accent transition-colors">
            {product.shortTitle}
          </p>
        </Link>
        <div className="flex items-baseline gap-1.5">
          <span className="text-base font-bold text-[var(--text)]">{formatPrice(product.price)}</span>
          <span className="text-xs text-[var(--text-muted)] line-through">{formatPrice(product.originalPrice)}</span>
        </div>
        <button
          onClick={handleBuy}
          className="flex items-center justify-center gap-1 text-xs font-semibold py-2
            rounded-lg bg-accent text-white hover:bg-accent-600 transition-colors active:scale-95"
        >
          Buy Now <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}

export function DealBanner({ deal }) {
  const countdown = useCountdown(deal.endsAt);

  return (
    <div className={`rounded-xl p-4 bg-gradient-to-r ${deal.color} text-white mb-4`}>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full mb-1 inline-block">
            {deal.tag}
          </span>
          <h3 className="font-bold text-lg leading-tight">{deal.title}</h3>
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
