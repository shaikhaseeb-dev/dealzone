import ProductCard from "./ProductCard";
import SkeletonCard from "./SkeletonCard";

export default function ProductGrid({
  products,
  loading,
  columns = 4,
  emptyMessage = "No products found",
}) {
  const colClass =
    {
      2: "grid-cols-2",
      3: "grid-cols-2 sm:grid-cols-3",
      4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
      5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
    }[columns] || "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";

  if (loading) {
    return (
      <div className={`grid ${colClass} gap-4`}>
        {Array.from({ length: columns * 2 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <span className="text-5xl mb-4">📦</span>
        <p className="text-[var(--text-secondary)] font-medium mb-2">
          {emptyMessage}
        </p>
        <p className="text-xs text-[var(--text-muted)]">
          Try adjusting your filters or check back later
        </p>
      </div>
    );
  }

  return (
    <div className={`grid ${colClass} gap-4`}>
      {products.map((product, i) => (
        <div
          key={product.id}
          className="animate-[slideUp_0.4s_ease-out_forwards]"
          style={{ animationDelay: `${i * 50}ms`, opacity: 0 }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
