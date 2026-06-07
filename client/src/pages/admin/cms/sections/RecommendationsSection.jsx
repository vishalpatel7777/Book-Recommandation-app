import { Star, TrendingUp, DollarSign, MousePointer } from "lucide-react";
import { st, SectionTitle, KpiRow } from "../cmsUi";

const TOP_RECOMMENDED = [
  { title: "Atomic Habits",        clicks: 1240, purchases: 186, revenue: "₹64,914", ctr: "15%" },
  { title: "The Midnight Library", clicks: 980,  purchases: 112, revenue: "₹31,248", ctr: "11.4%" },
  { title: "Sapiens",              clicks: 870,  purchases: 98,  revenue: "₹29,302", ctr: "11.3%" },
  { title: "The Alchemist",        clicks: 760,  purchases: 134, revenue: "₹40,066", ctr: "17.6%" },
  { title: "Project Hail Mary",    clicks: 640,  purchases: 76,  revenue: "₹30,324", ctr: "11.9%" },
];

const FUNNEL = [
  { stage: "Recommendation shown",  count: 8420, pct: 100 },
  { stage: "Clicked",               count: 2180, pct: 25.9 },
  { stage: "Added to cart",         count: 870,  pct: 10.3 },
  { stage: "Purchased",             count: 606,  pct: 7.2 },
];

export default function RecommendationsSection() {
  return (
    <>
      <SectionTitle>Recommendation Analytics</SectionTitle>

      <KpiRow items={[
        { label: "Recommendation CTR",      value: "25.9%", icon: MousePointer, color: "var(--accent-sage)",  sub: "Shown → Clicked" },
        { label: "Rec. Purchases",          value: "606",   icon: Star,         color: "var(--accent-gold, #F59E0B)", sub: "Purchased from rec" },
        { label: "Rec. Revenue",            value: "₹1.96L", icon: DollarSign, color: "var(--accent-info)",   sub: "Via recommendations" },
        { label: "Avg Rec. per Session",    value: "4.2",   icon: TrendingUp,   color: "var(--accent-amber)", sub: "Books shown per user" },
      ]} />

      <div style={st.card}>
        <p style={{ ...st.label, marginBottom: 14 }}>Conversion Funnel</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {FUNNEL.map(({ stage, count, pct }, i) => (
            <div key={stage}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{stage}</span>
                <div style={{ display: "flex", gap: 12 }}>
                  <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-primary)" }}>{count.toLocaleString()}</span>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-faint)", width: 44, textAlign: "right" }}>{pct}%</span>
                </div>
              </div>
              <div style={{ height: 10, borderRadius: 5, background: "var(--bg-surface)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, borderRadius: 5, background: i === 0 ? "var(--accent-sage)" : i === 1 ? "var(--accent-info)" : i === 2 ? "var(--accent-amber)" : "var(--accent-danger)", transition: "width 0.6s" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={st.card}>
        <p style={{ ...st.label, marginBottom: 14 }}>Top Recommended Books</p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>{["Book", "Clicks", "Purchases", "Revenue", "CTR"].map(h => <th key={h} style={st.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {TOP_RECOMMENDED.map((b, i) => (
              <tr key={b.title}>
                <td style={st.td}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: "0.65rem", color: "var(--text-faint)", width: 16, fontFamily: "monospace" }}>{i + 1}</span>
                    <span style={{ fontStyle: "italic", color: "var(--text-primary)", fontWeight: 500 }}>{b.title}</span>
                  </div>
                </td>
                <td style={st.td}>{b.clicks.toLocaleString()}</td>
                <td style={st.td}>{b.purchases}</td>
                <td style={{ ...st.td, fontWeight: 600, color: "var(--accent-sage-text)" }}>{b.revenue}</td>
                <td style={st.td}>
                  <span style={{ padding: "2px 8px", borderRadius: 4, background: "rgba(92,122,94,0.1)", color: "var(--accent-sage-text)", fontSize: "0.72rem", fontWeight: 600, border: "1px solid rgba(92,122,94,0.2)" }}>{b.ctr}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
