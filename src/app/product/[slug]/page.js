'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyCTA from '@/components/ui/StickyCTA';
import StarRating from '@/components/ui/StarRating';
import ProductGrid from '@/components/ui/ProductGrid';
import PlatformPriceTable from '@/components/ui/PlatformPriceTable';
import { formatPrice } from '@/lib/utils';
import { getProductBySlug, getRelatedProducts } from '@/lib/mockData';
import { CheckCircle2, Truck, Shield, RotateCcw, ChevronRight, TrendingUp } from 'lucide-react';
import { notFound } from 'next/navigation';

export default function ProductPage({ params }) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const related = getRelatedProducts(product);
  const [activeImage, setActiveImage] = useState(0);

  const lowestPrice = Math.min(...(product.affiliateLinks?.filter(l => l.inStock !== false).map(l => l.price) || [product.price]));
  const savings = product.originalPrice - lowestPrice;

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 page-enter">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-xs text-[var(--text-muted)] mb-6">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href={`/category/${product.category}`} className="hover:text-accent transition-colors capitalize">
            {product.category}
          </Link>
          <ChevronRight size={12} />
          <span className="text-[var(--text-secondary)] truncate max-w-48">{product.shortTitle}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">

          {/* Image gallery */}
          <div className="space-y-3">
            <div className="relative aspect-square rounded-2xl overflow-hidden
              bg-[var(--bg-secondary)] border border-[var(--border)]">
              <Image
                src={product.images[activeImage]}
                alt={product.title} fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover" priority
              />
              {product.isTrending && (
                <div className="absolute top-4 left-4 flex items-center gap-1 bg-orange-500
                  text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  <TrendingUp size={12} /> Trending
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all
                      ${activeImage === i ? 'border-accent' : 'border-[var(--border)] hover:border-accent/50'}`}>
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="flex flex-col gap-5">
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                {product.isNew && <span className="badge badge-new">✨ New</span>}
                {product.inStock
                  ? <span className="badge bg-green-500/10 text-green-600 dark:text-green-400">✓ In Stock</span>
                  : <span className="badge bg-red-500/10 text-red-500">✗ Out of Stock</span>}
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] leading-tight">
                {product.title}
              </h1>
            </div>

            <StarRating rating={product.rating} reviews={product.reviews} />

            {/* Price summary */}
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <div className="flex items-baseline gap-3 flex-wrap">
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-0.5">Best price from</p>
                  <span className="text-3xl sm:text-4xl font-bold text-[var(--text)]">
                    {formatPrice(lowestPrice)}
                  </span>
                </div>
                <span className="text-lg text-[var(--text-muted)] line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="bg-green-500 text-white text-sm font-bold px-2.5 py-0.5 rounded-full">
                  {product.discount}% OFF
                </span>
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">
                You save {formatPrice(savings)} on this deal!
              </p>
            </div>

            {/* ★ Multi-platform price comparison */}
            <PlatformPriceTable productId={product.id} affiliateLinks={product.affiliateLinks} />

            {/* StickyCTA sentinel */}
            <StickyCTA product={{ ...product, price: lowestPrice }} />

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck,    label: product.delivery || 'Free Delivery'  },
                { icon: Shield,   label: product.warranty || '1 Year Warranty' },
                { icon: RotateCcw, label: 'Easy Returns'                        },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 p-3 rounded-xl
                  bg-[var(--bg-secondary)] border border-[var(--border)] text-center">
                  <Icon size={18} className="text-accent" />
                  <span className="text-xs text-[var(--text-secondary)] leading-snug">{label}</span>
                </div>
              ))}
            </div>

            {/* Key Features */}
            {product.features?.length > 0 && (
              <div>
                <h3 className="font-semibold text-[var(--text)] mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                      <CheckCircle2 size={15} className="text-accent flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="p-4 rounded-xl border border-[var(--border)]">
                <h3 className="font-semibold text-[var(--text)] mb-2">About this product</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mb-12">
            <h2 className="section-title mb-5">You May Also Like</h2>
            <ProductGrid products={related} columns={4} />
          </section>
        )}

      </main>
      <Footer />
    </>
  );
}
