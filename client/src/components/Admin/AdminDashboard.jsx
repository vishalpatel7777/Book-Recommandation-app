import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { BarChart3, Users, BookOpen, TrendingUp, ArrowUpRight, Activity } from "lucide-react";

const TABS = [
  { name: "Overview", path: "/admin/dashboard", icon: Activity, exact: true },
  { name: "Daily Stats", path: "/admin/dashboard/daily-stats", icon: BarChart3 },
  { name: "User Activity", path: "/admin/dashboard/user-activity", icon: Users },
  { name: "Book Analytics", path: "/admin/dashboard/book-analytics", icon: BookOpen },
  { name: "Monthly Stats", path: "/admin/dashboard/Monthly-analytics", icon: TrendingUp },
];

const OVERVIEW_CARDS = [
  { label: "Daily Stats", desc: "New users, purchases, views", path: "/admin/dashboard/daily-stats", icon: BarChart3, accent: "var(--accent-sage)" },
  { label: "User Activity", desc: "Login trends, registrations", path: "/admin/dashboard/user-activity", icon: Users, accent: "var(--accent-info)" },
  { label: "Book Analytics", desc: "Top rated, most purchased", path: "/admin/dashboard/book-analytics", icon: BookOpen, accent: "var(--accent-amber)" },
  { label: "Monthly Stats", desc: "Revenue & growth over time", path: "/admin/dashboard/Monthly-analytics", icon: TrendingUp, accent: "var(--accent-gold)" },
];

export default function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const isBase = location.pathname === "/admin/dashboard";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)", padding: "28px 28px 60px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Page header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Analytics</h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 3 }}>Business intelligence and platform metrics</p>
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: 2, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: 4, marginBottom: 24, overflowX: "auto" }}>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = tab.exact ? location.pathname === tab.path : location.pathname === tab.path;
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                style={{
                  display: "flex", alignItems: "center", gap: 7, padding: "7px 14px", borderRadius: 7,
                  background: active ? "var(--bg-page)" : "transparent",
                  border: active ? "1px solid var(--border)" : "1px solid transparent",
                  boxShadow: active ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
                  cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap", flexShrink: 0,
                }}
              >
                <Icon size={13} style={{ color: active ? "var(--accent-sage)" : "var(--text-muted)" }} />
                <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", fontWeight: active ? 600 : 400, color: active ? "var(--text-primary)" : "var(--text-secondary)" }}>
                  {tab.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
          {isBase ? (
            <div style={{ padding: 24 }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 16 }}>
                Analytics Hub
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                {OVERVIEW_CARDS.map((card) => {
                  const Icon = card.icon;
                  return (
                    <button
                      key={card.path}
                      onClick={() => navigate(card.path)}
                      style={{ textAlign: "left", background: "var(--bg-surface)", border: "1px solid var(--border-light)", borderRadius: 10, padding: "18px 18px 16px", cursor: "pointer", transition: "border-color 0.15s, transform 0.15s, box-shadow 0.15s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = card.accent; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.06)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-light)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 8, background: `${card.accent}14`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icon size={15} style={{ color: card.accent }} />
                        </div>
                        <ArrowUpRight size={13} style={{ color: "var(--text-faint)" }} />
                      </div>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: 3 }}>{card.label}</p>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", color: "var(--text-muted)" }}>{card.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ padding: 24 }}>
              <Outlet />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
