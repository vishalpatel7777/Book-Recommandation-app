import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Shield, Clock, Search, ChevronLeft, ChevronRight, X, Mail, Calendar, Activity } from "lucide-react";
import api from "../../../services/axios";
import Loader from "../../common/Loader/Loader";

const PAGE_SIZE = 12;

function Avatar({ user, size = 32 }) {
  const initials = (user.username || user.email || "?").charAt(0).toUpperCase();
  const colors = ["var(--accent-sage)", "var(--accent-amber)", "var(--accent-info)", "var(--accent-gold-dark)"];
  const color = colors[initials.charCodeAt(0) % colors.length];
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden", border: "2px solid var(--bg-card)" }}>
      {user.image ? (
        <img src={user.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <span style={{ fontSize: size * 0.34 + "px", fontWeight: 700, color: "#fff", fontFamily: "var(--font-heading)" }}>{initials}</span>
      )}
    </div>
  );
}

function StatusBadge({ lastLogin }) {
  const now = Date.now();
  const loginTime = lastLogin ? new Date(lastLogin).getTime() : 0;
  const diffH = (now - loginTime) / 3600000;

  let label, bg, color, dot;
  if (!lastLogin) { label = "Never"; bg = "var(--bg-surface)"; color = "var(--text-faint)"; dot = "var(--border-medium)"; }
  else if (diffH < 1) { label = "Online"; bg = "rgba(92,122,94,0.1)"; color = "var(--accent-sage)"; dot = "var(--accent-sage)"; }
  else if (diffH < 24) { label = "Today"; bg = "rgba(184,158,80,0.1)"; color = "var(--accent-gold-dark)"; dot = "var(--accent-gold)"; }
  else if (diffH < 168) { label = "This week"; bg = "rgba(92,140,180,0.1)"; color = "var(--accent-info)"; dot = "var(--accent-info)"; }
  else { label = "Inactive"; bg = "var(--bg-surface)"; color = "var(--text-muted)"; dot = "var(--border-medium)"; }

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 8px", borderRadius: 20, background: bg, fontSize: "0.68rem", fontWeight: 600, color }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: dot, flexShrink: 0 }} />
      {label}
    </span>
  );
}

