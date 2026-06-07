import { useState } from "react";
import { ShoppingBag, Eye, RefreshCw, XCircle } from "lucide-react";
import { MOCK_ORDERS } from "../cmsData";
import { st, SectionTitle, KpiRow, StatusBadge, ConfirmDialog, Drawer, SearchBar, EmptyState, ActionBtn, Checkbox, Pagination, useToastEmitter } from "../cmsUi";

export default function OrdersSection() {
  const toast = useToastEmitter();
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState([]);
  const [drawer, setDrawer] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const filtered = orders.filter(o => {
    const ms = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
    const mf = statusFilter === "all" || o.status === statusFilter;
    return ms && mf;
  });
  const paginated = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  const refund = (id) => { setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "cancelled" } : o)); toast?.("Refund initiated"); };
  const cancel = (id) => { setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "cancelled" } : o)); toast?.("Order cancelled"); };

  const toggleSelect = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(selected.length === paginated.length ? [] : paginated.map(o => o.id));

  const total = orders.reduce((s, o) => s + parseInt(o.amount.replace(/[^0-9]/g, "")), 0);
  const delivered = orders.filter(o => o.status === "delivered").length;
  const pending = orders.filter(o => o.status === "pending").length;

  return (
    <>
      <SectionTitle>Orders Manager</SectionTitle>

      <KpiRow items={[
        { label: "Total Orders",   value: orders.length, icon: ShoppingBag, color: "var(--accent-sage)",  sub: "All time" },
        { label: "Revenue",        value: `₹${total.toLocaleString()}`, icon: ShoppingBag, color: "var(--accent-gold, #F59E0B)", sub: "Gross" },
        { label: "Delivered",      value: delivered,     icon: ShoppingBag, color: "var(--accent-info)",  sub: "Completed orders" },
        { label: "Pending",        value: pending,       icon: ShoppingBag, color: "var(--accent-amber)", sub: "Awaiting action" },
      ]} />

      <div style={st.card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search order ID or customer…" />
            {["all", "pending", "shipped", "delivered", "cancelled"].map(s => (
              <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
                style={{ padding: "3px 10px", borderRadius: 20, fontSize: "0.68rem", fontWeight: 500, cursor: "pointer", border: `1px solid ${statusFilter === s ? "var(--accent-sage)" : "var(--border)"}`, background: statusFilter === s ? "var(--accent-sage-bg)" : "none", color: statusFilter === s ? "var(--accent-sage-text)" : "var(--text-muted)" }}>
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {paginated.length === 0 ? <EmptyState icon={ShoppingBag} title="No orders found" desc="Try different filters." /> : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ ...st.th, width: 32 }}><Checkbox checked={selected.length === paginated.length && paginated.length > 0} onChange={toggleAll} /></th>
                {["Order ID", "Customer", "Items", "Amount", "Method", "Status", "Date", "Actions"].map(h => <th key={h} style={st.th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {paginated.map(o => (
                <tr key={o.id} style={{ background: selected.includes(o.id) ? "var(--accent-sage-bg)" : "transparent" }}>
                  <td style={st.td}><Checkbox checked={selected.includes(o.id)} onChange={() => toggleSelect(o.id)} /></td>
                  <td style={{ ...st.td, fontFamily: "monospace", fontSize: "0.78rem", fontWeight: 700, color: "var(--text-primary)", whiteSpace: "nowrap" }}>{o.id}</td>
                  <td style={st.td}>{o.customer}</td>
                  <td style={{ ...st.td, color: "var(--text-faint)", fontSize: "0.75rem" }}>{o.items} book{o.items !== 1 ? "s" : ""}</td>
                  <td style={{ ...st.td, fontWeight: 600, color: "var(--text-primary)" }}>{o.amount}</td>
                  <td style={st.td}><span style={{ fontSize: "0.72rem", padding: "2px 7px", borderRadius: 4, background: "var(--bg-surface)", border: "1px solid var(--border-light)", color: "var(--text-muted)" }}>{o.method}</span></td>
                  <td style={st.td}><StatusBadge status={o.status} /></td>
                  <td style={{ ...st.td, fontSize: "0.72rem", color: "var(--text-faint)" }}>{o.date}</td>
                  <td style={st.td}>
                    <div style={{ display: "flex", gap: 5 }}>
                      <ActionBtn onClick={() => setDrawer(o)}><Eye size={11} /></ActionBtn>
                      {o.status !== "cancelled" && <ActionBtn onClick={() => { setConfirmAction({ type: "refund", order: o }); setConfirm(true); }}><RefreshCw size={11} /></ActionBtn>}
                      {o.status === "pending" && <ActionBtn variant="danger" onClick={() => { setConfirmAction({ type: "cancel", order: o }); setConfirm(true); }}><XCircle size={11} /></ActionBtn>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
      </div>

      <Drawer open={!!drawer} onClose={() => setDrawer(null)} title={`Order ${drawer?.id}`} width={520}>
        {drawer && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <StatusBadge status={drawer.status} />
              <span style={{ fontSize: "0.75rem", color: "var(--text-faint)" }}>{drawer.date}</span>
            </div>

            <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-light)", borderRadius: 8, padding: "14px 16px", marginBottom: 16 }}>
              <p style={{ ...st.label, marginBottom: 8 }}>Customer</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--accent-sage-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--accent-sage-text)" }}>{drawer.customer.charAt(0).toUpperCase()}</span>
                </div>
                <span style={{ fontSize: "0.88rem", fontWeight: 500, color: "var(--text-primary)" }}>{drawer.customer}</span>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <p style={{ ...st.label, marginBottom: 8 }}>Books Purchased</p>
              {drawer.books.map((b, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: "1px solid var(--border-light)" }}>
                  <div style={{ width: 28, height: 36, borderRadius: 3, background: "var(--bg-page)", border: "1px solid var(--border)", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.82rem", color: "var(--text-primary)", fontStyle: "italic" }}>{b}</span>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 16 }}>
              <p style={{ ...st.label, marginBottom: 8 }}>Payment</p>
              {[["Method", drawer.method], ["Amount", drawer.amount], ["Order ID", drawer.id]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid var(--border-light)" }}>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{k}</span>
                  <span style={{ fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: k === "Amount" ? 600 : 400 }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 16 }}>
              <p style={{ ...st.label, marginBottom: 10 }}>Timeline</p>
              {[
                { event: "Order placed", time: drawer.date, done: true },
                { event: "Payment confirmed", time: drawer.date, done: drawer.status !== "pending" },
                { event: "Shipped", time: drawer.status === "shipped" || drawer.status === "delivered" ? drawer.date : "—", done: drawer.status === "shipped" || drawer.status === "delivered" },
                { event: "Delivered", time: drawer.status === "delivered" ? drawer.date : "—", done: drawer.status === "delivered" },
              ].map(({ event, time, done }) => (
                <div key={event} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: done ? "var(--accent-sage)" : "var(--border-medium)", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.78rem", color: done ? "var(--text-primary)" : "var(--text-faint)", flex: 1 }}>{event}</span>
                  <span style={{ fontSize: "0.68rem", color: "var(--text-faint)" }}>{time}</span>
                </div>
              ))}
            </div>

            {drawer.status !== "cancelled" && (
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <ActionBtn onClick={() => { refund(drawer.id); setDrawer(null); }}>Initiate Refund</ActionBtn>
                {drawer.status === "pending" && <ActionBtn variant="danger" onClick={() => { cancel(drawer.id); setDrawer(null); }}>Cancel Order</ActionBtn>}
              </div>
            )}
          </div>
        )}
      </Drawer>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          if (confirmAction?.type === "refund") refund(confirmAction.order.id);
          if (confirmAction?.type === "cancel") cancel(confirmAction.order.id);
          setConfirmAction(null);
        }}
        title={confirmAction?.type === "refund" ? "Initiate Refund" : "Cancel Order"}
        message={confirmAction?.type === "refund"
          ? `Issue a refund for order ${confirmAction?.order?.id} (${confirmAction?.order?.amount})?`
          : `Cancel order ${confirmAction?.order?.id}? This cannot be undone.`}
        danger={confirmAction?.type === "cancel"}
        confirmLabel={confirmAction?.type === "refund" ? "Refund" : "Cancel Order"}
      />
    </>
  );
}
