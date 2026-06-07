import { useState } from "react";
import { MessageSquare, Eye, CheckCircle, Send } from "lucide-react";
import { MOCK_SUPPORT } from "../cmsData";
import { st, SectionTitle, KpiRow, StatusBadge, Modal, Drawer, SearchBar, EmptyState, Field, ActionBtn, Checkbox, Pagination, useToastEmitter } from "../cmsUi";

export default function SupportSection() {
  const toast = useToastEmitter();
  const [tickets, setTickets] = useState(MOCK_SUPPORT);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [drawer, setDrawer] = useState(null);
  const [replyModal, setReplyModal] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const filtered = tickets.filter(t => {
    const ms = t.subject.toLowerCase().includes(search.toLowerCase()) || t.customer.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
    const mf = statusFilter === "all" || t.status === statusFilter;
    return ms && mf;
  });
  const paginated = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  const resolve = (id) => { setTickets(prev => prev.map(t => t.id === id ? { ...t, status: "resolved" } : t)); toast?.("Ticket resolved"); };
  const open = (id) => { setTickets(prev => prev.map(t => t.id === id ? { ...t, status: "open" } : t)); toast?.("Ticket reopened"); };
  const sendReply = () => {
    if (!replyText.trim()) return;
    toast?.(`Reply sent to ${replyModal?.customer}`);
    setReplyText("");
    setReplyModal(null);
  };

  const toggleSelect = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(selected.length === paginated.length ? [] : paginated.map(t => t.id));

  const openCount = tickets.filter(t => t.status === "open").length;
  const pendingCount = tickets.filter(t => t.status === "pending").length;
  const resolvedCount = tickets.filter(t => t.status === "resolved").length;

  return (
    <>
      <SectionTitle>Support Center</SectionTitle>

      <KpiRow items={[
        { label: "Open",     value: openCount,    icon: MessageSquare, color: "var(--accent-danger)", sub: "Needs attention" },
        { label: "Pending",  value: pendingCount, icon: MessageSquare, color: "var(--accent-amber)",  sub: "Awaiting reply" },
        { label: "Resolved", value: resolvedCount,icon: CheckCircle,   color: "var(--accent-sage)",   sub: "This week" },
        { label: "Total",    value: tickets.length,icon: MessageSquare,color: "var(--accent-info)",   sub: "All tickets" },
      ]} />

      <div style={st.card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search tickets…" />
            {["all", "open", "pending", "resolved"].map(s => (
              <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
                style={{ padding: "3px 10px", borderRadius: 20, fontSize: "0.68rem", fontWeight: 500, cursor: "pointer", border: `1px solid ${statusFilter === s ? "var(--accent-sage)" : "var(--border)"}`, background: statusFilter === s ? "var(--accent-sage-bg)" : "none", color: statusFilter === s ? "var(--accent-sage-text)" : "var(--text-muted)" }}>
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          {selected.length > 0 && (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{selected.length} selected</span>
              <ActionBtn onClick={() => { selected.forEach(id => resolve(id)); setSelected([]); }}>Resolve All</ActionBtn>
            </div>
          )}
        </div>

        {paginated.length === 0 ? <EmptyState icon={MessageSquare} title="No tickets found" desc="All support queries resolved!" /> : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ ...st.th, width: 32 }}><Checkbox checked={selected.length === paginated.length && paginated.length > 0} onChange={toggleAll} /></th>
                {["Ticket ID", "Customer", "Subject", "Priority", "Status", "Updated", "Actions"].map(h => <th key={h} style={st.th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {paginated.map(t => (
                <tr key={t.id} style={{ background: selected.includes(t.id) ? "var(--accent-sage-bg)" : "transparent" }}>
                  <td style={st.td}><Checkbox checked={selected.includes(t.id)} onChange={() => toggleSelect(t.id)} /></td>
                  <td style={{ ...st.td, fontFamily: "monospace", fontSize: "0.78rem", fontWeight: 700, color: "var(--text-primary)", whiteSpace: "nowrap" }}>{t.id}</td>
                  <td style={st.td}>{t.customer}</td>
                  <td style={{ ...st.td, fontWeight: 500, color: "var(--text-primary)", maxWidth: 200 }}>
                    <p style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.subject}</p>
                  </td>
                  <td style={st.td}><StatusBadge status={t.priority} /></td>
                  <td style={st.td}><StatusBadge status={t.status} /></td>
                  <td style={{ ...st.td, fontSize: "0.72rem", color: "var(--text-faint)" }}>{t.updated}</td>
                  <td style={st.td}>
                    <div style={{ display: "flex", gap: 5 }}>
                      <ActionBtn onClick={() => setDrawer(t)}><Eye size={11} /></ActionBtn>
                      <ActionBtn onClick={() => setReplyModal(t)}><Send size={11} /></ActionBtn>
                      {t.status !== "resolved" && <ActionBtn onClick={() => resolve(t.id)}><CheckCircle size={11} /></ActionBtn>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
      </div>

      <Drawer open={!!drawer} onClose={() => setDrawer(null)} title={`Ticket ${drawer?.id}`}>
        {drawer && (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <StatusBadge status={drawer.status} />
              <StatusBadge status={drawer.priority} />
            </div>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>{drawer.subject}</h3>
            {[["Customer", drawer.customer], ["Ticket ID", drawer.id], ["Last Updated", drawer.updated]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border-light)" }}>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 500 }}>{k}</span>
                <span style={{ fontSize: "0.82rem", color: "var(--text-primary)" }}>{v}</span>
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <ActionBtn variant="primary" onClick={() => { setDrawer(null); setReplyModal(drawer); }}>Reply</ActionBtn>
              {drawer.status !== "resolved" && <ActionBtn onClick={() => { resolve(drawer.id); setDrawer(null); }}>Resolve</ActionBtn>}
            </div>
          </div>
        )}
      </Drawer>

      <Modal open={!!replyModal} onClose={() => setReplyModal(null)} title={`Reply — ${replyModal?.id}`}>
        <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: 14 }}>
          Replying to <strong>{replyModal?.customer}</strong> regarding: {replyModal?.subject}
        </p>
        <Field label="Message">
          <textarea style={{ ...st.input, resize: "vertical" }} rows={5} value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Type your reply…" />
        </Field>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setReplyModal(null)}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={sendReply}>Send Reply</button>
        </div>
      </Modal>
    </>
  );
}
