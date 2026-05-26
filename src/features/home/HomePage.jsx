import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../../components/seo/Seo.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import { MAP_URL } from "../../lib/config.js";
import { db } from "../../lib/supabase/client.js";
import { PRODUCT_SELECT } from "../../lib/supabase/queries.js";
import { trackLead } from "../../lib/analytics.js";
import {
  BUSINESS_CITY,
  BUSINESS_PHONE_DISPLAY,
  BUSINESS_PHONE_LINK,
  BUSINESS_WHATSAPP_LINK,
  DEFAULT_META_DESCRIPTION,
  buildLocalBusinessSchema,
  getOccasionPath,
} from "../../lib/site.js";
import ProductCard from "../catalog/ProductCard.jsx";
import Hero from "./Hero.jsx";

export default function HomePage() {
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
      <Seo
        description={DEFAULT_META_DESCRIPTION}
        path="/"
        schema={buildLocalBusinessSchema()}
      />
      <Hero total={total} newCount={newCount} />
      <Section
        eyebrow="Just Arrived"
        title="New Arrivals"
        action={
          <Link
            to="/collection"
            style={{ fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontFamily: "'DM Sans',sans-serif", transition: "color .18s", textDecoration: "none" }}
            onMouseEnter={(e) => {
              e.target.style.color = "var(--pink)";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "var(--text-muted)";
            }}
          >
            View All →
          </Link>
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
            {[{ key: "daily", i: "🌸", n: "Daily Wear", d: "Light, elegant everyday pieces" }, { key: "festive", i: "🪔", n: "Festive", d: "Kundan, polki & temple designs" }, { key: "wedding", i: "💒", n: "Wedding", d: "Complete bridal jewellery sets" }].map((occasion, idx) => (
              <Link
                key={occasion.n}
                to={getOccasionPath(occasion.key)}
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
                  textDecoration: "none",
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
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "64px 2rem", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="trust-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 16 }}>
            {[
              { title: `Visit us in ${BUSINESS_CITY}`, text: "Local customers can browse styles, bridal sets and festive jewellery with in-person support." },
              { title: "Pan-India enquiries", text: "Customers across India can order through WhatsApp with catalogue help and styling support." },
              { title: "Bridal-ready styling", text: "Need matching earrings, bangles or layered sets? We help you shortlist complete looks quickly." },
              { title: "Fast response on WhatsApp", text: "Share your occasion, budget or reference photo and get guided jewellery suggestions faster." },
            ].map((item) => (
              <div key={item.title} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: 22, boxShadow: "var(--shadow-card)" }}>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: "var(--text)", marginBottom: 10 }}>{item.title}</h2>
                <p style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "64px 2rem", background: "var(--bg-soft)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="local-seo-grid" style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 24 }}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 18, padding: 28, boxShadow: "var(--shadow-card)" }}>
            <p style={{ fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 10 }}>Local Customers</p>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, color: "var(--text)", marginBottom: 12 }}>Visit our {BUSINESS_CITY} jewellery studio</h2>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.75, marginBottom: 20 }}>
              Bridal, festive and daily wear imitation jewellery collections are available for in-person selection and consultation in {BUSINESS_CITY}.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href={MAP_URL} target="_blank" rel="noopener" className="btn-primary" style={{ padding: "12px 22px", borderRadius: 8 }} onClick={() => trackLead("visit_map", { placement: "home_local_block" })}>
                Get Directions
              </a>
              <a href={BUSINESS_PHONE_LINK} className="btn-outline" style={{ padding: "12px 22px", borderRadius: 8 }} onClick={() => trackLead("call", { placement: "home_local_block" })}>
                Call {BUSINESS_PHONE_DISPLAY}
              </a>
            </div>
          </div>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 18, padding: 28, boxShadow: "var(--shadow-card)" }}>
            <p style={{ fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 10 }}>India-Wide Buyers</p>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, color: "var(--text)", marginBottom: 12 }}>Need jewellery delivered across India?</h2>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.75, marginBottom: 20 }}>
              Message us on WhatsApp for festive edits, bridal selections, daily wear picks and quick catalogue guidance before placing your order.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a
                href={`${BUSINESS_WHATSAPP_LINK}?text=Hi! I need help choosing jewellery for my occasion and budget.`}
                target="_blank"
                rel="noopener"
                className="btn-primary"
                style={{ padding: "12px 22px", borderRadius: 8 }}
                onClick={() => trackLead("whatsapp", { placement: "home_india_block" })}
              >
                Ask on WhatsApp
              </a>
              <Link to="/collection" className="btn-outline" style={{ padding: "12px 22px", borderRadius: 8, textDecoration: "none" }}>
                Browse Collection
              </Link>
            </div>
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
