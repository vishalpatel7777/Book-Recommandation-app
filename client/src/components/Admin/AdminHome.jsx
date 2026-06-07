import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  BookOpen, Users, ShoppingBag, TrendingUp,
  PlusCircle, Edit3, Settings, Layers,
  ArrowUpRight, BarChart3, Zap, Clock,
  ArrowUp, Minus,
} from "lucide-react";
import api from "../../services/axios";

const QUICK_ACTIONS = [
  { icon: PlusCircle, label: "Add Book", desc: "Publish to catalog", path: "/admin/books/add-book", accent: "var(--accent-sage)" },
  { icon: Users, label: "Customers", desc: "View all accounts", path: "/admin/users", accent: "var(--accent-info)" },
  { icon: BarChart3, label: "Analytics", desc: "Daily & monthly trends", path: "/admin/dashboard", accent: "var(--accent-amber)" },
  { icon: TrendingUp, label: "Monthly Stats", desc: "Revenue & growth", path: "/admin/dashboard/Monthly-analytics", accent: "var(--accent-gold)" },
  { icon: Edit3, label: "Edit Books", desc: "Update existing titles", path: "/admin/books/edit-books", accent: "var(--accent-sage-dark)" },
  { icon: Layers, label: "CMS", desc: "Branding & content", path: "/admin/cms", accent: "var(--accent-info)" },
  { icon: Settings, label: "Settings", desc: "Profile & password", path: "/admin/settings", accent: "var(--text-muted)" },
];

const INSIGHTS = [
  "Connect analytics to see revenue trends",
  "Add books to your catalog to get started",
  "Configure CMS to customize your platform branding",
  "Set up payment gateway in Platform settings",
];

function TrendBadge({ trend }) {
  if (trend === null || trend === undefined) return null;
  if (trend === 0) return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, padding: "2px 7px", borderRadius: 20, background: "var(--bg-surface)", border: "1px solid var(--border-light)" }}>
      <Minus size={9} style={{ color: "var(--text-muted)" }} />
      <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: 500 }}>0%</span>
    </div>
  );
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, padding: "2px 7px", borderRadius: 20, background: trend > 0 ? "rgba(92,122,94,0.1)" : "rgba(184,84,80,0.08)", border: `1px solid ${trend > 0 ? "rgba(92,122,94,0.2)" : "rgba(184,84,80,0.15)"}` }}>
      <ArrowUp size={9} style={{ color: trend > 0 ? "var(--accent-sage)" : "var(--accent-danger)", transform: trend < 0 ? "rotate(180deg)" : "none" }} />
      <span style={{ fontSize: "0.65rem", color: trend > 0 ? "var(--accent-sage)" : "var(--accent-danger)", fontWeight: 600 }}>{Math.abs(trend)}%</span>
    </div>
  );
}

