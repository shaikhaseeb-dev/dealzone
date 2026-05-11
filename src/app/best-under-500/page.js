import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductGrid from '@/components/ui/ProductGrid';
import { getBestUnder500 } from '@/lib/mockData';
import { Tag } from 'lucide-react';

export const metadata = {
  title: 'Best Products Under ₹500 | DealZone',
  description: 'Top-rated products under ₹500. Quality picks without breaking the bank.',
};

export default function BestUnder500Page() {
  const products = getBestUnder500();

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 page-enter">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Tag size={20} className="text-green-500" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text)]">Best Under ₹500</h1>
          </div>
          <p className="text-[var(--text-secondary)]">
            {products.length} budget-friendly picks — all under ₹500
          </p>
        </div>

        <div className="mb-8 p-4 rounded-xl bg-green-500/5 border border-green-500/20">
          <p className="text-sm text-green-600 dark:text-green-400 font-medium">
            💚 All products on this page are priced under ₹500 and hand-verified for quality.
          </p>
        </div>

        <ProductGrid products={products} emptyMessage="No under ₹500 products right now. Check back soon!" />
        <div className="h-12" />
      </main>
      <Footer />
    </>
  );
}
