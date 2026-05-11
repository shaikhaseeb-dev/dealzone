import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function CategoryChip({ category, active = false, size = 'md' }) {
  const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-5 py-2.5',
  };

  return (
    <Link
      href={`/category/${category.slug}`}
      className={cn(
        'inline-flex flex-col items-center gap-1 rounded-xl border font-medium transition-all',
        'hover:border-accent/60 hover:text-accent active:scale-95',
        sizes[size],
        active
          ? 'bg-accent text-white border-accent'
          : 'bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-secondary)]'
      )}
    >
      <span className="text-xl leading-none">{category.icon}</span>
      <span className="leading-none">{category.name}</span>
      {category.count !== undefined && (
        <span className={cn('text-xs', active ? 'text-blue-100' : 'text-[var(--text-muted)]')}>
          {category.count}
        </span>
      )}
    </Link>
  );
}

export function CategoryChipRow({ categories, activeSlug }) {
  return (
    <div className="scroll-snap-x">
      {categories.map((cat) => (
        <CategoryChip
          key={cat.id}
          category={cat}
          active={activeSlug === cat.slug}
        />
      ))}
    </div>
  );
}
