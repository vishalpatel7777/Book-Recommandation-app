import { motion } from "framer-motion";
import { Shield, User, Mail, Phone, Calendar, BookOpen, Edit3, Clock, Activity } from "lucide-react";
import { useAdminProfile } from "../../hooks";
import { useNavigate } from "react-router-dom";
import Loader from "../common/Loader/Loader";

const INFO_SECTIONS = [
  {
    title: "Account",
    icon: User,
    accent: "var(--accent-sage)",
    fields: [
      { label: "Full Name", key: "fullname", icon: User },
      { label: "Email Address", key: "email", icon: Mail },
      { label: "Phone", key: "phone", format: (v) => v ? `+91 ${v}` : null, icon: Phone },
    ],
  },
  {
    title: "Preferences",
    icon: BookOpen,
    accent: "var(--accent-amber)",
    fields: [
      { label: "Favourite Genre", key: "genre", icon: BookOpen },
      { label: "Age", key: "age", icon: Calendar },
    ],
  },
];

export default function AdminProfile() {
  const { admin, loading, error } = useAdminProfile();
  const navigate = useNavigate();

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Loader />
    </div>
  );
  if (error || !admin) return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>{error || "Failed to load profile."}</p>
    </div>
  );

  const initials = (admin.username || "A").charAt(0).toUpperCase();

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)", padding: "28px 28px 60px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", marginBottom: 18 }}>
            {/* Banner */}
            <div style={{ height: 100, background: "linear-gradient(120deg, var(--accent-sage) 0%, var(--accent-sage-dark) 100%)", position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, opacity: 0.12, backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.3) 0, rgba(255,255,255,0.3) 1px, transparent 0, transparent 50%)", backgroundSize: "20px 20px" }} />
            </div>

            {/* Identity */}
            <div style={{ padding: "0 28px 24px", position: "relative" }}>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
                  {/* Avatar */}
                  <div style={{ width: 72, height: 72, borderRadius: "50%", border: "3px solid var(--bg-card)", overflow: "hidden", marginTop: -36, background: "var(--accent-sage)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative" }}>
                    {admin.image ? (
                      <img src={admin.image} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 700, color: "#fff" }}>{initials}</span>
                    )}
                    <div style={{ position: "absolute", bottom: 2, right: 2, width: 16, height: 16, borderRadius: "50%", background: "var(--accent-amber)", border: "2px solid var(--bg-card)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Shield size={7} style={{ color: "#fff" }} />
                    </div>
                  </div>

                  <div style={{ paddingBottom: 4 }}>
                    <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.2, marginBottom: 4 }}>
                      {admin.fullname || admin.username}
                    </h1>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>@{admin.username}</span>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 9px", borderRadius: 20, background: "var(--accent-amber-bg)", border: "1px solid rgba(139,111,71,0.2)", color: "var(--accent-amber-dark)", fontSize: "0.68rem", fontWeight: 600 }}>
                        <Shield size={9} />
                        Administrator
                      </div>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 9px", borderRadius: 20, background: "rgba(92,122,94,0.1)", border: "1px solid rgba(92,122,94,0.2)", color: "var(--accent-sage)", fontSize: "0.68rem", fontWeight: 600 }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--accent-sage)" }} />
                        Active
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/admin/settings")}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 8, cursor: "pointer", fontSize: "0.78rem", fontWeight: 500, color: "var(--text-secondary)", fontFamily: "var(--font-body)", transition: "all 0.15s", marginBottom: 4 }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent-sage)"; e.currentTarget.style.color = "var(--accent-sage)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                >
                  <Edit3 size={12} />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Info cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {INFO_SECTIONS.map((section, si) => {
            const SectionIcon = section.icon;
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.08 + si * 0.06 }}
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}
              >
                <div style={{ padding: "13px 18px", borderBottom: "1px solid var(--border-light)", display: "flex", alignItems: "center", gap: 8 }}>
                  <SectionIcon size={13} style={{ color: section.accent }} />
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", fontWeight: 600, color: "var(--text-primary)" }}>{section.title}</span>
                </div>
                <div style={{ padding: "12px 0" }}>
                  {section.fields.map(({ label, key, icon: FieldIcon, format }) => {
                    const raw = admin[key];
                    const value = format ? format(raw) : raw;
                    return (
                      <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 18px" }}>
                        <div style={{ width: 28, height: 28, borderRadius: 6, background: `${section.accent}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <FieldIcon size={12} style={{ color: section.accent }} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: "0.62rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-faint)", marginBottom: 2 }}>{label}</p>
                          <p style={{ fontSize: "0.83rem", color: value ? "var(--text-primary)" : "var(--text-faint)", fontFamily: "var(--font-body)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value || "Not set"}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}

          {/* Security */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.2 }}
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}
          >
            <div style={{ padding: "13px 18px", borderBottom: "1px solid var(--border-light)", display: "flex", alignItems: "center", gap: 8 }}>
              <Shield size={13} style={{ color: "var(--accent-info)" }} />
              <span style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", fontWeight: 600, color: "var(--text-primary)" }}>Security</span>
            </div>
            <div style={{ padding: "14px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div>
                  <p style={{ fontSize: "0.83rem", fontWeight: 500, color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>Password</p>
                  <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>Last changed: unknown</p>
                </div>
                <button
                  onClick={() => navigate("/admin/settings")}
                  style={{ fontSize: "0.75rem", fontWeight: 500, color: "var(--accent-sage)", background: "none", border: "1px solid var(--accent-sage-ring)", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontFamily: "var(--font-body)" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "var(--accent-sage-bg)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                >
                  Change
                </button>
              </div>
              <div style={{ padding: "8px 12px", borderRadius: 7, background: "var(--accent-sage-bg)", border: "1px solid var(--accent-sage-ring)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-sage)" }} />
                  <span style={{ fontSize: "0.72rem", color: "var(--accent-sage-text)", fontFamily: "var(--font-body)" }}>Session secured via HttpOnly cookie</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Activity placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.26 }}
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}
          >
            <div style={{ padding: "13px 18px", borderBottom: "1px solid var(--border-light)", display: "flex", alignItems: "center", gap: 8 }}>
              <Activity size={13} style={{ color: "var(--accent-gold)" }} />
              <span style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", fontWeight: 600, color: "var(--text-primary)" }}>Activity</span>
            </div>
            <div style={{ padding: "14px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: "1px solid var(--border-light)" }}>
                <Clock size={12} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>Session started this session</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0" }}>
                <Shield size={12} style={{ color: "var(--accent-sage)", flexShrink: 0 }} />
                <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>Authentication: JWT + HttpOnly</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
