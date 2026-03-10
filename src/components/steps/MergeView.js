import { motion } from "framer-motion";
import { llama2Tokens, arabicOnlyTokens, newTokensAfterMerge } from "../../constants/data";
import TokenChip from "../shared/TokenChip";
import useMediaQuery from "../../hooks/useMediaQuery";

export default function MergeView() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div>
      <p style={{ color: "#aaa", marginBottom: 28, lineHeight: 1.7, fontSize: 15 }}>
        Now we have two tokenizers: the original Llama-2 tokenizer (English-centric) and the new
        Arabic tokenizer. The merge is simple:{" "}
        <span style={{ color: "#00C2A8", fontWeight: 700 }}>
          take every token from the Arabic tokenizer that does NOT already exist in Llama-2's
          vocabulary, and add it.
        </span>{" "}
        No deletions. Just additions.
      </p>

      {/* Wire diagram */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 60px 1fr 60px 1fr",
          gap: isMobile ? 12 : 0,
          alignItems: "start",
          marginBottom: 28,
        }}
      >
        {/* Llama-2 vocab */}
        <div style={{ background: "#0d0f1a", borderRadius: 10, border: "1px solid #4444ff44", padding: 16 }}>
          <div style={{ color: "#6699ff", fontSize: 11, fontWeight: 700, marginBottom: 12 }}>
            LLAMA-2 VOCAB (~32K tokens)
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {llama2Tokens.map((t, i) => {
              const isArabic = /[\u0600-\u06FF]/.test(t);
              return (
                <TokenChip
                  key={i}
                  text={t}
                  color={isArabic ? "#FF8C8C" : "#8899ff"}
                  size="sm"
                />
              );
            })}
            <div style={{ color: "#444", fontSize: 10, padding: "3px 8px" }}>
              + 31,982 more English tokens...
            </div>
          </div>
          <div style={{ marginTop: 10, padding: "6px 10px", background: "#FF4B4B18", borderRadius: 6, color: "#FF8C8C", fontSize: 10 }}>
            ⚠ Arabic coverage: ~18 mostly single-char tokens
          </div>
        </div>

        {/* Arrow + */}
        <div style={{ display: isMobile ? "none" : "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 4, paddingTop: 60 }}>
          <div style={{ color: "#00C2A8", fontSize: 20 }}>+</div>
          <div style={{ color: "#555", fontSize: 9, textAlign: "center" }}>merge</div>
        </div>

        {/* Arabic vocab */}
        <div style={{ background: "#0d1a15", borderRadius: 10, border: "1px solid #F7931E44", padding: 16 }}>
          <div style={{ color: "#F7931E", fontSize: 11, fontWeight: 700, marginBottom: 12 }}>
            ARABIC VOCAB (~16K tokens)
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, direction: "rtl", justifyContent: "flex-end" }}>
            {arabicOnlyTokens.map((t, i) => (
              <TokenChip key={i} text={t} color="#FFBA6B" size="sm" />
            ))}
            <div style={{ color: "#444", fontSize: 10, padding: "3px 8px" }}>
              + ~15,987 more Arabic tokens...
            </div>
          </div>
        </div>

        {/* Arrow = */}
        <div style={{ display: isMobile ? "none" : "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 4, paddingTop: 60 }}>
          <div style={{ color: "#00C2A8", fontSize: 20 }}>→</div>
          <div style={{ color: "#555", fontSize: 9, textAlign: "center" }}>result</div>
        </div>

        {/* Merged vocab */}
        <div style={{ background: "#0a1a1a", borderRadius: 10, border: "2px solid #00C2A8", padding: 16 }}>
          <div style={{ color: "#00C2A8", fontSize: 11, fontWeight: 700, marginBottom: 12 }}>
            MERGED VOCAB (~48K tokens)
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {["▁the", "▁is", "▁of"].map((t, i) => (
              <TokenChip key={`en-${i}`} text={t} color="#8899ff" size="sm" />
            ))}
            {newTokensAfterMerge.slice(0, 5).map((t, i) => (
              <motion.div
                key={`ar-${i}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
              >
                <TokenChip text={t} color="#6EFCE8" size="sm" />
              </motion.div>
            ))}
          </div>
          <div style={{ marginTop: 10, padding: "6px 10px", background: "#00C2A818", borderRadius: 6, color: "#00C2A8", fontSize: 10 }}>
            ✓ New Arabic tokens highlighted in teal — these need embeddings initialized
          </div>
        </div>
      </div>

      {/* Rule box */}
      <div style={{ background: "#111", borderRadius: 10, border: "1px solid #00C2A844", padding: 18 }}>
        <div style={{ color: "#00C2A8", fontSize: 12, fontWeight: 700, marginBottom: 10 }}>
          THE MERGE RULE (simple):
        </div>
        <div
          style={{
            background: "#0a1a1a",
            borderRadius: 8,
            padding: 14,
            fontSize: 12,
            color: "#6EFCE8",
            lineHeight: 1.8,
          }}
        >
          for token in arabic_tokenizer.vocab:<br />
          &nbsp;&nbsp;&nbsp;&nbsp;if token NOT IN llama2_tokenizer.vocab:<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;merged_vocab.add(token)  <span style={{ color: "#555" }}># ADD it</span><br />
          &nbsp;&nbsp;&nbsp;&nbsp;else:<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;pass  <span style={{ color: "#555" }}># Already exists — SKIP</span>
        </div>
        <div style={{ color: "#555", fontSize: 10, marginTop: 10 }}>
          * Approximate vocab sizes based on the ALLaM paper's methodology. Exact counts may vary.
        </div>
      </div>
    </div>
  );
}
