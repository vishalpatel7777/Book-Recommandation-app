import { useState, useEffect, useCallback } from "react";
import { ShoppingBag, Eye, RefreshCw, XCircle } from "lucide-react";
import api from "../../../../services/axios";
import { st, SectionTitle, KpiRow, StatusBadge, ConfirmDialog, Drawer, SearchBar, EmptyState, ActionBtn, Checkbox, Pagination, useToastEmitter } from "../cmsUi";

export default function OrdersSection() {
  const toast = useToastEmitter();
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState([]);
  const [drawer, setDrawer] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async (page = 1, status = "all") => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (status !== "all") params.status = status;
      const { data } = await api.get("/admin/orders", { params });
      setOrders(data.data || []);
      setPagination(data.pagination || { page, limit: 10, total: 0, totalPages: 1 });
    } catch {
      toast?.("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchOrders(1, statusFilter); }, [fetchOrders, statusFilter]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      toast?.(`Order ${newStatus.toLowerCase()}`);
      fetchOrders(pagination.page, statusFilter);
    } catch {
      toast?.("Failed to update order status");
    }
  };

  const toggleSelect = (id) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(selected.length === orders.length ? [] : orders.map((o) => o._id));

  const totalRevenue = orders.reduce((s, o) => s + (o.totalPrice || 0), 0);
  const completed = orders.filter((o) => o.status === "Completed").length;
  const pending = orders.filter((o) => o.status === "Pending").length;

  const filtered = search
    ? orders.filter((o) =>
        o._id?.toLowerCase().includes(search.toLowerCase()) ||
        o.user?.username?.toLowerCase().includes(search.toLowerCase()) ||
        o.user?.email?.toLowerCase().includes(search.toLowerCase())
      )
    : orders;

  return (
    <>
      <SectionTitle>Orders Manager</SectionTitle>

      <KpiRow items={[
        { label: "Total Orders",   value: pagination.total,              icon: ShoppingBag, color: "var(--accent-sage)",           sub: "All time" },
        { label: "Revenue (page)", value: `₹${totalRevenue.toLocaleString()}`, icon: ShoppingBag, color: "var(--accent-gold, #F59E0B)", sub: "Current page" },
        { label: "Completed",      value: completed,                     icon: ShoppingBag, color: "var(--accent-info)",             sub: "This page" },
        { label: "Pending",        value: pending,                       icon: ShoppingBag, color: "var(--accent-amber)",            sub: "This page" },
      ]} />

      <div style={st.card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <SearchBar value={search} onChange={setSearch} placeholder="Search order ID or customer…" />
            {["all", "Pending", "Completed", "Cancelled"].map((s) => (
              <button key={s} onClick={() => { setStatusFilter(s); fetchOrders(1, s); }}
                style={{ padding: "3px 10px", borderRadius: 20, fontSize: "0.68rem", fontWeight: 500, cursor: "pointer", border: `1px solid ${statusFilter === s ? "var(--accent-sage)" : "var(--border)"}`, background: statusFilter === s ? "var(--accent-sage-bg)" : "none", color: statusFilter === s ? "var(--accent-sage-text)" : "var(--text-muted)" }}>
                {s === "all" ? "All" : s}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)", fontSize: "0.82rem" }}>Loading orders…</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={ShoppingBag} title="No orders found" desc="Try different filters." />
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ ...st.th, width: 32 }}><Checkbox checked={selected.length === orders.length && orders.length > 0} onChange={toggleAll} /></th>
                {["Order ID", "Customer", "Books", "Amount", "Method", "Status", "Date", "Actions"].map((h) => <th key={h} style={st.th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o._id} style={{ background: selected.includes(o._id) ? "var(--accent-sage-bg)" : "transparent" }}>
                  <td style={st.td}><Checkbox checked={selected.includes(o._id)} onChange={() => toggleSelect(o._id)} /></td>
                  <td style={{ ...st.td, fontFamily: "monospace", fontSize: "0.78rem", fontWeight: 700, color: "var(--text-primary)", whiteSpace: "nowrap" }}>{o._id?.slice(-8).toUpperCase()}</td>
                  <td style={st.td}>
                    <div>
                      <p style={{ fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: 500 }}>{o.user?.username || "—"}</p>
                      <p style={{ fontSize: "0.68rem", color: "var(--text-faint)" }}>{o.user?.email}</p>
                    </div>
                  </td>
                  <td style={{ ...st.td, color: "var(--text-faint)", fontSize: "0.75rem" }}>{(o.books || []).length} book{(o.books || []).length !== 1 ? "s" : ""}</td>
                  <td style={{ ...st.td, fontWeight: 600, color: "var(--text-primary)" }}>₹{o.totalPrice || 0}</td>
                  <td style={st.td}><span style={{ fontSize: "0.72rem", padding: "2px 7px", borderRadius: 4, background: "var(--bg-surface)", border: "1px solid var(--border-light)", color: "var(--text-muted)" }}>{o.paymentMethod}</span></td>
                  <td style={st.td}><StatusBadge status={o.status?.toLowerCase()} /></td>
                  <td style={{ ...st.td, fontSize: "0.72rem", color: "var(--text-faint)" }}>{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
                  <td style={st.td}>
                    <div style={{ display: "flex", gap: 5 }}>
                      <ActionBtn onClick={() => setDrawer(o)}><Eye size={11} /></ActionBtn>
                      {o.status !== "Cancelled" && (
                        <ActionBtn onClick={() => { setConfirmAction({ type: "cancel", order: o }); setConfirm(true); }}>
                          <XCircle size={11} />
                        </ActionBtn>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Pagination page={pagination.page} total={pagination.total} perPage={pagination.limit} onChange={(p) => fetchOrders(p, statusFilter)} />
      </div>

      <Drawer open={!!drawer} onClose={() => setDrawer(null)} title={`Order ${drawer?._id?.slice(-8).toUpperCase()}`} width={520}>
        {drawer && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <StatusBadge status={drawer.status?.toLowerCase()} />
              <span style={{ fontSize: "0.75rem", color: "var(--text-faint)" }}>{new Date(drawer.createdAt).toLocaleDateString("en-IN")}</span>
            </div>

            <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-light)", borderRadius: 8, padding: "14px 16px", marginBottom: 16 }}>
              <p style={{ ...st.label, marginBottom: 8 }}>Customer</p>
              <p style={{ fontSize: "0.88rem", fontWeight: 500, color: "var(--text-primary)" }}>{drawer.user?.username}</p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{drawer.user?.email}</p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <p style={{ ...st.label, marginBottom: 8 }}>Books</p>
              {(drawer.books || []).map((b) => (
                <div key={b._id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: "1px solid var(--border-light)" }}>
                  <span style={{ fontSize: "0.82rem", color: "var(--text-primary)", fontStyle: "italic" }}>{b.title}</span>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginLeft: "auto" }}>₹{b.price}</span>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 16 }}>
              <p style={{ ...st.label, marginBottom: 8 }}>Payment</p>
              {[["Method", drawer.paymentMethod], ["Total", `₹${drawer.totalPrice}`], ["Order ID", drawer._id]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid var(--border-light)" }}>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{k}</span>
                  <span style={{ fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: k === "Total" ? 600 : 400, wordBreak: "break-all" }}>{v}</span>
                </div>
              ))}
            </div>

            {drawer.status !== "Cancelled" && (
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <ActionBtn variant="danger" onClick={() => { updateStatus(drawer._id, "Cancelled"); setDrawer(null); }}>Cancel Order</ActionBtn>
              </div>
            )}
          </div>
        )}
      </Drawer>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          if (confirmAction?.type === "cancel") updateStatus(confirmAction.order._id, "Cancelled");
          setConfirmAction(null);
        }}
        title="Cancel Order"
        message={`Cancel order ${confirmAction?.order?._id?.slice(-8).toUpperCase()}? This cannot be undone.`}
        danger
        confirmLabel="Cancel Order"
      />
    </>
  );
}
