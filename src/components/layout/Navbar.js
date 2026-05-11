'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Search, Sun, Moon, Menu, X, Zap, LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { isAdmin, checked } = useAdminAuth();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setSearchOpen(false);
      setQuery('');
    }
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/deals', label: '🔥 Deals' },
    { href: '/category/electronics', label: 'Electronics' },
    { href: '/category/fashion', label: 'Fashion' },
    { href: '/best-under-500', label: 'Under ₹500' },
  ];

  return (
    <>
      <nav className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        scrolled
          ? 'bg-[var(--bg)]/95 backdrop-blur-md border-b border-[var(--border)] shadow-sm'
          : 'bg-transparent'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <Zap size={16} className="text-white" fill="white" />
              </div>
              <span className="font-bold text-lg tracking-tight text-[var(--text)]">
                Deal<span className="text-accent">Zone</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}
                  className="px-3 py-2 text-sm font-medium rounded-lg transition-colors
                    text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--bg-secondary)]">
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    autoFocus value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-48 sm:w-64 px-4 py-2 text-sm rounded-xl border
                      bg-[var(--bg-card)] border-[var(--border)] text-[var(--text)]
                      focus:outline-none focus:border-accent/60 transition-all"
                  />
                  <button type="button" onClick={() => setSearchOpen(false)}
                    className="ml-2 p-2 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
                    <X size={18} />
                  </button>
                </form>
              ) : (
                <button onClick={() => setSearchOpen(true)} aria-label="Search"
                  className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]
                    hover:text-[var(--text)] transition-colors">
                  <Search size={20} />
                </button>
              )}

              {/* Theme toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  aria-label="Toggle theme"
                  className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]
                    hover:text-[var(--text)] transition-colors">
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              )}

              {/* Admin button — only shown when authenticated */}
              {checked && isAdmin && (
                <Link href="/admin"
                  className="hidden sm:flex items-center gap-1.5 btn-secondary text-xs px-3 py-2">
                  <LayoutDashboard size={13} />
                  Admin
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
                onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-[var(--border)] bg-[var(--bg)] pb-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                className="block px-6 py-3 text-sm font-medium text-[var(--text-secondary)]
                  hover:text-[var(--text)] hover:bg-[var(--bg-secondary)] transition-colors">
                {link.label}
              </Link>
            ))}
            {/* Admin link — mobile — only when authenticated */}
            {checked && isAdmin && (
              <div className="px-6 pt-3 border-t border-[var(--border)] mt-2">
                <Link href="/admin" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-1.5 text-sm font-medium text-accent">
                  <LayoutDashboard size={14} />
                  Admin Panel
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
      <div className="h-16" />
    </>
  );
}
