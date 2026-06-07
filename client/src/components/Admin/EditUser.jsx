import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Trash2, ShieldCheck, ShieldOff, Search,
  X, Mail, Phone, Calendar, UserCheck, UserX,
  Activity, ShoppingBag, MessageCircle, Shield, Clock,
} from "lucide-react";
import CustomAlert from "../common/Alert/CustomAlert";
import Loader from "../common/Loader/Loader";
import api from "../../services/axios";

function Avatar({ user, size = 40 }) {
  const initials = (user.username || "U").charAt(0).toUpperCase();
  const colors = ["var(--accent-sage)", "var(--accent-amber)", "var(--accent-info)", "var(--accent-gold-dark)"];
  const color = colors[initials.charCodeAt(0) % colors.length];
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden", border: "2px solid var(--bg-card)" }}>
      {user.image
        ? <img src={user.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : <span style={{ fontSize: size * 0.38 + "px", fontWeight: 700, color: "#fff", fontFamily: "var(--font-heading)" }}>{initials}</span>
      }
    </div>
  );
}

function RoleBadge({ role }) {
  if (role === "admin") return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 9px", borderRadius: 20, background: "var(--accent-amber-bg)", border: "1px solid rgba(139,111,71,0.2)", color: "var(--accent-amber-dark)", fontSize: "0.65rem", fontWeight: 600 }}>
      <ShieldCheck size={8} /> Admin
    </span>
  );
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 9px", borderRadius: 20, background: "var(--accent-sage-bg)", border: "1px solid var(--accent-sage-ring)", color: "var(--accent-sage-text)", fontSize: "0.65rem", fontWeight: 600 }}>
      <ShieldOff size={8} /> User
    </span>
  );
}

const DRAWER_TABS = [
  { key: "profile", label: "Profile", icon: UserCheck },
  { key: "activity", label: "Activity", icon: Activity },
  { key: "permissions", label: "Permissions", icon: Shield },
];

