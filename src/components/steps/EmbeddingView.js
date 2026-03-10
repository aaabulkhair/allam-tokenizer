import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sampleEmbeddings } from "../../constants/data";
import TokenChip from "../shared/TokenChip";

export default function EmbeddingView() {
  const [method, setMethod] = useState("smart");
  const { components, baseVector, averagedVector, embeddingDim } = sampleEmbeddings;

  return (
    <div>
      <p style={{ color: "#aaa", marginBottom: 28, lineHeight: 1.7, fontSize: 15 }}>
        This is the most technically novel part. Every new Arabic token added to the vocabulary has{" "}
        <span style={{ color: "#7B5EA7", fontWeight: 700 }}>no embedding vector</span> — it's never
        been seen by the model. We need to initialize these new embedding rows in the embedding matrix.
        ALLaM tested two approaches.
      </p>

      {/* Toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {[
          { id: "random", label: "❌ Random Init (naive)" },
          { id: "smart", label: "✅ Smart Init (ALLaM's method)" },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setMethod(m.id)}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: `1px solid ${method === m.id ? "#7B5EA7" : "#333"}`,
              background: method === m.id ? "#7B5EA718" : "transparent",
              color: method === m.id ? "#B89FD8" : "#666",
              fontSize: 12,
              cursor: "pointer",
              fontFamily: "'IBM Plex Mono', monospace",
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {method === "random" ? (
          <motion.div
            key="random"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
          >
            <RandomInit embeddingDim={embeddingDim} />
          </motion.div>
        ) : (
          <motion.div
            key="smart"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
          >
            <SmartInit
              components={components}
              baseVector={baseVector}
              averagedVector={averagedVector}
              embeddingDim={embeddingDim}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison chart */}
      <div style={{ background: "#111", borderRadius: 10, border: "1px solid #333", padding: 18, marginTop: 20 }}>
        <div style={{ color: "#888", fontSize: 12, fontWeight: 700, marginBottom: 14 }}>
          LEARNING SPEED COMPARISON (Arabic MMLU accuracy over training tokens):
        </div>
        <div style={{ position: "relative", height: 80 }}>
          <svg width="100%" height="80" style={{ position: "absolute", top: 0 }}>
            <polyline
              points="0,70 50,55 100,40 150,28 200,20 250,15 300,12 350,10"
              fill="none"
              stroke="#7B5EA7"
              strokeWidth="2"
            />
            <polyline
              points="0,70 50,65 100,60 150,52 200,45 250,40 300,36 350,33"
              fill="none"
              stroke="#FF4B4B"
              strokeWidth="2"
              strokeDasharray="5,3"
            />
          </svg>
          <div style={{ position: "absolute", top: 4, right: 0, color: "#7B5EA7", fontSize: 10 }}>
            Smart Init
          </div>
          <div style={{ position: "absolute", top: 28, right: 0, color: "#FF4B4B", fontSize: 10 }}>
            Random Init
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", color: "#444", fontSize: 10, marginTop: 4 }}>
          <span>0B tokens</span>
          <span>→ Training progress →</span>
          <span>20B tokens</span>
        </div>
      </div>
    </div>
  );
}

function RandomInit({ embeddingDim }) {
  // Use fixed random values so they don't change on re-render
  const randomValues = useState(() =>
    Array.from({ length: 12 }, (_, i) => ((Math.sin(i * 7.3 + 1.5) + 1) - 1).toFixed(2))
  )[0];

  return (
    <div
      style={{
        background: "#1a0a0a",
        borderRadius: 12,
        border: "1px solid #FF4B4B44",
        padding: 24,
        marginBottom: 20,
      }}
    >
      <div style={{ color: "#FF4B4B", fontSize: 12, fontWeight: 700, marginBottom: 16 }}>
        RANDOM INITIALIZATION
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 60px 1fr", gap: 8, alignItems: "center" }}>
        <div>
          <div style={{ color: "#666", fontSize: 11, marginBottom: 8 }}>New token:</div>
          <div style={{ textAlign: "center" }}>
            <TokenChip text="مكتبة" color="#FF8C8C" size="lg" />
          </div>
        </div>
        <div style={{ textAlign: "center", color: "#555" }}>→</div>
        <div>
          <div style={{ color: "#666", fontSize: 11, marginBottom: 8 }}>Embedding vector:</div>
          <div style={{ background: "#1a1a1a", borderRadius: 8, padding: 12, display: "flex", gap: 4, flexWrap: "wrap" }}>
            {randomValues.map((v, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                style={{ color: "#FF4B4B66", fontSize: 10, padding: "2px 4px", background: "#FF4B4B11", borderRadius: 3 }}
              >
                {v}
              </motion.span>
            ))}
            <span style={{ color: "#444", fontSize: 10 }}>... ({embeddingDim} dims)</span>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 16, padding: "10px 14px", background: "#FF4B4B11", borderRadius: 8, color: "#FF8C8C", fontSize: 12 }}>
        ⚠ Random noise. The model has no idea what this token means. It must learn everything
        from scratch through gradient descent — very slow convergence.
      </div>
    </div>
  );
}

