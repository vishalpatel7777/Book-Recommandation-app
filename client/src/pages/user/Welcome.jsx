import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Welcome() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/"), 3500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--bg-dark)", cursor: "pointer" }}
      onClick={() => navigate("/")}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}
      >
        <div style={{ width: 52, height: 52, background: "var(--accent-sage)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "var(--space-6)" }}>
          <svg width="26" height="26" viewBox="0 0 14 14" fill="none">
            <path d="M2 2.5h10M2 5h10M2 7.5h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <rect x="7" y="6.5" width="5" height="5" rx="0.75" fill="white" opacity="0.7"/>
          </svg>
        </div>
        <p style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xs)", fontWeight: 400, color: "var(--accent-sage)", letterSpacing: "var(--tracking-widest)", textTransform: "uppercase", marginBottom: "var(--space-4)" }}>
          Welcome to
        </p>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 6vw, 3.5rem)", fontWeight: 600, color: "var(--text-inverse)", letterSpacing: "var(--tracking-tight)", marginBottom: "var(--space-6)" }}>
          BookMosaic
        </h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); navigate("/"); }}
            style={{
              padding: "var(--space-3) var(--space-8)", borderRadius: "var(--radius-sm)",
              fontSize: "var(--text-sm)", fontWeight: 500,
              border: "1px solid rgba(245,240,232,0.2)", color: "var(--text-inverse)",
              background: "transparent", cursor: "pointer", transition: "var(--transition)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(245,240,232,0.08)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            Enter the Library
          </button>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          style={{ fontSize: "var(--text-xs)", color: "var(--text-faint)", marginTop: "var(--space-10)", letterSpacing: "var(--tracking-wide)" }}
        >
          Redirecting automatically...
        </motion.p>
      </motion.div>
    </div>
  );
}

export default Welcome;