function CustomerDrawer({ user, onClose, onDelete }) {
  const [tab, setTab] = useState("profile");

  useEffect(() => { setTab("profile"); }, [user?._id]);

  if (!user) return null;

  const since = user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "Unknown";
  const lastLogin = user.lastLogin ? new Date(user.lastLogin).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "Never";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.28)", zIndex: 200, backdropFilter: "blur(2px)" }}
      />
      <motion.div
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        onClick={(e) => e.stopPropagation()}
        style={{ position: "fixed", top: 0, right: 0, width: 380, height: "100%", background: "var(--bg-card)", borderLeft: "1px solid var(--border)", display: "flex", flexDirection: "column", overflow: "hidden", zIndex: 201 }}
      >
        {/* Header */}
        <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border-light)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Customer</span>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 6, background: "none", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-muted)" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-surface)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "none"}
          >
            <X size={12} />
          </button>
        </div>

        {/* Identity block */}
        <div style={{ padding: "20px 18px 0", borderBottom: "1px solid var(--border-light)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <Avatar user={user} size={52} />
            <div style={{ minWidth: 0 }}>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.fullname || user.username}</p>
              <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: 6 }}>@{user.username}</p>
              <RoleBadge role={user.role} />
            </div>
          </div>
          {/* Tab bar */}
          <div style={{ display: "flex", gap: 0 }}>
            {DRAWER_TABS.map((t) => {
              const Icon = t.icon;
              return (
                <button key={t.key} onClick={() => setTab(t.key)}
                  style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", fontSize: "0.75rem", fontWeight: tab === t.key ? 600 : 400, color: tab === t.key ? "var(--text-primary)" : "var(--text-muted)", background: "none", border: "none", cursor: "pointer", borderBottom: tab === t.key ? "2px solid var(--accent-sage)" : "2px solid transparent", marginBottom: -1, transition: "all 0.12s" }}
                >
                  <Icon size={11} /> {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          <AnimatePresence mode="wait">
            {tab === "profile" && (
              <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                style={{ padding: "18px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { icon: Mail, label: "Email", value: user.email },
                    { icon: Phone, label: "Phone", value: user.phone || "Not set" },
                    { icon: Calendar, label: "Age", value: user.age ? `${user.age} years` : "Not set" },
                    { icon: UserCheck, label: "Member Since", value: since },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 12px", borderRadius: 8, background: "var(--bg-surface)", border: "1px solid var(--border-light)" }}>
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: "var(--bg-card)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon size={12} style={{ color: "var(--text-muted)" }} />
                      </div>
                      <div>
                        <p style={{ fontSize: "0.62rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-faint)", marginBottom: 2 }}>{label}</p>
                        <p style={{ fontSize: "0.82rem", color: "var(--text-primary)", wordBreak: "break-all" }}>{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {tab === "activity" && (
              <motion.div key="activity" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                style={{ padding: "18px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ padding: "12px 14px", borderRadius: 8, background: "var(--bg-surface)", border: "1px solid var(--border-light)", display: "flex", alignItems: "center", gap: 10 }}>
                    <Clock size={13} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-faint)", marginBottom: 2 }}>Last Login</p>
                      <p style={{ fontSize: "0.82rem", color: "var(--text-primary)" }}>{lastLogin}</p>
                    </div>
                  </div>
                  <div style={{ padding: "12px 14px", borderRadius: 8, background: "var(--accent-sage-bg)", border: "1px solid var(--accent-sage-ring)", display: "flex", alignItems: "center", gap: 10 }}>
                    <Shield size={13} style={{ color: "var(--accent-sage)", flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-faint)", marginBottom: 2 }}>Auth Method</p>
                      <p style={{ fontSize: "0.82rem", color: "var(--accent-sage-text)" }}>JWT + HttpOnly Cookie</p>
                    </div>
                  </div>
                  <div style={{ padding: "36px 20px", textAlign: "center", borderRadius: 8, background: "var(--bg-surface)", border: "1px solid var(--border-light)" }}>
                    <Activity size={20} style={{ color: "var(--border-medium)", margin: "0 auto 8px" }} />
                    <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 500 }}>Activity timeline</p>
                    <p style={{ fontSize: "0.68rem", color: "var(--text-faint)", marginTop: 3 }}>Available in a future release</p>
                  </div>
                </div>
              </motion.div>
            )}

            {tab === "permissions" && (
              <motion.div key="permissions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                style={{ padding: "18px" }}>
                <div style={{ padding: "14px 16px", borderRadius: 8, background: "var(--bg-surface)", border: "1px solid var(--border-light)", marginBottom: 10 }}>
                  <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: 8 }}>Current Role</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <RoleBadge role={user.role} />
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                      {user.role === "admin" ? "Full platform access" : "Read & purchase access"}
                    </span>
                  </div>
                </div>
                <div style={{ padding: "14px 16px", borderRadius: 8, background: "var(--accent-danger-bg)", border: "1px solid rgba(184,84,80,0.2)" }}>
                  <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--accent-danger)", marginBottom: 6 }}>Danger Zone</p>
                  <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: 12 }}>Permanently remove this customer account. This action cannot be undone.</p>
                  <button
                    onClick={() => onDelete(user._id)}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 7, background: "var(--accent-danger)", border: "none", color: "#fff", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", transition: "opacity 0.15s" }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = "0.85"}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                  >
                    <Trash2 size={12} /> Remove Customer
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

const EditUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const flash = (msg) => { setAlertMessage(msg); setShowAlert(true); setTimeout(() => setShowAlert(false), 2500); };

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/all-users");
      setUsers(res.data);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await api.delete(`/delete-user/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      setSelectedUser(null);
      flash("Customer removed");
    } catch (err) {
      flash(err.response?.data?.message || "Failed to remove customer");
    }
  };

  const metrics = useMemo(() => ({
    total: users.length,
    regular: users.filter((u) => u.role !== "admin").length,
    admins: users.filter((u) => u.role === "admin").length,
  }), [users]);

  const filtered = useMemo(() => {
    let list = users;
    if (roleFilter !== "all") list = list.filter((u) => u.role === roleFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((u) => u.username?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.fullname?.toLowerCase().includes(q));
    }
    return list;
  }, [users, search, roleFilter]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)", padding: "28px 28px 60px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Customers</h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 3 }}>Manage user accounts and access</p>
        </div>

        {/* Metric strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Total Customers", value: metrics.total, icon: Users, color: "var(--accent-sage)" },
            { label: "Regular Users", value: metrics.regular, icon: UserCheck, color: "var(--accent-info)" },
            { label: "Administrators", value: metrics.admins, icon: ShieldCheck, color: "var(--accent-amber)" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: `${color}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={15} style={{ color }} />
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1 }}>{value}</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, maxWidth: 300 }}>
            <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="text" placeholder="Search by name, email…" value={search} onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "7px 10px 7px 32px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 7, fontSize: "0.78rem", color: "var(--text-primary)", fontFamily: "var(--font-body)", outline: "none", boxSizing: "border-box" }}
              onFocus={(e) => { e.target.style.borderColor = "var(--accent-sage)"; e.target.style.boxShadow = "0 0 0 2px var(--accent-sage-ring)"; }}
              onBlur={(e) => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
            />
          </div>
          <div style={{ display: "flex", gap: 2, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, padding: 3 }}>
            {[["all", "All"], ["user", "Users"], ["admin", "Admins"]].map(([val, label]) => (
              <button key={val} onClick={() => setRoleFilter(val)}
                style={{ padding: "5px 11px", borderRadius: 5, border: roleFilter === val ? "1px solid var(--border)" : "1px solid transparent", background: roleFilter === val ? "var(--bg-page)" : "transparent", cursor: "pointer", fontSize: "0.75rem", fontWeight: roleFilter === val ? 600 : 400, color: roleFilter === val ? "var(--text-primary)" : "var(--text-secondary)", transition: "all 0.12s" }}>
                {label}
              </button>
            ))}
          </div>
          <span style={{ fontSize: "0.72rem", color: "var(--text-faint)", marginLeft: "auto" }}>{filtered.length} results</span>
        </div>

        {/* Table */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: 48, display: "flex", justifyContent: "center" }}><Loader /></div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 90px 110px", alignItems: "center", padding: "9px 16px", background: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }}>
                {["Customer", "Email", "Phone", "Role"].map((h) => (
                  <span key={h} style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</span>
                ))}
              </div>
              <AnimatePresence>
                {filtered.map((user, i) => (
                  <motion.div
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: i * 0.015 }}
                    style={{ display: "grid", gridTemplateColumns: "2fr 2fr 90px 110px", alignItems: "center", padding: "10px 16px", borderBottom: "1px solid var(--border-light)", cursor: "pointer", transition: "background 0.1s", background: selectedUser?._id === user._id ? "var(--accent-sage-bg)" : "transparent" }}
                    onMouseEnter={(e) => { if (selectedUser?._id !== user._id) e.currentTarget.style.background = "var(--bg-surface-hover)"; }}
                    onMouseLeave={(e) => { if (selectedUser?._id !== user._id) e.currentTarget.style.background = "transparent"; }}
                    onClick={() => setSelectedUser(user)}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                      <Avatar user={user} size={28} />
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: "0.83rem", fontWeight: 500, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.username}</p>
                        <p style={{ fontSize: "0.68rem", color: "var(--text-faint)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.fullname}</p>
                      </div>
                    </div>
                    <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 8 }}>{user.email}</p>
                    <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{user.phone || "—"}</p>
                    <RoleBadge role={user.role} />
                  </motion.div>
                ))}
              </AnimatePresence>
              {filtered.length === 0 && (
                <div style={{ padding: "48px 20px", textAlign: "center" }}>
                  <UserX size={24} style={{ color: "var(--border-medium)", margin: "0 auto 10px" }} />
                  <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>No customers found</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <CustomerDrawer user={selectedUser} onClose={() => setSelectedUser(null)} onDelete={deleteUser} />
      {showAlert && <CustomAlert message={alertMessage} onClose={() => setShowAlert(false)} />}
    </div>
  );
};

export default EditUser;
