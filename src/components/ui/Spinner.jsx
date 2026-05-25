export default function Spinner({ sm }) {
  const size = sm ? { width: 15, height: 15, borderWidth: 2 } : { width: 38, height: 38, borderWidth: 2 };

  return (
    <div
      style={{
        ...size,
        borderRadius: "50%",
        borderStyle: "solid",
        borderColor: "var(--border)",
        borderTopColor: "var(--pink)",
        animation: "spin .8s linear infinite",
        display: "inline-block",
      }}
    />
  );
}
