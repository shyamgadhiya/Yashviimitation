import { IG, LOGO, MAP_URL, WA } from "../../lib/config.js";
import { IgIcon, WaIcon } from "../icons/index.jsx";

export default function Footer() {
  return (
    <footer style={{ background: "var(--bg-soft)", borderTop: "1px solid var(--border)", padding: "48px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <img src={LOGO} alt="Yashvi Imitation" style={{ width: 56, height: 56, objectFit: "contain", opacity: 0.9 }} />
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: "var(--text)", marginBottom: 4 }}>Yashvi Imitation</p>
          <p style={{ fontSize: 10, letterSpacing: ".18em", color: "var(--pink)", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>
            House of Antique Jewellery
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
          <a
            href={`https://wa.me/${WA}`}
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
            <WaIcon />+91 93285 82543
          </a>
          <span style={{ color: "var(--border)", fontSize: 18 }}>·</span>
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
          <span style={{ color: "var(--border)", fontSize: 18 }}>·</span>
          <a
            href={MAP_URL}
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
            📍 10, Akshardham Society, Mota Varachha, Surat, Gujarat 394101
          </a>
        </div>
        <p style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "'DM Sans',sans-serif" }}>© 2025 Yashvi Imitation. All rights reserved.</p>
      </div>
    </footer>
  );
}
