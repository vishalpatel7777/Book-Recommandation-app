import { useEffect, useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Users, IndianRupee, BookOpen, Minus } from "lucide-react";
import Loader from "../../common/Loader/Loader";
import api from "../../../services/axios";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const TIP = {
  contentStyle: {
    background: "var(--bg-card)", border: "1px solid var(--border)",
    borderRadius: 8, fontSize: 12, color: "var(--text-primary)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)", padding: "8px 12px",
  },
  cursor: { stroke: "var(--border-medium)", strokeWidth: 1 },
  labelStyle: { fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 },
};

function buildSeries(stats, key = "count") {
  if (!stats?.length) return [];
  return stats.map((item) => ({
    month: MONTHS[(item._id?.month ?? 1) - 1],
    value: item[key] ?? item.count ?? 0,
  }));
}

function Trend({ current, previous }) {
  if (!previous || previous === 0) return null;
  const pct = Math.round(((current - previous) / previous) * 100);
  const up = pct >= 0;
  const Icon = up ? TrendingUp : TrendingDown;
  const color = up ? "var(--accent-sage)" : "var(--accent-danger)";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: "0.72rem", fontWeight: 600, color, background: up ? "rgba(92,122,94,0.08)" : "rgba(184,84,80,0.08)", padding: "2px 7px", borderRadius: 20 }}>
      <Icon size={10} /> {up ? "+" : ""}{pct}%
    </span>
  );
}

function KPICard({ icon: Icon, label, value, accent, series, previous }) {
  const current = series?.length ? series[series.length - 1]?.value : 0;
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: `${accent}14`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon size={13} style={{ color: accent }} />
          </div>
          <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
        </div>
        <Trend current={current} previous={previous} />
      </div>
      <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1 }}>{value ?? "—"}</p>
      {series?.length > 0 && (
        <div style={{ height: 32, marginTop: 4 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
              <defs>
                <linearGradient id={`g-${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={accent} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke={accent} strokeWidth={1.5} fill={`url(#g-${label})`} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function ChartCard({ title, icon: Icon, accent, children }) {
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border-light)", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 26, height: 26, borderRadius: 6, background: `${accent}14`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={12} style={{ color: accent }} />
        </div>
        <span style={{ fontFamily: "var(--font-body)", fontSize: "0.83rem", fontWeight: 600, color: "var(--text-primary)" }}>{title}</span>
      </div>
      <div style={{ padding: "16px 18px 18px" }}>{children}</div>
    </div>
  );
}

export default function MonthlyStats() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/monthly-analytics")
      .then((r) => setAnalytics(r.data))
      .catch(() => setError("Failed to load analytics."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: "48px", display: "flex", justifyContent: "center" }}><Loader /></div>;
  if (error) return <p style={{ fontSize: "0.83rem", textAlign: "center", padding: "32px", color: "var(--accent-danger)" }}>{error}</p>;

  const userSeries = buildSeries(analytics?.userStats);
  const revSeries = buildSeries(analytics?.revenueStats, "totalRevenue");
  const totalUsers = userSeries.reduce((s, d) => s + d.value, 0);
  const totalRev = revSeries.reduce((s, d) => s + d.value, 0);

  const prevUsers = userSeries.length > 1 ? userSeries[userSeries.length - 2]?.value : null;
  const prevRev = revSeries.length > 1 ? revSeries[revSeries.length - 2]?.value : null;

  const hasData = userSeries.length > 0 || revSeries.length > 0 || analytics?.topGenres?.length > 0;

  if (!hasData) return (
    <div style={{ padding: "56px 20px", textAlign: "center" }}>
      <TrendingUp size={28} style={{ color: "var(--border-medium)", margin: "0 auto 12px" }} />
      <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>No data yet</p>
      <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Monthly analytics will appear once transactions are recorded.</p>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <KPICard
          icon={Users} label="Users Joined" accent="var(--accent-sage)"
          value={totalUsers.toLocaleString()}
          series={userSeries} previous={prevUsers}
        />
        <KPICard
          icon={IndianRupee} label="Revenue" accent="var(--accent-amber)"
          value={`₹${totalRev.toLocaleString()}`}
          series={revSeries} previous={prevRev}
        />
      </div>

      {/* User growth area chart */}
      {userSeries.length > 0 && (
        <ChartCard title="User Growth" icon={Users} accent="var(--accent-sage)">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={userSeries} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-sage)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--accent-sage)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip {...TIP} formatter={(v) => [v, "Users"]} />
              <Area type="monotone" dataKey="value" stroke="var(--accent-sage)" strokeWidth={2} fill="url(#userGrad)" dot={{ fill: "var(--accent-sage)", r: 3, strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} name="Users" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {/* Revenue bar chart */}
      {revSeries.length > 0 && (
        <ChartCard title="Monthly Revenue" icon={IndianRupee} accent="var(--accent-amber)">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revSeries} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
              <Tooltip {...TIP} formatter={(v) => [`₹${v.toLocaleString()}`, "Revenue"]} />
              <Bar dataKey="value" fill="var(--accent-amber)" radius={[4, 4, 0, 0]} name="Revenue" maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {/* Top genres */}
      {analytics?.topGenres?.length > 0 && (
        <ChartCard title="Top Genres" icon={BookOpen} accent="var(--accent-gold)">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {analytics.topGenres.map((genre, i) => {
              const max = analytics.topGenres[0]?.count || 1;
              const pct = Math.round((genre.count / max) * 100);
              const colors = ["var(--accent-sage)", "var(--accent-amber)", "var(--accent-gold)", "var(--accent-info)", "var(--accent-sage-dark)"];
              const color = colors[i % colors.length];
              return (
                <div key={genre._id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--text-faint)", width: 16, textAlign: "right", flexShrink: 0 }}>{i + 1}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: "0.78rem", color: "var(--text-primary)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{genre._id}</span>
                      <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", flexShrink: 0, marginLeft: 8 }}>{genre.count}</span>
                    </div>
                    <div style={{ height: 5, borderRadius: 3, background: "var(--border-light)", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 3, transition: "width 0.6s ease" }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      )}
    </motion.div>
  );
}
