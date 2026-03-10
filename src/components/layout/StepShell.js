import { motion, AnimatePresence } from "framer-motion";
import { steps } from "../../constants/steps";

export default function StepShell({ activeStep, goToStep, children }) {
  const step = steps[activeStep];

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        background: "#0f0f0f",
        borderRadius: 14,
        border: `1px solid ${step.color}33`,
        overflow: "hidden",
      }}
    >
      {/* Panel header */}
      <div
        style={{
          padding: "16px 24px",
          borderBottom: `1px solid ${step.color}22`,
          background: `${step.color}08`,
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
            background: step.color,
          }}
        />
        <div style={{ color: step.accent, fontWeight: 700, fontSize: 14 }}>
          {step.title}
        </div>
        <div style={{ color: "#444", fontSize: 11, marginLeft: "auto" }}>
          {activeStep + 1} / {steps.length}
        </div>
      </div>

      {/* Panel body with AnimatePresence */}
      <div style={{ padding: 24, minHeight: 400 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

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
          onClick={() => goToStep(Math.max(0, activeStep - 1))}
          disabled={activeStep === 0}
          aria-label="Previous step"
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
          onClick={() => goToStep(Math.min(steps.length - 1, activeStep + 1))}
          disabled={activeStep === steps.length - 1}
          aria-label="Next step"
          style={{
            padding: "8px 18px",
            borderRadius: 6,
            border: `1px solid ${step.color}`,
            background: `${step.color}18`,
            color: step.accent,
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
  );
}
