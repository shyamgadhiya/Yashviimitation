import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { IG, LOGO, MAP_URL } from "../../lib/config.js";
import { CloseIcon, IgIcon, MenuIcon, WaIcon } from "../icons/index.jsx";
import { trackLead } from "../../lib/analytics.js";
import { BUSINESS_PHONE_DISPLAY, BUSINESS_PHONE_LINK, BUSINESS_WHATSAPP_LINK } from "../../lib/site.js";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const nav = [
    { to: "/", label: "Home", match: (pathname) => pathname === "/" },
    { to: "/collection", label: "Collection", match: (pathname) => pathname.startsWith("/collection") || pathname.startsWith("/category") || pathname.startsWith("/product") },
    { to: "/occasion/wedding", label: "Bridal", match: (pathname) => pathname.startsWith("/occasion") },
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
          className="header-inner"
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
          <Link className="header-brand" to="/" style={{ display: "flex", alignItems: "center", gap: 12, background: "none", border: "none", cursor: "pointer", textDecoration: "none" }}>
            <img className="header-logo" src={LOGO} alt="Yashvi Imitation" style={{ width: 46, height: 46, objectFit: "contain", display: "block" }} />
            <div className="brand-copy" style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
              <span
                className="brand-title"
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
              <span className="brand-tagline" style={{ fontSize: 9.5, letterSpacing: ".18em", color: "var(--pink)", textTransform: "uppercase" }}>
                House of Antique Jewellery
              </span>
            </div>
          </Link>

          <nav className="desktop-nav" style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 12,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  color: item.match(location.pathname) ? "var(--pink)" : "var(--text-muted)",
                  transition: "color .2s",
                  textDecoration: "none",
                }}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="header-actions" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {!isAdminRoute ? (
              <>
                <a
                  className="header-social"
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
                  className="header-call"
                  href={BUSINESS_PHONE_LINK}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "var(--text-muted)",
                    padding: "6px 10px",
                    transition: "color .2s",
                    textDecoration: "none",
                  }}
                  onClick={() => trackLead("call", { placement: "header" })}
                >
                  ☎ <span className="sm-inline">{BUSINESS_PHONE_DISPLAY}</span>
                </a>
                <a
                  className="header-whatsapp"
                  href={`${BUSINESS_WHATSAPP_LINK}?text=Hi! I would like to enquire about your jewellery.`}
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
                  onClick={() => trackLead("whatsapp", { placement: "header" })}
                >
                  <WaIcon />
                  <span className="sm-inline">WhatsApp</span>
                </a>
              </>
            ) : (
              <Link to="/" className="btn-outline header-admin" style={{ borderRadius: 999, padding: "6px 14px", fontSize: 12, letterSpacing: ".06em", textDecoration: "none" }}>
                ← Store
              </Link>
            )}
            <button
              className="btn-outline menu-toggle"
              style={{ borderRadius: 999, padding: "6px 8px", display: "flex", alignItems: "center", justifyContent: "center" }}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
        {open && (
          <div className="mobile-menu-panel" style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)", animation: "slideDown .25s ease both" }}>
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
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
                  color: item.match(location.pathname) ? "var(--pink)" : "var(--text-muted)",
                  borderBottom: "1px solid var(--border-soft)",
                  textDecoration: "none",
                }}
              >
                {item.label}
              </Link>
            ))}
            {!isAdminRoute ? (
              <>
                <a
                  href={`${BUSINESS_WHATSAPP_LINK}?text=Hi! I would like to enquire about your jewellery.`}
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
                  onClick={() => trackLead("whatsapp", { placement: "mobile_menu" })}
                >
                  <WaIcon /> WhatsApp
                </a>
                <a
                  href={BUSINESS_PHONE_LINK}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "14px 24px",
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 13,
                    color: "var(--text-muted)",
                    borderBottom: "1px solid var(--border-soft)",
                    textDecoration: "none",
                  }}
                  onClick={() => trackLead("call", { placement: "mobile_menu" })}
                >
                  ☎ Call Now
                </a>
                <a
                  href={MAP_URL}
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
                  onClick={() => trackLead("visit_map", { placement: "mobile_menu" })}
                >
                  📍 Visit Store
                </a>
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
                <Link
                  to="/admin"
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "14px 24px",
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 13,
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    textDecoration: "none",
                  }}
                >
                  Staff Login
                </Link>
              </>
            ) : (
              <Link
                to="/"
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
                  color: "var(--text-muted)",
                  textDecoration: "none",
                }}
              >
                ← Store
              </Link>
            )}
          </div>
        )}
      </header>
    </>
  );
}
