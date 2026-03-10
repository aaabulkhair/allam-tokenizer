// ─── Byte-fallback tokenization examples ───
// Llama-2 uses UTF-8 byte-fallback for Arabic text.
// Each Arabic character = 2 UTF-8 bytes = 2 tokens.

function arabicToByteTokens(word) {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(word);
  return Array.from(bytes).map((b) => `<0x${b.toString(16).toUpperCase().padStart(2, "0")}>`);
}

export const problemExamples = [
  { word: "في", meaning: "(in)", arabicTokens: ["في"] },
  { word: "كتاب", meaning: "(book)", arabicTokens: ["كتاب"] },
  { word: "مكتبة", meaning: "(library)", arabicTokens: ["مكتبة"] },
  { word: "العربية", meaning: "(Arabic)", arabicTokens: ["العربية"] },
].map((ex) => ({
  ...ex,
  byteTokens: arabicToByteTokens(ex.word),
  charTokens: [...ex.word],
}));

export const consequences = [
  {
    icon: "📈",
    label: "Inflated Training Cost",
    desc: "10× more tokens = 10× more compute per Arabic sentence",
  },
  {
    icon: "✂️",
    label: "Context Window Eaten",
    desc: "A 4096-token window holds ~5× fewer Arabic words than English",
  },
  {
    icon: "🐌",
    label: "Slow Inference",
    desc: "Model must generate many more tokens to reply in Arabic",
  },
];

// ─── BPE Training stages ───
export const bpeStages = [
  {
    label: "Initial Characters",
    tokens: ["م", "ك", "ت", "ب", "ة", "ا", "ل", "ع", "ر", "ب", "ي", "ة"],
    desc: "Start with all individual Arabic characters as base vocabulary",
    mergeInfo: null,
  },
  {
    label: "First Merges (common pairs)",
    tokens: ["مك", "ت", "ب", "ة", "ال", "ع", "رب", "ية"],
    desc: "BPE finds the most frequent adjacent character pairs and merges them",
    mergeInfo: [
      { pair: "م + ك → مك", freq: "4,231" },
      { pair: "ا + ل → ال", freq: "3,892" },
      { pair: "ر + ب → رب", freq: "2,105" },
      { pair: "ي + ة → ية", freq: "1,987" },
    ],
  },
  {
    label: "More Merges",
    tokens: ["مكت", "بة", "الع", "ربية"],
    desc: "Repeated merging creates longer, more meaningful subwords",
    mergeInfo: [
      { pair: "مك + ت → مكت", freq: "1,845" },
      { pair: "ب + ة → بة", freq: "1,623" },
      { pair: "ال + ع → الع", freq: "1,412" },
      { pair: "رب + ية → ربية", freq: "1,203" },
    ],
  },
  {
    label: "Final Vocabulary",
    tokens: ["مكتبة", "العربية", "الكتاب", "يكتب"],
    desc: "Final vocabulary contains whole Arabic words and common subwords",
    mergeInfo: [
      { pair: "مكت + بة → مكتبة", freq: "891" },
      { pair: "الع + ربية → العربية", freq: "756" },
    ],
  },
];

export const trainingDataSources = [
  "Web documents",
  "News articles",
  "Books & literature",
  "Wikipedia (1M+ articles)",
  "Audio transcripts",
];

export const trainingDataStats = {
  arabicNatural: "270B natural Arabic tokens",
  arabicTranslated: "270B translated Arabic tokens",
  totalArabic: "540B total Arabic tokens",
  englishPretraining: "4T English pretraining tokens",
  continuedMixed: "1.2T continued mixed training",
};

export const tokenizerResults = [
  "Low fertility on Arabic (~1.5 tokens/word)",
  "Covers MSA + some dialects",
  "Efficient Arabic subwords",
  "Language-specific vocabulary",
];

// ─── Vocabulary merge data ───
export const llama2Tokens = [
  "▁the", "▁is", "▁of", "▁to", "▁in", "▁that", "▁it", "▁was", "▁he", "▁for",
  "▁on", "▁are", "▁as", "ال", "ب", "م", "ع", "ك",
];

export const arabicOnlyTokens = [
  "مكتبة", "الكتاب", "يكتب", "العربية", "والتي", "التعليم", "السياسة",
  "المدرسة", "اللغة", "ال", "في", "من", "على",
];

export const newTokensAfterMerge = [
  "مكتبة", "الكتاب", "يكتب", "العربية", "والتي", "التعليم", "السياسة", "المدرسة", "اللغة",
];

// ─── Embedding initialization data ───
export const sampleEmbeddings = {
  components: ["م", "ك", "ت", "ب", "ة"],
  baseVector: [0.12, -0.34, 0.56, 0.78, -0.21, 0.43, -0.67, 0.89],
  averagedVector: [0.24, -0.15, 0.58, 0.69, -0.31, 0.52, -0.54, 0.74],
  embeddingDim: 4096,
};

// ─── Result / benchmark data ───
export const fertilityModels = [
  { name: "AceGPT-7B\n(no vocab expansion)", fertility: 7.2, color: "#FF4B4B", bar: 100 },
  { name: "Llama-2\n(original)", fertility: 6.8, color: "#FF6B35", bar: 94 },
  { name: "ALLaM\n(merged tokenizer)", fertility: 1.9, color: "#00C2A8", bar: 26 },
  { name: "Arabic-only\ntokenizer", fertility: 1.5, color: "#27AE60", bar: 20 },
];

export const benchmarks = [
  { name: "Arabic MMLU", value: "75.92%", score: 76 },
  { name: "ACVA", value: "79.01%", score: 79 },
  { name: "MT-Bench Arabic", value: "8.19", score: 82 },
  { name: "Arabic Exams", value: "62.23%", score: 62 },
];

export const gains = [
  "Arabic words → mostly 1–2 tokens",
  "4× more Arabic content fits in context",
  "4× faster Arabic inference",
  "Training on same data = 4× more efficient",
  "English performance PRESERVED",
];

// ─── Streaming demo data ───
// For the visual demo, we show character-level tokens for Llama-2 (readable)
// rather than raw byte tokens (which are even worse but visually unreadable hex soup).
const streamingArabic = "المكتبة العربية تحتوي على كتب كثيرة";
export const streamingSentence = {
  arabic: streamingArabic,
  meaning: "The Arabic library contains many books",
  // Split into individual characters to simulate slow char-by-char generation
  llamaTokens: [...streamingArabic],
  allamTokens: ["المكتبة", " ", "العربية", " ", "تحتوي", " ", "على", " ", "كتب", " ", "كثيرة"],
};

// ─── Context window demo data ───
export const contextWindowSize = 4096;

export const contextDemoSentences = [
  { word: "المكتبة", meaning: "library" },
  { word: "العربية", meaning: "Arabic" },
  { word: "تحتوي", meaning: "contains" },
  { word: "على", meaning: "on" },
  { word: "كتب", meaning: "books" },
  { word: "كثيرة", meaning: "many" },
  { word: "ومتنوعة", meaning: "diverse" },
  { word: "في", meaning: "in" },
  { word: "مختلف", meaning: "various" },
  { word: "المجالات", meaning: "fields" },
];
