# ⚡ DealZone — Essentials Cheatsheet (v2)

## 🚀 3 Commands to Get Running

```bash
npm install
cp .env.example .env.local     # fill in ADMIN_SECRET_KEY at minimum
npm run dev                    # → http://localhost:3000
```

---

## 🔐 Admin Access

The admin panel is now **fully secured**.

### How it works
1. Set `ADMIN_SECRET_KEY=your-password` in `.env.local`
2. Visit `/admin` — you'll be redirected to `/admin/login`
3. Enter your secret key → httpOnly cookie is set for 24h
4. Admin button only appears in the Navbar **after you are logged in**
5. Logging out clears the cookie and returns you to the store

### Security layers
| Layer | How |
|-------|-----|
| **Next.js Middleware** (`src/middleware.js`) | Server-side redirect — no JS required |
| **Client auth check** (`AdminLayout`) | Redirects if cookie expires mid-session |
| **Navbar** | Admin button hidden until `useAdminAuth()` confirms session |
| **httpOnly cookie** | Not readable by JS — XSS resistant |

---

## 🛒 Multi-Platform Affiliate Aggregator

DealZone is a **price comparison + affiliate aggregator**, not just a single-platform site.

### How the multi-platform system works

Every product has per-platform pricing in `affiliateLinks`:

```js
affiliateLinks: [
  { platform: 'Amazon',   price: 1299, url: 'https://amzn.to/xxx', inStock: true  },
  { platform: 'Flipkart', price: 1349, url: 'https://fkrt.to/xxx', inStock: true  },
  { platform: 'Meesho',   price: 1280, url: 'https://m.me/xxx',    inStock: false },
]
```

**What users see on the product card:**
- "From ₹1,280" (lowest in-stock price)
- "Amazon ₹1,299 →" button
- "Flipkart ₹1,349 →" button

**What users see on the product detail page:**
- Full `PlatformPriceTable` with all platforms
- "Lowest" badge on the cheapest option
- Out-of-stock options shown but greyed out

**The sticky CTA (product page):**
- Shows up to 2 platform buttons with their individual prices
- Slides in from bottom on scroll

### Adding a new platform
1. Add to `PLATFORMS` array in `admin/products/page.js`
2. Add color in `src/lib/utils.js → getPlatformColor()`
3. Add color in `StickyCTA.js → PLATFORM_BTN`
4. Add color in `PlatformPriceTable.js → PLATFORM_META`

---

## 📄 New Pages (all live now)

| Page | URL | Purpose |
|------|-----|---------|
| About | `/about` | Brand story, affiliate model explainer |
| Contact | `/contact` | Contact form (needs Formspree to actually send) |
| Privacy Policy | `/privacy` | GDPR/ASCI-compliant policy |
| Disclosure | `/disclosure` | Affiliate disclosure (legally required) |
| Search | `/search?q=...` | Full-text product search |
| Admin Login | `/admin/login` | Secure admin entry point |

---

## ⚖️ Legal Pages — Don't Skip These

Before going live you **must** have:

| Page | Why |
|------|-----|
| `/disclosure` | Required by Amazon Associates & Flipkart TOS |
| `/privacy` | Required if you use Google Analytics or Supabase |
| Footer disclosure strip | ASCI requires affiliate relationship to be disclosed prominently |

Update these pages with your real business name and email before launch.

---

## 🔌 Connecting Contact Form to Real Email

The contact form at `/contact` simulates submission by default.  
To actually receive messages, use one of:

### Option A: Formspree (easiest, free tier)
```bash
# 1. Sign up at formspree.io → create a form → get YOUR_FORM_ID
# 2. In contact/page.js replace the simulated await with:
await fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  body: JSON.stringify(form),
});
```

### Option B: EmailJS (client-side only)
```bash
npm install @emailjs/browser
```

### Option C: Resend (best for production)
Create `src/app/api/contact/route.js` and use the Resend SDK.

---

## 🗂️ Key Files (updated)

| File | Purpose |
|------|---------|
| `src/middleware.js` | **Server-side admin auth guard** |
| `src/hooks/useAdminAuth.js` | Client hook — shows admin button only when logged in |
| `src/app/admin/login/page.js` | Admin login UI |
| `src/app/api/admin/login/route.js` | Sets httpOnly session cookie |
| `src/components/ui/PlatformPriceTable.js` | Multi-platform price comparison table |
| `src/components/ui/ProductCard.js` | Updated with per-platform buy buttons |
| `src/lib/mockData.js` | Per-platform pricing on every product |
| `supabase-schema.sql` | Updated with `best_price` auto-trigger |

---

## 🚨 Pre-Launch Checklist

- [ ] Set `ADMIN_SECRET_KEY` to a strong password in `.env.local` + Vercel env vars
- [ ] Replace placeholder affiliate links with real ones (Amazon SiteStripe, Flipkart dashboard)
- [ ] Update brand name in About/Privacy/Disclosure pages
- [ ] Update email in Privacy (`privacy@dealzone.in`) and Contact pages
- [ ] Run `supabase-schema.sql` in your Supabase project
- [ ] Connect Formspree or Resend to contact form
- [ ] Add Google Analytics ID to `.env.local`
- [ ] Test all buy buttons on mobile
- [ ] Verify admin login works before deploying
