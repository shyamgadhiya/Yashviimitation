import { useRef, useState } from "react";
import Spinner from "../../components/ui/Spinner.jsx";
import Toggle from "../../components/ui/Toggle.jsx";
import { getErrorMessage } from "../../lib/supabase/admin.js";
import { db } from "../../lib/supabase/client.js";

export default function EditModal({ product, cats, onClose, onSaved, show: toastFn }) {
  const [form, setForm] = useState({
    name: product.name || "",
    description: product.description || "",
    price: product.price || "",
    category_id: product.category_id || "",
    occasion: product.occasion || "daily",
    is_new: product.is_new || false,
    is_featured: product.is_featured || false,
    is_sold_out: product.is_sold_out || false,
  });
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(product.image_url || "");
  const fileRef = useRef();

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    if (!form.name.trim()) {
      toastFn("Name is required", "error");
      return;
    }
    if (!form.price || Number.isNaN(Number(form.price))) {
      toastFn("Enter a valid price", "error");
      return;
    }

    setSaving(true);
    let image_url = product.image_url;
    const file = fileRef.current?.files?.[0];

    if (file) {
      const ext = file.name.split(".").pop();
      const { data, error } = await db.storage.from("product-images").upload(`product-${Date.now()}.${ext}`, file, {
        cacheControl: "3600",
        upsert: false,
      });

      if (error) {
        toastFn(getErrorMessage(error, "Upload failed"), "error");
        setSaving(false);
        return;
      }

      const { data: publicUrl } = db.storage.from("product-images").getPublicUrl(data.path);
      image_url = publicUrl.publicUrl;
    }

    const { error } = await db
      .from("products")
      .update({
        name: form.name.trim(),
        description: form.description.trim() || null,
        price: parseFloat(form.price),
        category_id: form.category_id,
        occasion: form.occasion,
        is_new: form.is_new,
        is_featured: form.is_featured,
        is_sold_out: form.is_sold_out,
        image_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", product.id);

    if (error) {
      toastFn(getErrorMessage(error, "Update failed"), "error");
    } else {
      toastFn("Product updated!");
      onSaved();
    }

    setSaving(false);
  };

  const inp = {
    background: "var(--bg-soft)",
    border: "1px solid var(--border)",
    color: "var(--text)",
    fontSize: 13,
    padding: "10px 14px",
    fontFamily: "'DM Sans',sans-serif",
    width: "100%",
    borderRadius: 6,
    transition: "border .2s",
  };

  return (
    <div className="modal-ov" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box animate-fade-up" style={{ borderRadius: 14 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 22px",
            borderBottom: "1px solid var(--border)",
            position: "sticky",
            top: 0,
            background: "var(--bg-card)",
            zIndex: 10,
            borderRadius: "14px 14px 0 0",
          }}
        >
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: "var(--text)" }}>Edit Product</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "var(--text-muted)" }}>
            ✕
          </button>
        </div>
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 10, letterSpacing: ".12em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>
              Photo
            </label>
            <div
              style={{ border: "2px dashed var(--border)", borderRadius: 8, overflow: "hidden", position: "relative", minHeight: 120, cursor: "pointer", background: "var(--bg-soft)", transition: "border-color .2s" }}
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
                <div style={{ position: "relative" }}>
                  <img src={preview} alt="Preview" style={{ width: "100%", maxHeight: 200, objectFit: "cover", display: "block" }} />
                  <div
                    style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.35)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity .2s" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = 1;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = 0;
                    }}
                  >
                    <span style={{ color: "#fff", fontSize: 13 }}>Click to change</span>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 }}>
                  <span style={{ fontSize: 28, marginBottom: 8 }}>📷</span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Click to upload photo</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 10, letterSpacing: ".12em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>
              Name *
            </label>
            <input className="fi" type="text" value={form.name} onChange={(e) => updateField("name", e.target.value)} style={inp} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 10, letterSpacing: ".12em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>
              Description
            </label>
            <textarea className="fi" rows={2} value={form.description} onChange={(e) => updateField("description", e.target.value)} style={{ ...inp, resize: "none" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 10, letterSpacing: ".12em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>
                Price (₹) *
              </label>
              <input className="fi" type="number" value={form.price} onChange={(e) => updateField("price", e.target.value)} style={inp} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 10, letterSpacing: ".12em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>
                Category
              </label>
              <select className="fi" value={form.category_id} onChange={(e) => updateField("category_id", e.target.value)} style={inp}>
                {cats.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 10, letterSpacing: ".12em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>
              Occasion
            </label>
            <select className="fi" value={form.occasion} onChange={(e) => updateField("occasion", e.target.value)} style={inp}>
              <option value="daily">Daily Wear</option>
              <option value="festive">Festive</option>
              <option value="wedding">Wedding / Bridal</option>
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, paddingTop: 4 }}>
            <Toggle checked={form.is_new} onChange={(value) => updateField("is_new", value)} label="New Arrival" />
            <Toggle checked={form.is_featured} onChange={(value) => updateField("is_featured", value)} label="Featured" />
            <Toggle checked={form.is_sold_out} onChange={(value) => updateField("is_sold_out", value)} label="Sold Out" />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "14px 22px", borderTop: "1px solid var(--border)" }}>
          <button onClick={onClose} className="btn-outline" style={{ padding: "9px 20px", fontSize: 12, letterSpacing: ".06em", borderRadius: 6 }}>
            Cancel
          </button>
          <button onClick={save} disabled={saving} className="btn-primary" style={{ padding: "9px 24px", fontSize: 12, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", borderRadius: 6, display: "flex", alignItems: "center", gap: 8, opacity: saving ? 0.6 : 1 }}>
            {saving && <Spinner sm />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
