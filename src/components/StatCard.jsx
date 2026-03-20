export function StatCard({ label, value }) {
  return (
    <div style={{ flex: 1, background: "#F8F8FC", borderRadius: 12, padding: "10px 14px" }}>
      <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0, letterSpacing: 0.5, textTransform: "uppercase" }}>
        {label}
      </p>
      <p style={{ fontSize: 14, fontWeight: 700, color: "#3D3D50", margin: "3px 0 0" }}>
        {value}
      </p>
    </div>
  );
}
