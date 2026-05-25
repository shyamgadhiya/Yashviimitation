import { useEffect, useMemo, useState } from "react";
import { SearchIcon } from "../../components/icons/index.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import { db } from "../../lib/supabase/client.js";
import { CATEGORY_SELECT, PRODUCT_SELECT } from "../../lib/supabase/queries.js";
import CatBar from "./CatBar.jsx";
import ProductCard from "./ProductCard.jsx";

export default function CollectionPage() {
  const [products, setProducts] = useState([]);
  const [cats, setCats] = useState([]);
  const [active, setActive] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: c }, { data: p }] = await Promise.all([
        db.from("categories").select(CATEGORY_SELECT).order("name"),
        db.from("products").select(PRODUCT_SELECT).order("created_at", { ascending: false }),
      ]);

      setCats(c || []);
      setProducts(p || []);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    let list = active === "all" ? products : products.filter((product) => product.categories?.slug === active);
    if (search.trim()) {
      const query = search.toLowerCase();
      list = list.filter((product) => product.name.toLowerCase().includes(query) || product.description?.toLowerCase().includes(query));
    }
    return list;
  }, [products, active, search]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingTop: 68 }}>
      <div className="page-shell" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem" }}>
        <div className="collection-header" style={{ padding: "48px 0 32px", borderBottom: "1px solid var(--border)", marginBottom: 32 }}>
          <p style={{ fontSize: 11, letterSpacing: ".22em", color: "var(--pink)", textTransform: "uppercase", marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>✦ Browse</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 48, fontWeight: 600, color: "var(--text)" }}>Our Collection</h1>
            <div className="collection-search-wrap" style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Search designs…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="fi collection-search-input"
                style={{
                  paddingLeft: 36,
                  paddingRight: 16,
                  paddingTop: 10,
                  paddingBottom: 10,
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                  fontSize: 13,
                  width: 240,
                  fontFamily: "'DM Sans',sans-serif",
                  borderRadius: 8,
                }}
              />
            </div>
          </div>
        </div>
        <div style={{ marginBottom: 32 }}>
          <CatBar cats={cats} active={active} onChange={setActive} />
        </div>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
            <Spinner />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>💎</div>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: "var(--text)", marginBottom: 6 }}>No pieces found</p>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Try a different category or search term.</p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 20, fontFamily: "'DM Sans',sans-serif" }}>
              {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 20, paddingBottom: 60 }} className="stagger">
              {filtered.map((product, index) => (
                <ProductCard key={product.id} product={product} delay={index * 0.05} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
