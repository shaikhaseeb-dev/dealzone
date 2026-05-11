# 🚀 DealZone — Complete Setup Guide

> Affiliate ecommerce platform | Next.js 14 · Tailwind CSS · Supabase · Vercel

---

## 📋 Table of Contents

1. [Quick Start (Local Dev)](#1-quick-start)
2. [Supabase Setup](#2-supabase-setup)
3. [Environment Variables](#3-environment-variables)
4. [Deploy to Vercel](#4-deploy-to-vercel)
5. [Admin Panel Guide](#5-admin-panel)
6. [Adding Products](#6-adding-products)
7. [Customization](#7-customization)
8. [Essential Checklist](#8-essentials)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Install & Run

```bash
# 1. Navigate into project
cd affiliate-store

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env.local

# 4. Start development server
npm run dev
```

Open http://localhost:3000 — you'll see the homepage with mock data immediately.

---

## 2. Supabase Setup

> Skip this section if you want to run with mock data only (good for testing).

### Step 1: Create a Supabase project
1. Go to https://supabase.com and sign up (free)
2. Click **New Project**
3. Choose a name, password, and region (pick Mumbai/Singapore for India)
4. Wait ~2 minutes for setup

### Step 2: Run the database schema
1. In your Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **New query**
3. Open `supabase-schema.sql` from this project
4. Paste the entire contents into the editor
5. Click **Run** (green button)

You should see: `Success. No rows returned`

### Step 3: Get your API keys
1. Go to **Project Settings** (gear icon) → **API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` *(keep this secret!)*

---

## 3. Environment Variables

Edit `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App URL (change in production)
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=DealZone
```

> **⚠️ Security**: Never commit `.env.local` to git. The `.gitignore` already excludes it.

---

## 4. Deploy to Vercel

### Option A: Vercel Dashboard (Recommended)

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/dealzone.git
git push -u origin main
```

2. Go to https://vercel.com → **New Project**
3. Import your GitHub repository
4. Under **Environment Variables**, add all variables from `.env.local`
5. Click **Deploy**

Your site will be live at `https://your-project.vercel.app` in ~2 minutes!

### Option B: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Custom Domain
1. In Vercel dashboard → **Domains**
2. Add your domain (e.g., `dealzone.in`)
3. Update your DNS records as shown

---

## 5. Admin Panel

Access the admin panel at: `/admin`

### Features:
| Section | What you can do |
|---------|----------------|
| **Dashboard** | View total clicks, top products, category breakdown |
| **Products** | Add/Edit/Delete products, toggle trending/featured |
| **Analytics** | Click charts, performance trends, top products |
| **Categories** | Manage product categories |

### Admin Security (Production)
The admin panel is currently open. To add authentication:

1. Add Supabase Auth:
```bash
npm install @supabase/auth-helpers-nextjs
```

2. Wrap `/admin/layout.js` with an auth check
3. Or use a simple middleware password (see `src/middleware.js`)

---

## 6. Adding Products

### Via Admin UI (Easiest)
1. Go to `/admin/products`
2. Click **Add Product**
3. Fill in the form:
   - **Title**: Full product name (for SEO)
   - **Short Title**: Card display name (max 40 chars)
   - **Price**: Current sale price in ₹
   - **Original Price**: MRP (to calculate discount %)
   - **Category**: Select from dropdown
   - **Features**: Up to 5 bullet points
   - **Image URL**: Direct image URL (from Amazon, Unsplash, etc.)
   - **Affiliate Links**: Paste your Amazon/Flipkart affiliate URLs
   - **Toggles**: Mark as Trending, Featured, In Stock, New

### Via Supabase Table Editor
1. Go to Supabase → **Table Editor** → `products`
2. Click **Insert row**
3. Fill in the fields

### Via API (for bulk import)
```javascript
// POST /api/products
const response = await fetch('/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Product Name',
    short_title: 'Short Name',
    price: 1299,
    original_price: 3999,
    category: 'electronics',
    images: ['https://image-url.jpg'],
    affiliate_links: [
      { platform: 'Amazon', url: 'https://amzn.to/...', label: 'Buy on Amazon' }
    ],
    features: ['Feature 1', 'Feature 2'],
    is_trending: true,
    active: true,
  })
});
```

### Getting Affiliate Links

**Amazon Associates:**
1. Join: https://affiliate-program.amazon.in
2. Search for a product on Amazon
3. Use the **SiteStripe** bar at the top to get your affiliate link
4. Paste into the admin panel

**Flipkart Affiliate:**
1. Join: https://affiliate.flipkart.com
2. Use the affiliate link generator
3. Paste the URL into admin panel

---

## 7. Customization

### Change Brand Name
1. Edit `src/app/layout.js` → update `metadata`
2. Edit `src/components/layout/Navbar.js` → update logo text
3. Edit `src/components/layout/Footer.js` → update footer text

### Change Accent Color
In `tailwind.config.js`, update the accent color:
```js
accent: {
  DEFAULT: '#3B82F6',  // Change this hex
  // ... update all shades
}
```

### Change Default Theme
In `src/app/layout.js`:
```jsx
<ThemeProvider attribute="class" defaultTheme="light">  // or "dark"
```

### Add Google Analytics
1. Get GA4 Measurement ID (G-XXXXXXXXXX)
2. Add to `.env.local`: `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX`
3. Create `src/components/Analytics.js`:
```jsx
import Script from 'next/script';
export default function Analytics() {
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
      <Script id="ga">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}
        gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}')`}
      </Script>
    </>
  );
}
```
4. Import in `src/app/layout.js`

---

## 8. Essentials ✅

### 🎯 Conversion Essentials
- [x] Sticky "Buy Now" button (appears on scroll in product pages)
- [x] Price + discount visible on every card
- [x] Direct affiliate links (no extra clicks)
- [x] Mobile-first card layout

### ⚡ Performance Essentials
- [x] Next.js Image optimization (WebP, lazy loading)
- [x] Static page generation for products
- [x] CDN via Vercel Edge Network
- [x] CSS custom properties (no JS for theme)

### 📊 Business Essentials
- [x] Click tracking API (`/api/track-click`)
- [x] Analytics dashboard with charts
- [x] Top products ranking
- [x] Category breakdown

### 📱 UX Essentials
- [x] Mobile-first responsive layout
- [x] Dark mode default
- [x] Skeleton loading states
- [x] Smooth animations (CSS-based, no jank)
- [x] Horizontal scroll for deals
- [x] Category filter chips

---

## 9. Troubleshooting

### "Cannot find module" errors
```bash
rm -rf node_modules .next
npm install
npm run dev
```

### Images not loading
- Check the domain is in `next.config.js` → `images.remotePatterns`
- Add the domain of your image host

### Supabase connection failing
- Double-check `.env.local` has correct URL and keys
- Ensure you ran the SQL schema
- Check RLS policies allow public reads

### Build errors on Vercel
- Check all env vars are set in Vercel dashboard
- Run `npm run build` locally first to catch errors

### Affiliate links not opening
- Make sure the URLs include `https://`
- Test links manually in browser

---

## 📁 Project Structure

```
affiliate-store/
├── src/
│   ├── app/
│   │   ├── page.js               # Homepage
│   │   ├── product/[slug]/       # Product detail
│   │   ├── category/[slug]/      # Category listing
│   │   ├── deals/                # All deals
│   │   ├── best-under-500/       # Budget page
│   │   ├── admin/                # Admin panel
│   │   │   ├── page.js           # Dashboard
│   │   │   ├── products/         # Product CRUD
│   │   │   ├── analytics/        # Charts
│   │   │   └── categories/       # Category mgmt
│   │   └── api/
│   │       ├── track-click/      # Click tracking
│   │       ├── products/         # Products CRUD
│   │       └── analytics/        # Analytics data
│   ├── components/
│   │   ├── layout/               # Navbar, Footer
│   │   ├── sections/             # Hero, Deals
│   │   └── ui/                   # Cards, Grid, etc.
│   ├── hooks/                    # Custom React hooks
│   └── lib/                      # Utils, Supabase, mock data
├── supabase-schema.sql           # Database schema
├── .env.example                  # Environment template
└── SETUP.md                      # This file
```

---

## 🎯 Phase Roadmap

### Phase 1 (Done ✅)
- Homepage with hero, trending, deals
- Product detail page with sticky CTA
- Admin dashboard + product CRUD
- Click tracking
- Dark/light mode

### Phase 2 (Next steps)
- [ ] Add Supabase auth to admin
- [ ] Real image uploads (Supabase Storage)
- [ ] Search functionality
- [ ] Email newsletter (Resend / Mailchimp)
- [ ] Product comparison page

### Phase 3 (Scale)
- [ ] SEO-optimized static pages
- [ ] Sitemap generation
- [ ] Structured data (JSON-LD)
- [ ] A/B testing CTAs
- [ ] Instagram Reels embed support

---

*Built with ❤️ for affiliate marketers. Questions? Open an issue on GitHub.*
