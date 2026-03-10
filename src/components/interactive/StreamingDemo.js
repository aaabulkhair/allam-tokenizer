import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { streamingSentence } from "../../constants/data";

export default function StreamingDemo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [llamaIdx, setLlamaIdx] = useState(0);
  const [allamIdx, setAllamIdx] = useState(0);
  const llamaTimerRef = useRef(null);
  const allamTimerRef = useRef(null);

  const { llamaTokens, allamTokens, meaning } = streamingSentence;

  useEffect(() => {
    if (!isPlaying) {
      clearInterval(llamaTimerRef.current);
      clearInterval(allamTimerRef.current);
      return;
    }

    // Llama-2: slow character-by-character (80ms per char token)
    llamaTimerRef.current = setInterval(() => {
      setLlamaIdx((prev) => {
        if (prev >= llamaTokens.length) {
          clearInterval(llamaTimerRef.current);
          return prev;
        }
        return prev + 1;
      });
    }, 80);

    // ALLaM: fast word-by-word (250ms per word token)
    allamTimerRef.current = setInterval(() => {
      setAllamIdx((prev) => {
        if (prev >= allamTokens.length) {
          clearInterval(allamTimerRef.current);
          return prev;
        }
        return prev + 1;
      });
    }, 250);

    return () => {
      clearInterval(llamaTimerRef.current);
      clearInterval(allamTimerRef.current);
    };
  }, [isPlaying, llamaTokens.length, allamTokens.length]);

  const reset = () => {
    setIsPlaying(false);
    setLlamaIdx(0);
    setAllamIdx(0);
  };

  const llamaDone = llamaIdx >= llamaTokens.length;
  const allamDone = allamIdx >= allamTokens.length;

  // Build visible text from tokens
  const llamaText = llamaTokens.slice(0, llamaIdx).join("");
  const allamText = allamTokens.slice(0, allamIdx).join("");

  return (
    <div
      style={{
        background: "#0d0f1a",
        borderRadius: 12,
        border: "1px solid #27AE6033",
        padding: 20,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ color: "#27AE60", fontSize: 12, fontWeight: 700 }}>
          GENERATION SPEED COMPARISON
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => {
              if (llamaDone && allamDone) reset();
              setIsPlaying(!isPlaying);
            }}
            style={{
              padding: "4px 12px",
              borderRadius: 4,
              border: "1px solid #27AE60",
              background: isPlaying ? "#27AE6033" : "transparent",
              color: "#27AE60",
              fontSize: 11,
              cursor: "pointer",
              fontFamily: "'IBM Plex Mono', monospace",
            }}
          >
            {isPlaying ? "⏸ Pause" : "▶ Play"}
          </button>
          <button
            onClick={reset}
            style={{
              padding: "4px 12px",
              borderRadius: 4,
              border: "1px solid #333",
              background: "transparent",
              color: "#666",
              fontSize: 11,
              cursor: "pointer",
              fontFamily: "'IBM Plex Mono', monospace",
            }}
          >
            ↺ Reset
          </button>
        </div>
      </div>

      <div style={{ color: "#555", fontSize: 11, marginBottom: 16 }}>
        Generating: "{meaning}"
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Llama-2 side */}
        <div style={{ background: "#1a0a0a", borderRadius: 8, padding: 14, border: "1px solid #FF4B4B22", minHeight: 120 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: "#FF4B4B", fontSize: 11, fontWeight: 700 }}>LLAMA-2</span>
            <span style={{ color: "#555", fontSize: 10 }}>{llamaIdx}/{llamaTokens.length} tokens</span>
          </div>

          {/* Arabic text building up character by character */}
          <div
            lang="ar"
            style={{
              direction: "rtl",
              fontSize: 18,
              fontFamily: "serif",
              color: "#FF8C8C",
              minHeight: 48,
              padding: "8px 0",
              lineHeight: 1.6,
            }}
          >
            {llamaText}
            {!llamaDone && isPlaying && (
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                style={{ color: "#FF4B4B" }}
              >
                ▊
              </motion.span>
            )}
          </div>

          {/* Character token chips */}
          <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginTop: 8, direction: "rtl", justifyContent: "flex-end" }}>
            {llamaTokens.slice(0, llamaIdx).filter(t => t !== " ").map((t, i) => (
              <span
                key={i}
                style={{
                  fontSize: 11,
                  color: "#FF4B4B88",
                  padding: "1px 4px",
                  background: "#FF4B4B11",
                  borderRadius: 2,
                  fontFamily: "serif",
                }}
              >
                {t}
              </span>
            ))}
          </div>

          {llamaDone && (
            <div style={{ marginTop: 8, color: "#FF4B4B", fontSize: 10 }}>
              ✓ Done — {llamaTokens.length} tokens (1 per character)
            </div>
          )}
        </div>

        {/* ALLaM side */}
        <div style={{ background: "#0a1a0e", borderRadius: 8, padding: 14, border: "1px solid #27AE6022", minHeight: 120 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: "#27AE60", fontSize: 11, fontWeight: 700 }}>ALLaM</span>
            <span style={{ color: "#555", fontSize: 10 }}>{allamIdx}/{allamTokens.length} tokens</span>
          </div>

          {/* Arabic text building up word by word */}
          <div
            lang="ar"
            style={{
              direction: "rtl",
              fontSize: 18,
              fontFamily: "serif",
              color: "#6FCF97",
              minHeight: 48,
              padding: "8px 0",
              lineHeight: 1.6,
            }}
          >
            {allamText}
            {!allamDone && isPlaying && (
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                style={{ color: "#27AE60" }}
              >
                ▊
              </motion.span>
            )}
          </div>

          {/* Word token chips */}
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", direction: "rtl", justifyContent: "flex-end", marginTop: 8 }}>
            {allamTokens.slice(0, allamIdx).filter(t => t.trim()).map((t, i) => (
              <span
                key={i}
                style={{
                  fontSize: 12,
                  color: "#6FCF97",
                  padding: "2px 6px",
                  background: "#27AE6011",
                  borderRadius: 3,
                  fontFamily: "serif",
                }}
              >
                {t}
              </span>
            ))}
          </div>

          {allamDone && (
            <div style={{ marginTop: 8, color: "#27AE60", fontSize: 10 }}>
              ✓ Done — {allamTokens.length} tokens (1 per word)
            </div>
          )}
        </div>
      </div>

      <div style={{ color: "#444", fontSize: 10, marginTop: 10, fontStyle: "italic" }}>
        * Llama-2 actually uses byte-level tokens (2 bytes per character), making it even slower than shown.
        This demo uses character-level for readability.
      </div>
    </div>
  );
}
