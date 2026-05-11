import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-8xl mb-6">🔍</div>
        <h1 className="text-4xl font-bold text-[var(--text)] mb-3">Page Not Found</h1>
        <p className="text-[var(--text-secondary)] mb-8 max-w-sm">
          This page doesn&apos;t exist or the product may have been removed.
        </p>
        <div className="flex gap-3">
          <Link href="/" className="btn-primary px-6 py-3">Go Home</Link>
          <Link href="/deals" className="btn-secondary px-6 py-3">View Deals</Link>
        </div>
      </div>
    </>
  );
}
