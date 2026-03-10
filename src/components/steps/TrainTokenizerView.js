import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { bpeStages, trainingDataSources, trainingDataStats, tokenizerResults } from "../../constants/data";
import TokenChip from "../shared/TokenChip";
import ExpandableSection from "../shared/ExpandableSection";

export default function TrainTokenizerView() {
  const [stage, setStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setStage((prev) => {
          if (prev >= bpeStages.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying]);

  const currentStage = bpeStages[stage];

  return (
    <div>
      <p style={{ color: "#aaa", marginBottom: 28, lineHeight: 1.7, fontSize: 15 }}>
        A BPE (Byte Pair Encoding) tokenizer is trained from scratch on a large
        Arabic corpus. It iteratively merges the most frequent character pairs
        into new tokens. The result: a vocabulary where Arabic words are
        represented as single or double tokens instead of individual letters.
      </p>

      {/* BPE animation */}
      <div
        style={{
          background: "#0d0f1a",
          borderRadius: 12,
          border: "1px solid #F7931E33",
          padding: 24,
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ color: "#F7931E", fontWeight: 700, fontSize: 12 }}>
            BPE TRAINING PROCESS
          </div>
          <button
            onClick={() => {
              if (isPlaying) {
                setIsPlaying(false);
              } else {
                if (stage >= bpeStages.length - 1) setStage(0);
                setIsPlaying(true);
              }
            }}
            style={{
              padding: "4px 12px",
              borderRadius: 4,
              border: "1px solid #F7931E",
              background: isPlaying ? "#F7931E33" : "transparent",
              color: "#F7931E",
              fontSize: 11,
              cursor: "pointer",
              fontFamily: "'IBM Plex Mono', monospace",
            }}
          >
            {isPlaying ? "⏸ Pause" : "▶ Play"}
          </button>
        </div>

        {/* Stage selector */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {bpeStages.map((s, i) => (
            <button
              key={i}
              onClick={() => { setStage(i); setIsPlaying(false); }}
              style={{
                padding: "6px 14px",
                borderRadius: 6,
                border: `1px solid ${stage === i ? "#F7931E" : "#333"}`,
                background: stage === i ? "#F7931E22" : "transparent",
                color: stage === i ? "#F7931E" : "#666",
                fontSize: 11,
                cursor: "pointer",
                fontFamily: "'IBM Plex Mono', monospace",
                transition: "all 0.2s",
              }}
            >
              Iter {i + 1}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ color: "#fff", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
            {currentStage.label}
          </div>
          <div style={{ color: "#888", fontSize: 12, marginBottom: 14 }}>
            {currentStage.desc}
          </div>

          {/* Animated tokens */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", direction: "rtl", justifyContent: "flex-end", minHeight: 44 }}>
            <AnimatePresence mode="popLayout">
              {currentStage.tokens.map((t, i) => (
                <motion.div
                  key={`${stage}-${t}-${i}`}
                  layout
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25, delay: i * 0.05 }}
                >
                  <TokenChip text={t} color="#FFBA6B" size="md" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Merge frequency info */}
          {currentStage.mergeInfo && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: 16,
                background: "#0a0a0a",
                borderRadius: 8,
                padding: 12,
                border: "1px solid #222",
              }}
            >
              <div style={{ color: "#666", fontSize: 10, marginBottom: 8 }}>MERGES IN THIS ITERATION:</div>
              {currentStage.mergeInfo.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: "1px solid #1a1a1a" }}>
                  <span style={{ color: "#FFBA6B", fontSize: 12, fontFamily: "serif", direction: "rtl" }}>{m.pair}</span>
                  <span style={{ color: "#555", fontSize: 11 }}>{m.freq} occurrences</span>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 16, height: 4, background: "#1a1a1a", borderRadius: 2, overflow: "hidden" }}>
          <motion.div
            animate={{ width: `${((stage + 1) / bpeStages.length) * 100}%` }}
            transition={{ duration: 0.4 }}
            style={{ height: "100%", background: "#F7931E", borderRadius: 2 }}
          />
        </div>
        <div style={{ color: "#555", fontSize: 11, marginTop: 6 }}>
          Vocabulary quality: {((stage + 1) / bpeStages.length) * 100}% of training
        </div>
      </div>

      {/* What you get */}
      <div style={{ background: "#111", borderRadius: 12, border: "1px solid #333", padding: 20 }}>
        <div style={{ color: "#F7931E", fontWeight: 700, fontSize: 12, marginBottom: 12 }}>
          OUTPUT: ARABIC-ONLY TOKENIZER
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <div style={{ color: "#666", fontSize: 11, marginBottom: 8 }}>Trained on:</div>
            {trainingDataSources.map((s, i) => (
              <div key={i} style={{ color: "#aaa", fontSize: 12, padding: "3px 0", display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ color: "#F7931E" }}>→</span> {s}
              </div>
            ))}
          </div>
          <div>
            <div style={{ color: "#666", fontSize: 11, marginBottom: 8 }}>Result:</div>
            {tokenizerResults.map((s, i) => (
              <div key={i} style={{ color: "#aaa", fontSize: 12, padding: "3px 0", display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ color: "#27AE60" }}>✓</span> {s}
              </div>
            ))}
          </div>
        </div>

        {/* Training data stats */}
        <ExpandableSection title="Training data details (from the paper)" color="#F7931E">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {Object.values(trainingDataStats).map((stat, i) => (
              <div key={i} style={{ color: "#aaa", fontSize: 12, padding: "4px 0", display: "flex", gap: 8 }}>
                <span style={{ color: "#F7931E" }}>•</span> {stat}
              </div>
            ))}
          </div>
        </ExpandableSection>

        {/* Two model paths */}
        <ExpandableSection title="Two training approaches in the paper" color="#F7931E">
          <div style={{ color: "#aaa", fontSize: 12, lineHeight: 1.8 }}>
            <p style={{ margin: "0 0 8px" }}>
              <strong style={{ color: "#FFBA6B" }}>Path A — Adapt Llama-2 (what this explainer shows):</strong>{" "}
              Start with Llama-2 pretrained weights, expand the tokenizer, initialize new embeddings, then
              continue pretraining on 1.2T mixed Arabic/English tokens.
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: "#FFBA6B" }}>Path B — Train from scratch:</strong>{" "}
              Train a 7B model with random initialization. First pretrain on 4T English tokens,
              then continue with mixed Arabic/English data. Same tokenizer expansion approach.
              Models: 7B, 13B, 70B (Llama-2 adapted) + 7B (from scratch).
            </p>
          </div>
        </ExpandableSection>
      </div>
    </div>
  );
}
