import Link from 'next/link';
import { analyticsData, products } from '@/lib/mockData';
import {
  MousePointerClick, TrendingUp, Package, Eye,
  ArrowRight, ArrowUpRight, Star, ExternalLink
} from 'lucide-react';
import { formatNumber, formatPrice } from '@/lib/utils';

function StatCard({ icon: Icon, label, value, change, color = 'accent' }) {
  const colorMap = {
    accent: 'bg-accent/10 text-accent',
    green: 'bg-green-500/10 text-green-500',
    orange: 'bg-orange-500/10 text-orange-500',
    purple: 'bg-purple-500/10 text-purple-500',
  };

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
          <Icon size={20} />
        </div>
        {change && (
          <span className="flex items-center gap-1 text-xs font-medium text-green-500">
            <ArrowUpRight size={12} />
            {change}
          </span>
        )}
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-[var(--text)] mb-1">{value}</div>
      <div className="text-sm text-[var(--text-secondary)]">{label}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const stats = analyticsData;

  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Dashboard</h1>
          <p className="text-sm text-[var(--text-secondary)]">Welcome back! Here's what's happening.</p>
        </div>
        <Link href="/admin/products?action=new" className="btn-primary text-sm px-4 py-2">
          + Add Product
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={MousePointerClick}
          label="Total Clicks"
          value={formatNumber(stats.totalClicks)}
          change="+12.5%"
          color="accent"
        />
        <StatCard
          icon={TrendingUp}
          label="Today's Clicks"
          value={formatNumber(stats.todayClicks)}
          change="+8.2%"
          color="green"
        />
        <StatCard
          icon={Package}
          label="Total Products"
          value={products.length}
          color="orange"
        />
        <StatCard
          icon={Eye}
          label="Avg CTR"
          value="6.4%"
          change="+1.1%"
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top products */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[var(--text)]">Top Products by Clicks</h2>
            <Link href="/admin/analytics" className="text-xs text-accent hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {stats.topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold
                  ${i === 0 ? 'bg-amber-500/20 text-amber-500' :
                    i === 1 ? 'bg-gray-400/20 text-gray-400' :
                    i === 2 ? 'bg-orange-400/20 text-orange-400' :
                    'bg-[var(--bg-secondary)] text-[var(--text-muted)]'}`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text)] truncate">{p.shortTitle || p.title}</p>
                  <p className="text-xs text-[var(--text-muted)]">{formatPrice(p.price)}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-[var(--text)]">{formatNumber(p.clicks)}</div>
                  <div className="text-xs text-[var(--text-muted)]">clicks</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="card p-5">
          <h2 className="font-semibold text-[var(--text)] mb-4">Clicks by Category</h2>
          <div className="space-y-3">
            {stats.categoryBreakdown.map((cat) => (
              <div key={cat.category}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[var(--text-secondary)]">{cat.category}</span>
                  <span className="font-medium text-[var(--text)]">{formatNumber(cat.clicks)}</span>
                </div>
                <div className="h-2 rounded-full bg-[var(--bg-secondary)]">
                  <div
                    className="h-full rounded-full bg-accent transition-all duration-500"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent products */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-[var(--text)]">Recent Products</h2>
          <Link href="/admin/products" className="text-xs text-accent hover:underline flex items-center gap-1">
            Manage all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {['Product', 'Category', 'Price', 'Discount', 'Clicks', 'Status', ''].map(h => (
                  <th key={h} className="text-left pb-3 text-xs font-semibold text-[var(--text-muted)] px-2 first:pl-0">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 6).map((p) => (
                <tr key={p.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors">
                  <td className="py-3 px-2 first:pl-0">
                    <span className="font-medium text-[var(--text)] truncate max-w-40 block">{p.shortTitle}</span>
                  </td>
                  <td className="py-3 px-2 capitalize">
                    <span className="text-[var(--text-secondary)]">{p.category}</span>
                  </td>
                  <td className="py-3 px-2 font-semibold text-[var(--text)]">{formatPrice(p.price)}</td>
                  <td className="py-3 px-2">
                    <span className="badge badge-discount">{p.discount}%</span>
                  </td>
                  <td className="py-3 px-2 text-[var(--text-secondary)]">{formatNumber(p.clicks)}</td>
                  <td className="py-3 px-2">
                    <span className={`badge ${p.inStock ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {p.inStock ? '● Active' : '○ OOS'}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <Link href={`/admin/products?edit=${p.id}`} className="text-accent hover:underline text-xs">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
