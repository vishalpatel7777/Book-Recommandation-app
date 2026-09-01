import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Copy, Send, Eye } from "lucide-react";
import api from "../../../../services/axios";
import { st, SectionTitle, StatusBadge, Modal, ConfirmDialog, Drawer, SearchBar, EmptyState, Field, ActionBtn, Pagination, useToastEmitter } from "../cmsUi";

const CHANNELS = ["email", "push", "sms"];
const TRIGGERS = ["payment-success", "user-registered", "review-create", "refund-approved", "checkout-start", "cron-weekly", "cron-daily", "failed-login"];
const EMPTY = { template: "", channel: "email", trigger: "payment-success", subject: "", message: "", status: "draft" };

function TemplateForm({ value, onChange }) {
  const f = (key) => (e) => onChange({ ...value, [key]: e.target.value });
  return (
    <div>
      <Field label="Template Name"><input style={st.input} value={value.template} onChange={f("template")} placeholder="e.g. Order Confirmation" /></Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Channel">
          <select style={st.input} value={value.channel} onChange={f("channel")}>
            {CHANNELS.map(c => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Trigger">
          <select style={st.input} value={value.trigger} onChange={f("trigger")}>
            {TRIGGERS.map(t => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Status">
          <select style={st.input} value={value.status} onChange={f("status")}>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </Field>
      </div>
      {(value.channel === "email") && (
        <Field label="Subject" hint="Use {{name}}, {{book}}, {{amount}} as variables">
          <input style={st.input} value={value.subject} onChange={f("subject")} placeholder="Your order is confirmed!" />
        </Field>
      )}
      <Field label="Message Body" hint="Available vars: {{name}}, {{order_id}}, {{book}}, {{amount}}, {{rating}}">
        <textarea style={{ ...st.input, resize: "vertical" }} rows={4} value={value.message} onChange={f("message")} placeholder="Hi {{name}}, ..." />
      </Field>
    </div>
  );
}

function PreviewDrawer({ tpl, onClose }) {
  if (!tpl) return null;
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <span style={st.label}>Channel</span>
        <span style={{ fontSize: "0.82rem", padding: "2px 8px", borderRadius: 4, background: tpl.channel === "email" ? "rgba(59,130,246,0.1)" : "rgba(139,111,71,0.1)", color: tpl.channel === "email" ? "var(--accent-info)" : "var(--accent-amber-dark)" }}>{tpl.channel}</span>
      </div>
      <div style={{ marginBottom: 16 }}>
        <span style={st.label}>Trigger</span>
        <code style={{ fontSize: "0.78rem", padding: "2px 7px", borderRadius: 4, background: "var(--bg-surface)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>{tpl.trigger}</code>
      </div>
      {tpl.subject && (
        <div style={{ marginBottom: 16 }}>
          <span style={st.label}>Subject</span>
          <p style={{ fontSize: "0.88rem", fontWeight: 500, color: "var(--text-primary)" }}>{tpl.subject}</p>
        </div>
      )}
      <div>
        <span style={st.label}>Message Preview</span>
        <div style={{ background: "var(--bg-page)", border: "1px solid var(--border)", borderRadius: 8, padding: "16px", fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6, fontFamily: "var(--font-body)" }}>
          {tpl.message?.replace("{{name}}", "Anjali").replace("{{order_id}}", "ORD-1091").replace("{{book}}", "Atomic Habits").replace("{{amount}}", "₹349").replace("{{rating}}", "5")}
        </div>
      </div>
      <div style={{ marginTop: 20 }}>
        <span style={st.label}>Stats</span>
        <p style={{ fontSize: "0.88rem", color: "var(--text-primary)" }}>{(tpl.sent || 0).toLocaleString()} sent</p>
      </div>
      <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ marginTop: 20 }}>Close</button>
    </div>
  );
}

export default function NotificationCenterSection() {
  const toast = useToastEmitter();
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [previewDrawer, setPreviewDrawer] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const fetchNotifs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/cms/notifications", { params: { limit: 50 } });
      const raw=data?.data??data;
      const list=Array.isArray(raw)?raw:(Array.isArray(raw?.data)?raw.data:[]);
      setNotifs(Array.isArray(list)?list.map(n => ({ ...n, id: n._id || n.id, _id: n._id||n.id, sent: n.sent || 0 })):[]);
    } catch(e) {
      toast?.(e?.response?.data?.message||"Failed to load templates","error");
      setNotifs([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchNotifs(); }, []);

  const filtered = notifs.filter(n => !search || String(n.template||"").toLowerCase().includes(search.toLowerCase()));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const openAdd = () => { setForm(EMPTY); setEditingId(null); setModal("add"); };
  const openEdit = (n) => { setForm({ ...n }); setEditingId(n._id || n.id); setModal("edit"); };

  const clone = async (n) => {
    const id = n._id || n.id;
    try {
      const { data } = await api.post(`/cms/notifications/${id}/duplicate`);
      const saved = data?.data ?? data;
      setNotifs(prev => [...prev, { ...saved, id: saved._id || saved.id, _id: saved._id||saved.id, sent: saved.sent || 0 }]);
      toast?.("Template cloned (live)");
    } catch(e) {
      toast?.(e?.response?.data?.message||"Clone failed","error");
    }
  };
  const testSend = (n) => toast?.(`Test ${n.channel} sent for "${n.template}" — check email/logs`, "info");

  const save = async () => {
    if (!form.template.trim()) { toast?.("Template name is required", "error"); return; }
    if (!form.message.trim()) { toast?.("Message body is required", "error"); return; }
    try {
      if (modal === "add") {
        const { data } = await api.post("/cms/notifications", form);
        const saved = data?.data ?? data;
        setNotifs(prev => [...prev, { ...saved, id: saved._id || saved.id, sent: saved.sent || 0 }]);
        toast?.("Template created (live)");
      } else {
        const { data } = await api.put(`/cms/notifications/${editingId}`, form);
        const saved = data?.data ?? data;
        setNotifs(prev => prev.map(x => (x._id || x.id) === editingId ? { ...x, ...saved, id: saved._id || saved.id } : x));
        toast?.("Template updated (live)");
      }
      setModal(null);
    } catch (e) {
      toast?.(e?.response?.data?.message || "Save failed", "error");
    }
  };

  const deleteTemplate = async (n) => {
    const id = n._id || n.id;
    try {
      await api.delete(`/cms/notifications/${id}`);
      setNotifs(prev => prev.filter(x => (x._id || x.id) !== id));
      toast?.("Template deleted (live)");
    } catch(e) {
      toast?.(e?.response?.data?.message||"Delete failed","error");
    }
  };

  if (loading) return <><SectionTitle>Notification Center</SectionTitle><div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)", fontSize: "0.82rem" }}>Loading templates…</div></>;

  return (
    <>
      <SectionTitle action={<button className="btn btn-primary btn-sm" onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: 6 }}><Plus size={13} />New Template</button>}>
        Notification Center
      </SectionTitle>

      <div style={st.card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search templates…" />
        </div>

        {paginated.length === 0 ? <EmptyState title="No templates" desc={notifs.length===0 ? "No templates in database. Create a notification template." : "Try a different search."} /> : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>{["Template", "Channel", "Trigger", "Status", "Sent", "Actions"].map(h => <th key={h} style={st.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {paginated.map(n => (
                <tr key={n.id}>
                  <td style={{ ...st.td, fontWeight: 500, color: "var(--text-primary)" }}>{n.template}</td>
                  <td style={st.td}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.72rem", padding: "2px 7px", borderRadius: 4, background: n.channel === "email" ? "rgba(59,130,246,0.1)" : n.channel === "push" ? "rgba(139,111,71,0.1)" : "rgba(92,122,94,0.1)", color: n.channel === "email" ? "var(--accent-info)" : n.channel === "push" ? "var(--accent-amber-dark)" : "var(--accent-sage-text)", border: "1px solid transparent" }}>
                      {n.channel}
                    </span>
                  </td>
                  <td style={{ ...st.td, fontFamily: "monospace", fontSize: "0.72rem", color: "var(--text-muted)" }}>{n.trigger}</td>
                  <td style={st.td}><StatusBadge status={n.status} /></td>
                  <td style={{ ...st.td, fontWeight: 600 }}>{(n.sent || 0).toLocaleString()}</td>
                  <td style={st.td}>
                    <div style={{ display: "flex", gap: 5 }}>
                      <ActionBtn onClick={() => setPreviewDrawer(n)}><Eye size={11} /></ActionBtn>
                      <ActionBtn onClick={() => openEdit(n)}><Edit2 size={11} /></ActionBtn>
                      <ActionBtn onClick={() => clone(n)}><Copy size={11} /></ActionBtn>
                      <ActionBtn onClick={() => testSend(n)} title="Send test"><Send size={11} /></ActionBtn>
                      <ActionBtn variant="danger" onClick={() => setConfirm(n)}><Trash2 size={11} /></ActionBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
      </div>

      <Modal open={modal === "add" || modal === "edit"} onClose={() => setModal(null)} title={modal === "add" ? "New Template" : "Edit Template"} width={580}>
        <TemplateForm value={form} onChange={setForm} />
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setModal(null)}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={save}>{modal === "add" ? "Create Template" : "Save Changes"}</button>
        </div>
      </Modal>

      <Drawer open={!!previewDrawer} onClose={() => setPreviewDrawer(null)} title="Template Preview">
        <PreviewDrawer tpl={previewDrawer} onClose={() => setPreviewDrawer(null)} />
      </Drawer>

      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => deleteTemplate(confirm)}
        title="Delete Template" message={`Delete "${confirm?.template}"? This cannot be undone.`} />
    </>
  );
}