function formatDate(d) {
  if (!d) return "Never";
  const date = new Date(d);
  const now = new Date();
  const diffMs = now - date;
  const diffM = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);
  if (diffM < 1) return "Just now";
  if (diffM < 60) return `${diffM}m ago`;
  if (diffH < 24) return `${diffH}h ago`;
  if (diffD < 7) return `${diffD}d ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function UserDrawer({ user, onClose }) {
  return (
    <AnimatePresence>
      {user && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.25)", zIndex: 300, backdropFilter: "blur(2px)" }} />
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 360, background: "var(--bg-card)", borderLeft: "1px solid var(--border)", zIndex: 301, display: "flex", flexDirection: "column", overflow: "hidden" }}
          >
            {/* Header */}
            <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--border-light)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>User Detail</span>
              <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 6, background: "none", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-muted)" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-surface)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "none"}
              >
                <X size={12} />
              </button>
            </div>

            {/* Profile */}
            <div style={{ overflowY: "auto", flex: 1 }}>
              <div style={{ padding: "24px 18px 18px", borderBottom: "1px solid var(--border-light)", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <Avatar user={user} size={60} />
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>@{user.username}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 9px", borderRadius: 20, fontSize: "0.68rem", fontWeight: 600, background: user.role === "admin" ? "var(--accent-amber-bg)" : "var(--accent-sage-bg)", color: user.role === "admin" ? "var(--accent-amber-dark)" : "var(--accent-sage-text)", border: `1px solid ${user.role === "admin" ? "rgba(139,111,71,0.2)" : "var(--accent-sage-ring)"}` }}>
                      {user.role === "admin" && <Shield size={8} />} {user.role}
                    </span>
                    <StatusBadge lastLogin={user.lastLogin} />
                  </div>
                </div>
              </div>

              <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { icon: Mail, label: "Email", value: user.email },
                  { icon: Calendar, label: "Last Login", value: user.lastLogin ? new Date(user.lastLogin).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "Never" },
                  { icon: Activity, label: "Member Since", value: user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "Unknown" },
                ].map(({ icon: Icon, label, value }) => value && (
                  <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 7, background: "var(--bg-surface)", border: "1px solid var(--border-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={13} style={{ color: "var(--text-muted)" }} />
                    </div>
                    <div>
                      <p style={{ fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-faint)", marginBottom: 2 }}>{label}</p>
                      <p style={{ fontSize: "0.82rem", color: "var(--text-primary)", wordBreak: "break-all" }}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function UserActivity() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get("/user-activity")
      .then((r) => setUsers(r.data?.users ?? []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search) return users;
    const q = search.toLowerCase();
    return users.filter((u) => u.username?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.role?.toLowerCase().includes(q));
  }, [users, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (v) => { setSearch(v); setPage(1); };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Users size={14} style={{ color: "var(--accent-sage)" }} />
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)" }}>User Activity</h2>
          {!loading && <span style={{ fontSize: "0.68rem", padding: "1px 7px", borderRadius: 20, background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>{filtered.length}</span>}
        </div>
        <div style={{ position: "relative" }}>
          <Search size={12} style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text" placeholder="Search users…" value={search} onChange={(e) => handleSearch(e.target.value)}
            style={{ padding: "6px 10px 6px 28px", background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 7, fontSize: "0.78rem", color: "var(--text-primary)", fontFamily: "var(--font-body)", outline: "none", width: 200 }}
            onFocus={(e) => { e.target.style.borderColor = "var(--accent-sage)"; e.target.style.boxShadow = "0 0 0 2px var(--accent-sage-ring)"; }}
            onBlur={(e) => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ padding: "48px", display: "flex", justifyContent: "center" }}><Loader /></div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: "48px 20px", textAlign: "center" }}>
          <Users size={24} style={{ color: "var(--border-medium)", margin: "0 auto 10px" }} />
          <p style={{ fontSize: "0.83rem", color: "var(--text-muted)" }}>No users found</p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div style={{ border: "1px solid var(--border-light)", borderRadius: 8, overflow: "hidden" }}>
            {/* Header row */}
            <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 180px 120px 130px", alignItems: "center", gap: 0, padding: "8px 14px", background: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }}>
              {["", "User", "Email", "Role", "Last Active"].map((h, i) => (
                <span key={i} style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", paddingRight: 8 }}>{h}</span>
              ))}
            </div>

            {paged.map((u, i) => (
              <motion.div
                key={u._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.025 }}
                onClick={() => setSelected(u)}
                style={{ display: "grid", gridTemplateColumns: "40px 1fr 180px 120px 130px", alignItems: "center", padding: "10px 14px", borderBottom: "1px solid var(--border-light)", cursor: "pointer", transition: "background 0.1s" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-surface-hover)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <Avatar user={u} size={28} />
                <div style={{ minWidth: 0, paddingRight: 8 }}>
                  <p style={{ fontSize: "0.83rem", fontWeight: 500, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>@{u.username}</p>
                  {u.fullname && <p style={{ fontSize: "0.68rem", color: "var(--text-faint)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.fullname}</p>}
                </div>
                <p style={{ fontSize: "0.72rem", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 8 }}>{u.email}</p>
                <div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 20, fontSize: "0.68rem", fontWeight: 600, background: u.role === "admin" ? "var(--accent-amber-bg)" : "var(--accent-sage-bg)", color: u.role === "admin" ? "var(--accent-amber-dark)" : "var(--accent-sage-text)", border: `1px solid ${u.role === "admin" ? "rgba(139,111,71,0.2)" : "var(--accent-sage-ring)"}` }}>
                    {u.role === "admin" && <Shield size={8} />} {u.role}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <StatusBadge lastLogin={u.lastLogin} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, padding: "0 2px" }}>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
              <div style={{ display: "flex", gap: 4 }}>
                <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}
                  style={{ width: 30, height: 30, borderRadius: 6, border: "1px solid var(--border)", background: "none", cursor: page === 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: page === 1 ? "var(--text-faint)" : "var(--text-secondary)", opacity: page === 1 ? 0.5 : 1 }}>
                  <ChevronLeft size={13} />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const p = i + 1;
                  return (
                    <button key={p} onClick={() => setPage(p)}
                      style={{ width: 30, height: 30, borderRadius: 6, border: "1px solid var(--border)", background: page === p ? "var(--accent-sage)" : "none", cursor: "pointer", fontSize: "0.78rem", fontWeight: page === p ? 600 : 400, color: page === p ? "#fff" : "var(--text-secondary)", transition: "all 0.12s" }}>
                      {p}
                    </button>
                  );
                })}
                <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}
                  style={{ width: 30, height: 30, borderRadius: 6, border: "1px solid var(--border)", background: "none", cursor: page === totalPages ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: page === totalPages ? "var(--text-faint)" : "var(--text-secondary)", opacity: page === totalPages ? 0.5 : 1 }}>
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <UserDrawer user={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
