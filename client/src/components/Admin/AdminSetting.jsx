import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, User, Bell, Monitor } from "lucide-react";
import CustomAlert from "../common/Alert/CustomAlert";
import api from "../../services/axios";
import { useAdminProfile } from "../../hooks";
import Loader from "../common/Loader/Loader";

const TABS = [
  { key: "profile", label: "Profile", icon: User },
  { key: "security", label: "Security", icon: Lock },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "preferences", label: "Preferences", icon: Monitor },
];

const inputStyle = {
  width: "100%", padding: "9px 12px",
  background: "var(--bg-surface)", border: "1px solid var(--border)",
  borderRadius: 7, color: "var(--text-primary)", fontSize: "0.83rem",
  fontFamily: "var(--font-body)", outline: "none",
  transition: "border-color 0.15s, box-shadow 0.15s", boxSizing: "border-box",
};

function InputField({ label, hint, ...props }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>
      <input
        {...props}
        style={inputStyle}
        onFocus={(e) => { e.target.style.borderColor = "var(--accent-sage)"; e.target.style.boxShadow = "0 0 0 2px var(--accent-sage-ring)"; }}
        onBlur={(e) => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
      />
      {hint && <p style={{ fontSize: "0.68rem", color: "var(--text-faint)", marginTop: 4, fontFamily: "var(--font-body)" }}>{hint}</p>}
    </div>
  );
}

