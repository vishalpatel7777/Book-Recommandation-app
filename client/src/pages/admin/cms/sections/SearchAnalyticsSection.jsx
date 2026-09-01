import { useState, useEffect } from "react";
import { Search, TrendingUp, AlertCircle, BarChart2 } from "lucide-react";
import { SEARCH_TERMS, NO_RESULT_SEARCHES } from "../cmsData";
import { st, SectionTitle, KpiRow } from "../cmsUi";
import api from "../../../../services/axios";

export default function SearchAnalyticsSection() {
  const [live, setLive] = useState(null);
  useEffect(()=>{ api.get("/cms/analytics/search").then(({data})=>setLive(data?.data??data)).catch(()=>{}); },[]);
  const terms = live ? (live.topTerms||[]) : SEARCH_TERMS;
  const noRes = live ? (live.noResultTerms||[]) : NO_RESULT_SEARCHES;
  const totalSearches = terms.length ? terms.reduce((s, t) => s + (t.count||0), 0) : SEARCH_TERMS.reduce((s, t) => s + t.count, 0);
  const avgSuccess = terms.length ? Math.round(terms.reduce((s, t) => s + (t.success||0), 0) / terms.length) : Math.round(SEARCH_TERMS.reduce((s, t) => s + t.success, 0) / SEARCH_TERMS.length);
  const noResultCount = noRes.length ? noRes.reduce((s, t) => s + (t.count||0), 0) : NO_RESULT_SEARCHES.reduce((s, t) => s + t.count, 0);

  return (
    <>
      <SectionTitle>Search Analytics</SectionTitle>

      <KpiRow items={[
        { label: "Total Searches",     value: totalSearches.toLocaleString(), icon: Search,       color: "var(--accent-sage)",   sub: "Last 30 days" },
        { label: "Success Rate",       value: `${avgSuccess}%`,               icon: TrendingUp,   color: "var(--accent-info)",   sub: "Results found" },
        { label: "No-Result Searches", value: noResultCount,                  icon: AlertCircle,  color: "var(--accent-danger)", sub: "Opportunity gaps" },
        { label: "Avg per Session",    value: "1.8",                          icon: BarChart2,    color: "var(--accent-amber)",  sub: "Searches/session" },
      ]} />

      <div style={st.card}>
        <p style={{ ...st.label, marginBottom: 14 }}>Top Search Terms {live ? "· live" : "(demo)"}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {terms.map(({ term, count, success }, i) => (
            <div key={term} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: "0.65rem", color: "var(--text-faint)", width: 16, flexShrink: 0, fontFamily: "monospace", textAlign: "right" }}>{i + 1}</span>
              <span style={{ fontSize: "0.82rem", color: "var(--text-primary)", width: 180, flexShrink: 0 }}>{term}</span>
              <div style={{ flex: 1, height: 8, borderRadius: 4, background: "var(--bg-surface)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(count / (terms[0]?.count||1)) * 100}%`, borderRadius: 4, background: "var(--accent-sage)", transition: "width 0.6s" }} />
              </div>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", width: 40, flexShrink: 0, textAlign: "right" }}>{count}</span>
              <span style={{ fontSize: "0.68rem", padding: "1px 7px", borderRadius: 4, background: success >= 90 ? "rgba(92,122,94,0.1)" : "rgba(139,111,71,0.1)", color: success >= 90 ? "var(--accent-sage-text)" : "var(--accent-amber-dark)", width: 52, textAlign: "center", flexShrink: 0 }}>{success}%</span>
            </div>
          ))}
        </div>
      </div>

      <div style={st.card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <p style={st.label}>No-Result Searches — Catalogue Gaps</p>
          <span style={{ fontSize: "0.68rem", padding: "2px 8px", borderRadius: 4, background: "rgba(184,84,80,0.08)", color: "var(--accent-danger)", border: "1px solid rgba(184,84,80,0.2)" }}>Action needed</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>{["Search Term", "Count", "Last Seen", "Action"].map(h => <th key={h} style={st.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {noRes.map(r => (
              <tr key={r.term}>
                <td style={{ ...st.td, fontWeight: 500, color: "var(--text-primary)" }}>{r.term}</td>
                <td style={{ ...st.td, fontWeight: 600, color: "var(--accent-danger)" }}>{r.count}</td>
                <td style={{ ...st.td, fontSize: "0.72rem", color: "var(--text-faint)" }}>{r.lastSeen}</td>
                <td style={st.td}>
                  <button style={{ padding: "3px 10px", borderRadius: 5, background: "var(--accent-sage-bg)", border: "1px solid var(--accent-sage-ring, var(--accent-sage))", fontSize: "0.68rem", cursor: "pointer", color: "var(--accent-sage-text)", fontFamily: "var(--font-body)" }}>
                    Add to Catalogue
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
