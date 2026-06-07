import { useState } from "react";
import { RefreshCw, Eye, CheckCircle, XCircle } from "lucide-react";
import { REFUND_HISTORY } from "../cmsData";
import { st, SectionTitle, KpiRow, StatusBadge, ConfirmDialog, Drawer, SearchBar, EmptyState, ActionBtn, Checkbox, Pagination, useToastEmitter } from "../cmsUi";

const MOCK_REFUNDS = REFUND_HISTORY.map((r, i) => ({ ...r, orderId: `ORD-${1080 + i}` }));

export default function RefundsSection() {
  const toast = useToastEmitter();
  const [refunds, setRefunds] = useState(MOCK_REFUNDS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [drawer, setDrawer] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const filtered = refunds.filter(r => {
    const ms = r.user.toLowerCase().includes(search.toLowerCase()) || r.book.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase());
    const mf = statusFilter === "all" || r.status === statusFilter;
    return ms && mf;
  });
  const paginated = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  const approve = (id) => { setRefunds(prev => prev.map(r => r.id === id ? { ...r, status: "approved" } : r)); toast?.("Refund approved"); };
  const reject = (id) => { setRefunds(prev => prev.map(r => r.id === id ? { ...r, status: "rejected" } : r)); toast?.("Refund rejected"); };

  const pending = refunds.filter(r => r.status === "pending").length;
  const approved = refunds.filter(r => r.status === "approved").length;

  return (
    <>
      <SectionTitle>Refund Manager</SectionTitle>

      <KpiRow items={[
        { label: "Total Refunds",  value: refunds.length, icon: RefreshCw, color: "var(--accent-amber)", sub: "All time" },
        { label: "Pending",        value: pending,         icon: RefreshCw, color: "var(--accent-danger)", sub: "Awaiting review" },
        { label: "Approved",       value: approved,        icon: CheckCircle, color: "var(--accent-sage)", sub: "Processed" },
        { label: "Total Refunded", value: `₹${refunds.filter(r => r.status === "approved").reduce((s, r) => s + parseInt(r.amount.replace(/[^0-9]/g, "")), 0)}`, icon: RefreshCw, color: "var(--accent-info)", sub: "Amount returned" },
      ]} />

      <div style={st.card}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search refund ID, user, book…" />
          {["all", "pending", "approved", "rejected"].map(s => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
              style={{ padding: "3px 10px", borderRadius: 20, fontSize: "0.68rem", fontWeight: 500, cursor: "pointer", border: `1px solid ${statusFilter === s ? "var(--accent-sage)" : "var(--border)"}`, background: statusFilter === s ? "var(--accent-sage-bg)" : "none", color: statusFilter === s ? "var(--accent-sage-text)" : "var(--text-muted)" }}>
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {paginated.length === 0 ? <EmptyState icon={RefreshCw} title="No refunds found" desc="All clear." /> : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>{["Refund ID", "Customer", "Book", "Amount", "Reason", "Date", "Status", "Actions"].map(h => <th key={h} style={st.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {paginated.map(r => (
                <tr key={r.id}>
                  <td style={{ ...st.td, fontFamily: "monospace", fontSize: "0.72rem", color: "var(--text-faint)" }}>{r.id}</td>
                  <td style={st.td}>{r.user}</td>
                  <td style={{ ...st.td, fontStyle: "italic", color: "var(--text-primary)" }}>{r.book}</td>
                  <td style={{ ...st.td, fontWeight: 600 }}>{r.amount}</td>
                  <td style={{ ...st.td, fontSize: "0.75rem", color: "var(--text-muted)" }}>{r.reason}</td>
                  <td style={{ ...st.td, fontSize: "0.72rem", color: "var(--text-faint)" }}>{r.date}</td>
                  <td style={st.td}><StatusBadge status={r.status} /></td>
                  <td style={st.td}>
                    <div style={{ display: "flex", gap: 5 }}>
                      <ActionBtn onClick={() => setDrawer(r)}><Eye size={11} /></ActionBtn>
                      {r.status === "pending" && <>
                        <ActionBtn onClick={() => approve(r.id)}><CheckCircle size={11} /></ActionBtn>
                        <ActionBtn variant="danger" onClick={() => reject(r.id)}><XCircle size={11} /></ActionBtn>
                      </>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
      </div>

      <Drawer open={!!drawer} onClose={() => setDrawer(null)} title={`Refund ${drawer?.id}`}>
        {drawer && (
          <div>
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              <StatusBadge status={drawer.status} />
            </div>
            {[["Customer", drawer.user], ["Book", drawer.book], ["Amount", drawer.amount], ["Reason", drawer.reason], ["Date", drawer.date], ["Order", drawer.orderId]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border-light)" }}>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 500 }}>{k}</span>
                <span style={{ fontSize: "0.82rem", color: "var(--text-primary)" }}>{v}</span>
              </div>
            ))}
            {drawer.status === "pending" && (
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <ActionBtn variant="primary" onClick={() => { approve(drawer.id); setDrawer(null); }}>Approve Refund</ActionBtn>
                <ActionBtn variant="danger" onClick={() => { reject(drawer.id); setDrawer(null); }}>Reject</ActionBtn>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </>
  );
}
