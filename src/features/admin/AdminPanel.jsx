import { useCallback, useEffect, useRef, useState } from "react";
import Toast from "../../components/ui/Toast.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import Toggle from "../../components/ui/Toggle.jsx";
import { CAT_ICONS } from "../../lib/config.js";
import { getErrorMessage } from "../../lib/supabase/admin.js";
import { db } from "../../lib/supabase/client.js";
import { CATEGORY_SELECT, PRODUCT_SELECT } from "../../lib/supabase/queries.js";
import { useToast } from "../../hooks/useToast.js";
import EditModal from "./EditModal.jsx";

export default function AdminPanel({ onLogout, adminEmail }) {
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [preview, setPreview] = useState("");
  const [catSaving, setCatSaving] = useState(false);
  const [catDeleting, setCatDeleting] = useState(null);
  const [catForm, setCatForm] = useState({ name: "", slug: "" });
  const fileRef = useRef();
  const { toast, show } = useToast();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    occasion: "daily",
    is_new: true,
    is_featured: false,
    is_sold_out: false,
  });

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    const [{ data: c, error: catError }, { data: p, error: prodError }] = await Promise.all([
      db.from("categories").select(CATEGORY_SELECT).order("name"),
      db.from("products").select(PRODUCT_SELECT).order("created_at", { ascending: false }),
    ]);

    const loadFailure = catError || prodError;
    if (loadFailure) {
      setCats([]);
      setProducts([]);
      setLoadError(getErrorMessage(loadFailure, "Admin data could not be loaded."));
      setLoading(false);
      return;
    }

    setCats(c || []);
    setProducts(p || []);
    if (c?.length && !form.category_id) {
      setForm((prev) => ({ ...prev, category_id: c[0].id }));
    }
    setLoading(false);
  }, [form.category_id]);

  useEffect(() => {
    load();
  }, [load]);

  const reset = () => {
    setForm((prev) => ({
      ...prev,
      name: "",
      description: "",
      price: "",
      is_new: true,
      is_featured: false,
      is_sold_out: false,
    }));
    setPreview("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const submit = async () => {
    if (!form.name.trim()) {
      show("Name is required", "error");
      return;
    }
    if (!form.price || Number.isNaN(Number(form.price))) {
      show("Enter a valid price", "error");
      return;
    }
    if (!form.category_id) {
      show("Select a category", "error");
      return;
    }

    setSaving(true);
    let image_url = null;
    const file = fileRef.current?.files?.[0];

    if (file) {
      const ext = file.name.split(".").pop();
      const { data, error } = await db.storage.from("product-images").upload(`product-${Date.now()}.${ext}`, file, {
        cacheControl: "3600",
        upsert: false,
      });

      if (error) {
        show(getErrorMessage(error, "Upload failed"), "error");
        setSaving(false);
        return;
      }

      const { data: publicUrl } = db.storage.from("product-images").getPublicUrl(data.path);
      image_url = publicUrl.publicUrl;
    }

    const { error } = await db.from("products").insert({
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: parseFloat(form.price),
      category_id: form.category_id,
      occasion: form.occasion,
      is_new: form.is_new,
      is_featured: form.is_featured,
      is_sold_out: form.is_sold_out,
      image_url,
    });

    if (error) {
      show(getErrorMessage(error, "Product add failed"), "error");
    } else {
      show("Product added!");
      reset();
    }

    setSaving(false);
    load();
  };

  const del = async (id, name) => {
    if (!window.confirm(`Remove "${name}"?`)) return;
    setDeleting(id);
    const { error } = await db.from("products").delete().eq("id", id);
    if (error) {
      show(getErrorMessage(error, "Remove failed"), "error");
    } else {
      show("Removed", "info");
      load();
    }
    setDeleting(null);
  };

  const addCat = async () => {
    if (!catForm.name.trim()) {
      show("Name required", "error");
      return;
    }
    setCatSaving(true);
    const { error } = await db.from("categories").insert({
      name: catForm.name.trim(),
      slug: catForm.slug || catForm.name.toLowerCase().replace(/\s+/g, "-"),
    });

    if (error) {
      show(getErrorMessage(error, "Category add failed"), "error");
    } else {
      show("Category added!");
      setCatForm({ name: "", slug: "" });
    }

    setCatSaving(false);
    load();
  };

  const delCat = async (id, name) => {
    const cnt = products.filter((product) => product.category_id === id).length;
    if (!window.confirm(cnt > 0 ? `Delete "${name}"? This will unlink ${cnt} product(s).` : `Delete "${name}"?`)) return;
    setCatDeleting(id);
    const { error } = await db.from("categories").delete().eq("id", id);
    if (error) {
      show(getErrorMessage(error, "Category delete failed"), "error");
    } else {
      show("Category removed", "info");
      load();
    }
    setCatDeleting(null);
  };

  const stats = [
    { n: products.length, l: "Total" },
    { n: products.filter((product) => product.is_new).length, l: "New" },
    { n: products.filter((product) => product.is_featured).length, l: "Featured" },
    { n: products.filter((product) => !product.is_sold_out).length, l: "Available" },
  ];

  const inp = {
    background: "var(--bg-soft)",
    border: "1px solid var(--border)",
    color: "var(--text)",
    fontSize: 13,
    padding: "10px 14px",
    fontFamily: "'DM Sans',sans-serif",
    width: "100%",
    borderRadius: 8,
    transition: "border .2s",
  };

  const TABS = [
    { k: "products", l: "Products" },
    { k: "add", l: "Add Product" },
    { k: "categories", l: "Categories" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingTop: 68, paddingBottom: 60 }}>
      <Toast toast={toast} />
      {editItem && <EditModal product={editItem} cats={cats} onClose={() => setEditItem(null)} onSaved={() => { setEditItem(null); load(); }} show={show} />}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ padding: "36px 0 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 28 }}>
          <div>
            <p style={{ fontSize: 11, letterSpacing: ".22em", color: "var(--pink)", textTransform: "uppercase", marginBottom: 4, fontFamily: "'DM Sans',sans-serif" }}>✦ Management</p>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 38, fontWeight: 600, color: "var(--text)" }}>Admin Panel</h1>
            {adminEmail && <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6, fontFamily: "'DM Sans',sans-serif" }}>Signed in as {adminEmail}</p>}
          </div>
          <button onClick={onLogout} className="btn-outline" style={{ padding: "9px 18px", fontSize: 12, letterSpacing: ".06em", borderRadius: 8 }}>
            🔒 Lock Panel
          </button>
        </div>

        {loadError && <div style={{ background: "#fff7ed", border: "1px solid #fdba74", color: "#9a3412", fontSize: 13, padding: "12px 14px", borderRadius: 10, marginBottom: 20, fontFamily: "'DM Sans',sans-serif" }}>{loadError}</div>}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
          {stats.map((stat) => (
            <div key={stat.l} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px", boxShadow: "var(--shadow-card)" }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, fontWeight: 400, color: "var(--pink)", lineHeight: 1 }}>{stat.n}</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: ".1em", textTransform: "uppercase", marginTop: 5, fontFamily: "'DM Sans',sans-serif" }}>{stat.l}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--border)", marginBottom: 28 }}>
          {TABS.map((item) => (
            <button
              key={item.k}
              onClick={() => setTab(item.k)}
              className={tab === item.k ? "tab-a" : "tab-i"}
              style={{
                padding: "10px 20px",
                fontSize: 12,
                letterSpacing: ".08em",
                textTransform: "uppercase",
                background: "none",
                border: "none",
                borderBottom: "2px solid",
                cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif",
                transition: "color .18s",
              }}
            >
              {item.l}
            </button>
          ))}
        </div>

        {tab === "add" && (
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: 28, boxShadow: "var(--shadow-card)" }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: "var(--text)", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid var(--border-soft)" }}>✦ Add New Product</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              <div style={{ gridColumn: "1/-1" }}>
                <label style={{ display: "block", fontSize: 10, letterSpacing: ".12em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>Product Photo</label>
                <div
                  style={{ border: "2px dashed var(--border)", borderRadius: 8, overflow: "hidden", position: "relative", minHeight: 140, cursor: "pointer", background: "var(--bg-soft)", transition: "border-color .2s" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--pink)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileRef}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) setPreview(URL.createObjectURL(file));
                    }}
                    style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", zIndex: 2 }}
                  />
                  {preview ? (
                    <img src={preview} alt="Preview" style={{ width: "100%", maxHeight: 220, objectFit: "cover", display: "block" }} />
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 36 }}>
                      <span style={{ fontSize: 36, marginBottom: 10 }}>📷</span>
                      <p style={{ fontSize: 13, color: "var(--text-muted)", fontFamily: "'DM Sans',sans-serif" }}>
                        <span style={{ color: "var(--pink)" }}>Click to upload</span> or drag & drop
                      </p>
                      <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>JPG, PNG, WebP up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ gridColumn: "1/-1" }}>
                <label style={{ display: "block", fontSize: 10, letterSpacing: ".12em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>Product Name *</label>
                <input className="fi" type="text" value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="e.g. Kundan Long Necklace Set" style={inp} />
              </div>

              <div style={{ gridColumn: "1/-1" }}>
                <label style={{ display: "block", fontSize: 10, letterSpacing: ".12em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>Description</label>
                <textarea className="fi" rows={3} value={form.description} onChange={(e) => updateField("description", e.target.value)} placeholder="Material, design, occasion…" style={{ ...inp, resize: "none" }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 10, letterSpacing: ".12em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>Price (₹) *</label>
                <input className="fi" type="number" value={form.price} onChange={(e) => updateField("price", e.target.value)} placeholder="450" style={inp} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 10, letterSpacing: ".12em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>Category *</label>
                <select className="fi" value={form.category_id} onChange={(e) => updateField("category_id", e.target.value)} style={inp}>
                  <option value="">Select…</option>
                  {cats.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 10, letterSpacing: ".12em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>Occasion</label>
                <select className="fi" value={form.occasion} onChange={(e) => updateField("occasion", e.target.value)} style={inp}>
                  <option value="daily">Daily Wear</option>
                  <option value="festive">Festive</option>
                  <option value="wedding">Wedding / Bridal</option>
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14, justifyContent: "center" }}>
                <Toggle checked={form.is_new} onChange={(value) => updateField("is_new", value)} label="New Arrival" />
                <Toggle checked={form.is_featured} onChange={(value) => updateField("is_featured", value)} label="Featured on Homepage" />
                <Toggle checked={form.is_sold_out} onChange={(value) => updateField("is_sold_out", value)} label="Mark as Sold Out" />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--border-soft)" }}>
              <button onClick={reset} className="btn-outline" style={{ padding: "9px 20px", fontSize: 12, letterSpacing: ".06em", borderRadius: 8 }}>
                Reset
              </button>
              <button onClick={submit} disabled={saving} className="btn-primary" style={{ padding: "9px 26px", fontSize: 12, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", borderRadius: 8, display: "flex", alignItems: "center", gap: 8, opacity: saving ? 0.6 : 1 }}>
                {saving && <Spinner sm />}
                {saving ? "Adding…" : "+ Add Product"}
              </button>
            </div>
          </div>
        )}

        {tab === "products" && (
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
            <div style={{ padding: "14px 22px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: "var(--text)" }}>All Products</span>
              <span style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: ".1em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>{products.length} items</span>
            </div>
            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
                <Spinner />
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: "center", padding: 60 }}>
                <div style={{ fontSize: 44, marginBottom: 10 }}>📦</div>
                <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: "var(--text)", marginBottom: 8 }}>No products yet</p>
                <button onClick={() => setTab("add")} style={{ fontSize: 13, color: "var(--pink)", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                  Add your first product →
                </button>
              </div>
            ) : (
              <div>
                {products.map((product) => {
                  const slug = product.categories?.slug || "default";
                  return (
                    <div
                      key={product.id}
                      style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 22px", borderBottom: "1px solid var(--border-soft)", transition: "background .15s" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "var(--bg-soft)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <div style={{ width: 52, height: 52, flexShrink: 0, borderRadius: 8, overflow: "hidden", background: "var(--bg-mid)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                        {product.image_url ? <img src={product.image_url} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : CAT_ICONS[slug] || "💎"}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "'DM Sans',sans-serif" }}>{product.name}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2, fontFamily: "'DM Sans',sans-serif" }}>
                          {product.categories?.name}
                          {product.is_new ? " · 🆕" : ""}
                          {product.is_featured ? " · ⭐" : ""}
                          {product.is_sold_out ? " · 🔴 Sold" : ""}
                        </div>
                      </div>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, color: "var(--text-mid)", whiteSpace: "nowrap" }}>
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </div>
                      <span style={{ fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 4, fontFamily: "'DM Sans',sans-serif", background: product.is_sold_out ? "#fef2f2" : "#f0fdf4", color: product.is_sold_out ? "#b91c1c" : "#15803d", border: `1px solid ${product.is_sold_out ? "#fecaca" : "#bbf7d0"}` }}>
                        {product.is_sold_out ? "Sold" : "Avail."}
                      </span>
                      <button onClick={() => setEditItem(product)} className="btn-edit" style={{ padding: "6px 14px", fontSize: 11, letterSpacing: ".04em", borderRadius: 6, whiteSpace: "nowrap" }}>
                        ✏ Edit
                      </button>
                      <button onClick={() => del(product.id, product.name)} disabled={deleting === product.id} className="btn-danger" style={{ padding: "6px 12px", fontSize: 11, borderRadius: 6, whiteSpace: "nowrap", opacity: deleting === product.id ? 0.5 : 1 }}>
                        {deleting === product.id ? <Spinner sm /> : "🗑"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {tab === "categories" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: 28, boxShadow: "var(--shadow-card)" }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: "var(--text)", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid var(--border-soft)" }}>✦ Add New Category</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
                <div>
                  <label style={{ display: "block", fontSize: 10, letterSpacing: ".12em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>Category Name *</label>
                  <input
                    className="fi"
                    type="text"
                    value={catForm.name}
                    placeholder="e.g. Maang Tikka"
                    onChange={(e) => {
                      const name = e.target.value;
                      setCatForm({
                        name,
                        slug: name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
                      });
                    }}
                    style={inp}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 10, letterSpacing: ".12em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>Slug (auto)</label>
                  <input className="fi" type="text" value={catForm.slug} onChange={(e) => setCatForm((prev) => ({ ...prev, slug: e.target.value }))} placeholder="maang-tikka" style={inp} />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button onClick={addCat} disabled={catSaving} className="btn-primary" style={{ padding: "9px 26px", fontSize: 12, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", borderRadius: 8, display: "flex", alignItems: "center", gap: 8, opacity: catSaving ? 0.6 : 1 }}>
                  {catSaving && <Spinner sm />}
                  {catSaving ? "Adding…" : "+ Add Category"}
                </button>
              </div>
            </div>

            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
              <div style={{ padding: "14px 22px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: "var(--text)" }}>All Categories</span>
                <span style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: ".1em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>{cats.length} categories</span>
              </div>
              {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
                  <Spinner />
                </div>
              ) : cats.length === 0 ? (
                <div style={{ textAlign: "center", padding: 40, color: "var(--text-muted)", fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>No categories yet.</div>
              ) : (
                <div>
                  {cats.map((category) => {
                    const cnt = products.filter((product) => product.category_id === category.id).length;
                    return (
                      <div
                        key={category.id}
                        style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 22px", borderBottom: "1px solid var(--border-soft)", transition: "background .15s" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "var(--bg-soft)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <span style={{ fontSize: 24 }}>{CAT_ICONS[category.slug] || "💎"}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", fontFamily: "'DM Sans',sans-serif" }}>{category.name}</div>
                          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2, fontFamily: "'DM Sans',sans-serif" }}>
                            /{category.slug} · {cnt} product{cnt !== 1 ? "s" : ""}
                          </div>
                        </div>
                        <button onClick={() => delCat(category.id, category.name)} disabled={catDeleting === category.id} className="btn-danger" style={{ padding: "6px 14px", fontSize: 11, borderRadius: 6, opacity: catDeleting === category.id ? 0.5 : 1 }}>
                          {catDeleting === category.id ? <Spinner sm /> : "🗑 Delete"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
