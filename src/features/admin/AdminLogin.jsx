import { useEffect, useState } from "react";
import Spinner from "../../components/ui/Spinner.jsx";
import { LOGO } from "../../lib/config.js";
import { getErrorMessage, SAVED_ADMIN_EMAIL_KEY } from "../../lib/supabase/admin.js";
import { db } from "../../lib/supabase/client.js";

export default function AdminLogin({ session, authError, onLogout }) {
  const [email, setEmail] = useState(() => session?.user?.email || localStorage.getItem(SAVED_ADMIN_EMAIL_KEY) || "");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [vis, setVis] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (session?.user?.email) setEmail(session.user.email);
  }, [session?.user?.email]);

  useEffect(() => {
    setErr(authError || "");
  }, [authError]);

  const emailInp = {
    background: "var(--bg-soft)",
    border: "1px solid var(--border)",
    color: "var(--text)",
    fontSize: 14,
    padding: "12px 14px",
    fontFamily: "'DM Sans',sans-serif",
    width: "100%",
    borderRadius: 8,
    transition: "border .2s",
    display: "block",
    boxSizing: "border-box",
  };
  const pwInp = { ...emailInp, padding: "12px 44px 12px 14px" };

  const login = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !pw) {
      setErr("Enter your admin email and password.");
      return;
    }

    setSaving(true);
    setErr("");
    const { error } = await db.auth.signInWithPassword({ email: cleanEmail, password: pw });
    if (error) {
      setErr(getErrorMessage(error, "Sign in failed."));
      setPw("");
      setSaving(false);
      return;
    }

    localStorage.setItem(SAVED_ADMIN_EMAIL_KEY, cleanEmail);
    setPw("");
    setSaving(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 380, animation: "fadeUp .45s ease both" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 32 }}>
          <img src={LOGO} alt="Logo" style={{ width: 72, height: 72, objectFit: "contain", marginBottom: 16 }} />
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, color: "var(--text)", marginBottom: 4 }}>Admin Access</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", fontFamily: "'DM Sans',sans-serif" }}>Yashvi Imitation — Staff Only</p>
        </div>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: 32, boxShadow: "var(--shadow)" }}>
          {err && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", fontSize: 13, padding: "10px 14px", borderRadius: 6, marginBottom: 16, fontFamily: "'DM Sans',sans-serif" }}>{err}</div>}
          {session ? (
            <>
              <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6, fontFamily: "'DM Sans',sans-serif", marginBottom: 18 }}>
                Signed in as <span style={{ color: "var(--text)" }}>{session.user.email || "an authenticated user"}</span>, but this account is not approved for admin access.
              </p>
              <button onClick={onLogout} className="btn-outline" style={{ width: "100%", padding: 13, fontSize: 13, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", borderRadius: 8 }}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <label style={{ display: "block", fontSize: 10, letterSpacing: ".12em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>Admin Email</label>
              <div style={{ marginBottom: 16 }}>
                <input className="fi" type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && login()} placeholder="owner@example.com" style={emailInp} />
              </div>
              <label style={{ display: "block", fontSize: 10, letterSpacing: ".12em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>Password</label>
              <div style={{ position: "relative", marginBottom: 20 }}>
                <input className="fi" type={vis ? "text" : "password"} value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && login()} placeholder="Enter admin password" style={pwInp} />
                <button onClick={() => setVis((value) => !value)} type="button" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "var(--text-muted)" }}>
                  {vis ? "🙈" : "👁"}
                </button>
              </div>
              <button onClick={login} disabled={saving} className="btn-primary" style={{ width: "100%", padding: 13, fontSize: 13, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: saving ? 0.6 : 1 }}>
                {saving && <Spinner sm />}
                {saving ? "Signing In…" : "Enter Admin Panel"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
