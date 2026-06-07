import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Download, ArrowRight } from "lucide-react";

const Thankyou = () => {
  const handleDownload = () => {
    alert("Your PDF download will start soon!");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 var(--space-4)", background: "var(--bg-page)" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{ width: "100%", maxWidth: "24rem", textAlign: "center" }}
      >
        <div style={{ borderRadius: "var(--radius-sm)", padding: "var(--space-10)", background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-card)" }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            style={{
              width: 64, height: 64, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto var(--space-6)",
              background: "var(--accent-sage-bg)", border: "1px solid var(--accent-sage-mid)",
            }}
          >
            <CheckCircle size={28} style={{ color: "var(--accent-sage)" }} />
          </motion.div>

          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontWeight: 600, color: "var(--text-primary)", marginBottom: "var(--space-3)" }}>Order Confirmed</h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: "var(--space-8)", fontSize: "var(--text-sm)", lineHeight: "var(--leading-relaxed)" }}>
            Thank you for your purchase. Your book is ready to download — we hope you enjoy every page.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <button onClick={handleDownload} className="btn btn-primary w-full flex items-center justify-center gap-2">
              <Download size={14} /> Download PDF
            </button>
            <Link to="/" style={{ textDecoration: "none" }}>
              <button className="btn btn-secondary w-full flex items-center justify-center gap-2">
                Continue Browsing <ArrowRight size={13} />
              </button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Thankyou;
