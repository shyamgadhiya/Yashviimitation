import { IG, LOGO, WA } from "../../lib/config.js";
import { ChevronRight, IgIcon, WaIcon } from "../../components/icons/index.jsx";

export default function Hero({ setPage, total, newCount }) {
  return (
    <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }} className="hero-light">
      <div style={{ position: "absolute", top: "20%", left: "10%", width: 400, height: 400, borderRadius: "50%", background: "var(--pink)", opacity: 0.06, filter: "blur(80px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "15%", right: "8%", width: 280, height: 280, borderRadius: "50%", background: "var(--pink)", opacity: 0.05, filter: "blur(60px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(var(--pink) 1px,transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />

      <div
        className="hero-grid"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "88px 2rem 60px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "5rem",
          alignItems: "center",
          width: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="hero-copy" style={{ animation: "fadeUp .5s ease both" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ height: 1, width: 40, background: "var(--pink)" }} />
            <span style={{ fontSize: 11, letterSpacing: ".22em", color: "var(--pink)", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>
              New Festive Collection 2025
            </span>
          </div>
          <div className="hero-brand-row" style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
            <img className="hero-logo" src={LOGO} alt="Yashvi Imitation" style={{ width: 80, height: 80, objectFit: "contain" }} />
            <div>
              <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(38px,5vw,64px)", fontWeight: 600, color: "var(--text)", lineHeight: 1.05, marginBottom: 6 }}>
                Yashvi
                <br />
                <em className="shimmer-text" style={{ fontStyle: "normal" }}>
                  Imitation
                </em>
              </h1>
              <p style={{ fontSize: 10, letterSpacing: ".2em", color: "var(--pink)", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>
                House of Antique Jewellery
              </p>
            </div>
          </div>
          <p className="hero-description" style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.72, marginBottom: 32, maxWidth: 400, fontFamily: "'DM Sans',sans-serif" }}>
            Discover our exquisite collection of handpicked kundan, polki &amp; temple jewellery crafted for every occasion — weddings, festive celebrations, and everyday elegance.
          </p>
          <div className="hero-buttons" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => setPage("collection")} className="btn-primary hero-button" style={{ padding: "13px 30px", fontSize: 13, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", borderRadius: 2 }}>
              Explore Collection
            </button>
            <a href={`https://wa.me/${WA}?text=Hi! Please share your latest catalogue.`} target="_blank" rel="noopener" className="btn-outline hero-button" style={{ padding: "12px 24px", fontSize: 13, letterSpacing: ".08em", textTransform: "uppercase", borderRadius: 2, display: "inline-flex", alignItems: "center", gap: 6 }}>
              <WaIcon />
              View Catalogue
            </a>
            <a href={IG} target="_blank" rel="noopener" className="btn-outline hero-button" style={{ padding: "12px 20px", fontSize: 13, letterSpacing: ".08em", textTransform: "uppercase", borderRadius: 2, display: "inline-flex", alignItems: "center", gap: 6 }}>
              <IgIcon />
              Follow
            </a>
          </div>
        </div>

        <div className="hero-side" style={{ display: "flex", flexDirection: "column", gap: 14, animation: "fadeUp .5s ease both .12s" }}>
          <div className="hero-stats" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            {[{ n: `${total}+`, l: "Designs" }, { n: newCount, l: "New Arrivals" }, { n: "6", l: "Categories" }].map((stat) => (
              <div key={stat.l} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: "18px 16px", textAlign: "center", boxShadow: "var(--shadow-card)" }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, fontWeight: 400, color: "var(--pink)", lineHeight: 1 }}>{stat.n}</div>
                <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: ".1em", textTransform: "uppercase", marginTop: 5, fontFamily: "'DM Sans',sans-serif" }}>{stat.l}</div>
              </div>
            ))}
          </div>
          {[{ i: "🪔", n: "Festive", d: "Kundan & polki designs" }, { i: "💒", n: "Bridal", d: "Complete wedding sets" }, { i: "🌸", n: "Daily Wear", d: "Elegant & lightweight" }].map((occasion, idx) => (
            <button
              className="hero-occasion-card"
              key={occasion.n}
              onClick={() => setPage("occasions")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: "14px 16px",
                textAlign: "left",
                cursor: "pointer",
                transition: "all .22s",
                boxShadow: "var(--shadow-card)",
                animation: `fadeUp .5s ease both ${0.18 + idx * 0.07}s`,
                fontFamily: "'DM Sans',sans-serif",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--pink)";
                e.currentTarget.style.boxShadow = "0 6px 24px rgba(196,135,140,.18)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.boxShadow = "var(--shadow-card)";
              }}
            >
              <span style={{ fontSize: 24 }}>{occasion.i}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", marginBottom: 2 }}>{occasion.n}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{occasion.d}</div>
              </div>
              <span style={{ color: "var(--text-muted)" }}>
                <ChevronRight />
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
