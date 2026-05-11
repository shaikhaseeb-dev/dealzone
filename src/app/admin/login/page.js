'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const [key, setKey] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!key.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      });
      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        setError('Invalid secret key. Please try again.');
      }
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center">
            <Zap size={18} className="text-white" fill="white" />
          </div>
          <span className="font-bold text-xl text-[var(--text)]">
            Deal<span className="text-accent">Zone</span>
          </span>
        </div>

        <div className="card p-7">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Lock size={15} className="text-accent" />
            </div>
            <div>
              <h1 className="font-bold text-[var(--text)] text-base leading-tight">Admin Access</h1>
              <p className="text-xs text-[var(--text-muted)]">Enter your secret key to continue</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                Secret Key
              </label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="Enter admin secret key"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-10 rounded-xl border border-[var(--border)]
                    bg-[var(--bg-secondary)] text-[var(--text)] text-sm
                    focus:outline-none focus:border-accent/60 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]
                    hover:text-[var(--text-secondary)] transition-colors"
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-red-500 bg-red-500/10
                border border-red-500/20 rounded-lg px-3 py-2.5">
                <AlertCircle size={14} className="flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !key.trim()}
              className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying…
                </span>
              ) : (
                'Sign In to Admin'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[var(--text-muted)] mt-5">
          Set <code className="bg-[var(--bg-secondary)] px-1 rounded">ADMIN_SECRET_KEY</code> in your{' '}
          <code className="bg-[var(--bg-secondary)] px-1 rounded">.env.local</code>
        </p>
      </div>
    </div>
  );
}
