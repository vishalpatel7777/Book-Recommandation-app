import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, X, HelpCircle } from "lucide-react";
import { CMS_FAQ } from "../../../store/cmsStore";
import { useFaqLive } from "../../../hooks/useCmsLive";

const STATIC_FAQ = CMS_FAQ;
const CATEGORIES_STATIC = ["All", ...new Set(STATIC_FAQ.map((f) => f.category))];

const FaqItem = ({ faq, isOpen, onToggle }) => (
  <div
    style={{
      background: "var(--bg-card)",
      border: `1px solid ${isOpen ? "var(--accent-sage-ring)" : "var(--border)"}`,
      borderRadius: "var(--radius-md)",
      overflow: "hidden",
      transition: "border-color 0.15s",
    }}
  >
    <button
      onClick={onToggle}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "var(--space-5)",
        background: isOpen ? "var(--accent-sage-bg)" : "transparent",
        border: "none",
        cursor: "pointer",
        textAlign: "left",
        gap: "var(--space-4)",
        transition: "background 0.15s",
      }}
    >
      <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", fontWeight: 600, color: isOpen ? "var(--accent-sage-text)" : "var(--text-primary)", lineHeight: "var(--leading-snug)" }}>
        {faq.question}
      </span>
      <ChevronDown
        size={15}
        style={{ color: isOpen ? "var(--accent-sage)" : "var(--text-muted)", transition: "transform 0.25s", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}
      />
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.22 }}
          style={{ overflow: "hidden" }}
        >
          <div style={{ padding: "0 var(--space-5) var(--space-5)", borderTop: `1px solid var(--border-light)` }}>
            <p style={{ paddingTop: "var(--space-4)", fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: "var(--leading-relaxed)" }}>
              {faq.answer}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const Faq = () => {
  const [openId, setOpenId] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const { items: liveItems, loading } = useFaqLive();
  const items = liveItems ?? STATIC_FAQ;
  const CATEGORIES = liveItems ? ["All", ...new Set(items.map((f) => f.category))] : CATEGORIES_STATIC;

  const filtered = items.filter((f) => {
    if (category !== "All" && f.category !== category) return false;
    if (search && !String(f.question||"").toLowerCase().includes(search.toLowerCase()) && !String(f.answer||"").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-2)" }}>
        <HelpCircle size={16} style={{ color: "var(--accent-sage)" }} />
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 600, color: "var(--text-primary)" }}>
          Frequently Asked Questions
        </h2>
      </div>
      <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", marginBottom: "var(--space-6)" }}>
        Everything you need to know about BookMosaic. {loading ? "· loading…" : liveItems ? "· live" : "· sample questions"}
      </p>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: "var(--space-5)" }}>
        <Search size={13} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions…"
          style={{ width: "100%", paddingLeft: 34, paddingRight: search ? 32 : 12, paddingTop: "0.55rem", paddingBottom: "0.55rem", border: `1px solid var(--border-medium)`, borderRadius: "var(--radius-sm)", background: "var(--bg-page)", color: "var(--text-primary)", fontSize: "var(--text-sm)", fontFamily: "var(--font-body)", outline: "none" }}
          onFocus={(e) => { e.target.style.borderColor = "var(--accent-sage)"; }}
          onBlur={(e) => { e.target.style.borderColor = "var(--border-medium)"; }}
        />
        {search && (
          <button onClick={() => setSearch("")} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 2 }}>
            <X size={12} />
          </button>
        )}
      </div>

      {/* Category pills */}
      <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap", marginBottom: "var(--space-6)" }}>
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCategory(c)}
            style={{ padding: "3px 14px", borderRadius: "var(--radius-full)", border: `1px solid ${category === c ? "var(--accent-sage)" : "var(--border)"}`, background: category === c ? "var(--accent-sage-bg)" : "transparent", color: category === c ? "var(--accent-sage-text)" : "var(--text-secondary)", fontSize: "var(--text-xs)", fontWeight: category === c ? 600 : 400, cursor: "pointer", transition: "all 0.12s", fontFamily: "var(--font-body)" }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* FAQ list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        {filtered.map((faq) => (
          <FaqItem
            key={faq.id}
            faq={faq}
            isOpen={openId === faq.id}
            onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "var(--space-10) 0" }}>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>No results for "{search}". Try a different search.</p>
        </div>
      )}
    </div>
  );
};

export default Faq;
