import { useState } from "react";
import { motion } from "framer-motion";
import { problemExamples, consequences } from "../../constants/data";
import TokenChip from "../shared/TokenChip";
import ExpandableSection from "../shared/ExpandableSection";
import FertilityCalculator from "../interactive/FertilityCalculator";
import useMediaQuery from "../../hooks/useMediaQuery";

export default function ProblemView() {
  const [selectedIdx, setSelectedIdx] = useState(2); // مكتبة
  const example = problemExamples[selectedIdx];
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div>
      <p style={{ color: "#aaa", marginBottom: 32, lineHeight: 1.7, fontSize: 15 }}>
        Llama-2 was trained almost entirely on English text. Its vocabulary of
        ~32,000 tokens has very few Arabic subwords. When it encounters Arabic,
        it falls back to{" "}
        <span style={{ color: "#FF4B4B", fontWeight: 700 }}>
          UTF-8 byte-level encoding
        </span>{" "}
        — each Arabic character becomes 2 raw byte tokens. This is called{" "}
        <span style={{ color: "#FF4B4B", fontWeight: 700 }}>
          high fertility
        </span>
        : many tokens per word.
      </p>

      {/* Word selector */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {problemExamples.map((ex, i) => (
          <button
            key={i}
            onClick={() => setSelectedIdx(i)}
            style={{
              padding: "6px 14px",
              borderRadius: 6,
              border: `1px solid ${selectedIdx === i ? "#FF4B4B" : "#333"}`,
              background: selectedIdx === i ? "#FF4B4B22" : "transparent",
              color: selectedIdx === i ? "#FF8C8C" : "#666",
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "serif",
              direction: "rtl",
            }}
          >
            {ex.word} <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#555" }}>{ex.meaning}</span>
          </button>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? 16 : 24,
          marginBottom: 32,
        }}
      >
        {/* Llama-2 Bad */}
        <motion.div
          key={`llama-${selectedIdx}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: "#1a0a0a",
            border: "1px solid #FF4B4B44",
            borderRadius: 12,
            padding: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 20 }}>❌</span>
            <span style={{ color: "#FF4B4B", fontWeight: 700, fontSize: 13 }}>
              LLAMA-2 TOKENIZER
            </span>
          </div>
          <div lang="ar" style={{ textAlign: "center", fontSize: 32, color: "#fff", marginBottom: 8, direction: "rtl" }}>
            {example.word}
          </div>
          <div style={{ textAlign: "center", color: "#666", fontSize: 12, marginBottom: 20 }}>
            {example.meaning}
          </div>
          <div style={{ display: "flex", gap: 4, justifyContent: "center", flexWrap: "wrap", direction: "rtl" }}>
            {example.charTokens.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
              >
                <TokenChip text={t} color="#FF8C8C" size="sm" />
              </motion.div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 14, color: "#FF4B4B", fontWeight: 700, fontSize: 13 }}>
            {example.charTokens.length} characters = {example.byteTokens.length} byte tokens
          </div>
          <div style={{ textAlign: "center", color: "#666", fontSize: 11, marginTop: 4 }}>
            Fertility = {example.byteTokens.length.toFixed(1)} ← BAD
          </div>
        </motion.div>

        {/* Arabic Tokenizer Good */}
        <motion.div
          key={`arabic-${selectedIdx}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          style={{
            background: "#0a1a0e",
            border: "1px solid #27AE6044",
            borderRadius: 12,
            padding: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 20 }}>✅</span>
            <span style={{ color: "#27AE60", fontWeight: 700, fontSize: 13 }}>
              ARABIC TOKENIZER
            </span>
          </div>
          <div lang="ar" style={{ textAlign: "center", fontSize: 32, color: "#fff", marginBottom: 8, direction: "rtl" }}>
            {example.word}
          </div>
          <div style={{ textAlign: "center", color: "#666", fontSize: 12, marginBottom: 20 }}>
            {example.meaning}
          </div>
          <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap", direction: "rtl" }}>
            {example.arabicTokens.map((t, i) => (
              <TokenChip key={i} text={t} color="#6FCF97" />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 14, color: "#27AE60", fontWeight: 700, fontSize: 13 }}>
            {example.arabicTokens.length} token for 1 word
          </div>
          <div style={{ textAlign: "center", color: "#666", fontSize: 11, marginTop: 4 }}>
            Fertility = {example.arabicTokens.length.toFixed(1)} ← IDEAL
          </div>
        </motion.div>
      </div>

      {/* Byte explanation */}
      <ExpandableSection title="Why bytes? Understanding UTF-8 byte-fallback" color="#FF4B4B">
        <div style={{ color: "#aaa", fontSize: 12, lineHeight: 1.8 }}>
          <p style={{ margin: "0 0 8px" }}>
            Llama-2's tokenizer uses <strong style={{ color: "#FF8C8C" }}>SentencePiece with byte-fallback</strong>.
            When it encounters a character not in its vocabulary, it encodes it as raw UTF-8 bytes.
          </p>
          <p style={{ margin: "0 0 8px" }}>
            Each Arabic character takes <strong style={{ color: "#FF8C8C" }}>2 bytes</strong> in UTF-8
            (range 0x0600–0x06FF). So "مكتبة" (5 characters) becomes{" "}
            <strong style={{ color: "#FF8C8C" }}>10 byte tokens</strong> internally.
          </p>
          <p style={{ margin: 0 }}>
            The model sees each character split into 2 meaningless pieces —
            it has no linguistic structure to learn from, making Arabic extremely inefficient.
          </p>
        </div>
      </ExpandableSection>

      {/* Interactive fertility calculator */}
      <FertilityCalculator />

      {/* Consequences */}
      <div
        style={{
          background: "#111",
          borderRadius: 12,
          border: "1px solid #333",
          padding: 20,
          marginTop: 20,
        }}
      >
        <div style={{ color: "#FF4B4B", fontWeight: 700, fontSize: 12, marginBottom: 12 }}>
          WHY HIGH FERTILITY IS CATASTROPHIC
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 12 }}>
          {consequences.map((item, i) => (
            <div
              key={i}
              style={{
                background: "#1a1a1a",
                borderRadius: 8,
                padding: 14,
                border: "1px solid #222",
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 8 }}>{item.icon}</div>
              <div style={{ color: "#fff", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
                {item.label}
              </div>
              <div style={{ color: "#666", fontSize: 11, lineHeight: 1.5 }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
