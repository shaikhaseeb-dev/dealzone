import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { FileText, ExternalLink, IndianRupee, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Affiliate Disclosure | DealZone',
  description: 'DealZone earns commissions from Amazon, Flipkart and other affiliate programs. Read our full disclosure.',
};

const LAST_UPDATED = 'April 23, 2025';

const AFFILIATE_PROGRAMS = [
  {
    platform: 'Amazon Associates',
    region: 'India (amazon.in)',
    commission: '1% – 10%',
    categories: 'Electronics, Fashion, Kitchen, Home, Books & more',
    policyUrl: 'https://affiliate-program.amazon.in',
    emoji: '🛒',
  },
  {
    platform: 'Flipkart Affiliate Program',
    region: 'India (flipkart.com)',
    commission: '1% – 15%',
    categories: 'All categories on Flipkart',
    policyUrl: 'https://affiliate.flipkart.com',
    emoji: '🛍️',
  },
  {
    platform: 'Myntra Affiliate',
    region: 'India (myntra.com)',
    commission: '5% – 12%',
    categories: 'Fashion, Beauty, Lifestyle',
    policyUrl: 'https://myntra.com',
    emoji: '👗',
  },
  {
    platform: 'Meesho Affiliate',
    region: 'India (meesho.com)',
    commission: '2% – 8%',
    categories: 'Fashion, Home, Electronics',
    policyUrl: 'https://meesho.com',
    emoji: '🏪',
  },
];

export default function DisclosurePage() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 page-enter">

        {/* Header */}
        <section className="py-12 sm:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <FileText size={20} className="text-accent" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text)]">Affiliate Disclosure</h1>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            Last updated: <strong className="text-[var(--text-secondary)]">{LAST_UPDATED}</strong>
          </p>
        </section>

        {/* The important box — displayed prominently */}
        <div className="mb-10 p-6 rounded-2xl border-2 border-accent/30 bg-accent/5">
          <div className="flex items-start gap-3">
            <ShieldCheck size={22} className="text-accent flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="font-bold text-[var(--text)] text-base mb-2">Our Commitment to Transparency</h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                <strong className="text-[var(--text)]">DealZone is an affiliate marketing website.</strong>{' '}
                This means that when you click a product link on our site and make a purchase on a 
                retailer&apos;s website (such as Amazon or Flipkart), we may earn a small advertising commission 
                from that retailer.
              </p>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mt-2">
                <strong className="text-[var(--text)]">This commission is paid entirely by the retailer 
                and comes at absolutely zero extra cost to you.</strong>{' '}
                The price you pay is always the same whether you visit the retailer directly or through our links.
              </p>
            </div>
          </div>
        </div>

        {/* FTC / ASCI compliance note */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[var(--text)] mb-4 pb-2 border-b border-[var(--border)]">
            Regulatory Compliance
          </h2>
          <div className="text-sm text-[var(--text-secondary)] leading-relaxed space-y-3">
            <p>
              This disclosure is made in compliance with the{' '}
              <strong className="text-[var(--text)]">Advertising Standards Council of India (ASCI) Guidelines</strong>{' '}
              for Influencer Advertising and with the United States Federal Trade Commission (FTC) 
              guidelines on endorsements and testimonials, where applicable.
            </p>
            <p>
              As required by these guidelines, we clearly disclose our material connections with 
              retailers and affiliate networks. Our affiliate relationship with retailers does not 
              affect the integrity of our content.
            </p>
          </div>
        </section>

        {/* What this means for you */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[var(--text)] mb-4 pb-2 border-b border-[var(--border)]">
            What This Means for You
          </h2>
          <div className="space-y-3">
            {[
              {
                icon: IndianRupee,
                title: 'No extra cost to you',
                desc: 'The price you see on Amazon or Flipkart is the price you pay. Our commission is a separate payment from the retailer — never added to your bill.',
              },
              {
                icon: ShieldCheck,
                title: 'Our recommendations are genuine',
                desc: 'We select products based on deal quality, genuine discount depth, and user reviews — not commission rates. We have declined to promote products solely because they had higher commissions.',
              },
              {
                icon: ExternalLink,
                title: 'You can always shop directly',
                desc: 'You are never required to use our links. You can always visit Amazon.in or Flipkart.com directly and search for the product yourself. Our goal is to help you find the best price, regardless.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-5 flex gap-4">
                <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text)] mb-1">{title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Affiliate programs table */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[var(--text)] mb-4 pb-2 border-b border-[var(--border)]">
            Affiliate Programs We Participate In
          </h2>
          <div className="space-y-3">
            {AFFILIATE_PROGRAMS.map((p) => (
              <div key={p.platform} className="card p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{p.emoji}</span>
                    <div>
                      <h3 className="font-semibold text-[var(--text)] text-sm">{p.platform}</h3>
                      <p className="text-xs text-[var(--text-muted)]">{p.region}</p>
                    </div>
                  </div>
                  <span className="badge bg-green-500/10 text-green-600 dark:text-green-400 text-xs whitespace-nowrap">
                    {p.commission} commission
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mb-3">
                  <strong className="text-[var(--text)]">Categories:</strong> {p.categories}
                </p>
                <a href={p.policyUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-accent hover:underline">
                  View their affiliate policy <ExternalLink size={11} />
                </a>
              </div>
            ))}
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-3">
            Commission rates shown are approximate ranges and may change. Actual rates depend on 
            product category and promotional periods.
          </p>
        </section>

        {/* Editorial independence */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[var(--text)] mb-4 pb-2 border-b border-[var(--border)]">
            Editorial Independence
          </h2>
          <div className="text-sm text-[var(--text-secondary)] leading-relaxed space-y-3">
            <p>
              DealZone maintains <strong className="text-[var(--text)]">full editorial independence</strong>. 
              No retailer, brand, or advertiser has the ability to pay to have their products featured, 
              promoted, or ranked higher on our platform.
            </p>
            <p>
              Products are selected by our team based on:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Genuine discount depth (minimum 30% discount from MRP)</li>
              <li>User ratings and review volume on the retailer platform</li>
              <li>Price competitiveness across platforms</li>
              <li>Product quality signals (brand reputation, return rates)</li>
            </ul>
            <p>
              A retailer offering a higher commission rate does not influence our editorial decisions 
              in any way.
            </p>
          </div>
        </section>

        {/* Price accuracy */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[var(--text)] mb-4 pb-2 border-b border-[var(--border)]">
            Price Accuracy Disclaimer
          </h2>
          <div className="text-sm text-[var(--text-secondary)] leading-relaxed space-y-3">
            <p>
              We make every effort to display accurate, up-to-date prices. However, prices on 
              e-commerce platforms can change dynamically — sometimes multiple times per day.
            </p>
            <p>
              <strong className="text-[var(--text)]">Always verify the final price on the retailer&apos;s 
              website before completing your purchase.</strong>{' '}
              DealZone is not responsible for any price discrepancies between what is shown on our site 
              and what the retailer charges at checkout.
            </p>
          </div>
        </section>

        {/* Questions */}
        <section className="mb-16 p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)]">
          <h3 className="font-semibold text-[var(--text)] mb-2">Questions about this disclosure?</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            If you have any questions or concerns about our affiliate relationships or how we select 
            products, please reach out.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link href="/contact" className="btn-primary text-sm px-5 py-2.5">Contact Us</Link>
            <Link href="/privacy" className="btn-secondary text-sm px-5 py-2.5">Privacy Policy</Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
