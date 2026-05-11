import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | DealZone',
  description: 'How DealZone collects, uses and protects your data.',
};

const LAST_UPDATED = 'April 23, 2025';

function Section({ id, title, children }) {
  return (
    <section id={id} className="mb-10 scroll-mt-24">
      <h2 className="text-xl font-bold text-[var(--text)] mb-4 pb-2 border-b border-[var(--border)]">
        {title}
      </h2>
      <div className="text-sm text-[var(--text-secondary)] leading-relaxed space-y-3">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 page-enter">

        {/* Header */}
        <section className="py-12 sm:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Shield size={20} className="text-accent" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text)]">Privacy Policy</h1>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            Last updated: <strong className="text-[var(--text-secondary)]">{LAST_UPDATED}</strong>
          </p>
          <div className="mt-4 p-4 rounded-xl bg-accent/5 border border-accent/20">
            <p className="text-sm text-[var(--text-secondary)]">
              <strong className="text-[var(--text)]">Short version:</strong>{' '}
              DealZone does not sell your data. We use cookies for analytics and affiliate tracking. 
              We never collect your payment information — purchases happen on Amazon, Flipkart and other retailers directly.
            </p>
          </div>
        </section>

        {/* TOC */}
        <nav className="mb-10 p-5 card">
          <h2 className="text-sm font-semibold text-[var(--text)] mb-3">Contents</h2>
          <ol className="space-y-1.5 text-sm text-accent">
            {[
              ['#who-we-are',        '1. Who We Are'],
              ['#data-we-collect',   '2. Data We Collect'],
              ['#cookies',           '3. Cookies & Tracking'],
              ['#third-parties',     '4. Third-Party Services'],
              ['#affiliate-links',   '5. Affiliate Links'],
              ['#data-retention',    '6. Data Retention'],
              ['#your-rights',       '7. Your Rights'],
              ['#contact',           '8. Contact'],
            ].map(([href, label]) => (
              <li key={href}>
                <a href={href} className="hover:underline">{label}</a>
              </li>
            ))}
          </ol>
        </nav>

        <Section id="who-we-are" title="1. Who We Are">
          <p>
            DealZone (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is an affiliate deal aggregator website operating at{' '}
            <strong className="text-[var(--text)]">dealzone.in</strong>. We compare prices across multiple 
            e-commerce platforms and link you to the best deals.
          </p>
          <p>
            We are not a retailer. We do not sell products, process payments, or handle deliveries. 
            All purchases you make through our links are handled entirely by the respective retailer 
            (Amazon, Flipkart, Myntra, etc.) under their own privacy policies.
          </p>
        </Section>

        <Section id="data-we-collect" title="2. Data We Collect">
          <p><strong className="text-[var(--text)]">We automatically collect:</strong></p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Pages you visit on DealZone</li>
            <li>Links and products you click (to understand which deals are popular)</li>
            <li>Your approximate location (city-level, via IP address)</li>
            <li>Browser type, device type, and operating system</li>
            <li>Referring website (e.g., if you clicked a link from Instagram)</li>
          </ul>
          <p className="mt-3"><strong className="text-[var(--text)]">We do NOT collect:</strong></p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Your name or email address (unless you voluntarily contact us)</li>
            <li>Payment or card information</li>
            <li>Your order history (orders are placed on retailer websites)</li>
            <li>Sensitive personal data of any kind</li>
          </ul>
          <p className="mt-3">
            If you contact us via our contact form or email, we retain your name and email address 
            solely to respond to your query and delete it once resolved.
          </p>
        </Section>

        <Section id="cookies" title="3. Cookies & Tracking">
          <p>We use cookies and similar technologies for the following purposes:</p>
          <div className="space-y-3 mt-2">
            {[
              {
                name: 'Essential cookies',
                purpose: 'Required for the website to function (e.g., theme preference, admin session).',
                canOptOut: false,
              },
              {
                name: 'Analytics cookies (Google Analytics)',
                purpose: 'We use Google Analytics 4 to understand how visitors use our site — pages viewed, time spent, traffic sources. No personally identifiable data is shared.',
                canOptOut: true,
              },
              {
                name: 'Affiliate tracking cookies',
                purpose: 'When you click a product link, the retailer (Amazon, Flipkart, etc.) sets their own tracking cookies to attribute the sale to us. These cookies are governed by the respective retailer\'s privacy policy.',
                canOptOut: false,
              },
            ].map(({ name, purpose, canOptOut }) => (
              <div key={name} className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                <p className="font-semibold text-[var(--text)] text-sm mb-1">{name}</p>
                <p>{purpose}</p>
                {canOptOut && (
                  <p className="text-xs text-accent mt-1 font-medium">
                    You can opt out via{' '}
                    <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer"
                      className="underline">Google Analytics Opt-out Browser Add-on</a>.
                  </p>
                )}
              </div>
            ))}
          </div>
          <p className="mt-3">
            Most browsers allow you to block or delete cookies via Settings. Note that blocking essential 
            cookies may affect how the website works (e.g., theme preference won&apos;t be saved).
          </p>
        </Section>

        <Section id="third-parties" title="4. Third-Party Services">
          <p>DealZone integrates with the following third-party services. Each has its own privacy policy:</p>
          <div className="space-y-2 mt-2">
            {[
              { name: 'Google Analytics',   url: 'https://policies.google.com/privacy',                     purpose: 'Website usage analytics'            },
              { name: 'Amazon Associates',  url: 'https://www.amazon.in/gp/help/customer/display.html',     purpose: 'Affiliate link tracking & commissions' },
              { name: 'Flipkart Affiliate', url: 'https://www.flipkart.com/pages/privacypolicy',            purpose: 'Affiliate link tracking & commissions' },
              { name: 'Vercel',             url: 'https://vercel.com/legal/privacy-policy',                 purpose: 'Website hosting & edge network'       },
              { name: 'Supabase',           url: 'https://supabase.com/privacy',                            purpose: 'Database hosting (click analytics)'   },
            ].map(({ name, url, purpose }) => (
              <div key={name} className="flex items-start gap-3 py-2 border-b border-[var(--border)] last:border-0">
                <div className="flex-1">
                  <a href={url} target="_blank" rel="noopener noreferrer"
                    className="text-sm font-medium text-accent hover:underline">{name}</a>
                  <p className="text-xs text-[var(--text-muted)]">{purpose}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="affiliate-links" title="5. Affiliate Links">
          <p>
            DealZone contains affiliate links. When you click these links and make a purchase, 
            we may earn a commission from the retailer. This commission is paid by the retailer — 
            <strong className="text-[var(--text)]"> it does not add any cost to your purchase</strong>.
          </p>
          <p>
            The retailers&apos; own cookies, tracking pixels, and privacy practices apply once you leave 
            DealZone and visit their platforms. We encourage you to review Amazon&apos;s and Flipkart&apos;s 
            privacy policies for details on their data practices.
          </p>
          <p>
            For full details, see our{' '}
            <Link href="/disclosure" className="text-accent hover:underline">Affiliate Disclosure</Link>.
          </p>
        </Section>

        <Section id="data-retention" title="6. Data Retention">
          <p>
            Click analytics data (product ID, platform, timestamp) is retained for up to 12 months 
            and then aggregated or deleted.
          </p>
          <p>
            Contact form submissions are retained only until your query is resolved, then deleted.
          </p>
          <p>
            Analytics data collected by Google Analytics is subject to Google&apos;s own retention policies 
            (default: 14 months).
          </p>
        </Section>

        <Section id="your-rights" title="7. Your Rights">
          <p>Since we collect minimal personal data, your rights are straightforward:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong className="text-[var(--text)]">Access:</strong> Request a copy of any data we hold about you.</li>
            <li><strong className="text-[var(--text)]">Deletion:</strong> Request we delete any personal data you provided (e.g., from a contact form).</li>
            <li><strong className="text-[var(--text)]">Opt-out of analytics:</strong> Use the Google Analytics opt-out link above or your browser's cookie settings.</li>
            <li><strong className="text-[var(--text)]">No spam:</strong> We will never send you unsolicited emails. We don&apos;t have your email unless you contact us first.</li>
          </ul>
          <p>
            To exercise any right, email us at{' '}
            <a href="mailto:privacy@dealzone.in" className="text-accent hover:underline">privacy@dealzone.in</a>.
          </p>
        </Section>

        <Section id="contact" title="8. Contact">
          <p>
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] mt-2">
            <p><strong className="text-[var(--text)]">DealZone</strong></p>
            <p>Email: <a href="mailto:privacy@dealzone.in" className="text-accent hover:underline">privacy@dealzone.in</a></p>
            <p className="mt-1">Or use our <Link href="/contact" className="text-accent hover:underline">contact form</Link>.</p>
          </div>
          <p className="mt-3 text-xs text-[var(--text-muted)]">
            We may update this Privacy Policy from time to time. Material changes will be noted with a 
            new &quot;Last updated&quot; date at the top of this page.
          </p>
        </Section>

        <div className="h-12" />
      </main>
      <Footer />
    </>
  );
}
