"use client";
import { useState } from "react";
import { AlertTriangle, RotateCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({ error, reset }) {
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async () => {
    setRetrying(true);
    reset();
    setTimeout(() => setRetrying(false), 500);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center">
            <AlertTriangle size={40} className="text-red-500" />
          </div>
        </div>

        {/* Error message */}
        <h1 className="text-2xl font-bold text-[var(--text)] mb-2">
          Oops! Something went wrong
        </h1>
        <p className="text-[var(--text-secondary)] mb-2 text-sm">
          {error?.message || "An unexpected error occurred. Please try again."}
        </p>
        <p className="text-xs text-[var(--text-muted)] mb-8 font-mono bg-[var(--bg-secondary)] p-3 rounded-lg break-words">
          {process.env.NODE_ENV === "development" && error?.stack}
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="flex items-center justify-center gap-2 w-full btn-primary px-4 py-3 disabled:opacity-50"
          >
            <RotateCw size={16} className={retrying ? "animate-spin" : ""} />
            {retrying ? "Retrying..." : "Try Again"}
          </button>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full btn-secondary px-4 py-3"
          >
            <Home size={16} />
            Go Home
          </Link>
        </div>

        {/* Additional help */}
        <div className="mt-8 pt-6 border-t border-[var(--border)]">
          <p className="text-xs text-[var(--text-muted)] mb-3">
            Still having issues?
          </p>
          <Link href="/" className="text-xs text-accent hover:underline">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
