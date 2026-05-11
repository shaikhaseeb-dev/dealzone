import Link from 'next/link';
import { Zap, Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-secondary)] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center">
                <Zap size={14} className="text-white" fill="white" />
              </div>
              <span className="font-bold text-[var(--text)]">
                Deal<span className="text-accent">Zone</span>
              </span>
            </Link>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
              India&apos;s best affiliate deal aggregator. We compare prices across Amazon, Flipkart &amp; more — at zero extra cost to you.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
                { Icon: Twitter,   href: 'https://twitter.com',   label: 'Twitter'   },
                { Icon: Youtube,   href: 'https://youtube.com',   label: 'YouTube'   },
              ].map(({ Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  aria-label={label}
                  className="p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)]
                    text-[var(--text-secondary)] hover:text-accent hover:border-accent/40 transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-sm text-[var(--text)] mb-3">Categories</h4>
            <ul className="space-y-2">
              {[
                { label: '⚡ Electronics', href: '/category/electronics' },
                { label: '👗 Fashion',     href: '/category/fashion'     },
                { label: '🍳 Kitchen',     href: '/category/kitchen'     },
                { label: '💪 Fitness',     href: '/category/fitness'     },
                { label: '🏠 Home',        href: '/category/home'        },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href}
                    className="text-sm text-[var(--text-secondary)] hover:text-accent transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Deals */}
          <div>
            <h4 className="font-semibold text-sm text-[var(--text)] mb-3">Deals</h4>
            <ul className="space-y-2">
              {[
                { label: '🔥 All Deals',      href: '/deals'                    },
                { label: '💰 Under ₹500',     href: '/best-under-500'           },
                { label: '📈 Trending Now',   href: '/deals?filter=trending'    },
                { label: '⚡ Flash Sales',    href: '/deals?filter=hot'         },
                { label: '⭐ Best Sellers',   href: '/deals?filter=best-seller' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href}
                    className="text-sm text-[var(--text-secondary)] hover:text-accent transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-sm text-[var(--text)] mb-3">Company</h4>
            <ul className="space-y-2">
              {[
                { label: 'About Us',           href: '/about'       },
                { label: 'Contact',            href: '/contact'     },
                { label: 'Privacy Policy',     href: '/privacy'     },
                { label: 'Affiliate Disclosure', href: '/disclosure' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href}
                    className="text-sm text-[var(--text-secondary)] hover:text-accent transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Affiliate disclosure strip */}
        <div className="mt-8 p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
          <p className="text-xs text-[var(--text-muted)] leading-relaxed text-center">
            <strong className="text-[var(--text-secondary)]">Affiliate Disclosure:</strong>{' '}
            DealZone participates in the Amazon Associates Program, Flipkart Affiliate Program, and other
            affiliate programs. We earn advertising commissions when you purchase through our links —
            at <strong className="text-[var(--text-secondary)]">no extra cost to you</strong>.
            Product prices are subject to change. Always verify the final price at checkout.{' '}
            <Link href="/disclosure" className="text-accent hover:underline">
              Read our full disclosure →
            </Link>
          </p>
        </div>

        <div className="border-t border-[var(--border)] mt-6 pt-6 flex flex-col sm:flex-row
          items-center justify-between gap-3">
          <p className="text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} DealZone. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
            <Link href="/privacy" className="hover:text-accent transition-colors">Privacy</Link>
            <Link href="/disclosure" className="hover:text-accent transition-colors">Disclosure</Link>
            <Link href="/contact" className="hover:text-accent transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
