import { Link } from "react-router-dom";
import { CAT_ICONS } from "../../lib/config.js";

export default function CatBar({ cats, active, buildHref }) {
  return (
    <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }} className="noscroll">
      {[{ id: "all", name: "All", slug: "all" }, ...cats].map((category) => {
        const on = active === category.slug || active === category.id;
        return (
          <Link
            key={category.id}
            to={buildHref(category.slug || "all")}
            style={{
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 18px",
              borderRadius: 999,
              fontSize: 12,
              fontFamily: "'DM Sans',sans-serif",
              letterSpacing: ".07em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all .18s",
              background: on ? "var(--pink)" : "var(--bg-card)",
              color: on ? "#fff" : "var(--text-muted)",
              border: `1px solid ${on ? "var(--pink)" : "var(--border)"}`,
              textDecoration: "none",
            }}
          >
            {category.slug && category.slug !== "all" ? `${CAT_ICONS[category.slug] || "💎"} ` : ""}
            {category.name}
          </Link>
        );
      })}
    </div>
  );
}
