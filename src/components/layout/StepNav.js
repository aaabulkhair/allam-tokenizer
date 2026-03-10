import { motion } from "framer-motion";
import { steps } from "../../constants/steps";

export default function StepNav({ activeStep, goToStep }) {
  return (
    <div
      role="tablist"
      aria-label="Tutorial steps"
      style={{
        maxWidth: 900,
        margin: "0 auto 28px",
        display: "flex",
        gap: 0,
        borderRadius: 10,
        overflow: "hidden",
        border: "1px solid #222",
        position: "relative",
      }}
    >
      {steps.map((s, i) => (
        <button
          key={i}
          role="tab"
          aria-selected={activeStep === i}
          aria-label={`${s.label}: ${s.title}`}
          onClick={() => goToStep(i)}
          style={{
            flex: 1,
            padding: "12px 8px",
            background: activeStep === i ? s.color + "22" : "transparent",
            border: "none",
            borderRight: i < steps.length - 1 ? "1px solid #222" : "none",
            borderBottom: "2px solid transparent",
            color: activeStep === i ? s.accent : "#555",
            fontSize: 11,
            cursor: "pointer",
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: activeStep === i ? 700 : 400,
            transition: "background 0.2s, color 0.2s",
            textAlign: "center",
            position: "relative",
          }}
        >
          <div>{s.label}</div>
          {activeStep === i && (
            <motion.div
              layoutId="activeTab"
              style={{
                position: "absolute",
                bottom: -2,
                left: 0,
                right: 0,
                height: 2,
                background: s.color,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
