import { useState, useEffect, useRef } from "react";
import { X, Check, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Primitive style objects ── */
export const st = {
  label:       { fontFamily: "var(--font-body)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 5, display: "block" },
  input:       { width: "100%", padding: "0.55rem 0.75rem", background: "var(--bg-page)", border: "1px solid var(--border-medium)", borderRadius: 6, color: "var(--text-primary)", fontFamily: "var(--font-body)", fontSize: "0.83rem", outline: "none", boxSizing: "border-box" },
  card:        { background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: "20px", marginBottom: 16 },
  th:          { textAlign: "left", padding: "8px 12px", fontFamily: "var(--font-body)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--text-faint)", borderBottom: "1px solid var(--border-light)" },
  td:          { padding: "9px 12px", fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--text-secondary)", borderBottom: "1px solid var(--border-light)", verticalAlign: "middle" },
  overlay:     { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
  modalBox:    { background: "var(--bg-card)", borderRadius: 12, width: "100%", maxWidth: 560, maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.25)", border: "1px solid var(--border)" },
  drawerBox:   { position: "fixed", top: 0, right: 0, height: "100vh", width: 480, background: "var(--bg-card)", borderLeft: "1px solid var(--border)", zIndex: 200, overflowY: "auto", display: "flex", flexDirection: "column", boxShadow: "-8px 0 32px rgba(0,0,0,0.15)" },
};

/* ── SectionTitle ── */
export function SectionTitle({ children, action }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em", margin: 0 }}>{children}</h2>
      {action}
    </div>
  );
}

/* ── StatusBadge ── */
export function StatusBadge({ status }) {
  const map = {
    active:    { bg: "rgba(92,122,94,0.12)",  color: "var(--accent-sage-text)",  border: "rgba(92,122,94,0.25)" },
    inactive:  { bg: "var(--bg-surface)",     color: "var(--text-muted)",         border: "var(--border)" },
    draft:     { bg: "rgba(139,111,71,0.1)",  color: "var(--accent-amber-dark)", border: "rgba(139,111,71,0.2)" },
    expired:   { bg: "var(--bg-surface)",     color: "var(--text-faint)",         border: "var(--border)" },
    scheduled: { bg: "rgba(59,130,246,0.1)",  color: "var(--accent-info)",        border: "rgba(59,130,246,0.25)" },
    approved:  { bg: "rgba(92,122,94,0.12)",  color: "var(--accent-sage-text)",  border: "rgba(92,122,94,0.25)" },
    pending:   { bg: "rgba(139,111,71,0.1)",  color: "var(--accent-amber-dark)", border: "rgba(139,111,71,0.2)" },
    rejected:  { bg: "rgba(184,84,80,0.1)",   color: "var(--accent-danger)",      border: "rgba(184,84,80,0.2)" },
    delivered: { bg: "rgba(92,122,94,0.12)",  color: "var(--accent-sage-text)",  border: "rgba(92,122,94,0.25)" },
    shipped:   { bg: "rgba(59,130,246,0.1)",  color: "var(--accent-info)",        border: "rgba(59,130,246,0.25)" },
    cancelled: { bg: "rgba(184,84,80,0.1)",   color: "var(--accent-danger)",      border: "rgba(184,84,80,0.2)" },
    open:      { bg: "rgba(184,84,80,0.1)",   color: "var(--accent-danger)",      border: "rgba(184,84,80,0.2)" },
    resolved:  { bg: "rgba(92,122,94,0.12)",  color: "var(--accent-sage-text)",  border: "rgba(92,122,94,0.25)" },
    completed: { bg: "rgba(92,122,94,0.12)",  color: "var(--accent-sage-text)",  border: "rgba(92,122,94,0.25)" },
    info:      { bg: "rgba(59,130,246,0.1)",  color: "var(--accent-info)",        border: "rgba(59,130,246,0.25)" },
    warn:      { bg: "rgba(139,111,71,0.1)",  color: "var(--accent-amber-dark)", border: "rgba(139,111,71,0.2)" },
    danger:    { bg: "rgba(184,84,80,0.1)",   color: "var(--accent-danger)",      border: "rgba(184,84,80,0.2)" },
    high:      { bg: "rgba(184,84,80,0.1)",   color: "var(--accent-danger)",      border: "rgba(184,84,80,0.2)" },
    medium:    { bg: "rgba(139,111,71,0.1)",  color: "var(--accent-amber-dark)", border: "rgba(139,111,71,0.2)" },
    low:       { bg: "rgba(59,130,246,0.1)",  color: "var(--accent-info)",        border: "rgba(59,130,246,0.25)" },
  };
  const s = map[status] || map.inactive;
  return (
    <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 20, fontSize: "0.65rem", fontWeight: 600, background: s.bg, color: s.color, border: `1px solid ${s.border}`, whiteSpace: "nowrap" }}>
      {status}
    </span>
  );
}