function SmartInit({ components, baseVector, averagedVector, embeddingDim }) {
  return (
    <div
      style={{
        background: "#0d0a1a",
        borderRadius: 12,
        border: "1px solid #7B5EA7",
        padding: 24,
        marginBottom: 20,
      }}
    >
      <div style={{ color: "#B89FD8", fontSize: 12, fontWeight: 700, marginBottom: 16 }}>
        SMART INITIALIZATION — ALLAM'S METHOD
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ color: "#888", fontSize: 12, marginBottom: 12 }}>
          Key insight: The new Arabic token "مكتبة" can be broken down using the{" "}
          <em>original</em> Llama-2 tokenizer into smaller pieces it already knows:
        </div>

        {/* Decompose */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <TokenChip text="مكتبة" color="#B89FD8" size="lg" />
          </motion.div>
          <div style={{ color: "#555", fontSize: 18 }}>→</div>
          <div style={{ color: "#888", fontSize: 12 }}>Tokenize with Llama-2:</div>
          {components.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <TokenChip text={t} color="#8899ff" />
            </motion.div>
          ))}
        </div>

        {/* Average */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ color: "#555", fontSize: 12 }}>Each subtoken has an existing embedding:</div>
        </div>

        <div style={{ background: "#0a0a1a", borderRadius: 8, padding: 16, marginBottom: 16 }}>
          {components.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.12 }}
              style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}
            >
              <div style={{ width: 32, textAlign: "center", color: "#8899ff", fontSize: 16, fontFamily: "serif", direction: "rtl" }}>
                {t}
              </div>
              <div style={{ color: "#555", fontSize: 12 }}>→</div>
              <div style={{ display: "flex", gap: 3 }}>
                {baseVector.map((v, j) => (
                  <span
                    key={j}
                    style={{ color: "#6699ff88", fontSize: 10, padding: "2px 4px", background: "#4444ff11", borderRadius: 3 }}
                  >
                    {(v + i * 0.05).toFixed(2)}
                  </span>
                ))}
                <span style={{ color: "#333", fontSize: 10 }}>...</span>
              </div>
            </motion.div>
          ))}

          {/* Averaged result */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            style={{
              borderTop: "1px solid #333",
              marginTop: 10,
              paddingTop: 10,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div style={{ width: 32, color: "#B89FD8", fontSize: 11, textAlign: "center" }}>AVG</div>
            <div style={{ color: "#555", fontSize: 12 }}>→</div>
            <div style={{ display: "flex", gap: 3 }}>
              {averagedVector.map((v, j) => (
                <motion.span
                  key={j}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4 + j * 0.06 }}
                  style={{
                    color: "#B89FD8",
                    fontSize: 10,
                    padding: "2px 4px",
                    background: "#7B5EA722",
                    borderRadius: 3,
                    border: "1px solid #7B5EA744",
                  }}
                >
                  {v.toFixed(2)}
                </motion.span>
              ))}
              <span style={{ color: "#333", fontSize: 10 }}>...</span>
            </div>
            <div style={{ background: "#7B5EA722", borderRadius: 6, padding: "4px 10px", color: "#B89FD8", fontSize: 11, border: "1px solid #7B5EA744" }}>
              = embedding for مكتبة
            </div>
          </motion.div>
        </div>
      </div>

      <div style={{ padding: "10px 14px", background: "#27AE6011", borderRadius: 8, color: "#6FCF97", fontSize: 12, border: "1px solid #27AE6033" }}>
        ✓ The new token starts with a meaningful representation — a blend of its component parts.
        The model converges dramatically faster because it has a sensible starting point, not random noise.
      </div>
    </div>
  );
}
