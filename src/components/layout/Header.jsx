import { useEffect, useState } from "react";
import { IG, LOGO, WA } from "../../lib/config.js";
import { CloseIcon, IgIcon, MenuIcon, WaIcon } from "../icons/index.jsx";

export default function Header({ page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const nav = [
    { k: "home", l: "Home" },
    { k: "collection", l: "Collection" },
    { k: "occasions", l: "Occasions" },
  ];

  const hStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    background: scrolled ? "var(--header-bg)" : "transparent",
    backdropFilter: scrolled ? "blur(14px)" : "none",
    borderBottom: scrolled ? "1px solid var(--border)" : "none",
    transition: "all .3s",
  };

  return (
    <>
      <header style={hStyle}>
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 1.5rem",
            height: 70,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <button
            onClick={() => setPage("home")}
            style={{ display: "flex", alignItems: "center", gap: 12, background: "none", border: "none", cursor: "pointer" }}
          >
            <img src={LOGO} alt="Yashvi Imitation" style={{ width: 46, height: 46, objectFit: "contain", display: "block" }} />
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
              <span
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 17,
                  fontWeight: 600,
                  color: "var(--text)",
                  letterSpacing: ".03em",
                }}
              >
                Yashvi Imitation
              </span>
              <span style={{ fontSize: 9.5, letterSpacing: ".18em", color: "var(--pink)", textTransform: "uppercase" }}>
                House of Antique Jewellery
              </span>
            </div>
          </button>

          <nav style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {nav.map((item) => (
              <button
                key={item.k}
                onClick={() => setPage(item.k)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 12,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  color: page === item.k ? "var(--pink)" : "var(--text-muted)",
                  transition: "color .2s",
                }}
              >
                {item.l}
              </button>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <a
              href={IG}
              target="_blank"
              rel="noopener"
              style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)", padding: "6px 10px", transition: "color .2s" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--pink)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-muted)";
              }}
            >
              <IgIcon />
              <span className="sm-inline" style={{ fontSize: 12, letterSpacing: ".06em" }}>
                Instagram
              </span>
            </a>
            <a
              href={`https://wa.me/${WA}?text=Hi! I would like to enquire about your jewellery.`}
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
                fontSize: 12,
                fontWeight: 500,
                fontFamily: "'DM Sans',sans-serif",
                transition: "all .18s",
                textDecoration: "none",
              }}
            >
              <WaIcon />
              <span className="sm-inline">WhatsApp</span>
            </a>
            {page === "admin" ? (
              <button onClick={() => setPage("home")} className="btn-outline" style={{ borderRadius: 999, padding: "6px 14px", fontSize: 12, letterSpacing: ".06em" }}>
                ← Store
              </button>
            ) : (
              <button onClick={() => setPage("admin")} className="btn-outline" style={{ borderRadius: 999, padding: "6px 14px", fontSize: 12, letterSpacing: ".06em" }}>
                ⚙ Admin
              </button>
            )}
            <button
              className="btn-outline"
              style={{ borderRadius: 999, padding: "6px 8px", display: "flex", alignItems: "center", justifyContent: "center" }}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
        {open && (
          <div style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)", animation: "slideDown .25s ease both" }}>
            {nav.map((item) => (
              <button
                key={item.k}
                onClick={() => {
                  setPage(item.k);
                  setOpen(false);
                }}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "14px 24px",
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 13,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: page === item.k ? "var(--pink)" : "var(--text-muted)",
                  borderBottom: "1px solid var(--border-soft)",
                }}
              >
                {item.l}
              </button>
            ))}
            <a
              href={IG}
              target="_blank"
              rel="noopener"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 24px",
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 13,
                color: "var(--text-muted)",
                borderBottom: "1px solid var(--border-soft)",
              }}
            >
              <IgIcon /> @yashvi_imitation_
            </a>
          </div>
        )}
      </header>
    </>
  );
}
