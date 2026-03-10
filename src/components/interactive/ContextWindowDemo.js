import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

function byteTokenCount(word) {
  return new TextEncoder().encode(word).length;
}

const WINDOW_SIZE = 64; // Visual slots (representing 4096 conceptually)
const WORDS = ["المكتبة", "العربية", "تحتوي", "على", "كتب", "كثيرة", "ومتنوعة", "في", "مختلف", "المجالات", "العلمية", "والأدبية"];

export default function ContextWindowDemo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [llamaSlots, setLlamaSlots] = useState(0);
  const [allamSlots, setAllamSlots] = useState(0);
  const [llamaWords, setLlamaWords] = useState(0);
  const [allamWords, setAllamWords] = useState(0);
  const timerRef = useRef(null);
  const wordIdxRef = useRef(0);

  useEffect(() => {
    if (!isPlaying) {
      clearInterval(timerRef.current);
      return;
    }

    wordIdxRef.current = 0;
    let lSlots = 0;
    let aSlots = 0;
    let wIdx = 0;

    timerRef.current = setInterval(() => {
      const word = WORDS[wIdx % WORDS.length];
      const byteCount = byteTokenCount(word);
      const arabicCount = word.length > 6 ? 2 : 1;

      lSlots += byteCount;
      aSlots += arabicCount;
      wIdx++;

      if (lSlots >= WINDOW_SIZE && aSlots >= WINDOW_SIZE) {
        clearInterval(timerRef.current);
        setIsPlaying(false);
      }

      setLlamaSlots(Math.min(lSlots, WINDOW_SIZE));
      setAllamSlots(Math.min(aSlots, WINDOW_SIZE));
      setLlamaWords((prev) => lSlots < WINDOW_SIZE ? wIdx : prev);
      setAllamWords((prev) => aSlots < WINDOW_SIZE ? wIdx : prev);
    }, 300);

    return () => clearInterval(timerRef.current);
  }, [isPlaying]);

  const reset = () => {
    setIsPlaying(false);
    setLlamaSlots(0);
    setAllamSlots(0);
    setLlamaWords(0);
    setAllamWords(0);
  };

  const llamaFull = llamaSlots >= WINDOW_SIZE;
  const allamFull = allamSlots >= WINDOW_SIZE;

  return (
    <div
      style={{
        background: "#0d0f1a",
        borderRadius: 12,
        border: "1px solid #00C2A833",
        padding: 20,
        marginTop: 20,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ color: "#00C2A8", fontSize: 12, fontWeight: 700 }}>
          CONTEXT WINDOW USAGE
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => {
              if (llamaFull && allamFull) reset();
              setIsPlaying(!isPlaying);
            }}
            style={{
              padding: "4px 12px",
              borderRadius: 4,
              border: "1px solid #00C2A8",
              background: isPlaying ? "#00C2A833" : "transparent",
              color: "#00C2A8",
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
        Watch a 4096-token context window fill up as Arabic words are added:
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Llama-2 window */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ color: "#FF4B4B", fontSize: 11, fontWeight: 700 }}>LLAMA-2</span>
            <span style={{ color: "#555", fontSize: 10 }}>
              {llamaFull ? "FULL" : `${Math.round((llamaSlots / WINDOW_SIZE) * 100)}%`}
            </span>
          </div>
          <div
            style={{
              height: 24,
              background: "#111",
              borderRadius: 4,
              overflow: "hidden",
              border: llamaFull ? "1px solid #FF4B4B" : "1px solid #222",
            }}
          >
            <motion.div
              animate={{ width: `${(llamaSlots / WINDOW_SIZE) * 100}%` }}
              transition={{ duration: 0.2 }}
              style={{
                height: "100%",
                background: llamaFull ? "#FF4B4B" : "#FF4B4B88",
                borderRadius: 4,
              }}
            />
          </div>
          <div style={{ color: "#666", fontSize: 10, marginTop: 4 }}>
            ~{llamaWords} words fit ({llamaSlots} tokens used)
          </div>
        </div>

        {/* ALLaM window */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ color: "#27AE60", fontSize: 11, fontWeight: 700 }}>ALLaM</span>
            <span style={{ color: "#555", fontSize: 10 }}>
              {allamFull ? "FULL" : `${Math.round((allamSlots / WINDOW_SIZE) * 100)}%`}
            </span>
          </div>
          <div
            style={{
              height: 24,
              background: "#111",
              borderRadius: 4,
              overflow: "hidden",
              border: allamFull ? "1px solid #27AE60" : "1px solid #222",
            }}
          >
            <motion.div
              animate={{ width: `${(allamSlots / WINDOW_SIZE) * 100}%` }}
              transition={{ duration: 0.2 }}
              style={{
                height: "100%",
                background: allamFull ? "#27AE60" : "#27AE6088",
                borderRadius: 4,
              }}
            />
          </div>
          <div style={{ color: "#666", fontSize: 10, marginTop: 4 }}>
            ~{allamWords} words fit ({allamSlots} tokens used)
          </div>
        </div>
      </div>

      {llamaFull && !allamFull && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ marginTop: 12, color: "#00C2A8", fontSize: 11, textAlign: "center" }}
        >
          Llama-2's window is full, but ALLaM still has room for more Arabic text!
        </motion.div>
      )}
    </div>
  );
}
