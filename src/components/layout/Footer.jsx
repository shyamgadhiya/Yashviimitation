import { Link } from "react-router-dom";
import { IG, LOGO, MAP_URL } from "../../lib/config.js";
import { IgIcon, WaIcon } from "../icons/index.jsx";
import { trackLead } from "../../lib/analytics.js";
import { BUSINESS_ADDRESS, BUSINESS_CITY, BUSINESS_PHONE_DISPLAY, BUSINESS_PHONE_LINK, BUSINESS_WHATSAPP_LINK } from "../../lib/site.js";

export default function Footer() {
  return (
    <footer style={{ background: "var(--bg-soft)", borderTop: "1px solid var(--border)", padding: "48px 24px 88px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1.1fr) minmax(0,0.9fr)", gap: 24, alignItems: "start" }} className="footer-grid">
        <div>
          <img src={LOGO} alt="Yashvi Imitation" style={{ width: 56, height: 56, objectFit: "contain", opacity: 0.9, marginBottom: 16 }} />
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, color: "var(--text)", marginBottom: 4 }}>Yashvi Imitation</p>
            <p style={{ fontSize: 10, letterSpacing: ".18em", color: "var(--pink)", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", marginBottom: 10 }}>
              House of Antique Jewellery
            </p>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.75, maxWidth: 560 }}>
              Bridal, festive and daily wear imitation jewellery curated in {BUSINESS_CITY}. Visit our studio or enquire on WhatsApp for quick catalogue support and pan-India buying help.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <Link to="/collection" style={{ color: "var(--text-muted)", fontSize: 12 }}>Collection</Link>
            <Link to="/occasion/wedding" style={{ color: "var(--text-muted)", fontSize: 12 }}>Bridal Jewellery</Link>
            <Link to="/occasion/festive" style={{ color: "var(--text-muted)", fontSize: 12 }}>Festive Jewellery</Link>
            <Link to="/occasion/daily" style={{ color: "var(--text-muted)", fontSize: 12 }}>Daily Wear</Link>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <a
            href={BUSINESS_WHATSAPP_LINK}
            target="_blank"
            rel="noopener"
            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-muted)", fontFamily: "'DM Sans',sans-serif", transition: "color .18s" }}
            onClick={() => trackLead("whatsapp", { placement: "footer" })}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--pink)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-muted)";
            }}
          >
            <WaIcon /> WhatsApp: {BUSINESS_PHONE_DISPLAY}
          </a>
          <a href={BUSINESS_PHONE_LINK} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-muted)", fontFamily: "'DM Sans',sans-serif" }} onClick={() => trackLead("call", { placement: "footer" })}>
            ☎ Call: {BUSINESS_PHONE_DISPLAY}
          </a>
          <a
            href={IG}
            target="_blank"
            rel="noopener"
            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-muted)", fontFamily: "'DM Sans',sans-serif", transition: "color .18s" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--pink)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-muted)";
            }}
          >
            <IgIcon />@yashvi_imitation_
          </a>
          <a
            href={MAP_URL}
            target="_blank"
            rel="noopener"
            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-muted)", fontFamily: "'DM Sans',sans-serif", transition: "color .18s" }}
            onClick={() => trackLead("visit_map", { placement: "footer" })}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--pink)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-muted)";
            }}
          >
            📍 {BUSINESS_ADDRESS}
          </a>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", fontSize: 11, color: "var(--text-muted)" }}>
            <span>Visit in Surat or order across India</span>
            <Link to="/admin" style={{ color: "inherit" }}>Staff Login</Link>
          </div>
        </div>
      </div>
      <p style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "'DM Sans',sans-serif", textAlign: "center", marginTop: 24 }}>© 2025 Yashvi Imitation. All rights reserved.</p>
    </footer>
  );
}
