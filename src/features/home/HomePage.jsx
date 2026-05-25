import { useEffect, useState } from "react";
import Spinner from "../../components/ui/Spinner.jsx";
import { db } from "../../lib/supabase/client.js";
import { PRODUCT_SELECT } from "../../lib/supabase/queries.js";
import ProductCard from "../catalog/ProductCard.jsx";
import Hero from "./Hero.jsx";

export default function HomePage({ setPage }) {
  const [featured, setFeatured] = useState([]);
  const [newArr, setNewArr] = useState([]);
  const [total, setTotal] = useState(0);
  const [newCount, setNewCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: f }, { data: n }, { count: t }, { count: nc }] = await Promise.all([
        db.from("products").select(PRODUCT_SELECT).eq("is_featured", true).limit(4),
        db.from("products").select(PRODUCT_SELECT).eq("is_new", true).order("created_at", { ascending: false }).limit(4),
        db.from("products").select("id", { count: "exact", head: true }),
        db.from("products").select("id", { count: "exact", head: true }).eq("is_new", true),
      ]);

      setFeatured(f || []);
      setNewArr(n || []);
      setTotal(t || 0);
      setNewCount(nc || 0);
      setLoading(false);
    })();
  }, []);

  const Section = ({ eyebrow, title, children, action }) => (
    <section style={{ padding: "72px 2rem", background: "var(--bg)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40, flexWrap: "wrap", gap: 12 }}>
          <div>
            <p style={{ fontSize: 11, letterSpacing: ".22em", color: "var(--pink)", textTransform: "uppercase", marginBottom: 6, fontFamily: "'DM Sans',sans-serif" }}>✦ {eyebrow}</p>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, fontWeight: 600, color: "var(--text)" }}>{title}</h2>
          </div>
          {action}
        </div>
        {children}
      </div>
    </section>
  );

  return (
    <>
      <Hero setPage={setPage} total={total} newCount={newCount} />
      <Section
        eyebrow="Just Arrived"
        title="New Arrivals"
        action={
          <button
            onClick={() => setPage("collection")}
            style={{ fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontFamily: "'DM Sans',sans-serif", transition: "color .18s" }}
            onMouseEnter={(e) => {
              e.target.style.color = "var(--pink)";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "var(--text-muted)";
            }}
          >
            View All →
          </button>
        }
      >
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
            <Spinner />
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 20 }} className="stagger">
            {newArr.map((product, index) => (
              <ProductCard key={product.id} product={product} delay={index * 0.07} />
            ))}
          </div>
        )}
      </Section>

      <section style={{ padding: "64px 2rem", background: "var(--bg-soft)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <p style={{ textAlign: "center", fontSize: 11, letterSpacing: ".22em", color: "var(--pink)", textTransform: "uppercase", marginBottom: 10, fontFamily: "'DM Sans',sans-serif" }}>✦ Curated For Every Moment</p>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, color: "var(--text)", textAlign: "center", marginBottom: 36 }}>Shop by Occasion</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
            {[{ i: "🌸", n: "Daily Wear", d: "Light, elegant everyday pieces" }, { i: "🪔", n: "Festive", d: "Kundan, polki & temple designs" }, { i: "💒", n: "Wedding", d: "Complete bridal jewellery sets" }].map((occasion, idx) => (
              <button
                key={occasion.n}
                onClick={() => setPage("occasions")}
                style={{
                  border: "1px solid var(--border)",
                  background: "var(--bg-card)",
                  borderRadius: 14,
                  padding: "32px 24px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all .22s",
                  boxShadow: "var(--shadow-card)",
                  animation: `fadeUp .45s ease both ${idx * 0.1}s`,
                  fontFamily: "'DM Sans',sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--pink)";
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 8px 28px rgba(196,135,140,.18)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "var(--shadow-card)";
                }}
              >
                <div style={{ fontSize: 38, marginBottom: 14 }}>{occasion.i}</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: "var(--text)", marginBottom: 6 }}>{occasion.n}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{occasion.d}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <Section eyebrow="Handpicked Pieces" title="Featured Collection">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 20 }} className="stagger">
            {featured.map((product, index) => (
              <ProductCard key={product.id} product={product} delay={index * 0.07} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