function MetricCard({ label, value, sub, icon: Icon, color, trend, loading }) {
  return (
    <div style={{
      background: "var(--bg-card)", border: "1px solid var(--border)",
      borderRadius: 10, padding: "18px 20px",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: `${color}14`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={15} style={{ color }} />
        </div>
        <TrendBadge trend={trend} />
      </div>
      <div style={{ fontFamily: "var(--font-heading)", fontSize: loading ? "1.2rem" : "1.8rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1, marginBottom: 4 }}>
        {loading ? "—" : value}
      </div>
      <div style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 500 }}>{label}</div>
      {sub && <div style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", color: "var(--text-faint)", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

export default function AdminHome() {
  const user = useSelector((s) => s.auth.user);
  const [metrics, setMetrics] = useState({ books: null, users: null, orders: null, revenue: null });
  const [loading, setLoading] = useState(true);
  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 18 ? "Good afternoon" : "Good evening";

  useEffect(() => {
    Promise.allSettled([
      api.get("/book-analytics"),
      api.get("/all-users"),
    ]).then(([booksRes, usersRes]) => {
      setMetrics({
        books: booksRes.status === "fulfilled" ? booksRes.value.data?.totalBooks ?? "—" : "—",
        users: usersRes.status === "fulfilled" ? usersRes.value.data?.length ?? "—" : "—",
        orders: "—",
        revenue: "—",
      });
    }).finally(() => setLoading(false));
  }, []);

  const METRIC_CARDS = [
    { label: "Total Books", value: metrics.books, sub: "in catalog", icon: BookOpen, color: "var(--accent-sage)", trend: null },
    { label: "Registered Users", value: metrics.users, sub: "all time", icon: Users, color: "var(--accent-info)", trend: null },
    { label: "Orders Placed", value: metrics.orders, sub: "pending integration", icon: ShoppingBag, color: "var(--accent-amber)", trend: null },
    { label: "Monthly Revenue", value: metrics.revenue, sub: "pending integration", icon: TrendingUp, color: "var(--accent-gold)", trend: null },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)", padding: "32px 32px 60px" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
          style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent-sage)", marginBottom: 4, fontFamily: "var(--font-body)" }}>
                Platform Control Center
              </p>
              <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                {greeting}, <em style={{ fontStyle: "italic", color: "var(--accent-sage)" }}>{user?.username || "Admin"}</em>
              </h1>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", borderRadius: 6, background: "rgba(92,122,94,0.1)", border: "1px solid rgba(92,122,94,0.2)" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-sage)", animation: "pulse 2s infinite" }} />
                <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--accent-sage)", fontFamily: "var(--font-body)" }}>Platform live</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.06 }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 14, marginBottom: 28 }}
        >
          {METRIC_CARDS.map((card) => (
            <MetricCard key={card.label} {...card} loading={loading} />
          ))}
        </motion.div>

        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, alignItems: "start" }}>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.12 }}>

            {/* Quick Actions */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 12, fontFamily: "var(--font-body)" }}>
                Quick Actions
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {QUICK_ACTIONS.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link key={action.path} to={action.path} style={{ textDecoration: "none" }}>
                      <div
                        style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", transition: "border-color 0.15s, box-shadow 0.15s, transform 0.15s" }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = action.accent; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.07)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                      >
                        <div style={{ width: 30, height: 30, borderRadius: 7, background: `${action.accent}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Icon size={14} style={{ color: action.accent }} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", fontWeight: 500, color: "var(--text-primary)", marginBottom: 1 }}>{action.label}</p>
                          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.68rem", color: "var(--text-muted)" }}>{action.desc}</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Business Insights */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border-light)", display: "flex", alignItems: "center", gap: 8 }}>
                <Zap size={13} style={{ color: "var(--accent-amber)" }} />
                <span style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", fontWeight: 600, color: "var(--text-primary)" }}>Platform Insights</span>
              </div>
              <div style={{ padding: "10px 0" }}>
                {INSIGHTS.map((insight, i) => (
                  <div key={i} style={{ padding: "9px 18px", display: "flex", alignItems: "flex-start", gap: 10, borderBottom: i < INSIGHTS.length - 1 ? "1px solid var(--border-light)" : "none" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-amber)", marginTop: 5, flexShrink: 0 }} />
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right column */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.18 }} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Platform Status */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ padding: "13px 16px", borderBottom: "1px solid var(--border-light)" }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>Platform Status</p>
              </div>
              <div style={{ padding: "6px 0" }}>
                {[
                  { label: "Authentication", ok: true },
                  { label: "Book Catalog", ok: true },
                  { label: "User Management", ok: true },
                  { label: "Payment Gateway", ok: false },
                  { label: "Email Service", ok: false },
                ].map((row) => (
                  <div key={row.label} style={{ padding: "7px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--text-secondary)" }}>{row.label}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: row.ok ? "var(--accent-sage)" : "var(--accent-amber)" }} />
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "0.62rem", color: row.ok ? "var(--accent-sage)" : "var(--accent-amber)", fontWeight: 500 }}>
                        {row.ok ? "Operational" : "Not configured"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Today's snapshot */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ padding: "13px 16px", borderBottom: "1px solid var(--border-light)", display: "flex", alignItems: "center", gap: 7 }}>
                <Clock size={12} style={{ color: "var(--accent-info)" }} />
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>Today</p>
              </div>
              <div style={{ padding: "14px 16px" }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                  {now.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </p>
                <Link to="/admin/dashboard/daily-stats" style={{ textDecoration: "none" }}>
                  <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: "0.78rem", fontWeight: 500, color: "var(--accent-sage)", fontFamily: "var(--font-body)" }}>View daily stats</span>
                    <ArrowUpRight size={12} style={{ color: "var(--accent-sage)" }} />
                  </div>
                </Link>
              </div>
            </div>

            {/* Analytics shortcut */}
            <Link to="/admin/dashboard" style={{ textDecoration: "none" }}>
              <div style={{ background: "var(--accent-sage)", borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", transition: "background 0.15s" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "var(--accent-sage-dark)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "var(--accent-sage)"}
              >
                <BarChart3 size={15} style={{ color: "rgba(255,255,255,0.9)", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", fontWeight: 600, color: "#fff" }}>View Analytics</p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.68rem", color: "rgba(255,255,255,0.65)" }}>Revenue, users, books & trends</p>
                </div>
                <ArrowUpRight size={14} style={{ color: "rgba(255,255,255,0.7)", flexShrink: 0 }} />
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
