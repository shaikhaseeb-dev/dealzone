"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getCategories } from "@/lib/supabase";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";

export default function AdminCategoriesPage() {
  const [cats, setCats] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", slug: "", icon: "📦" });

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const { data } = await getCategories();

    setCats(data || []);
  }

  const openEdit = (cat) => {
    setEditing(cat.id);
    setForm({ name: cat.name, slug: cat.slug, icon: cat.icon });
  };

  const openNew = () => {
    setEditing("new");
    setForm({ name: "", slug: "", icon: "📦" });
  };

  const save = () => {
    if (!form.name) {
      toast.error("Name required");
      return;
    }
    if (editing === "new") {
      setCats((prev) => [...prev, { id: Date.now(), ...form, count: 0 }]);
      toast.success("Category added!");
    } else {
      setCats((prev) =>
        prev.map((c) => (c.id === editing ? { ...c, ...form } : c)),
      );
      toast.success("Category updated!");
    }
    setEditing(null);
  };

  const del = (id) => {
    if (!confirm("Delete category?")) return;
    setCats((prev) => prev.filter((c) => c.id !== id));
    toast.success("Deleted");
  };

  return (
    <div className="page-enter max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Categories</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            {cats.length} categories
          </p>
        </div>
        <button onClick={openNew} className="btn-primary text-sm px-4 py-2">
          <Plus size={15} /> Add Category
        </button>
      </div>

      {/* Form */}
      {editing && (
        <div className="card p-5 mb-5 animate-[fadeIn_0.2s_ease-out]">
          <h3 className="font-semibold text-[var(--text)] mb-4">
            {editing === "new" ? "New Category" : "Edit Category"}
          </h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Icon
              </label>
              <input
                value={form.icon}
                onChange={(e) =>
                  setForm((p) => ({ ...p, icon: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]
                  text-[var(--text)] text-sm focus:outline-none focus:border-accent/60 text-center text-xl"
                maxLength={2}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Name *
              </label>
              <input
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setForm((p) => ({
                    ...p,
                    name,
                    slug: name
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/(^-|-$)/g, ""),
                  }));
                }}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]
                  text-[var(--text)] text-sm focus:outline-none focus:border-accent/60"
                placeholder="Electronics"
              />
            </div>
            <div className="col-span-3">
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Slug
              </label>
              <input
                value={form.slug}
                onChange={(e) =>
                  setForm((p) => ({ ...p, slug: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]
                  text-[var(--text)] text-sm focus:outline-none focus:border-accent/60 font-mono"
                placeholder="electronics"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={save} className="btn-primary text-sm px-4 py-2">
              <Save size={14} /> Save
            </button>
            <button
              onClick={() => setEditing(null)}
              className="btn-secondary text-sm px-4 py-2"
            >
              <X size={14} /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--bg-secondary)] border-b border-[var(--border)]">
            <tr>
              {["Icon", "Name", "Slug", "Products", ""].map((h) => (
                <th
                  key={h}
                  className="text-left py-3 px-4 text-xs font-semibold text-[var(--text-muted)]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cats.map((cat) => (
              <tr
                key={cat.id}
                className="border-b border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <td className="py-3 px-4 text-xl">{cat.icon}</td>
                <td className="py-3 px-4 font-medium text-[var(--text)]">
                  {cat.name}
                </td>
                <td className="py-3 px-4 font-mono text-xs text-[var(--text-secondary)]">
                  {cat.slug}
                </td>
                <td className="py-3 px-4 text-[var(--text-secondary)]">
                  {cat.count}
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(cat)}
                      className="p-1.5 rounded-lg hover:bg-accent/10 text-accent"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => del(cat.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
