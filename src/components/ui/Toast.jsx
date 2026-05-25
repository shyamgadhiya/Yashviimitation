export default function Toast({ toast }) {
  if (!toast) return null;

  const bg =
    toast.type === "error"
      ? "#fef2f2"
      : toast.type === "info"
        ? "var(--bg-mid)"
        : "var(--pink)";
  const tc =
    toast.type === "error" ? "#b91c1c" : toast.type === "info" ? "var(--text-mid)" : "#fff";
  const bc =
    toast.type === "error"
      ? "#fecaca"
      : toast.type === "info"
        ? "var(--border)"
        : "var(--pink-light)";

  return (
    <div
      style={{
        position: "fixed",
        bottom: 84,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 600,
        background: bg,
        color: tc,
        border: `1px solid ${bc}`,
        padding: "10px 22px",
        borderRadius: 999,
        fontSize: 13,
        fontFamily: "'DM Sans',sans-serif",
        fontWeight: 500,
        boxShadow: "0 4px 20px rgba(0,0,0,.12)",
        whiteSpace: "nowrap",
        animation: "fadeUp .3s ease both",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      {toast.type === "error" ? "✕" : toast.type === "info" ? "ℹ" : "✓"} {toast.msg}
    </div>
  );
}
