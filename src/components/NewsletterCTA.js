"use client";
import { useState } from "react";

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setMessage("Please enter a valid email");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setMessage(res.ok ? "✓ Subscribed!" : "Something went wrong");
      if (res.ok) setEmail("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mb-12 rounded-2xl bg-accent p-8 sm:p-12 text-white text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-60" />
      <div className="relative">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">
          Never Miss a Deal
        </h2>
        <p className="text-blue-100 mb-6">
          Join 50,000+ deal hunters. Get top deals every morning.
        </p>

        <form
          onSubmit={handleSubscribe}
          className="flex gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl bg-white/20 border border-white/30
              placeholder:text-blue-200 text-white focus:outline-none focus:border-white
              transition-colors text-sm disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-white text-accent font-semibold text-sm
              hover:bg-blue-50 transition-colors active:scale-95 whitespace-nowrap disabled:opacity-50"
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-2 text-sm ${message.includes("✓") ? "text-green-200" : "text-red-200"}`}
          >
            {message}
          </p>
        )}
      </div>
    </section>
  );
}
