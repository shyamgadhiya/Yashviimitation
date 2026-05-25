import { CAT_ICONS, WA } from "../../lib/config.js";
import { WaIcon } from "../../components/icons/index.jsx";

export default function ProductCard({ product, delay = 0 }) {
  const slug = product.categories?.slug || "default";
  const icon = CAT_ICONS[slug] || CAT_ICONS.default;
  const waLines = [
    `Hi! I am interested in "${product.name}" priced at ₹${product.price}. Is it available?`,
    product.categories?.name ? `Category: ${product.categories.name}` : null,
    product.image_url ? `Photo: ${product.image_url}` : null,
  ].filter(Boolean);
  const waMsg = encodeURIComponent(waLines.join("\n"));

  return (
    <div
      className="card-h"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        overflow: "hidden",
        transition: "all .28s",
        animation: "fadeUp .45s ease both",
        boxShadow: "var(--shadow-card)",
        animationDelay: `${delay}s`,
      }}
    >
      <div style={{ aspectRatio: "1/1", overflow: "hidden", position: "relative", background: "var(--bg-mid)" }}>
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .45s", display: "block" }}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
            }}
            loading="lazy"
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              background: "var(--bg-soft)",
            }}
          >
            <span style={{ fontSize: 56, lineHeight: 1 }}>{icon}</span>
            <span style={{ fontSize: 9, color: "var(--text-muted)", letterSpacing: ".14em", textTransform: "uppercase" }}>
              {product.categories?.name}
            </span>
          </div>
        )}
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", flexDirection: "column", gap: 5 }}>
          {product.is_new && <span className="badge-new">New</span>}
          {product.is_featured && !product.is_sold_out && <span className="badge-feat">Featured</span>}
        </div>
        {product.is_sold_out && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 11, color: "#e5e7eb", border: "1px solid #6b7280", padding: "5px 14px", letterSpacing: ".14em", textTransform: "uppercase" }}>
              Sold Out
            </span>
          </div>
        )}
      </div>
      <div style={{ padding: "14px 16px 16px" }}>
        <div style={{ fontSize: 10, color: "var(--pink)", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 5 }}>
          {product.categories?.name || "Jewellery"}
        </div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontWeight: 500, color: "var(--text)", lineHeight: 1.25, marginBottom: 6 }}>
          {product.name}
        </div>
        {product.description && (
          <p
            style={{
              fontSize: 11.5,
              color: "var(--text-muted)",
              lineHeight: 1.55,
              marginBottom: 10,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.description}
          </p>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid var(--border-soft)", marginTop: 10 }}>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 500, color: "var(--text)" }}>
            ₹{Number(product.price).toLocaleString("en-IN")}
          </span>
          {!product.is_sold_out ? (
            <a
              href={`https://wa.me/${WA}?text=${waMsg}`}
              target="_blank"
              rel="noopener"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "#25D366",
                color: "#fff",
                borderRadius: 999,
                padding: "7px 14px",
                fontSize: 11,
                fontWeight: 500,
                fontFamily: "'DM Sans',sans-serif",
                transition: "all .18s",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#1ebe5d";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#25D366";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <WaIcon />
              Enquire
            </a>
          ) : (
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Unavailable</span>
          )}
        </div>
      </div>
    </div>
  );
}
