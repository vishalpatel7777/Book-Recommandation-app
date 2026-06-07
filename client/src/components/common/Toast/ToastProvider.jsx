import React, { createContext, useContext, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Heart, Check, AlertCircle, Info, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const ToastCtx = createContext(null);

const ICONS = {
  cart:    <ShoppingCart size={16} />,
  wishlist: <Heart size={16} />,
  success: <Check size={16} />,
  error:   <AlertCircle size={16} />,
  info:    <Info size={16} />,
  book:    <BookOpen size={16} />,
};

const COLORS = {
  cart:    { bg: "var(--accent-sage-bg)", border: "var(--accent-sage-ring)", icon: "var(--accent-sage)", bar: "var(--accent-sage)" },
  wishlist:{ bg: "rgba(184,84,80,0.06)", border: "rgba(184,84,80,0.18)", icon: "var(--accent-danger)", bar: "var(--accent-danger)" },
  success: { bg: "var(--accent-sage-bg)", border: "var(--accent-sage-ring)", icon: "var(--accent-sage)", bar: "var(--accent-sage)" },
  error:   { bg: "rgba(184,84,80,0.06)", border: "rgba(184,84,80,0.18)", icon: "var(--accent-danger)", bar: "var(--accent-danger)" },
  info:    { bg: "rgba(59,130,246,0.06)", border: "rgba(59,130,246,0.2)", icon: "#3b82f6", bar: "#3b82f6" },
  book:    { bg: "var(--accent-amber-bg)", border: "rgba(139,111,71,0.2)", icon: "var(--accent-amber)", bar: "var(--accent-amber)" },
};

let uid = 0;

function ToastItem({ toast, onRemove }) {
  const c = COLORS[toast.type] || COLORS.info;
  const duration = toast.duration || 4000;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      style={{
        width: 320,
        background: "var(--bg-card)",
        border: `1px solid ${c.border}`,
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-modal)",
        overflow: "hidden",
        position: "relative",
        marginBottom: "var(--space-2)",
      }}
    >
      {/* Progress bar */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: duration / 1000, ease: "linear" }}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: 2,
          width: "100%",
          background: c.bar,
          transformOrigin: "left center",
        }}
      />

      <div style={{ padding: "var(--space-4)", display: "flex", gap: "var(--space-3)", alignItems: "flex-start" }}>
        {/* Icon */}
        <div style={{ width: 32, height: 32, borderRadius: "var(--radius-sm)", background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: c.icon }}>
          {toast.thumbnail ? (
            <img src={toast.thumbnail} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "var(--radius-sm)" }} onError={(e) => { e.target.style.display = "none"; }} />
          ) : ICONS[toast.type]}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {toast.title && (
            <p style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-primary)", marginBottom: "2px" }}>{toast.title}</p>
          )}
          {toast.message && (
            <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", lineHeight: "var(--leading-relaxed)" }}>{toast.message}</p>
          )}
          {toast.action && (
            <Link
              to={toast.action.href}
              onClick={() => onRemove(toast.id)}
              style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: "var(--space-2)", fontSize: "var(--text-xs)", fontWeight: 600, color: c.icon, textDecoration: "none" }}
            >
              {toast.action.label} →
            </Link>
          )}
        </div>

        {/* Close */}
        <button
          onClick={() => onRemove(toast.id)}
          style={{ color: "var(--text-faint)", background: "none", border: "none", cursor: "pointer", padding: 2, flexShrink: 0, display: "flex", alignItems: "center" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-faint)"; }}
        >
          <X size={13} />
        </button>
      </div>
    </motion.div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((opts) => {
    const id = ++uid;
    const duration = opts.duration || 4000;
    const entry = { id, duration, ...opts };
    setToasts((prev) => [...prev.slice(-4), entry]);
    setTimeout(() => removeToast(id), duration + 300);
  }, [removeToast]);

  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <div style={{ position: "fixed", bottom: "var(--space-6)", right: "var(--space-6)", zIndex: 9999, display: "flex", flexDirection: "column-reverse", alignItems: "flex-end", pointerEvents: "none" }}>
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <div key={t.id} style={{ pointerEvents: "auto" }}>
              <ToastItem toast={t} onRemove={removeToast} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx.toast;
};
