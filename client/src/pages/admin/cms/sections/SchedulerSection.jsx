import { useState, useEffect } from "react";
import { Clock, Plus, Trash2, CheckCircle } from "lucide-react";
import api from "../../../../services/axios";
import { st, SectionTitle, StatusBadge, Modal, ConfirmDialog, EmptyState, Field, ActionBtn, Pagination, useToastEmitter } from "../cmsUi";

const TYPES = ["Book", "Promotion", "Homepage", "Notification"];
const ACTIONS = { Book: ["Publish", "Archive"], Promotion: ["Activate", "Deactivate"], Homepage: ["Publish", "Unpublish"], Notification: ["Send"] };
const TIMEZONES = ["IST", "UTC", "PST", "EST", "CST"];
const EMPTY = { type: "Book", name: "", action: "Publish", date: "", time: "09:00", tz: "IST" };

export default function SchedulerSection() {
  const toast = useToastEmitter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [confirm, setConfirm] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/cms/scheduled-tasks", { params: { limit: 50 } });
      const raw=data?.data??data;
      const list=Array.isArray(raw)?raw:(Array.isArray(raw?.data)?raw.data:[]);
      setJobs(Array.isArray(list)?list.map(j => ({
        ...j,
        id: j._id || j.id,
        _id: j._id||j.id,
        scheduledAt: j.scheduledAt ? new Date(j.scheduledAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : j.scheduledAt,
        rawScheduledAt: j.scheduledAt,
        status: j.status || "pending",
      })) : []);
    } catch(e) {
      toast?.(e?.response?.data?.message||"Failed to load jobs","error");
      setJobs([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchJobs(); }, []);

  const paginated = jobs.slice((page-1)*PER_PAGE, page*PER_PAGE);
  const f = (key) => (e) => {
    const updated = { ...form, [key]: e.target.value };
    if (key === "type") updated.action = ACTIONS[e.target.value]?.[0] || "";
    setForm(updated);
  };

  const save = async () => {
    if (!form.name.trim()) { toast?.("Name is required", "error"); return; }
    if (!form.date) { toast?.("Date is required", "error"); return; }
    const scheduledAt = new Date(`${form.date}T${form.time}:00`).toISOString();
    try {
      const { data } = await api.post("/cms/scheduled-tasks", {
        type: form.type,
        name: form.name,
        action: form.action,
        scheduledAt,
        tz: form.tz,
        status: "pending",
      });
      const saved = data?.data ?? data;
      setJobs(prev => [...prev, {
        ...saved, id: saved._id || saved.id,
        scheduledAt: saved.scheduledAt ? new Date(saved.scheduledAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : `${form.date}, ${form.time}`,
        rawScheduledAt: saved.scheduledAt,
        status: saved.status || "pending",
        type: saved.type || form.type,
        name: saved.name || form.name,
        action: saved.action || form.action,
        tz: saved.tz || form.tz,
      }]);
      toast?.("Job scheduled (live)");
      setModal(false);
      setForm(EMPTY);
    } catch (e) {
      toast?.(e?.response?.data?.message || "Schedule failed", "error");
    }
  };

  const deleteJob = async (j) => {
    const id = j._id || j.id;
    try {
      await api.delete(`/cms/scheduled-tasks/${id}`);
      setJobs(prev => prev.filter(x => (x._id || x.id) !== id));
      toast?.("Job removed (live)");
    } catch(e) {
      toast?.(e?.response?.data?.message||"Delete failed","error");
    }
  };

  const typeColor = { Book: "var(--accent-sage)", Promotion: "var(--accent-danger)", Homepage: "var(--accent-info)", Notification: "var(--accent-amber)" };

  if (loading) return <><SectionTitle>Content Scheduler</SectionTitle><div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)", fontSize: "0.82rem" }}>Loading scheduled jobs…</div></>;

  return (
    <>
      <SectionTitle action={<button className="btn btn-primary btn-sm" onClick={() => { setForm(EMPTY); setModal(true); }} style={{ display: "flex", alignItems: "center", gap: 6 }}><Plus size={13} />Schedule Job</button>}>
        Content Scheduler
      </SectionTitle>

      <div style={{ ...st.card, background: "rgba(59,130,246,0.04)", border: "1px solid rgba(59,130,246,0.15)", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <Clock size={16} style={{ color: "var(--accent-info)", marginTop: 2, flexShrink: 0 }} />
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
            Schedule publish, archive, or send actions for Books, Promotions, Homepage sections, and Notifications. Jobs are persisted via <code>/cms/scheduled-tasks</code> and run at the specified time in the selected timezone.
          </p>
        </div>
      </div>

      <div style={st.card}>
        {paginated.length === 0 ? <EmptyState icon={Clock} title="No scheduled jobs" desc="Schedule your first content action." /> : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>{["Type", "Name", "Action", "Scheduled At", "Timezone", "Status", "Actions"].map(h => <th key={h} style={st.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {paginated.map(j => (
                <tr key={j.id}>
                  <td style={st.td}>
                    <span style={{ fontSize: "0.7rem", padding: "2px 8px", borderRadius: 4, background: `${typeColor[j.type]}14`, color: typeColor[j.type], border: `1px solid ${typeColor[j.type]}30`, fontWeight: 600 }}>{j.type}</span>
                  </td>
                  <td style={{ ...st.td, fontWeight: 500, color: "var(--text-primary)" }}>{j.name}</td>
                  <td style={{ ...st.td, fontFamily: "monospace", fontSize: "0.75rem", color: "var(--text-muted)" }}>{j.action}</td>
                  <td style={{ ...st.td, fontSize: "0.78rem", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>{j.scheduledAt}</td>
                  <td style={{ ...st.td, fontSize: "0.72rem", color: "var(--text-faint)" }}>{j.tz}</td>
                  <td style={st.td}><StatusBadge status={j.status} /></td>
                  <td style={st.td}>
                    {j.status === "pending" && (
                      <ActionBtn variant="danger" onClick={() => setConfirm(j)}><Trash2 size={11} /></ActionBtn>
                    )}
                    {j.status === "completed" && <CheckCircle size={14} style={{ color: "var(--accent-sage)" }} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Pagination page={page} total={jobs.length} perPage={PER_PAGE} onChange={setPage} />
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Schedule New Job">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Content Type">
            <select style={st.input} value={form.type} onChange={f("type")}>
              {TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Action">
            <select style={st.input} value={form.action} onChange={f("action")}>
              {(ACTIONS[form.type] || []).map(a => <option key={a}>{a}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Name / Title">
          <input style={st.input} value={form.name} onChange={f("name")} placeholder="e.g. Summer Sale Banner" />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <Field label="Date"><input type="date" style={st.input} value={form.date} onChange={f("date")} /></Field>
          <Field label="Time"><input type="time" style={st.input} value={form.time} onChange={f("time")} /></Field>
          <Field label="Timezone">
            <select style={st.input} value={form.tz} onChange={f("tz")}>
              {TIMEZONES.map(t => <option key={t}>{t}</option>)}
            </select>
          </Field>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setModal(false)}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={save}>Schedule Job</button>
        </div>
      </Modal>

      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => deleteJob(confirm)}
        title="Cancel Scheduled Job" message={`Cancel the scheduled "${confirm?.action}" for "${confirm?.name}"?`}
        confirmLabel="Cancel Job" />
    </>
  );
}
