import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, Settings, BookHeart, FileText, Shield, BookOpen, HelpCircle, User } from "lucide-react";
import Loader from "../../components/common/Loader/Loader";
import { logout } from "../../store/slices/auth.slice";
import api from "../../services/axios";

const SIDEBAR_ITEMS = [
  { name: "Wishlist", path: "/profile/wishlist", icon: <BookHeart size={14} /> },
  { name: "Edit Profile", path: "/profile/edit-profile", icon: <Settings size={14} /> },
  { name: "Blog", path: "/profile/blog", icon: <BookOpen size={14} /> },
  { name: "Best Authors", path: "/profile/best-author", icon: <User size={14} /> },
  { name: "FAQ", path: "/profile/faq", icon: <HelpCircle size={14} /> },
  { name: "Terms", path: "/profile/terms", icon: <FileText size={14} /> },
  { name: "Privacy", path: "/profile/privacy-policy", icon: <Shield size={14} /> },
];

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(undefined);

  useEffect(() => {
    api.get("/user-information")
      .then((r) => setProfile(r.data))
      .catch((err) => {
        setProfile(null);
        if (err.response?.status === 401 || err.response?.status === 403) navigate("/login");
      });
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  if (profile === undefined) return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-page)" }}>
      <Loader />
    </div>
  );

  if (profile === null) return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-page)" }}>
      <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
        Could not load profile.{" "}
        <button onClick={() => navigate("/login")} style={{ color: "var(--accent-sage)", background: "none", border: "none", cursor: "pointer" }}>Sign in</button>
      </p>
    </div>
  );

  const isBase = location.pathname === "/profile" || location.pathname === "/profile/";
  const initials = (profile.fullname || profile.username || "U").charAt(0).toUpperCase();

  return (
    <div style={{ minHeight: "100vh", padding: "var(--space-10) var(--space-6)", maxWidth: "72rem", margin: "0 auto", background: "var(--bg-page)" }}>
      <div style={{ display: "flex", gap: "var(--space-8)" }}>
        {/* Sidebar */}
        <div style={{ width: "13rem", flexShrink: 0 }}>
          <div style={{ borderRadius: "var(--radius-sm)", overflow: "hidden", position: "sticky", top: "6rem", background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            {/* User card */}
            <div style={{ padding: "var(--space-5)", textAlign: "center", borderBottom: "1px solid var(--border-light)", background: "var(--bg-surface)" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", overflow: "hidden", margin: "0 auto var(--space-3)", border: "2px solid var(--border-medium)" }}>
                {profile.image ? (
                  <img src={profile.image} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "var(--text-lg)", fontWeight: 600, background: "var(--accent-sage)", color: "#fff", fontFamily: "var(--font-heading)" }}>
                    {initials}
                  </div>
                )}
              </div>
              <p style={{ fontSize: "var(--text-sm)", fontFamily: "var(--font-heading)", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>@{profile.username}</p>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profile.email}</p>
            </div>

            {/* Nav */}
            <nav style={{ padding: "var(--space-2)" }}>
              {SIDEBAR_ITEMS.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path} style={{ textDecoration: "none" }}>
                    <div
                      style={{
                        display: "flex", alignItems: "center", gap: "var(--space-2)",
                        padding: "var(--space-2) var(--space-3)", borderRadius: "var(--radius-sm)",
                        fontSize: "var(--text-sm)", marginBottom: "1px", cursor: "pointer",
                        background: active ? "var(--accent-sage-bg)" : "transparent",
                        color: active ? "var(--accent-sage-text)" : "var(--text-secondary)",
                        fontWeight: active ? 500 : 400,
                        borderLeft: active ? "2px solid var(--accent-sage)" : "2px solid transparent",
                        transition: "var(--transition)",
                      }}
                      onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "var(--bg-surface)"; e.currentTarget.style.color = "var(--text-primary)"; } }}
                      onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; } }}
                    >
                      <span style={{ color: active ? "var(--accent-sage)" : "var(--text-muted)" }}>{item.icon}</span>
                      {item.name}
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Logout */}
            <div style={{ padding: "var(--space-2)", borderTop: "1px solid var(--border-light)" }}>
              <button
                onClick={handleLogout}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: "var(--space-2)",
                  padding: "var(--space-2) var(--space-3)", borderRadius: "var(--radius-sm)",
                  fontSize: "var(--text-sm)", color: "var(--accent-danger)",
                  background: "none", border: "none", cursor: "pointer", transition: "var(--transition)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(184,84,80,0.06)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <LogOut size={14} /> Sign out
              </button>
            </div>
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {isBase ? (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ borderRadius: "var(--radius-sm)", padding: "var(--space-6)", marginBottom: "var(--space-4)", background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 600, color: "var(--text-primary)", marginBottom: "var(--space-5)" }}>
                  Your Library
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { label: "Full Name", value: profile.fullname || "—" },
                    { label: "Username", value: `@${profile.username}` },
                    { label: "Email", value: profile.email || "—" },
                    { label: "Phone", value: profile.phone ? `+91 ${profile.phone}` : "—" },
                    { label: "Age", value: profile.age || "—" },
                    { label: "Favourite Genre", value: profile.genre || "—" },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ padding: "var(--space-4)", borderRadius: "var(--radius-sm)", background: "var(--bg-surface)", border: "1px solid var(--border-light)" }}>
                      <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)", marginBottom: "var(--space-1)" }}>{label}</p>
                      <p style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</p>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: "var(--space-5)" }}>
                  <button
                    onClick={() => navigate("/profile/edit-profile")}
                    style={{
                      display: "flex", alignItems: "center", gap: "var(--space-2)",
                      padding: "var(--space-2) var(--space-4)", borderRadius: "var(--radius-sm)",
                      fontSize: "var(--text-sm)", fontWeight: 500,
                      border: "1px solid var(--border-medium)", color: "var(--text-secondary)",
                      background: "var(--bg-card)", cursor: "pointer", transition: "var(--transition)",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent-sage)"; e.currentTarget.style.color = "var(--accent-sage)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-medium)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                  >
                    <Settings size={13} /> Edit Profile
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div style={{ borderRadius: "var(--radius-sm)", overflow: "hidden", background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <div style={{ padding: "var(--space-6)" }}>
                <Outlet />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
