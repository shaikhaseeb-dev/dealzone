'use client';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Mail, MessageSquare, Clock, CheckCircle2, Send, Instagram, Twitter } from 'lucide-react';

// Note: This form doesn't submit anywhere by default.
// Connect to Formspree, EmailJS, or your own API in production.

const TOPICS = [
  'Product suggestion',
  'Wrong price / broken link',
  'Partnership / advertising',
  'Press inquiry',
  'Other',
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', topic: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);

    // ── Replace this with your actual form handler ─────────────
    // e.g. Formspree: await fetch('https://formspree.io/f/YOUR_ID', { method: 'POST', body: JSON.stringify(form) })
    await new Promise(r => setTimeout(r, 800)); // simulated delay
    // ────────────────────────────────────────────────────────────

    setSubmitted(true);
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 page-enter">

        {/* Header */}
        <section className="py-12 sm:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <MessageSquare size={20} className="text-accent" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text)]">Contact Us</h1>
          </div>
          <p className="text-[var(--text-secondary)] max-w-lg leading-relaxed">
            Have a question, found a broken link, or want to suggest a product? We&apos;d love to hear from you.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">

          {/* Info cards */}
          <div className="space-y-4 md:col-span-1">
            {[
              {
                icon: Mail,
                title: 'Email us',
                value: 'hello@dealzone.in',
                sub: 'We reply within 24 hours',
                href: 'mailto:hello@dealzone.in',
              },
              {
                icon: Clock,
                title: 'Response time',
                value: '< 24 hours',
                sub: 'Mon – Sat, 9am – 6pm IST',
                href: null,
              },
              {
                icon: Instagram,
                title: 'Instagram',
                value: '@dealzone.in',
                sub: 'DMs open for quick queries',
                href: 'https://instagram.com/dealzone.in',
              },
            ].map(({ icon: Icon, title, value, sub, href }) => (
              <div key={title} className="card p-4">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                  <Icon size={16} className="text-accent" />
                </div>
                <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1">
                  {title}
                </h3>
                {href ? (
                  <a href={href} target="_blank" rel="noopener noreferrer"
                    className="font-semibold text-sm text-accent hover:underline block">{value}</a>
                ) : (
                  <p className="font-semibold text-sm text-[var(--text)]">{value}</p>
                )}
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{sub}</p>
              </div>
            ))}
          </div>

          {/* Contact form */}
          <div className="md:col-span-2">
            {submitted ? (
              <div className="card p-8 text-center flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 size={28} className="text-green-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[var(--text)] mb-1">Message Sent!</h2>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Thanks {form.name}! We&apos;ll get back to you within 24 hours.
                  </p>
                </div>
                <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', topic: '', message: '' }); }}
                  className="text-sm text-accent hover:underline mt-2">
                  Send another message
                </button>
              </div>
            ) : (
              <div className="card p-6 sm:p-7">
                <h2 className="font-bold text-lg text-[var(--text)] mb-5">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text" required
                        value={form.name} onChange={e => update('name', e.target.value)}
                        placeholder="Rahul Sharma"
                        className="w-full px-4 py-3 rounded-xl border border-[var(--border)]
                          bg-[var(--bg-secondary)] text-[var(--text)] text-sm
                          focus:outline-none focus:border-accent/60 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email" required
                        value={form.email} onChange={e => update('email', e.target.value)}
                        placeholder="rahul@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-[var(--border)]
                          bg-[var(--bg-secondary)] text-[var(--text)] text-sm
                          focus:outline-none focus:border-accent/60 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                      Topic
                    </label>
                    <select
                      value={form.topic} onChange={e => update('topic', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)]
                        bg-[var(--bg-secondary)] text-[var(--text)] text-sm
                        focus:outline-none focus:border-accent/60 transition-colors cursor-pointer"
                    >
                      <option value="">Select a topic…</option>
                      {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                      Message *
                    </label>
                    <textarea
                      required rows={5}
                      value={form.message} onChange={e => update('message', e.target.value)}
                      placeholder="Tell us what's on your mind…"
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)]
                        bg-[var(--bg-secondary)] text-[var(--text)] text-sm resize-none
                        focus:outline-none focus:border-accent/60 transition-colors"
                    />
                  </div>

                  <button
                    type="submit" disabled={loading}
                    className="btn-primary w-full py-3.5 disabled:opacity-60 disabled:cursor-not-allowed">
                    {loading ? (
                      <span className="flex items-center gap-2 justify-center">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending…
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 justify-center">
                        <Send size={16} /> Send Message
                      </span>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* FAQ quick links */}
        <section className="mb-16 p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)]">
          <h3 className="font-semibold text-[var(--text)] mb-3">Common questions</h3>
          <div className="space-y-2">
            {[
              { q: 'Do you sell products directly?', a: 'No. We link to Amazon, Flipkart and other retailers. All purchases are fulfilled by them.' },
              { q: 'Are your prices always accurate?', a: 'We update prices regularly but they can change. Always verify the final price at checkout.' },
              { q: 'How do you earn money?', a: 'We earn a small affiliate commission when you buy through our links — at no extra cost to you.' },
            ].map(({ q, a }) => (
              <div key={q} className="py-3 border-b border-[var(--border)] last:border-0">
                <p className="text-sm font-medium text-[var(--text)] mb-0.5">{q}</p>
                <p className="text-xs text-[var(--text-secondary)]">{a}</p>
              </div>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
