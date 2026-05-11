import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import DealCard from '@/components/ui/DealCard';

export default function DealsSection({ title, tag, products, viewAllHref }) {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="section-title">{title}</h2>
          {tag && (
            <span className="badge badge-trending">{tag}</span>
          )}
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="flex items-center gap-1 text-sm font-medium text-accent hover:underline"
          >
            View all <ArrowRight size={14} />
          </Link>
        )}
      </div>
      <div className="scroll-snap-x">
        {products.map((product) => (
          <DealCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
