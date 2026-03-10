export default function ProgressBar({ value, color, height = 10, animated = true }) {
  return (
    <div
      style={{
        height,
        background: "#111",
        borderRadius: height / 2,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${value}%`,
          height: "100%",
          background: color,
          borderRadius: height / 2,
          transition: animated ? "width 1s ease" : "none",
        }}
      />
    </div>
  );
}
