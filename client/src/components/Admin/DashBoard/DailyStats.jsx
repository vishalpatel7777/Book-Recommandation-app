import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, UserCheck, ShoppingBag, MessageCircle, TrendingUp, TrendingDown } from "lucide-react";
import api from "../../../services/axios.js";
import Loader from "../../common/Loader/Loader";

const CARDS = [
  { key: "totalUsers",     label: "Total Users",     icon: Users,         accent: "var(--accent-sage)",      desc: "Registered accounts" },
  { key: "activeUsers",    label: "Active Today",    icon: UserCheck,     accent: "var(--accent-amber)",     desc: "Logged in last 24h" },
  { key: "totalPurchases", label: "Total Purchases", icon: ShoppingBag,   accent: "var(--accent-info)",      desc: "All-time transactions" },
  { key: "totalReviews",   label: "Total Reviews",   icon: MessageCircle, accent: "var(--accent-gold-dark)", desc: "User-submitted reviews" },
];

function StatCard({ label, desc, icon: Icon, accent, value, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.3 }}
      style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14 }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ width: 36, height: 36, borderRadius: 9, background: `${accent}14`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={16} style={{ color: accent }} />
        </div>
        <TrendingUp size={13} style={{ color: "var(--accent-sage)", opacity: 0.6 }} />
      </div>
      <div>
        <p style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1, marginBottom: 6 }}>
          {value ?? "—"}
        </p>
        <p style={{ fontSize: "0.83rem", fontWeight: 500, color: "var(--text-primary)", marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{desc}</p>
      </div>
    </motion.div>
  );
}

export default function DailyStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/daily")
      .then((r) => setStats(r.data))
      .catch(() => setError("Failed to load statistics."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: "48px", display: "flex", justifyContent: "center" }}><Loader /></div>;
  if (error) return <p style={{ fontSize: "0.83rem", textAlign: "center", padding: "32px", color: "var(--accent-danger)" }}>{error}</p>;

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)" }}>Daily Statistics</h2>
        <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 3 }}>Platform-wide snapshot</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        {CARDS.map((c, i) => (
          <StatCard key={c.key} {...c} value={stats?.[c.key]} index={i} />
        ))}
      </div>
    </div>
  );
}
