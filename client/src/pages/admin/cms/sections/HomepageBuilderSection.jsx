import { useState, useRef } from "react";
import { GripVertical, Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import { st, SectionTitle, StatusBadge, Modal, ConfirmDialog, Field, ActionBtn, Toggle, useToastEmitter } from "../cmsUi";

const SECTION_TYPES = ["Hero Banner", "Featured Books", "Best Sellers", "Trending", "New Arrivals", "Authors", "Testimonials", "Newsletter", "Promotion Banner", "Categories"];

const INITIAL_BLOCKS = [
  { id: "b1", type: "Hero Banner",       status: "active",   order: 1, headline: "Discover Your Next Read", subtext: "Curated books for every mood." },
  { id: "b2", type: "Featured Books",    status: "active",   order: 2, headline: "Staff Picks", subtext: "" },
  { id: "b3", type: "Categories",        status: "active",   order: 3, headline: "Browse by Genre", subtext: "" },
  { id: "b4", type: "New Arrivals",      status: "active",   order: 4, headline: "Fresh off the Press", subtext: "" },
  { id: "b5", type: "Promotion Banner",  status: "inactive", order: 5, headline: "Summer Sale", subtext: "Up to 40% off" },
  { id: "b6", type: "Trending",          status: "active",   order: 6, headline: "Trending This Week", subtext: "" },
  { id: "b7", type: "Newsletter",        status: "inactive", order: 7, headline: "Stay in the Loop", subtext: "Get weekly book recommendations." },
];

const EMPTY_BLOCK = { type: "Hero Banner", status: "active", headline: "", subtext: "" };

function BlockConfig({ value, onChange }) {
  const f = (key) => (e) => onChange({ ...value, [key]: e.target.value });
  return (
    <div>
      <Field label="Section Type">
        <select style={st.input} value={value.type} onChange={f("type")}>
          {SECTION_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
      </Field>
      <Field label="Headline / Title">
        <input style={st.input} value={value.headline || ""} onChange={f("headline")} placeholder="Section heading" />
      </Field>
      <Field label="Subtext / Description">
        <input style={st.input} value={value.subtext || ""} onChange={f("subtext")} placeholder="Optional subtitle" />
      </Field>
      {value.type === "Hero Banner" && (
        <>
          <Field label="Background Image URL">
            <input style={st.input} value={value.bgImage || ""} onChange={f("bgImage")} placeholder="https://..." />
          </Field>
          <Field label="CTA Button Text">
            <input style={st.input} value={value.ctaText || ""} onChange={f("ctaText")} placeholder="Shop Now" />
          </Field>
        </>
      )}
      {value.type === "Promotion Banner" && (
        <Field label="Discount Text">
          <input style={st.input} value={value.discount || ""} onChange={f("discount")} placeholder="Up to 40% off" />
        </Field>
      )}
      <Field label="Status">
        <select style={st.input} value={value.status} onChange={f("status")}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </Field>
    </div>
  );
}

export default function HomepageBuilderSection() {
  const toast = useToastEmitter();
  const [blocks, setBlocks] = useState(INITIAL_BLOCKS);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_BLOCK);
  const [confirm, setConfirm] = useState(null);
  const [dragId, setDragId] = useState(null);
  const dragOverId = useRef(null);

  const openAdd = () => { setForm({ ...EMPTY_BLOCK }); setModal({ mode: "add" }); };
  const openEdit = (b) => { setForm({ ...b }); setModal({ mode: "edit", id: b.id }); };

  const save = () => {
    if (!form.headline?.trim()) { toast?.("Headline is required", "error"); return; }
    if (modal.mode === "add") {
      setBlocks(prev => [...prev, { ...form, id: `b${Date.now()}`, order: prev.length + 1 }]);
      toast?.("Section added");
    } else {
      setBlocks(prev => prev.map(b => b.id === modal.id ? { ...b, ...form } : b));
      toast?.("Section updated");
    }
    setModal(null);
  };

  const deleteBlock = (b) => { setBlocks(prev => prev.filter(x => x.id !== b.id)); toast?.("Section removed"); };
  const toggleStatus = (id) => { setBlocks(prev => prev.map(b => b.id === id ? { ...b, status: b.status === "active" ? "inactive" : "active" } : b)); };

  const onDragStart = (id) => setDragId(id);
  const onDragOver = (e, id) => { e.preventDefault(); dragOverId.current = id; };
  const onDrop = () => {
    if (!dragId || dragId === dragOverId.current) return;
    setBlocks(prev => {
      const arr = [...prev];
      const fromIdx = arr.findIndex(b => b.id === dragId);
      const toIdx = arr.findIndex(b => b.id === dragOverId.current);
      const [moved] = arr.splice(fromIdx, 1);
      arr.splice(toIdx, 0, moved);
      return arr.map((b, i) => ({ ...b, order: i + 1 }));
    });
    setDragId(null);
    dragOverId.current = null;
  };

  const publish = () => toast?.("Layout published to storefront");

  return (
    <>
      <SectionTitle action={
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => toast?.("Preview opened", "info")}>Preview</button>
          <button className="btn btn-primary btn-sm" onClick={publish}>Publish Layout</button>
        </div>
      }>
        Homepage Builder
      </SectionTitle>

      <div style={{ ...st.card, marginBottom: 16 }}>
        <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: 16 }}>Drag rows to reorder. Toggle visibility per section. Changes apply after Publish.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {blocks.map((b) => (
            <div key={b.id}
              draggable
              onDragStart={() => onDragStart(b.id)}
              onDragOver={(e) => onDragOver(e, b.id)}
              onDrop={onDrop}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                borderRadius: 8, background: dragId === b.id ? "var(--accent-sage-bg)" : "var(--bg-surface)",
                border: `1px solid ${dragId === b.id ? "var(--accent-sage)" : "var(--border-light)"}`,
                cursor: "grab", transition: "all 0.15s",
                opacity: b.status === "inactive" ? 0.6 : 1,
              }}>
              <GripVertical size={14} style={{ color: "var(--text-faint)", flexShrink: 0 }} />
              <span style={{ fontSize: "0.65rem", color: "var(--text-faint)", width: 16, flexShrink: 0, fontFamily: "monospace" }}>{b.order}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "0.83rem", fontWeight: 500, color: "var(--text-primary)" }}>{b.type}</p>
                {b.headline && <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 1 }}>{b.headline}</p>}
              </div>
              <StatusBadge status={b.status} />
              <Toggle on={b.status === "active"} onToggle={() => toggleStatus(b.id)} />
              <ActionBtn onClick={() => openEdit(b)}><Edit2 size={11} /></ActionBtn>
              <ActionBtn variant="danger" onClick={() => setConfirm(b)}><Trash2 size={11} /></ActionBtn>
            </div>
          ))}
        </div>
        <button className="btn btn-secondary btn-sm" onClick={openAdd} style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 6 }}>
          <Plus size={12} /> Add Section
        </button>
      </div>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === "add" ? "Add Homepage Section" : "Edit Section"}>
        <BlockConfig value={form} onChange={setForm} />
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setModal(null)}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={save}>{modal?.mode === "add" ? "Add Section" : "Save"}</button>
        </div>
      </Modal>

      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => deleteBlock(confirm)}
        title="Remove Section" message={`Remove "${confirm?.type}" from the homepage? This can be re-added later.`} />
    </>
  );
}
