import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ExpandableSection({ title, color = "#888", children }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        border: `1px solid ${color}33`,
        borderRadius: 8,
        overflow: "hidden",
        marginTop: 12,
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "10px 14px",
          background: `${color}08`,
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: color,
          fontSize: 12,
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 700,
        }}
      >
        <span>{title}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ fontSize: 14 }}
        >
          ▼
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "12px 14px" }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
