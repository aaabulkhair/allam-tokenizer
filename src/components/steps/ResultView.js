import { motion } from "framer-motion";
import { fertilityModels, benchmarks, gains } from "../../constants/data";
import useCountUp from "../../hooks/useCountUp";
import useMediaQuery from "../../hooks/useMediaQuery";
import ProgressBar from "../shared/ProgressBar";
import StreamingDemo from "../interactive/StreamingDemo";
import ContextWindowDemo from "../interactive/ContextWindowDemo";

function AnimatedScore({ score, color }) {
  const value = useCountUp(score, 1200);
  return (
    <span style={{ color, fontWeight: 700 }}>
      {Math.round(value)}%
    </span>
  );
}

function AnimatedFertility({ fertility, color }) {
  const value = useCountUp(fertility, 1000);
  return (
    <span style={{ color, fontSize: 12, fontWeight: 700 }}>
      {value.toFixed(1)} tokens/word
    </span>
  );
}

export default function ResultView() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <div>
      <p style={{ color: "#aaa", marginBottom: 28, lineHeight: 1.7, fontSize: 15 }}>
        After tokenizer expansion + continued pretraining on{" "}
        <span style={{ color: "#27AE60", fontWeight: 700 }}>1.2T mixed Arabic/English tokens</span>{" "}
        (following 4T English pretraining), ALLaM achieves drastically reduced Arabic fertility
        while retaining full English performance.
      </p>

      {/* Fertility comparison */}
      <div
        style={{
          background: "#0a1a0a",
          borderRadius: 12,
          border: "1px solid #27AE6044",
          padding: 24,
          marginBottom: 24,
        }}
      >
        <div style={{ color: "#27AE60", fontSize: 12, fontWeight: 700, marginBottom: 20 }}>
          ARABIC FERTILITY RATE COMPARISON (lower = better)
        </div>
        {fertilityModels.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            style={{ marginBottom: 16 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ color: "#aaa", fontSize: 11, whiteSpace: "pre" }}>{m.name}</span>
              <AnimatedFertility fertility={m.fertility} color={m.color} />
            </div>
            <ProgressBar value={m.bar} color={m.color} height={10} />
          </motion.div>
        ))}
        <div style={{ color: "#555", fontSize: 11, marginTop: 8 }}>
          Fertility of 1.0 = perfect (one word = one token). ALLaM gets close to the Arabic-only tokenizer while keeping English intact.
        </div>
        <div style={{ color: "#444", fontSize: 10, marginTop: 4, fontStyle: "italic" }}>
          * Approximate values based on reported fertility ratios in the ALLaM paper.
        </div>
      </div>

      {/* What you get */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
        <div style={{ background: "#111", borderRadius: 12, border: "1px solid #00C2A844", padding: 20 }}>
          <div style={{ color: "#00C2A8", fontSize: 12, fontWeight: 700, marginBottom: 14 }}>
            WHAT YOU GAIN
          </div>
          {gains.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              style={{ color: "#aaa", fontSize: 12, padding: "5px 0", borderBottom: "1px solid #1a1a1a", display: "flex", gap: 8 }}
            >
              <span style={{ color: "#27AE60" }}>✓</span> {s}
            </motion.div>
          ))}
        </div>
        <div style={{ background: "#111", borderRadius: 12, border: "1px solid #7B5EA744", padding: 20 }}>
          <div style={{ color: "#B89FD8", fontSize: 12, fontWeight: 700, marginBottom: 14 }}>
            ALLAM BENCHMARKS AFTER THIS METHOD
          </div>
          {benchmarks.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              style={{ marginBottom: 12 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, color: "#888", fontSize: 11 }}>
                <span>{b.name} ({b.value})</span>
                <AnimatedScore score={b.score} color="#B89FD8" />
              </div>
              <ProgressBar value={b.score} color="#7B5EA7" height={5} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Interactive demos */}
      <div style={{ marginTop: 24 }}>
        <StreamingDemo />
        <ContextWindowDemo />
      </div>
    </div>
  );
}
