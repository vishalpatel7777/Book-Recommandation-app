import { useState, useEffect } from "react";
import { Star, TrendingUp, DollarSign, MousePointer } from "lucide-react";
import { st, SectionTitle, KpiRow } from "../cmsUi";
import api from "../../../../services/axios";

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
  const [live, setLive] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ api.get("/cms/analytics/books").then(({data})=> { const raw=data?.data??data; const list=Array.isArray(raw)?raw:[]; setLive(list.map(b=>({ title:b.title, clicks: b.views||0, purchases:b.purchases||0, revenue: `₹${(b.price*(b.purchases||0)).toLocaleString()}`, ctr: b.views?`${((b.purchases/b.views)*100).toFixed(1)}%`:"0%" }))); }).catch(()=>setLive([])).finally(()=>setLoading(false)); },[]);
  const rows = Array.isArray(live) ? live : [];
  return (
    <>
      <SectionTitle>Recommendation Analytics {loading ? "· loading…" : rows.length ? "· live" : "· no data"}</SectionTitle>

      <KpiRow items={[
        { label: "Recommendation CTR",      value: "—", icon: MousePointer, color: "var(--accent-sage)",  sub: "TBD — needs click tracking" },
        { label: "Rec. Purchases",          value: loading ? "…" : String(rows.reduce((s,r)=>s+(r.purchases||0),0)),   icon: Star,         color: "var(--accent-gold, #F59E0B)", sub: "Purchased" },
        { label: "Rec. Revenue",            value: "—", icon: DollarSign, color: "var(--accent-info)",   sub: "TBD" },
        { label: "Avg Rec. per Session",    value: "—",   icon: TrendingUp,   color: "var(--accent-amber)", sub: "TBD" },
      ]} />

      <div style={st.card}>
        <p style={{ ...st.label, marginBottom: 14 }}>Conversion Funnel · demo</p>
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
        <p style={{ ...st.label, marginBottom: 14 }}>Top Recommended Books {loading ? "· loading…" : ""}</p>
        {loading ? <div style={{textAlign:"center",padding:"20px 0",color:"var(--text-muted)",fontSize:"0.82rem"}}>Loading…</div> : rows.length===0 ? <div style={{textAlign:"center",padding:"20px 0",color:"var(--text-muted)",fontSize:"0.82rem"}}>No recommendation data yet.</div> : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>{["Book", "Clicks", "Purchases", "Revenue", "CTR"].map(h => <th key={h} style={st.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((b, i) => (
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
        )}
      </div>
    </>
  );
}
