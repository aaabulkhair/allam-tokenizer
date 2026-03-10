export default function TokenChip({ text, color, size = "md" }) {
  const sizes = {
    sm: { fontSize: 11, padding: "3px 8px" },
    md: { fontSize: 16, padding: "6px 10px" },
    lg: { fontSize: 22, padding: "10px 18px" },
  };

  const s = sizes[size] || sizes.md;
  const isArabic = /[\u0600-\u06FF]/.test(text);

  return (
    <div
      style={{
        background: `${color}22`,
        border: `1px solid ${color}`,
        borderRadius: 6,
        padding: s.padding,
        color: color,
        fontSize: s.fontSize,
        fontFamily: "serif",
        direction: isArabic ? "rtl" : "ltr",
        display: "inline-block",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
}
