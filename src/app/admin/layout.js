'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  LayoutDashboard, Package, BarChart3, Tag,
  Zap, Menu, X, Sun, Moon, LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) { setAuthChecked(true); return; }
    fetch('/api/admin/check')
      .then(r => r.json())
      .then(d => {
        if (!d.isAdmin) router.replace('/admin/login');
        else setAuthChecked(true);
      })
      .catch(() => router.replace('/admin/login'));
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
  };

  if (!authChecked && !isLoginPage) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (isLoginPage) return <>{children}</>;

  return (
    <div className="min-h-screen bg-[var(--bg)] flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed top-0 left-0 h-full w-64 z-40 flex flex-col',
        'bg-[var(--bg-card)] border-r border-[var(--border)] transition-transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-[var(--border)]">
          <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center">
            <Zap size={14} className="text-white" fill="white" />
          </div>
          <div>
            <span className="font-bold text-sm text-[var(--text)]">Deal<span className="text-accent">Zone</span></span>
            <div className="text-xs text-[var(--text-muted)]">Admin Panel</div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-[var(--text-secondary)]">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
            return (
              <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-accent text-white'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text)]'
                )}>
                <Icon size={18} />{label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[var(--border)] space-y-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm
            text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors">
            <LogOut size={16} /> Back to Store
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm
            text-red-500 hover:bg-red-500/10 transition-colors">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <header className="h-16 border-b border-[var(--border)] bg-[var(--bg-card)] flex items-center
          px-4 sm:px-6 gap-3 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-colors">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
