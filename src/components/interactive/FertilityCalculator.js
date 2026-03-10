import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import TokenChip from "../shared/TokenChip";

// Split text into individual characters (simulating Llama-2's per-character tokenization for Arabic)
function charTokenize(text) {
  return [...text].filter((c) => c.trim());
}

// Simple heuristic: Arabic words are usually 1-2 tokens with a good tokenizer
function simulateArabicTokenizer(text) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const tokens = [];
  for (const word of words) {
    if (/[\u0600-\u06FF]/.test(word)) {
      // Arabic word: most common words = 1 token, longer/rarer = 2
      if (word.length <= 6) {
        tokens.push(word);
      } else {
        // Split into 2 subwords
        const mid = Math.ceil(word.length / 2);
        tokens.push(word.slice(0, mid));
        tokens.push(word.slice(mid));
      }
    } else {
      tokens.push(word);
    }
    tokens.push(" ");
  }
  if (tokens.length > 0 && tokens[tokens.length - 1] === " ") tokens.pop();
  return tokens.filter((t) => t.trim());
}

export default function FertilityCalculator() {
  const [input, setInput] = useState("المكتبة العربية");

  const llamaTokens = useMemo(() => {
    if (!input.trim()) return [];
    return charTokenize(input);
  }, [input]);

  const arabicTokens = useMemo(() => {
    if (!input.trim()) return [];
    return simulateArabicTokenizer(input);
  }, [input]);

  const wordCount = input.trim().split(/\s+/).filter(Boolean).length || 1;
  // Real fertility uses byte count (each Arabic char = 2 UTF-8 bytes)
  const byteCount = new TextEncoder().encode(input.trim()).length;
  const llamaFertility = byteCount / wordCount;
  const arabicFertility = arabicTokens.length / wordCount;

  return (
    <div
      style={{
        background: "#0d0f1a",
        borderRadius: 12,
        border: "1px solid #FF4B4B33",
        padding: 20,
        marginTop: 20,
      }}
    >
      <div style={{ color: "#FF4B4B", fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
        TRY IT: FERTILITY CALCULATOR
      </div>
      <div style={{ color: "#666", fontSize: 11, marginBottom: 12 }}>
        Type Arabic text to see how each tokenizer would handle it:
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        dir="rtl"
        placeholder="اكتب نصاً عربياً..."
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: 8,
          border: "1px solid #333",
          background: "#0a0a0a",
          color: "#fff",
          fontSize: 18,
          fontFamily: "serif",
          outline: "none",
          marginBottom: 20,
        }}
      />

      {input.trim() && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Llama-2 */}
          <motion.div
            key={`calc-llama-${input}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ background: "#1a0a0a", borderRadius: 8, padding: 14, border: "1px solid #FF4B4B33" }}
          >
            <div style={{ color: "#FF4B4B", fontSize: 11, fontWeight: 700, marginBottom: 10 }}>
              LLAMA-2: {llamaTokens.length} chars ({byteCount} byte tokens)
            </div>
            <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginBottom: 8, direction: "rtl", justifyContent: "flex-end" }}>
              {llamaTokens.slice(0, 40).map((t, i) => (
                <TokenChip key={i} text={t} color="#FF8C8C" size="sm" />
              ))}
              {llamaTokens.length > 40 && (
                <span style={{ color: "#555", fontSize: 10 }}>+{llamaTokens.length - 40} more...</span>
              )}
            </div>
            <div style={{ color: "#FF4B4B", fontSize: 12, fontWeight: 700 }}>
              Fertility: {llamaFertility.toFixed(1)}
            </div>
          </motion.div>

          {/* Arabic tokenizer */}
          <motion.div
            key={`calc-arabic-${input}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ background: "#0a1a0e", borderRadius: 8, padding: 14, border: "1px solid #27AE6033" }}
          >
            <div style={{ color: "#27AE60", fontSize: 11, fontWeight: 700, marginBottom: 10 }}>
              ARABIC TOKENIZER: {arabicTokens.length} tokens
            </div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", direction: "rtl", justifyContent: "flex-end", marginBottom: 8 }}>
              {arabicTokens.map((t, i) => (
                <TokenChip key={i} text={t} color="#6FCF97" size="sm" />
              ))}
            </div>
            <div style={{ color: "#27AE60", fontSize: 12, fontWeight: 700 }}>
              Fertility: {arabicFertility.toFixed(1)}
            </div>
          </motion.div>
        </div>
      )}

      <div style={{ color: "#444", fontSize: 10, marginTop: 10, fontStyle: "italic" }}>
        * Llama-2 actually produces ~2 byte tokens per Arabic character. Showing characters for readability. Arabic tokenizer is simulated.
      </div>
    </div>
  );
}
