import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatNumber(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

export function calculateDiscount(original, current) {
  return Math.round(((original - current) / original) * 100);
}

export function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function truncate(str, n) {
  return str.length > n ? str.slice(0, n - 1) + '…' : str;
}

export function timeUntil(isoString) {
  const diff = new Date(isoString) - Date.now();
  if (diff <= 0) return 'Expired';
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  if (h > 24) return `${Math.floor(h / 24)}d ${h % 24}h`;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function getPlatformIcon(platform) {
  const icons = {
    Amazon: '🛒',
    Flipkart: '🛍️',
    Meesho: '🛒',
    Myntra: '👗',
    Nykaa: '💄',
  };
  return icons[platform] || '🔗';
}

export function getPlatformColor(platform) {
  const colors = {
    Amazon: 'bg-orange-500 hover:bg-orange-600',
    Flipkart: 'bg-blue-600 hover:bg-blue-700',
    Meesho: 'bg-pink-500 hover:bg-pink-600',
    Myntra: 'bg-purple-600 hover:bg-purple-700',
    Nykaa: 'bg-rose-500 hover:bg-rose-600',
  };
  return colors[platform] || 'bg-accent hover:bg-accent-600';
}
