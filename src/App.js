import { useState, useEffect } from "react";

const steps = [
  {
    id: 0,
    label: "The Problem",
    title: "Why Arabic Breaks English Tokenizers",
    color: "#FF4B4B",
    accent: "#FF8C8C",
  },
  {
    id: 1,
    label: "Step 1",
    title: "Train Arabic Tokenizer",
    color: "#F7931E",
    accent: "#FFBA6B",
  },
  {
    id: 2,
    label: "Step 2",
    title: "Merge Vocabularies",
    color: "#00C2A8",
    accent: "#6EFCE8",
  },
  {
    id: 3,
    label: "Step 3",
    title: "Initialize New Embeddings",
    color: "#7B5EA7",
    accent: "#B89FD8",
  },
  {
    id: 4,
    label: "Result",
    title: "The Improved Model",
    color: "#27AE60",
    accent: "#6FCF97",
  },
];

// --- STEP 0: The Problem ---
function ProblemView() {
  const [highlight, setHighlight] = useState(null);

  const llama2Example = {
    word: "مكتبة",
    meaning: "(library)",
    tokens: ["م", "ك", "ت", "ب", "ة"],
    count: 5,
  };

  const arabicExample = {
    word: "مكتبة",
    meaning: "(library)",
    tokens: ["مكتبة"],
    count: 1,
  };

  return (
    <div style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
      <p style={{ color: "#aaa", marginBottom: 32, lineHeight: 1.7, fontSize: 15 }}>
        Llama-2 was trained almost entirely on English text. Its vocabulary of
        ~32,000 tokens has very few Arabic subwords. When it encounters Arabic,
        it falls back to{" "}
        <span style={{ color: "#FF4B4B", fontWeight: 700 }}>
          splitting each character into a separate token
        </span>{" "}
        — sometimes even individual bytes. This is called{" "}
        <span style={{ color: "#FF4B4B", fontWeight: 700 }}>
          high fertility
        </span>
        : many tokens per word.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          marginBottom: 32,
        }}
      >
        {/* Llama-2 Bad */}
        <div
          style={{
            background: "#1a0a0a",
            border: "1px solid #FF4B4B44",
            borderRadius: 12,
            padding: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: 20 }}>❌</span>
            <span style={{ color: "#FF4B4B", fontWeight: 700, fontSize: 13 }}>
              LLAMA-2 TOKENIZER
            </span>
          </div>
          <div
            style={{
              textAlign: "center",
              fontSize: 32,
              color: "#fff",
              marginBottom: 8,
              direction: "rtl",
            }}
          >
            {llama2Example.word}
          </div>
          <div
            style={{ textAlign: "center", color: "#666", fontSize: 12, marginBottom: 20 }}
          >
            {llama2Example.meaning}
          </div>
          <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
            {llama2Example.tokens.map((t, i) => (
              <div
                key={i}
                style={{
                  background: "#FF4B4B22",
                  border: "1px solid #FF4B4B",
                  borderRadius: 6,
                  padding: "6px 10px",
                  color: "#FF8C8C",
                  fontSize: 16,
                  fontFamily: "serif",
                  direction: "rtl",
                }}
              >
                {t}
              </div>
            ))}
          </div>
          <div
            style={{
              textAlign: "center",
              marginTop: 14,
              color: "#FF4B4B",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            5 tokens for 1 word
          </div>
          <div style={{ textAlign: "center", color: "#666", fontSize: 11, marginTop: 4 }}>
            Fertility = 5.0 ← BAD
          </div>
        </div>

        {/* Arabic Tokenizer Good */}
        <div
          style={{
            background: "#0a1a0e",
            border: "1px solid #27AE6044",
            borderRadius: 12,
            padding: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: 20 }}>✅</span>
            <span style={{ color: "#27AE60", fontWeight: 700, fontSize: 13 }}>
              ARABIC TOKENIZER
            </span>
          </div>
          <div
            style={{
              textAlign: "center",
              fontSize: 32,
              color: "#fff",
              marginBottom: 8,
              direction: "rtl",
            }}
          >
            {arabicExample.word}
          </div>
          <div
            style={{ textAlign: "center", color: "#666", fontSize: 12, marginBottom: 20 }}
          >
            {arabicExample.meaning}
          </div>
          <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
            {arabicExample.tokens.map((t, i) => (
              <div
                key={i}
                style={{
                  background: "#27AE6022",
                  border: "1px solid #27AE60",
                  borderRadius: 6,
                  padding: "6px 10px",
                  color: "#6FCF97",
                  fontSize: 16,
                  fontFamily: "serif",
                  direction: "rtl",
                }}
              >
                {t}
              </div>
            ))}
          </div>
          <div
            style={{
              textAlign: "center",
              marginTop: 14,
              color: "#27AE60",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            1 token for 1 word
          </div>
          <div style={{ textAlign: "center", color: "#666", fontSize: 11, marginTop: 4 }}>
            Fertility = 1.0 ← IDEAL
          </div>
        </div>
      </div>

      {/* Consequences */}
      <div
        style={{
          background: "#111",
          borderRadius: 12,
          border: "1px solid #333",
          padding: 20,
        }}
      >
        <div style={{ color: "#FF4B4B", fontWeight: 700, fontSize: 12, marginBottom: 12 }}>
          WHY HIGH FERTILITY IS CATASTROPHIC
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[
            {
              icon: "📈",
              label: "Inflated Training Cost",
              desc: "5× more tokens = 5× more compute per Arabic sentence",
            },
            {
              icon: "✂️",
              label: "Context Window Eaten",
              desc: "A 4096-token window holds 5× fewer Arabic words than English words",
            },
            {
              icon: "🐌",
              label: "Slow Inference",
              desc: "Model must generate 5× more tokens to reply in Arabic",
            },
          ].map((item, i) => (
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

// --- STEP 1: Train Arabic Tokenizer ---
function TrainTokenizerView() {
  const [stage, setStage] = useState(0);

  const bpeStages = [
    {
      label: "Initial Characters",
      tokens: ["م", "ك", "ت", "ب", "ة", "ا", "ل", "ع", "ر", "ب", "ي", "ة"],
      desc: "Start with all individual Arabic characters as base vocabulary",
    },
    {
      label: "First Merges (common pairs)",
      tokens: ["مك", "ت", "ب", "ة", "ال", "ع", "رب", "ية"],
      desc: "BPE finds the most frequent adjacent character pairs and merges them",
    },
    {
      label: "More Merges",
      tokens: ["مكت", "بة", "الع", "ربية"],
      desc: "Repeated merging creates longer, more meaningful subwords",
    },
    {
      label: "Final Vocabulary",
      tokens: ["مكتبة", "العربية", "الكتاب", "يكتب"],
      desc: "Final vocabulary contains whole Arabic words and common subwords",
    },
  ];

  return (
    <div style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
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
        <div
          style={{
            color: "#F7931E",
            fontWeight: 700,
            fontSize: 12,
            marginBottom: 16,
          }}
        >
          BPE TRAINING PROCESS — STEP THROUGH IT:
        </div>

        {/* Stage selector */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {bpeStages.map((s, i) => (
            <button
              key={i}
              onClick={() => setStage(i)}
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
          <div
            style={{
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            {bpeStages[stage].label}
          </div>
          <div style={{ color: "#888", fontSize: 12, marginBottom: 14 }}>
            {bpeStages[stage].desc}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", direction: "rtl", justifyContent: "flex-end" }}>
            {bpeStages[stage].tokens.map((t, i) => (
              <div
                key={i}
                style={{
                  background: "#F7931E18",
                  border: "1px solid #F7931E",
                  borderRadius: 6,
                  padding: "8px 14px",
                  color: "#FFBA6B",
                  fontSize: 18,
                  fontFamily: "serif",
                  transition: "all 0.3s",
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div
          style={{
            marginTop: 16,
            height: 4,
            background: "#1a1a1a",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${((stage + 1) / bpeStages.length) * 100}%`,
              height: "100%",
              background: "#F7931E",
              borderRadius: 2,
              transition: "width 0.4s ease",
            }}
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
            {["Web documents", "News articles", "Books", "Wikipedia (1M+ articles)", "Audio transcripts"].map((s, i) => (
              <div key={i} style={{ color: "#aaa", fontSize: 12, padding: "3px 0", display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ color: "#F7931E" }}>→</span> {s}
              </div>
            ))}
          </div>
          <div>
            <div style={{ color: "#666", fontSize: 11, marginBottom: 8 }}>Result:</div>
            {[
              "Low fertility on Arabic (~1.5 tokens/word)",
              "Covers MSA + some dialects",
              "Efficient Arabic subwords",
              "Language-specific vocabulary",
            ].map((s, i) => (
              <div key={i} style={{ color: "#aaa", fontSize: 12, padding: "3px 0", display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ color: "#27AE60" }}>✓</span> {s}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- STEP 2: Merge Vocabularies ---
function MergeView() {
  const [hover, setHover] = useState(null);

  const llama2Tokens = [
    "▁the", "▁is", "▁of", "▁to", "▁in", "▁that", "▁it", "▁was", "▁he", "▁for",
    "▁on", "▁are", "▁as", "ال", "ب", "م", "ع", "ك",
  ];

  const arabicOnlyTokens = [
    "مكتبة", "الكتاب", "يكتب", "العربية", "والتي", "التعليم", "السياسة",
    "المدرسة", "اللغة", "ال", "في", "من", "على",
  ];

  const newTokens = ["مكتبة", "الكتاب", "يكتب", "العربية", "والتي", "التعليم", "السياسة", "المدرسة", "اللغة"];

  return (
    <div style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
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
          gridTemplateColumns: "1fr 60px 1fr 60px 1fr",
          gap: 0,
          alignItems: "start",
          marginBottom: 28,
        }}
      >
        {/* Llama-2 vocab */}
        <div
          style={{
            background: "#0d0f1a",
            borderRadius: 10,
            border: "1px solid #4444ff44",
            padding: 16,
          }}
        >
          <div style={{ color: "#6699ff", fontSize: 11, fontWeight: 700, marginBottom: 12 }}>
            LLAMA-2 VOCAB (~32K tokens)
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {llama2Tokens.map((t, i) => (
              <div
                key={i}
                style={{
                  background: t.match(/[ا-ي]/) ? "#FF4B4B22" : "#6699ff18",
                  border: `1px solid ${t.match(/[ا-ي]/) ? "#FF4B4B" : "#6699ff44"}`,
                  borderRadius: 4,
                  padding: "3px 8px",
                  color: t.match(/[ا-ي]/) ? "#FF8C8C" : "#8899ff",
                  fontSize: 11,
                  direction: "rtl",
                }}
              >
                {t}
              </div>
            ))}
            <div style={{ color: "#444", fontSize: 10, padding: "3px 8px" }}>
              + 31,982 more English tokens...
            </div>
          </div>
          <div
            style={{
              marginTop: 10,
              padding: "6px 10px",
              background: "#FF4B4B18",
              borderRadius: 6,
              color: "#FF8C8C",
              fontSize: 10,
            }}
          >
            ⚠ Arabic coverage: ~18 mostly single-char tokens
          </div>
        </div>

        {/* Arrow + */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 4,
            paddingTop: 60,
          }}
        >
          <div style={{ color: "#00C2A8", fontSize: 20 }}>+</div>
          <div style={{ color: "#555", fontSize: 9, textAlign: "center" }}>merge</div>
        </div>

        {/* Arabic vocab */}
        <div
          style={{
            background: "#0d1a15",
            borderRadius: 10,
            border: "1px solid #F7931E44",
            padding: 16,
          }}
        >
          <div style={{ color: "#F7931E", fontSize: 11, fontWeight: 700, marginBottom: 12 }}>
            ARABIC VOCAB (~16K tokens)
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, direction: "rtl", justifyContent: "flex-end" }}>
            {arabicOnlyTokens.map((t, i) => (
              <div
                key={i}
                style={{
                  background: "#F7931E18",
                  border: "1px solid #F7931E44",
                  borderRadius: 4,
                  padding: "3px 8px",
                  color: "#FFBA6B",
                  fontSize: 12,
                  fontFamily: "serif",
                }}
              >
                {t}
              </div>
            ))}
            <div style={{ color: "#444", fontSize: 10, padding: "3px 8px" }}>
              + ~15,987 more Arabic tokens...
            </div>
          </div>
        </div>

        {/* Arrow = */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 4,
            paddingTop: 60,
          }}
        >
          <div style={{ color: "#00C2A8", fontSize: 20 }}>→</div>
          <div style={{ color: "#555", fontSize: 9, textAlign: "center" }}>result</div>
        </div>

        {/* Merged vocab */}
        <div
          style={{
            background: "#0a1a1a",
            borderRadius: 10,
            border: "2px solid #00C2A8",
            padding: 16,
          }}
        >
          <div style={{ color: "#00C2A8", fontSize: 11, fontWeight: 700, marginBottom: 12 }}>
            MERGED VOCAB (~48K tokens)
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {["▁the", "▁is", "▁of"].map((t, i) => (
              <div
                key={i}
                style={{
                  background: "#6699ff18",
                  border: "1px solid #6699ff44",
                  borderRadius: 4,
                  padding: "3px 8px",
                  color: "#8899ff",
                  fontSize: 11,
                }}
              >
                {t}
              </div>
            ))}
            {newTokens.slice(0, 5).map((t, i) => (
              <div
                key={i}
                style={{
                  background: "#00C2A822",
                  border: "1px solid #00C2A8",
                  borderRadius: 4,
                  padding: "3px 8px",
                  color: "#6EFCE8",
                  fontSize: 12,
                  fontFamily: "serif",
                  direction: "rtl",
                }}
              >
                {t}
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 10,
              padding: "6px 10px",
              background: "#00C2A818",
              borderRadius: 6,
              color: "#00C2A8",
              fontSize: 10,
            }}
          >
            ✓ New Arabic tokens are highlighted in teal — these are the ones that need embeddings initialized
          </div>
        </div>
      </div>

      {/* Rule box */}
      <div
        style={{
          background: "#111",
          borderRadius: 10,
          border: "1px solid #00C2A844",
          padding: 18,
        }}
      >
        <div style={{ color: "#00C2A8", fontSize: 12, fontWeight: 700, marginBottom: 10 }}>
          THE MERGE RULE (simple):
        </div>
        <div
          style={{
            background: "#0a1a1a",
            borderRadius: 8,
            padding: 14,
            fontFamily: "'IBM Plex Mono', monospace",
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
      </div>
    </div>
  );
}

// --- STEP 3: Embedding Initialization ---
function EmbeddingView() {
  const [method, setMethod] = useState("smart");

  return (
    <div style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
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

      {method === "random" ? (
        <div>
          {/* Random init diagram */}
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
                <div
                  style={{
                    background: "#FF4B4B22",
                    border: "1px solid #FF4B4B",
                    borderRadius: 8,
                    padding: 14,
                    textAlign: "center",
                    color: "#FF8C8C",
                    fontSize: 22,
                    fontFamily: "serif",
                    direction: "rtl",
                  }}
                >
                  مكتبة
                </div>
              </div>
              <div style={{ textAlign: "center", color: "#555" }}>→</div>
              <div>
                <div style={{ color: "#666", fontSize: 11, marginBottom: 8 }}>Embedding vector:</div>
                <div
                  style={{
                    background: "#1a1a1a",
                    borderRadius: 8,
                    padding: 12,
                    display: "flex",
                    gap: 4,
                    flexWrap: "wrap",
                  }}
                >
                  {Array.from({ length: 12 }, () =>
                    ((Math.random() - 0.5) * 2).toFixed(2)
                  ).map((v, i) => (
                    <span
                      key={i}
                      style={{
                        color: "#FF4B4B66",
                        fontSize: 10,
                        padding: "2px 4px",
                        background: "#FF4B4B11",
                        borderRadius: 3,
                      }}
                    >
                      {v}
                    </span>
                  ))}
                  <span style={{ color: "#444", fontSize: 10 }}>... (4096 dims)</span>
                </div>
              </div>
            </div>
            <div
              style={{
                marginTop: 16,
                padding: "10px 14px",
                background: "#FF4B4B11",
                borderRadius: 8,
                color: "#FF8C8C",
                fontSize: 12,
              }}
            >
              ⚠ Random noise. The model has no idea what this token means. It must learn everything
              from scratch through gradient descent — very slow convergence.
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* Smart init diagram */}
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

            {/* The process */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ color: "#888", fontSize: 12, marginBottom: 12 }}>
                Key insight: The new Arabic token "مكتبة" can be broken down using the{" "}
                <em>original</em> Llama-2 tokenizer into smaller pieces it already knows:
              </div>

              {/* Decompose */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                <div
                  style={{
                    background: "#7B5EA722",
                    border: "2px solid #7B5EA7",
                    borderRadius: 8,
                    padding: "10px 18px",
                    color: "#B89FD8",
                    fontSize: 22,
                    fontFamily: "serif",
                    direction: "rtl",
                  }}
                >
                  مكتبة
                </div>
                <div style={{ color: "#555", fontSize: 18 }}>→</div>
                <div style={{ color: "#888", fontSize: 12 }}>Tokenize with Llama-2:</div>
                {["م", "ك", "ت", "ب", "ة"].map((t, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#4444ff18",
                      border: "1px solid #4444ff44",
                      borderRadius: 6,
                      padding: "8px 12px",
                      color: "#8899ff",
                      fontSize: 16,
                      fontFamily: "serif",
                      direction: "rtl",
                    }}
                  >
                    {t}
                  </div>
                ))}
              </div>

              {/* Average */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ color: "#555", fontSize: 12 }}>Each subtoken has an existing embedding:</div>
              </div>

              <div
                style={{
                  background: "#0a0a1a",
                  borderRadius: 8,
                  padding: 16,
                  marginBottom: 16,
                }}
              >
                {["م", "ك", "ت", "ب", "ة"].map((t, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 8,
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        textAlign: "center",
                        color: "#8899ff",
                        fontSize: 16,
                        fontFamily: "serif",
                        direction: "rtl",
                      }}
                    >
                      {t}
                    </div>
                    <div style={{ color: "#555", fontSize: 12 }}>→</div>
                    <div style={{ display: "flex", gap: 3 }}>
                      {[0.12, -0.34, 0.56, 0.78, -0.21, 0.43, -0.67, 0.89].map((v, j) => (
                        <span
                          key={j}
                          style={{
                            color: "#6699ff88",
                            fontSize: 10,
                            padding: "2px 4px",
                            background: "#4444ff11",
                            borderRadius: 3,
                          }}
                        >
                          {(v + (i * 0.05)).toFixed(2)}
                        </span>
                      ))}
                      <span style={{ color: "#333", fontSize: 10 }}>...</span>
                    </div>
                  </div>
                ))}

                <div
                  style={{
                    borderTop: "1px solid #333",
                    marginTop: 10,
                    paddingTop: 10,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div style={{ width: 32, color: "#B89FD8", fontSize: 11, textAlign: "center" }}>
                    AVG
                  </div>
                  <div style={{ color: "#555", fontSize: 12 }}>→</div>
                  <div style={{ display: "flex", gap: 3 }}>
                    {[0.24, -0.15, 0.58, 0.69, -0.31, 0.52, -0.54, 0.74].map((v, j) => (
                      <span
                        key={j}
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
                      </span>
                    ))}
                    <span style={{ color: "#333", fontSize: 10 }}>...</span>
                  </div>
                  <div
                    style={{
                      background: "#7B5EA722",
                      borderRadius: 6,
                      padding: "4px 10px",
                      color: "#B89FD8",
                      fontSize: 11,
                      border: "1px solid #7B5EA744",
                    }}
                  >
                    = embedding for مكتبة
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                padding: "10px 14px",
                background: "#27AE6011",
                borderRadius: 8,
                color: "#6FCF97",
                fontSize: 12,
                border: "1px solid #27AE6033",
              }}
            >
              ✓ The new token starts with a meaningful representation — a blend of its component parts.
              The model converges dramatically faster because it has a sensible starting point, not random noise.
            </div>
          </div>
        </div>
      )}

      {/* Comparison chart */}
      <div
        style={{
          background: "#111",
          borderRadius: 10,
          border: "1px solid #333",
          padding: 18,
        }}
      >
        <div style={{ color: "#888", fontSize: 12, fontWeight: 700, marginBottom: 14 }}>
          LEARNING SPEED COMPARISON (Arabic MMLU accuracy over training tokens):
        </div>
        <div style={{ position: "relative", height: 80 }}>
          {/* Smart line */}
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
          <div
            style={{
              position: "absolute",
              top: 4,
              right: 0,
              color: "#7B5EA7",
              fontSize: 10,
            }}
          >
            Smart Init
          </div>
          <div
            style={{
              position: "absolute",
              top: 28,
              right: 0,
              color: "#FF4B4B",
              fontSize: 10,
            }}
          >
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

// --- STEP 4: Result ---
function ResultView() {
  const models = [
    { name: "AceGPT-7B\n(no vocab expansion)", fertility: 7.2, color: "#FF4B4B", bar: 100 },
    { name: "Llama-2\n(original)", fertility: 6.8, color: "#FF6B35", bar: 94 },
    { name: "ALLaM\n(merged tokenizer)", fertility: 1.9, color: "#00C2A8", bar: 26 },
    { name: "Arabic-only\ntokenizer", fertility: 1.5, color: "#27AE60", bar: 20 },
  ];

  return (
    <div style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
      <p style={{ color: "#aaa", marginBottom: 28, lineHeight: 1.7, fontSize: 15 }}>
        After tokenizer expansion + continued pretraining on 1.2T Arabic/English tokens,
        ALLaM achieves drastically reduced Arabic fertility while retaining full English performance.
        Here's the full picture of what changed:
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
        {models.map((m, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ color: "#aaa", fontSize: 11, whiteSpace: "pre" }}>{m.name}</span>
              <span style={{ color: m.color, fontSize: 12, fontWeight: 700 }}>
                {m.fertility} tokens/word
              </span>
            </div>
            <div
              style={{
                height: 10,
                background: "#111",
                borderRadius: 5,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${m.bar}%`,
                  height: "100%",
                  background: m.color,
                  borderRadius: 5,
                  transition: "width 1s ease",
                }}
              />
            </div>
          </div>
        ))}
        <div style={{ color: "#555", fontSize: 11, marginTop: 8 }}>
          Fertility of 1.0 = perfect (one word = one token). ALLaM gets close to the Arabic-only tokenizer while keeping English intact.
        </div>
      </div>

      {/* What you get */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div
          style={{
            background: "#111",
            borderRadius: 12,
            border: "1px solid #00C2A844",
            padding: 20,
          }}
        >
          <div style={{ color: "#00C2A8", fontSize: 12, fontWeight: 700, marginBottom: 14 }}>
            WHAT YOU GAIN
          </div>
          {[
            "Arabic words → mostly 1–2 tokens",
            "4× more Arabic content fits in context",
            "4× faster Arabic inference",
            "Training on same data = 4× more efficient",
            "English performance PRESERVED",
          ].map((s, i) => (
            <div
              key={i}
              style={{
                color: "#aaa",
                fontSize: 12,
                padding: "5px 0",
                borderBottom: "1px solid #1a1a1a",
                display: "flex",
                gap: 8,
              }}
            >
              <span style={{ color: "#27AE60" }}>✓</span> {s}
            </div>
          ))}
        </div>
        <div
          style={{
            background: "#111",
            borderRadius: 12,
            border: "1px solid #7B5EA744",
            padding: 20,
          }}
        >
          <div style={{ color: "#B89FD8", fontSize: 12, fontWeight: 700, marginBottom: 14 }}>
            ALLAM BENCHMARKS AFTER THIS METHOD
          </div>
          {[
            { name: "Arabic MMLU (75.92%)", score: 76 },
            { name: "ACVA (79.01%)", score: 79 },
            { name: "MT-Bench Arabic (8.19)", score: 82 },
            { name: "Arabic Exams (62.23%)", score: 62 },
          ].map((b, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                  color: "#888",
                  fontSize: 11,
                }}
              >
                <span>{b.name}</span>
                <span style={{ color: "#B89FD8" }}>{b.score}%</span>
              </div>
              <div
                style={{ height: 5, background: "#1a1a1a", borderRadius: 3, overflow: "hidden" }}
              >
                <div
                  style={{
                    width: `${b.score}%`,
                    height: "100%",
                    background: "#7B5EA7",
                    borderRadius: 3,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- MAIN ---
export default function TokenizerExplainer() {
  const [activeStep, setActiveStep] = useState(0);

  const views = [
    <ProblemView />,
    <TrainTokenizerView />,
    <MergeView />,
    <EmbeddingView />,
    <ResultView />,
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#fff",
        fontFamily: "'IBM Plex Mono', monospace",
        padding: "32px 24px",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <div style={{ maxWidth: 900, margin: "0 auto 32px" }}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: 3,
            color: "#555",
            marginBottom: 8,
            textTransform: "uppercase",
          }}
        >
          ALLaM Paper — Technical Deep Dive
        </div>
        <h1
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: "#fff",
            margin: "0 0 8px",
            lineHeight: 1.2,
          }}
        >
          Tokenizer Expansion for Arabic LLMs
        </h1>
        <p style={{ color: "#555", fontSize: 13, margin: 0 }}>
          How to teach an English-trained model to speak Arabic efficiently
        </p>
      </div>

      {/* Step nav */}
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto 28px",
          display: "flex",
          gap: 0,
          borderRadius: 10,
          overflow: "hidden",
          border: "1px solid #222",
        }}
      >
        {steps.map((s, i) => (
          <button
            key={i}
            onClick={() => setActiveStep(i)}
            style={{
              flex: 1,
              padding: "12px 8px",
              background: activeStep === i ? s.color + "22" : "transparent",
              border: "none",
              borderRight: i < steps.length - 1 ? "1px solid #222" : "none",
              borderBottom: activeStep === i ? `2px solid ${s.color}` : "2px solid transparent",
              color: activeStep === i ? s.accent : "#555",
              fontSize: 11,
              cursor: "pointer",
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: activeStep === i ? 700 : 400,
              transition: "all 0.2s",
              textAlign: "center",
            }}
          >
            <div>{s.label}</div>
          </button>
        ))}
      </div>

      {/* Content */}
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          background: "#0f0f0f",
          borderRadius: 14,
          border: `1px solid ${steps[activeStep].color}33`,
          overflow: "hidden",
        }}
      >
        {/* Panel header */}
        <div
          style={{
            padding: "16px 24px",
            borderBottom: `1px solid ${steps[activeStep].color}22`,
            background: `${steps[activeStep].color}08`,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: steps[activeStep].color,
            }}
          />
          <div style={{ color: steps[activeStep].accent, fontWeight: 700, fontSize: 14 }}>
            {steps[activeStep].title}
          </div>
          <div style={{ color: "#444", fontSize: 11, marginLeft: "auto" }}>
            {activeStep + 1} / {steps.length}
          </div>
        </div>

        {/* Panel body */}
        <div style={{ padding: 24 }}>{views[activeStep]}</div>

        {/* Navigation */}
        <div
          style={{
            padding: "12px 24px",
            borderTop: "1px solid #1a1a1a",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
            disabled={activeStep === 0}
            style={{
              padding: "8px 18px",
              borderRadius: 6,
              border: "1px solid #333",
              background: "transparent",
              color: activeStep === 0 ? "#333" : "#888",
              fontSize: 12,
              cursor: activeStep === 0 ? "not-allowed" : "pointer",
              fontFamily: "'IBM Plex Mono', monospace",
            }}
          >
            ← Previous
          </button>
          <button
            onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
            disabled={activeStep === steps.length - 1}
            style={{
              padding: "8px 18px",
              borderRadius: 6,
              border: `1px solid ${steps[activeStep].color}`,
              background: `${steps[activeStep].color}18`,
              color: steps[activeStep].accent,
              fontSize: 12,
              cursor: activeStep === steps.length - 1 ? "not-allowed" : "pointer",
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 700,
            }}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}