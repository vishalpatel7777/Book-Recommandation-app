import { useState, useEffect, useCallback } from "react";
import { RefreshCw, Eye, CheckCircle, XCircle } from "lucide-react";
import api from "../../../../services/axios";
import { st, SectionTitle, KpiRow, StatusBadge, ConfirmDialog, Drawer, SearchBar, EmptyState, ActionBtn, Checkbox, Pagination, useToastEmitter } from "../cmsUi";

export default function RefundsSection() {
  const toast = useToastEmitter();
  const [refunds, setRefunds] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [drawer, setDrawer] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRefunds = useCallback(async (page = 1, status = "all") => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (status !== "all") params.status = status;
      const { data } = await api.get("/admin/refunds", { params });
      setRefunds(data.data || []);
      setPagination(data.pagination || { page, limit: 10, total: 0, totalPages: 1 });
    } catch {
      toast?.("Failed to load refunds");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchRefunds(1, statusFilter); }, [fetchRefunds, statusFilter]);

  const processRefund = async (refundId, action) => {
    try {
      await api.put(`/admin/refunds/${refundId}`, { action });
      toast?.(action === "approved" ? "Refund approved" : "Refund rejected");
      fetchRefunds(pagination.page, statusFilter);
      setDrawer(null);
    } catch (err) {
      toast?.(err.response?.data?.error || "Failed to process refund");
    }
  };

  const pending = refunds.filter((r) => r.status === "pending").length;
  const approved = refunds.filter((r) => r.status === "approved").length;
  const totalRefunded = refunds.filter((r) => r.status === "approved").reduce((s, r) => s + (r.amount || 0), 0);

  const filtered = search
    ? refunds.filter((r) =>
        r.user?.username?.toLowerCase().includes(search.toLowerCase()) ||
        r.book?.title?.toLowerCase().includes(search.toLowerCase()) ||
        r._id?.toLowerCase().includes(search.toLowerCase())
      )
    : refunds;

  return (
    <>
      <SectionTitle>Refund Manager</SectionTitle>

      <KpiRow items={[
        { label: "Total Refunds",  value: pagination.total, icon: RefreshCw,    color: "var(--accent-amber)",  sub: "All time" },
        { label: "Pending",        value: pending,          icon: RefreshCw,    color: "var(--accent-danger)", sub: "Awaiting review" },
        { label: "Approved",       value: approved,         icon: CheckCircle,  color: "var(--accent-sage)",   sub: "This page" },
        { label: "Total Refunded", value: `₹${totalRefunded.toLocaleString()}`, icon: RefreshCw, color: "var(--accent-info)", sub: "This page" },
      ]} />

      <div style={st.card}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search refund ID, user, book…" />
          {["all", "pending", "approved", "rejected"].map((s) => (
            <button key={s} onClick={() => { setStatusFilter(s); fetchRefunds(1, s); }}
              style={{ padding: "3px 10px", borderRadius: 20, fontSize: "0.68rem", fontWeight: 500, cursor: "pointer", border: `1px solid ${statusFilter === s ? "var(--accent-sage)" : "var(--border)"}`, background: statusFilter === s ? "var(--accent-sage-bg)" : "none", color: statusFilter === s ? "var(--accent-sage-text)" : "var(--text-muted)" }}>
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)", fontSize: "0.82rem" }}>Loading refunds…</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={RefreshCw} title="No refunds found" desc="All clear." />
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>{["Refund ID", "Customer", "Book", "Amount", "Reason", "Date", "Status", "Actions"].map((h) => <th key={h} style={st.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r._id}>
                  <td style={{ ...st.td, fontFamily: "monospace", fontSize: "0.72rem", color: "var(--text-faint)" }}>{r._id?.slice(-6).toUpperCase()}</td>
                  <td style={st.td}>
                    <div>
                      <p style={{ fontSize: "0.82rem", color: "var(--text-primary)" }}>{r.user?.username || "—"}</p>
                      <p style={{ fontSize: "0.68rem", color: "var(--text-faint)" }}>{r.user?.email}</p>
                    </div>
                  </td>
                  <td style={{ ...st.td, fontStyle: "italic", color: "var(--text-primary)" }}>{r.book?.title || "—"}</td>
                  <td style={{ ...st.td, fontWeight: 600 }}>₹{r.amount}</td>
                  <td style={{ ...st.td, fontSize: "0.75rem", color: "var(--text-muted)" }}>{r.reason || "—"}</td>
                  <td style={{ ...st.td, fontSize: "0.72rem", color: "var(--text-faint)" }}>{new Date(r.createdAt).toLocaleDateString("en-IN")}</td>
                  <td style={st.td}><StatusBadge status={r.status} /></td>
                  <td style={st.td}>
                    <div style={{ display: "flex", gap: 5 }}>
                      <ActionBtn onClick={() => setDrawer(r)}><Eye size={11} /></ActionBtn>
                      {r.status === "pending" && <>
                        <ActionBtn onClick={() => { setConfirmAction({ type: "approved", refund: r }); setConfirm(true); }}><CheckCircle size={11} /></ActionBtn>
                        <ActionBtn variant="danger" onClick={() => { setConfirmAction({ type: "rejected", refund: r }); setConfirm(true); }}><XCircle size={11} /></ActionBtn>
                      </>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Pagination page={pagination.page} total={pagination.total} perPage={pagination.limit} onChange={(p) => fetchRefunds(p, statusFilter)} />
      </div>

      <Drawer open={!!drawer} onClose={() => setDrawer(null)} title={`Refund ${drawer?._id?.slice(-6).toUpperCase()}`}>
        {drawer && (
          <div>
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              <StatusBadge status={drawer.status} />
            </div>
            {[
              ["Customer",   drawer.user?.username],
              ["Email",      drawer.user?.email],
              ["Book",       drawer.book?.title],
              ["Amount",     `₹${drawer.amount}`],
              ["Reason",     drawer.reason || "—"],
              ["Date",       new Date(drawer.createdAt).toLocaleDateString("en-IN")],
              ["Processed by", drawer.processedBy?.username || "—"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border-light)" }}>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 500 }}>{k}</span>
                <span style={{ fontSize: "0.82rem", color: "var(--text-primary)" }}>{v}</span>
              </div>
            ))}
            {drawer.status === "pending" && (
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <ActionBtn variant="primary" onClick={() => processRefund(drawer._id, "approved")}>Approve Refund</ActionBtn>
                <ActionBtn variant="danger" onClick={() => processRefund(drawer._id, "rejected")}>Reject</ActionBtn>
              </div>
            )}
          </div>
        )}
      </Drawer>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          if (confirmAction) processRefund(confirmAction.refund._id, confirmAction.type);
          setConfirmAction(null);
        }}
        title={confirmAction?.type === "approved" ? "Approve Refund" : "Reject Refund"}
        message={confirmAction?.type === "approved"
          ? `Approve refund of ₹${confirmAction?.refund?.amount} for ${confirmAction?.refund?.user?.username}?`
          : `Reject refund for ${confirmAction?.refund?.user?.username}?`}
        danger={confirmAction?.type === "rejected"}
        confirmLabel={confirmAction?.type === "approved" ? "Approve" : "Reject"}
      />
    </>
  );
}