function ToggleRow({ label, desc, value, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 0", borderBottom: "1px solid var(--border-light)" }}>
      <div>
        <p style={{ fontSize: "0.83rem", fontWeight: 500, color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>{label}</p>
        {desc && <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 2 }}>{desc}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        style={{ width: 38, height: 22, borderRadius: 11, background: value ? "var(--accent-sage)" : "var(--border-medium)", border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}
      >
        <div style={{ position: "absolute", top: 3, left: value ? 18 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
      </button>
    </div>
  );
}

export default function AdminSettings() {
  const { admin, setAdmin, loading } = useAdminProfile();
  const [tab, setTab] = useState("profile");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [formData, setFormData] = useState({ fullname: "", email: "", age: "", genre: "", phone: "" });
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "", confirm: "" });
  const [notifs, setNotifs] = useState({ email: true, orders: true, users: false, refunds: false, reviews: false, catalog: true, security: true, sessions: true });
  const [prefs, setPrefs] = useState({ compact: false, animations: true });

  useEffect(() => {
    if (admin) setFormData({ fullname: admin.fullname || "", email: admin.email || "", age: admin.age || "", genre: admin.genre || "", phone: admin.phone || "" });
  }, [admin]);

  const alert = (msg) => { setAlertMessage(msg); setShowAlert(true); setTimeout(() => setShowAlert(false), 2500); };

  const handleUpdate = async () => {
    try {
      const res = await api.put("/update-admin-profile", formData);
      setAdmin(res.data);
      alert("Profile updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleChangePwd = async () => {
    if (!passwords.oldPassword || !passwords.newPassword) { alert("Fill in all password fields"); return; }
    if (passwords.newPassword !== passwords.confirm) { alert("New passwords do not match"); return; }
    try {
      await api.put("/update-admin-profile", { oldPassword: passwords.oldPassword, password: passwords.newPassword });
      setPasswords({ oldPassword: "", newPassword: "", confirm: "" });
      alert("Password changed successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to change password");
    }
  };

  if (loading) return <div style={{ minHeight: "100vh", background: "var(--bg-page)", display: "flex", alignItems: "center", justifyContent: "center" }}><Loader /></div>;
  if (!admin) return <p style={{ textAlign: "center", padding: "64px 16px", color: "var(--text-muted)", fontSize: "0.875rem" }}>Error loading profile.</p>;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)", padding: "28px 28px 60px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Settings</h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 3 }}>Manage your account and preferences</p>
        </div>

        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
          {/* Tab nav */}
          <div style={{ width: 180, flexShrink: 0 }}>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", padding: "6px 0" }}>
              {TABS.map((t) => {
                const Icon = t.icon;
                const active = tab === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "9px 14px", background: active ? "var(--accent-sage-bg)" : "transparent", borderLeft: `2px solid ${active ? "var(--accent-sage)" : "transparent"}`, border: "none", cursor: "pointer", textAlign: "left", transition: "all 0.12s" }}
                    onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "var(--bg-surface)"; }}
                    onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
                  >
                    <Icon size={13} style={{ color: active ? "var(--accent-sage)" : "var(--text-muted)" }} />
                    <span style={{ fontSize: "0.82rem", fontWeight: active ? 600 : 400, color: active ? "var(--accent-sage-text)" : "var(--text-secondary)", fontFamily: "var(--font-body)" }}>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <AnimatePresence mode="wait">
              {tab === "profile" && (
                <motion.div key="profile" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}
                >
                  <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-light)" }}>
                    <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)" }}>Profile Information</h2>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>Update your personal details</p>
                  </div>
                  <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <InputField label="Full Name" type="text" name="fullname" value={formData.fullname} onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} placeholder="Full name" />
                      <InputField label="Username" type="text" value={admin.username || ""} disabled placeholder="Username" />
                    </div>
                    <InputField label="Email Address" type="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} placeholder="Email address" />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <InputField label="Phone" type="text" name="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} placeholder="+91 XXXXX XXXXX" />
                      <InputField label="Age" type="number" name="age" value={formData.age} onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} placeholder="Age" />
                    </div>
                    <InputField label="Favourite Genre" type="text" name="genre" value={formData.genre} onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} placeholder="e.g. Fiction" />
                    <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 4 }}>
                      <button onClick={handleUpdate} style={{ padding: "9px 20px", background: "var(--accent-sage)", border: "none", borderRadius: 7, color: "#fff", fontSize: "0.83rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)", transition: "background 0.15s" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "var(--accent-sage-dark)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "var(--accent-sage)"}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {tab === "security" && (
                <motion.div key="security" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                  style={{ display: "flex", flexDirection: "column", gap: 14 }}
                >
                  <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
                    <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-light)" }}>
                      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)" }}>Change Password</h2>
                    </div>
                    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
                      <InputField label="Current Password" type="password" name="oldPassword" value={passwords.oldPassword} onChange={(e) => setPasswords({ ...passwords, [e.target.name]: e.target.value })} placeholder="••••••••" />
                      <InputField label="New Password" type="password" name="newPassword" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, [e.target.name]: e.target.value })} placeholder="Min. 8 characters" hint="Choose a strong password with mixed characters" />
                      <InputField label="Confirm Password" type="password" name="confirm" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, [e.target.name]: e.target.value })} placeholder="Repeat new password" />
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button onClick={handleChangePwd} style={{ padding: "9px 20px", background: "var(--accent-danger-bg)", border: "1px solid var(--border-danger)", borderRadius: 7, color: "var(--accent-danger)", fontSize: "0.83rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)", transition: "background 0.15s" }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(184,84,80,0.14)"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "var(--accent-danger-bg)"}
                        >
                          Update Password
                        </button>
                      </div>
                    </div>
                  </div>

                  <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
                    <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-light)" }}>
                      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)" }}>Session</h2>
                    </div>
                    <div style={{ padding: "4px 20px" }}>
                      <ToggleRow label="Active session" desc="Authenticated via HttpOnly JWT cookie" value={true} onChange={() => {}} />
                    </div>
                  </div>
                </motion.div>
              )}

              {tab === "notifications" && (
                <motion.div key="notifications" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                  style={{ display: "flex", flexDirection: "column", gap: 14 }}
                >
                  {[
                    {
                      group: "Orders & Transactions",
                      rows: [
                        { key: "orders", label: "New orders", desc: "Alert when a customer completes a purchase" },
                        { key: "refunds", label: "Refund requests", desc: "Notify when a refund is initiated" },
                      ],
                    },
                    {
                      group: "Users & Accounts",
                      rows: [
                        { key: "users", label: "New registrations", desc: "Alert when a new user signs up" },
                        { key: "email", label: "Email digest", desc: "Daily summary of platform activity via email" },
                      ],
                    },
                    {
                      group: "Content & Reviews",
                      rows: [
                        { key: "reviews", label: "New reviews", desc: "Alert when a user leaves a book review" },
                        { key: "catalog", label: "Catalog changes", desc: "Notify when books are added or removed" },
                      ],
                    },
                    {
                      group: "Security",
                      rows: [
                        { key: "security", label: "Security alerts", desc: "Alert on suspicious login attempts or access from new devices" },
                        { key: "sessions", label: "Session events", desc: "Notify when admin sessions start or expire" },
                      ],
                    },
                  ].map((section) => (
                    <div key={section.group} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
                      <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--border-light)", background: "var(--bg-surface)" }}>
                        <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)" }}>{section.group}</p>
                      </div>
                      <div style={{ padding: "0 20px" }}>
                        {section.rows.map((row) => (
                          <ToggleRow
                            key={row.key}
                            label={row.label}
                            desc={row.desc}
                            value={!!notifs[row.key]}
                            onChange={(v) => setNotifs({ ...notifs, [row.key]: v })}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {tab === "preferences" && (
                <motion.div key="preferences" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}
                >
                  <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-light)" }}>
                    <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)" }}>Display Preferences</h2>
                  </div>
                  <div style={{ padding: "0 20px" }}>
                    <ToggleRow label="Compact mode" desc="Reduce spacing for denser layouts" value={prefs.compact} onChange={(v) => setPrefs({ ...prefs, compact: v })} />
                    <ToggleRow label="Animations" desc="Enable motion and transitions" value={prefs.animations} onChange={(v) => setPrefs({ ...prefs, animations: v })} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {showAlert && <CustomAlert message={alertMessage} onClose={() => setShowAlert(false)} />}
    </div>
  );
}
