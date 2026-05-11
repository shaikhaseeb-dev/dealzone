import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { Zap, ShoppingBag, Shield, TrendingUp, Users, Heart } from 'lucide-react';

export const metadata = {
  title: 'About DealZone — Who We Are',
  description: 'DealZone is an affiliate deal aggregator that finds the best prices across Amazon, Flipkart and more — at zero extra cost to you.',
};

const stats = [
  { value: '10,000+', label: 'Products tracked' },
  { value: '50k+',    label: 'Happy deal hunters' },
  { value: '₹5 Cr+',  label: 'Saved by our users' },
  { value: '4',        label: 'Platforms compared' },
];

const values = [
  {
    icon: TrendingUp,
    title: 'Always Up-to-Date',
    description: 'We monitor prices daily across platforms. The moment a deal drops, you see it here.',
  },
  {
    icon: Shield,
    title: 'Transparent & Honest',
    description: 'We earn affiliate commissions — and we say so clearly. No hidden agendas, no paid placements.',
  },
  {
    icon: ShoppingBag,
    title: 'Multi-Platform Comparison',
    description: 'Every product shows prices from Amazon, Flipkart, Myntra and more. You always get the lowest price.',
  },
  {
    icon: Heart,
    title: 'Curated, Not Automated',
    description: 'Every deal is hand-picked by our team. We only list products with strong reviews and genuine discounts.',
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 page-enter">

        {/* Hero */}
        <section className="py-14 sm:py-20 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center shadow-lg">
              <Zap size={32} className="text-white" fill="white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-[var(--text)] mb-4 tracking-tight">
            We find the deals.<br />
            <span className="text-accent">You save the money.</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed">
            DealZone is an independent affiliate deal website. We compare prices across India&apos;s biggest 
            e-commerce platforms so you never overpay for anything.
          </p>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {stats.map(({ value, label }) => (
            <div key={label} className="card p-5 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-accent mb-1">{value}</div>
              <div className="text-xs sm:text-sm text-[var(--text-secondary)]">{label}</div>
            </div>
          ))}
        </section>

        {/* What we do */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[var(--text)] mb-4">What is DealZone?</h2>
          <div className="prose-custom space-y-4 text-[var(--text-secondary)] leading-relaxed">
            <p>
              DealZone is a <strong className="text-[var(--text)]">price comparison and affiliate deal aggregator</strong> built 
              for Indian shoppers. Every day, we track thousands of products across Amazon, Flipkart, Myntra, 
              Meesho and more — and surface only the ones where the discount is real and the savings are significant.
            </p>
            <p>
              When you click a &quot;Buy&quot; button on our site, you are taken directly to the retailer&apos;s website 
              where you complete the purchase. <strong className="text-[var(--text)]">We never handle your payment, personal data, or order.</strong>{' '}
              The retailer does all of that.
            </p>
            <p>
              In return for sending you to their store, retailers pay us a small referral commission — typically 
              1–10% depending on the category. This is called <strong className="text-[var(--text)]">affiliate marketing</strong>, 
              and it costs you absolutely nothing extra.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[var(--text)] mb-6">How it works</h2>
          <div className="space-y-3">
            {[
              { step: '01', title: 'We track prices', desc: 'Our team monitors products across 4+ platforms daily and updates prices in real time.' },
              { step: '02', title: 'You compare',     desc: 'Every product page shows a live price comparison table so you can see which store is cheapest right now.' },
              { step: '03', title: 'You click & buy', desc: 'Click "Buy on Amazon" (or Flipkart, etc.) and you\'re taken directly to the official product page.' },
              { step: '04', title: 'Everyone wins',   desc: 'You get the best price. The retailer gets a sale. We earn a small commission. No hidden costs.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="card p-5 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center
                  flex-shrink-0 font-bold text-accent text-sm">{step}</div>
                <div>
                  <h3 className="font-semibold text-[var(--text)] mb-1">{title}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[var(--text)] mb-6">What we stand for</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title} className="card p-5">
                <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                  <Icon size={18} className="text-accent" />
                </div>
                <h3 className="font-semibold text-[var(--text)] mb-1.5">{title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Affiliate note */}
        <section className="mb-16 p-6 rounded-2xl bg-accent/5 border border-accent/20">
          <h2 className="text-lg font-bold text-[var(--text)] mb-2">Our Affiliate Model</h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            DealZone participates in the Amazon Associates Program and Flipkart Affiliate Program, 
            among others. This means we earn advertising fees when you click our links and make a purchase. 
            These commissions <strong className="text-[var(--text)]">do not change the price you pay</strong> — 
            the retailer covers them. Our recommendations are based purely on deal quality, not commission rates.
          </p>
          <Link href="/disclosure" className="inline-flex items-center gap-1 text-sm text-accent
            hover:underline mt-3 font-medium">
            Read our full disclosure →
          </Link>
        </section>

        {/* CTA */}
        <section className="mb-16 text-center">
          <h2 className="text-xl font-bold text-[var(--text)] mb-3">Ready to save?</h2>
          <p className="text-[var(--text-secondary)] mb-6 text-sm">Browse today&apos;s best deals across all categories.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/deals" className="btn-primary px-6 py-3">🔥 Browse Deals</Link>
            <Link href="/best-under-500" className="btn-secondary px-6 py-3">Under ₹500</Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
