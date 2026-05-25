export default function Toggle({ checked, onChange, label }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", userSelect: "none" }}>
      <div className="tog-wrap">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <div
          className="tog-track"
          style={{ background: checked ? "var(--pink)" : "var(--bg-mid)", borderColor: checked ? "var(--pink)" : "var(--border)" }}
        />
        <div className="tog-thumb" style={{ left: checked ? 21 : 3, background: checked ? "#fff" : "var(--text-muted)" }} />
      </div>
      {label && <span style={{ fontSize: 13, color: "var(--text-mid)" }}>{label}</span>}
    </label>
  );
}
