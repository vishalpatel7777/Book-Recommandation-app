import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const CustomAlert = ({ message, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center"
    style={{ background: "var(--bg-overlay)", backdropFilter: "blur(4px)" }}
    onClick={onClose}
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.18 }}
      style={{
        width: "100%",
        maxWidth: "24rem",
        margin: "0 var(--space-4)",
        padding: "var(--space-6)",
        borderRadius: "var(--radius-md)",
        background: "var(--bg-card)",
        border: `1px solid var(--border)`,
        boxShadow: "var(--shadow-modal)",
        position: "relative",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onClose}
        style={{ position: "absolute", top: "var(--space-4)", right: "var(--space-4)", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", transition: "var(--transition-color)" }}
        onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
        onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
      >
        <X size={15} />
      </button>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "var(--space-4)" }}>
        <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: "var(--leading-relaxed)" }}>{message}</p>
        <button onClick={onClose} className="btn btn-primary" style={{ padding: "var(--space-2) var(--space-6)" }}>
          Got it
        </button>
      </div>
    </motion.div>
  </motion.div>
);

export default CustomAlert;
