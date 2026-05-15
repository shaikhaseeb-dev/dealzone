"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ToggleLeft,
  ToggleRight,
  X,
  Save,
  ExternalLink,
  Minus,
} from "lucide-react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
} from "@/lib/supabase";
import { formatPrice, formatNumber, slugify } from "@/lib/utils";

const PLATFORMS = ["Amazon", "Flipkart", "Meesho", "Myntra", "Nykaa"];

const EMPTY_PRODUCT = {
  title: "",
  shortTitle: "",
  originalPrice: "",
  category: "electronics",
  description: "",
  features: ["", "", "", "", ""],
  images: [""],
  affiliateLinks: [
    {
      platform: "Amazon",
      price: "",
      url: "",
      label: "Buy on Amazon",
      inStock: true,
    },
    {
      platform: "Flipkart",
      price: "",
      url: "",
      label: "Buy on Flipkart",
      inStock: true,
    },
  ],
  isTrending: false,
  featured: false,
  inStock: true,
  isNew: false,
  delivery: "Free delivery in 2-3 days",
  warranty: "1 Year Warranty",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  async function fetchProducts() {
    const { data, error } = await getProducts();

    if (error) {
      console.error(error);
      return;
    }

    const formatted = data.map((p) => ({
      ...p,
      shortTitle: p.short_title,
      originalPrice: p.original_price,
      affiliateLinks: p.affiliate_links,
      isTrending: p.is_trending,
      isNew: p.is_new,
      inStock: p.in_stock,
      price: p.best_price,
    }));

    setProducts(formatted);
  }

  async function fetchCategories() {
    const { data } = await getCategories();

    if (data) {
      setCategories(data);
    }
  }

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  );

  const openNew = () => {
    setEditing({
      ...EMPTY_PRODUCT,
      affiliateLinks: EMPTY_PRODUCT.affiliateLinks.map((l) => ({ ...l })),
      features: [...EMPTY_PRODUCT.features],
    });
    setIsNew(true);
  };
  const openEdit = (p) => {
    setEditing({
      ...p,
      features: p.features?.length ? [...p.features] : ["", "", "", "", ""],
      affiliateLinks: p.affiliateLinks?.map((l) => ({ ...l })) || [],
    });
    setIsNew(false);
  };
  const close = () => {
    setEditing(null);
    setIsNew(false);
  };

  const setField = (k, v) => setEditing((prev) => ({ ...prev, [k]: v }));

  const setFeature = (i, v) => {
    const f = [...(editing.features || [])];
    f[i] = v;
    setField("features", f);
  };

  const setLink = (i, k, v) => {
    const links = editing.affiliateLinks.map((l, idx) =>
      idx === i ? { ...l, [k]: v } : l,
    );
    setField("affiliateLinks", links);
  };

  const addLink = () => {
    const used = new Set(editing.affiliateLinks.map((l) => l.platform));
    const next = PLATFORMS.find((p) => !used.has(p)) || "Amazon";
    setField("affiliateLinks", [
      ...editing.affiliateLinks,
      {
        platform: next,
        price: "",
        url: "",
        label: `Buy on ${next}`,
        inStock: true,
      },
    ]);
  };

  const removeLink = (i) => {
    setField(
      "affiliateLinks",
      editing.affiliateLinks.filter((_, idx) => idx !== i),
    );
  };

  const handleSave = async () => {
    if (!editing.title || !editing.originalPrice) {
      toast.error("Title and original price are required");
      return;
    }
    if (!editing.affiliateLinks?.length) {
      toast.error("Add at least one affiliate link");
      return;
    }
    setSaving(true);
    try {
      const cleanLinks = editing.affiliateLinks
        .filter((l) => l.url.trim())
        .map((l) => ({ ...l, price: parseFloat(l.price) || 0 }));

      const prices = cleanLinks.map((l) => l.price).filter(Boolean);
      const lowestPrice = prices.length ? Math.min(...prices) : 0;
      const origPrice = parseFloat(editing.originalPrice);
      const discount =
        lowestPrice && origPrice
          ? Math.round(((origPrice - lowestPrice) / origPrice) * 100)
          : 0;

      const saved = {
        ...editing,
        slug: isNew ? slugify(editing.title) : editing.slug,
        price: lowestPrice,
        originalPrice: origPrice,
        discount,
        affiliateLinks: cleanLinks,
        features: editing.features.filter(Boolean),
        id: isNew ? String(Date.now()) : editing.id,
        clicks: editing.clicks || 0,
        rating: editing.rating || 4.0,
        reviews: editing.reviews || 0,
      };

      const dbProduct = {
        slug: saved.slug,
        title: saved.title,
        short_title: saved.shortTitle,
        original_price: saved.originalPrice,
        category: saved.category,
        images: saved.images,
        description: saved.description,
        features: saved.features,
        affiliate_links: saved.affiliateLinks,
        featured: saved.featured,
        is_trending: saved.isTrending,
        is_new: saved.isNew,
        in_stock: saved.inStock,
        delivery: saved.delivery,
        warranty: saved.warranty,
      };

      let result;

      if (isNew) {
        result = await createProduct(dbProduct);
      } else {
        result = await updateProduct(saved.id, dbProduct);
      }

      if (result.error) {
        throw new Error(result.error.message);
      }

      await fetchProducts();

      // In production:
      // await fetch('/api/products', { method: isNew ? 'POST' : 'PATCH', body: JSON.stringify(saved) })
      toast.success(isNew ? "✅ Product added!" : "✅ Product updated!");
      close();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;

    const result = await deleteProduct(id);

    if (result.error) {
      toast.error("Delete failed");
      return;
    }

    await fetchProducts();
    await deleteProduct(id);
    toast.success("Deleted");
  };

  const toggle = (id, field) =>
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: !p[field] } : p)),
    );

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Products</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            {products.length} total products
          </p>
        </div>
        <button onClick={openNew} className="btn-primary text-sm px-4 py-2">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or category…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)]
            bg-[var(--bg-card)] text-[var(--text)] text-sm
            focus:outline-none focus:border-accent/60 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
              <tr>
                {[
                  "Product",
                  "Category",
                  "Best Price",
                  "Platforms",
                  "Discount",
                  "Trending",
                  "Featured",
                  "Clicks",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left py-3 px-4 text-xs font-semibold text-[var(--text-muted)] whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[var(--bg-secondary)] flex-shrink-0">
                        <Image
                          src={product.images?.[0] || ""}
                          alt={product.shortTitle}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </div>
                      <span className="font-medium text-[var(--text)] line-clamp-1 max-w-36">
                        {product.shortTitle}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 capitalize text-[var(--text-secondary)] text-xs">
                    {product.category}
                  </td>
                  <td className="py-3 px-4 font-semibold text-[var(--text)]">
                    {formatPrice(product.price)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1 flex-wrap">
                      {product.affiliateLinks
                        ?.filter((l) => l.inStock !== false)
                        .map((l) => (
                          <span
                            key={l.platform}
                            className="text-xs px-1.5 py-0.5 rounded bg-accent/10 text-accent font-medium"
                          >
                            {l.platform.slice(0, 3)}
                          </span>
                        ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="badge badge-discount">
                      {product.discount}% off
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button onClick={() => toggle(product.id, "isTrending")}>
                      {product.isTrending ? (
                        <ToggleRight size={22} className="text-accent" />
                      ) : (
                        <ToggleLeft
                          size={22}
                          className="text-[var(--text-muted)]"
                        />
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <button onClick={() => toggle(product.id, "featured")}>
                      {product.featured ? (
                        <ToggleRight size={22} className="text-accent" />
                      ) : (
                        <ToggleLeft
                          size={22}
                          className="text-[var(--text-muted)]"
                        />
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">
                    {formatNumber(product.clicks)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(product)}
                        className="p-1.5 rounded-lg hover:bg-accent/10 text-accent transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-[var(--text-secondary)]">
              No products found
            </div>
          )}
        </div>
      </div>

      {/* ── Edit / Add Modal ── */}
      {editing && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto
  bg-black/60 backdrop-blur-sm"
        >
          <div className="product-modal">
            {/* Modal header */}
            <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
              <h2 className="font-bold text-lg text-[var(--text)]">
                {isNew ? "Add New Product" : "Edit Product"}
              </h2>
              <button
                onClick={close}
                className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="product-modal-body space-y-5">
              {/* ── Basic Info ── */}
              <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <legend className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Basic Info
                </legend>

                <div>
                  <label className="label">Full Title *</label>
                  <input
                    value={editing.title}
                    onChange={(e) => setField("title", e.target.value)}
                    placeholder="Full product title for SEO"
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Short Title (card display)</label>
                    <input
                      value={editing.shortTitle}
                      onChange={(e) => setField("shortTitle", e.target.value)}
                      placeholder="Short name for card"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label">Category</label>
                    <select
                      value={editing.category}
                      onChange={(e) => setField("category", e.target.value)}
                      className="input-field cursor-pointer"
                    >
                      {categories.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">MRP / Original Price (₹) *</label>
                    <input
                      type="number"
                      value={editing.originalPrice}
                      onChange={(e) =>
                        setField("originalPrice", e.target.value)
                      }
                      placeholder="3990"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label">Delivery Info</label>
                    <input
                      value={editing.delivery}
                      onChange={(e) => setField("delivery", e.target.value)}
                      placeholder="Free delivery by tomorrow"
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Warranty</label>
                  <input
                    value={editing.warranty}
                    onChange={(e) => setField("warranty", e.target.value)}
                    placeholder="1 Year Warranty"
                    className="input-field"
                  />
                </div>
              </fieldset>

              {/* ── Affiliate Links (per-platform pricing) ── */}
              <fieldset>
                <div className="flex items-center justify-between mb-3">
                  <legend className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                    Affiliate Links &amp; Prices
                  </legend>
                  <button
                    onClick={addLink}
                    className="flex items-center gap-1 text-xs text-accent hover:underline font-medium"
                  >
                    <Plus size={12} /> Add platform
                  </button>
                </div>

                <div className="space-y-3">
                  {editing.affiliateLinks?.map((link, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        {/* Platform select */}
                        <select
                          value={link.platform || "Amazon"}
                          onChange={(e) =>
                            setLink(i, "platform", e.target.value)
                          }
                          className="input-field w-32 text-xs cursor-pointer flex-shrink-0"
                        >
                          {PLATFORMS.map((p) => (
                            <option key={p}>{p}</option>
                          ))}
                        </select>

                        {/* Price */}
                        <div className="relative flex-shrink-0">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)]">
                            ₹
                          </span>
                          <input
                            type="number"
                            value={link.price}
                            onChange={(e) =>
                              setLink(i, "price", e.target.value)
                            }
                            placeholder="Price"
                            className="input-field pl-6 w-24 text-xs"
                          />
                        </div>

                        {/* In stock toggle */}
                        <label
                          className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]
                          cursor-pointer ml-1 flex-shrink-0"
                        >
                          <input
                            type="checkbox"
                            checked={link.inStock !== false}
                            onChange={(e) =>
                              setLink(i, "inStock", e.target.checked)
                            }
                            className="w-3.5 h-3.5 accent-blue-500"
                          />
                          In stock
                        </label>

                        {/* Remove */}
                        {editing.affiliateLinks.length > 1 && (
                          <button
                            onClick={() => removeLink(i)}
                            className="ml-auto p-1 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors flex-shrink-0"
                          >
                            <Minus size={14} />
                          </button>
                        )}
                      </div>

                      {/* Affiliate URL */}
                      <input
                        value={link.url}
                        onChange={(e) => setLink(i, "url", e.target.value)}
                        placeholder={`https://www.${(link.platform || "amazon").toLowerCase()}.in/dp/YOUR_AFFILIATE_LINK`}
                        className="input-field text-xs font-mono"
                      />
                    </div>
                  ))}
                </div>

                <p className="text-xs text-[var(--text-muted)] mt-2">
                  The lowest in-stock price becomes the displayed &quot;From
                  ₹X&quot; price automatically.
                </p>
              </fieldset>

              {/* ── Image ── */}
              <fieldset>
                <legend className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Product Image
                </legend>
                <input
                  value={editing.images?.[0] || ""}
                  onChange={(e) => setField("images", [e.target.value])}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="input-field"
                />
                {editing.images?.[0] && (
                  <div className="mt-2 relative w-16 h-16 rounded-xl overflow-hidden border border-[var(--border)]">
                    <Image
                      src={editing.images[0]}
                      alt="preview"
                      fill
                      className="object-cover"
                      onError={() => {}}
                    />
                  </div>
                )}
              </fieldset>

              {/* ── Description ── */}
              <fieldset>
                <legend className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Description
                </legend>
                <textarea
                  value={editing.description}
                  onChange={(e) => setField("description", e.target.value)}
                  rows={3}
                  placeholder="Short product description (1-2 sentences)…"
                  className="input-field resize-none"
                />
              </fieldset>

              {/* ── Features ── */}
              <fieldset>
                <legend className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Key Features (up to 5)
                </legend>
                <div className="space-y-2">
                  {(editing.features || ["", "", "", "", ""]).map((f, i) => (
                    <input
                      key={i}
                      value={f}
                      onChange={(e) => setFeature(i, e.target.value)}
                      placeholder={`Feature ${i + 1}`}
                      className="input-field"
                    />
                  ))}
                </div>
              </fieldset>

              {/* ── Flags ── */}
              <fieldset>
                <legend className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                  Flags
                </legend>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { field: "isTrending", label: "🔥 Trending" },
                    { field: "featured", label: "⭐ Featured" },
                    { field: "inStock", label: "✅ In Stock" },
                    { field: "isNew", label: "✨ New" },
                  ].map(({ field, label }) => (
                    <label
                      key={field}
                      className="flex items-center gap-2 p-3 rounded-xl border border-[var(--border)]
                        cursor-pointer hover:border-accent/40 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={!!editing[field]}
                        onChange={(e) => setField(field, e.target.checked)}
                        className="w-4 h-4 accent-blue-500"
                      />
                      <span className="text-xs text-[var(--text)]">
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-3 p-5 border-t border-[var(--border)]">
              <button
                onClick={close}
                className="btn-secondary text-sm px-5 py-2.5"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary text-sm px-5 py-2.5 disabled:opacity-60"
              >
                <Save size={15} />
                {saving ? "Saving…" : isNew ? "Add Product" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .label {
          display: block;
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 0.375rem;
        }
        .input-field {
          width: 100%;
          padding: 0.625rem 0.75rem;
          border-radius: 0.75rem;
          border: 1px solid var(--border);
          background: var(--bg-card);
          color: var(--text);
          font-size: 0.875rem;
          transition: border-color 0.2s;
          outline: none;
        }
        .input-field:focus {
          border-color: rgba(59, 130, 246, 0.6);
        }
      `}</style>
    </div>
  );
}