/* ── Toggle ── */
export function Toggle({ on, onToggle }) {
  return (
    <button onClick={onToggle}
      style={{ width: 40, height: 22, borderRadius: 11, border: "none", cursor: "pointer", background: on ? "var(--accent-sage)" : "var(--border-medium)", position: "relative", transition: "background 0.2s", flexShrink: 0 }}
    >
      <span style={{ position: "absolute", top: 3, left: on ? 21 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }} />
    </button>
  );
}

/* ── KpiRow ── */
export function KpiRow({ items }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${items.length}, 1fr)`, gap: 10, marginBottom: 20 }}>
      {items.map(({ label, value, icon: Icon, color, sub }) => (
        <div key={label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)" }}>{label}</span>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: `${color}14`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon size={12} style={{ color }} />
            </div>
          </div>
          <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1 }}>{value}</p>
          {sub && <p style={{ fontSize: "0.68rem", color: "var(--text-faint)", marginTop: 4 }}>{sub}</p>}
        </div>
      ))}
    </div>
  );
}

/* ── Toast system ── */
let _addToast = null;
export function useToastEmitter() { return _addToast; }
export function useToast() {
  return (msg, type = "success") => _addToast?.(msg, type);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    _addToast = (msg, type = "success") => {
      const id = Date.now();
      setToasts((t) => [...t, { id, msg, type }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
    };
  }, []);

  const icons = { success: CheckCircle, error: AlertTriangle, info: Info };
  const colors = { success: "var(--accent-sage)", error: "var(--accent-danger)", info: "var(--accent-info)" };

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 999, display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none" }}>
      <AnimatePresence>
        {toasts.map(({ id, msg, type }) => {
          const Icon = icons[type] || icons.success;
          return (
            <motion.div key={id} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, boxShadow: "var(--shadow-md)", minWidth: 240, pointerEvents: "all" }}>
              <Icon size={14} style={{ color: colors[type], flexShrink: 0 }} />
              <span style={{ fontSize: "0.82rem", color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>{msg}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

/* ── Modal wrapper ── */
export function Modal({ open, onClose, title, children, width = 560 }) {
  if (!open) return null;
  return (
    <div style={st.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
        style={{ ...st.modalBox, maxWidth: width }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid var(--border-light)" }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4, borderRadius: 4, display: "flex" }}><X size={16} /></button>
        </div>
        <div style={{ padding: "20px 22px" }}>{children}</div>
      </motion.div>
    </div>
  );
}

/* ── Confirm dialog ── */
export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = "Delete", danger = true }) {
  if (!open) return null;
  return (
    <div style={st.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        style={{ ...st.modalBox, maxWidth: 420 }}>
        <div style={{ padding: "24px" }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: danger ? "rgba(184,84,80,0.1)" : "rgba(139,111,71,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
            <AlertTriangle size={18} style={{ color: danger ? "var(--accent-danger)" : "var(--accent-amber)" }} />
          </div>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>{title}</h3>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.5, marginBottom: 22 }}>{message}</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button onClick={onClose} className="btn btn-secondary btn-sm">Cancel</button>
            <button onClick={() => { onConfirm(); onClose(); }} style={{ padding: "6px 16px", borderRadius: 6, border: "none", cursor: "pointer", background: danger ? "var(--accent-danger)" : "var(--accent-amber)", color: "#fff", fontSize: "0.82rem", fontWeight: 600, fontFamily: "var(--font-body)" }}>{confirmLabel}</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Drawer ── */
export function Drawer({ open, onClose, title, children, width = 480 }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 199 }} onClick={onClose} />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "tween", duration: 0.25 }}
            style={{ ...st.drawerBox, width }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid var(--border-light)", flexShrink: 0 }}>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>{title}</h3>
              <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4, borderRadius: 4, display: "flex" }}><X size={16} /></button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px" }}>{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── SearchBar ── */
export function SearchBar({ value, onChange, placeholder = "Search…" }) {
  return (
    <div style={{ position: "relative" }}>
      <svg style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        style={{ ...st.input, paddingLeft: 32, width: 220, height: 34 }} />
    </div>
  );
}

/* ── EmptyState ── */
export function EmptyState({ icon: Icon, title, desc, action }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 20px", color: "var(--text-faint)" }}>
      {Icon && <Icon size={32} style={{ marginBottom: 12, color: "var(--border-medium)" }} />}
      <p style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--text-muted)", marginBottom: 6 }}>{title}</p>
      <p style={{ fontSize: "0.78rem", color: "var(--text-faint)", marginBottom: action ? 16 : 0 }}>{desc}</p>
      {action}
    </div>
  );
}

/* ── Skeleton row ── */
export function SkeletonRow({ cols = 5 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} style={{ padding: "12px" }}>
          <div style={{ height: 14, borderRadius: 4, background: "var(--bg-surface)", animation: "pulse 1.5s ease-in-out infinite" }} />
        </td>
      ))}
    </tr>
  );
}

/* ── Field helper ── */
export function Field({ label: lbl, children, hint }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <span style={st.label}>{lbl}</span>
      {children}
      {hint && <p style={{ fontSize: "0.68rem", color: "var(--text-faint)", marginTop: 4 }}>{hint}</p>}
    </div>
  );
}

/* ── ActionBtn ── */
export function ActionBtn({ onClick, children, variant = "ghost", small = true }) {
  const base = { padding: small ? "3px 9px" : "6px 14px", borderRadius: 5, fontSize: small ? "0.68rem" : "0.78rem", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 500, transition: "all 0.12s", border: "1px solid var(--border)", background: "none", color: "var(--text-muted)" };
  const danger = { ...base, border: "1px solid var(--accent-danger)", color: "var(--accent-danger)" };
  const primary = { ...base, background: "var(--accent-sage)", border: "1px solid var(--accent-sage)", color: "#fff" };
  const styles = variant === "danger" ? danger : variant === "primary" ? primary : base;
  return <button style={styles} onClick={onClick}>{children}</button>;
}

/* ── Checkbox ── */
export function Checkbox({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)}
      style={{ width: 16, height: 16, borderRadius: 3, border: checked ? "none" : "1.5px solid var(--border-medium)", background: checked ? "var(--accent-sage)" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {checked && <Check size={10} color="#fff" />}
    </button>
  );
}

/* ── Pagination ── */
export function Pagination({ page, total, perPage, onChange }) {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end", marginTop: 14 }}>
      <span style={{ fontSize: "0.72rem", color: "var(--text-faint)", marginRight: 6 }}>{total} results</span>
      {Array.from({ length: pages }).map((_, i) => (
        <button key={i} onClick={() => onChange(i + 1)}
          style={{ width: 28, height: 28, borderRadius: 5, border: `1px solid ${page === i + 1 ? "var(--accent-sage)" : "var(--border)"}`, background: page === i + 1 ? "var(--accent-sage-bg)" : "none", color: page === i + 1 ? "var(--accent-sage-text)" : "var(--text-muted)", fontSize: "0.72rem", cursor: "pointer", fontFamily: "var(--font-body)" }}>
          {i + 1}
        </button>
      ))}
    </div>
  );
}
