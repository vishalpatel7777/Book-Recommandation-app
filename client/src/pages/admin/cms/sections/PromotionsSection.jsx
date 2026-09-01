import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";
import api from "../../../../services/axios";
import { st, SectionTitle, StatusBadge, Modal, ConfirmDialog, Drawer, SearchBar, EmptyState, Field, ActionBtn, Checkbox, Pagination, useToastEmitter } from "../cmsUi";

const EMPTY = { name: "", type: "Banner", discount: "", cta: "Shop Now", ctaUrl: "/books", priority: 1, starts: "", ends: "", status: "draft", bannerImg: "" };

const TYPES = ["Banner", "Popup", "Flash", "Bundle", "Sidebar"];

function PromotionForm({ value, onChange }) {
  const f = (key) => (e) => onChange({ ...value, [key]: e.target.value });
  return (
    <div>
      <Field label="Promotion Name"><input style={st.input} value={value.name} onChange={f("name")} placeholder="e.g. Summer Reading Sale" /></Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Type">
          <select style={st.input} value={value.type} onChange={f("type")}>
            {TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Discount"><input style={st.input} value={value.discount} onChange={f("discount")} placeholder="20%" /></Field>
        <Field label="CTA Button Text"><input style={st.input} value={value.cta} onChange={f("cta")} placeholder="Shop Now" /></Field>
        <Field label="CTA URL"><input style={st.input} value={value.ctaUrl} onChange={f("ctaUrl")} placeholder="/books" /></Field>
        <Field label="Start Date"><input type="date" style={st.input} value={value.starts} onChange={f("starts")} /></Field>
        <Field label="End Date"><input type="date" style={st.input} value={value.ends} onChange={f("ends")} /></Field>
        <Field label="Priority" hint="Lower = higher priority"><input type="number" style={st.input} value={value.priority} onChange={f("priority")} min={1} /></Field>
        <Field label="Status">
          <select style={st.input} value={value.status} onChange={f("status")}>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="scheduled">Scheduled</option>
            <option value="inactive">Inactive</option>
          </select>
        </Field>
      </div>
      <Field label="Banner Image URL" hint="Recommended: 1200×400px">
        <input style={st.input} value={value.bannerImg} onChange={f("bannerImg")} placeholder="https://..." />
      </Field>
    </div>
  );
}

function PreviewModal({ promo, onClose }) {
  if (!promo) return null;
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ background: "linear-gradient(135deg, var(--accent-sage-bg), var(--accent-amber-bg, #fdf8ee))", borderRadius: 10, padding: "32px 24px", marginBottom: 16 }}>
        <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent-sage-text)", marginBottom: 8 }}>{promo.type}</p>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>{promo.name}</h2>
        <p style={{ fontSize: "2rem", fontWeight: 800, color: "var(--accent-danger)", marginBottom: 12 }}>{promo.discount} OFF</p>
        {promo.starts && <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 16 }}>Valid: {promo.starts} – {promo.ends}</p>}
        <div style={{ display: "inline-block", padding: "10px 24px", borderRadius: 6, background: "var(--accent-sage)", color: "#fff", fontSize: "0.88rem", fontWeight: 600 }}>{promo.cta}</div>
      </div>
      <button className="btn btn-secondary btn-sm" onClick={onClose}>Close Preview</button>
    </div>
  );
}

export default function PromotionsSection() {
  const toast = useToastEmitter();
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ api.get("/cms/promotions").then(({data})=>{ const raw=data?.data??data; const list=Array.isArray(raw)?raw:(Array.isArray(raw?.data)?raw.data:[]); if(Array.isArray(list)) setPromos(list.map(x=>({ ...x, id:x._id||x.id, _id:x._id||x.id, name:x.title||x.name, title:x.title||x.name, type:x.type||"Banner", status:x.status||"active", starts:x.starts||"", ends:x.ends||"", discount:x.discount||"", cta:x.cta||"", ctaUrl:x.ctaLink||x.ctaUrl||"" })) ); }).catch((e)=>{ toast?.(e?.response?.data?.message||"Failed to load promotions","error"); }).finally(()=>setLoading(false)); },[]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [modal, setModal] = useState(null); // "add"|"edit"|"preview"
  const [confirm, setConfirm] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [previewItem, setPreviewItem] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const filtered = promos.filter(p => !search || String(p.name||p.title||"").toLowerCase().includes(search.toLowerCase()));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const [editingId, setEditingId] = useState(null);
  const openAdd = () => { setForm(EMPTY); setEditingId(null); setModal("add"); };
  const openEdit = (p) => { setForm({ ...p }); setEditingId(p._id||p.id); setModal("edit"); };

  const save = async () => {
    if (!form.title?.trim() && !form.name?.trim()) { toast?.("Name is required","error"); return; }
    const payload={ title: form.title||form.name, description: form.description||"", badge: form.badge||"", cta: form.cta||"", ctaLink: form.ctaUrl||form.ctaLink||"", imageUrl: form.imageUrl||form.bannerImg||"", type: form.type||"Banner", status: form.status||"active", priority: Number(form.priority)||1 };
    try{
      if(modal==="add"){ const {data}=await api.post("/cms/promotions", payload); const saved=data?.data??data; setPromos(prev=>[...prev,{...saved, id:saved._id||saved.id, name:saved.title||saved.name, title:saved.title||saved.name}]); toast?.("Promotion created (live)"); }
      else { const id=editingId; const {data}=await api.put(`/cms/promotions/${id}`, payload); const saved=data?.data??data; setPromos(prev=>prev.map(x=>(x._id||x.id)===id?{...x,...saved, id:saved._id||saved.id, name:saved.title||saved.name}:x)); toast?.("Promotion updated (live)"); }
      setModal(null);
    }catch(e){ toast?.(e?.response?.data?.message||"Save failed","error"); }
  };

  const deletePromo = async (p) => { const id=p._id||p.id; try{ await api.delete(`/cms/promotions/${id}`); setPromos(prev=>prev.filter(x=>(x._id||x.id)!==id)); toast?.("Promotion deleted (live)"); }catch(e){ toast?.(e?.response?.data?.message||"Delete failed","error"); } };
  const toggleSelect = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(selected.length === paginated.length ? [] : paginated.map(p => p.id));

  return (
    <>
      <SectionTitle action={<button className="btn btn-primary btn-sm" onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: 6 }}><Plus size={13} />New Promotion</button>}>
        Promotions
      </SectionTitle>

      <div style={st.card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search promotions…" />
          {selected.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{selected.length} selected</span>
              <ActionBtn variant="danger" onClick={async () => { try{ await Promise.all(selected.map(id=>api.delete(`/cms/promotions/${id}`))); setPromos(p => p.filter(x => !selected.includes(x.id) && !selected.includes(x._id))); toast?.("Deleted (live)"); }catch(e){ toast?.(e?.response?.data?.message||"Bulk delete failed","error"); } setSelected([]); }}>Delete</ActionBtn>
            </div>
          )}
        </div>

        {loading ? <div style={{textAlign:"center",padding:"40px 0",color:"var(--text-muted)",fontSize:"0.82rem"}}>Loading promotions…</div> : paginated.length === 0 ? <EmptyState title="No promotions" desc={promos.length===0 ? "No promotions in database. Create your first campaign." : "Try a different filter."} /> : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ ...st.th, width: 32 }}><Checkbox checked={selected.length === paginated.length && paginated.length > 0} onChange={toggleAll} /></th>
                {["Name", "Type", "Discount", "Starts", "Ends", "Status", "Actions"].map(h => <th key={h} style={st.th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {paginated.map(p => (
                <tr key={p.id} style={{ background: selected.includes(p.id) ? "var(--accent-sage-bg)" : "transparent" }}>
                  <td style={st.td}><Checkbox checked={selected.includes(p.id)} onChange={() => toggleSelect(p.id)} /></td>
                  <td style={{ ...st.td, fontWeight: 500, color: "var(--text-primary)" }}>{p.name}</td>
                  <td style={st.td}><span style={{ fontSize: "0.72rem", padding: "2px 7px", borderRadius: 4, background: "var(--bg-surface)", border: "1px solid var(--border-light)", color: "var(--text-muted)" }}>{p.type}</span></td>
                  <td style={{ ...st.td, fontWeight: 700, color: "var(--accent-danger)" }}>{p.discount}</td>
                  <td style={{ ...st.td, fontSize: "0.72rem", color: "var(--text-faint)" }}>{p.starts}</td>
                  <td style={{ ...st.td, fontSize: "0.72rem", color: "var(--text-faint)" }}>{p.ends}</td>
                  <td style={st.td}><StatusBadge status={p.status} /></td>
                  <td style={st.td}>
                    <div style={{ display: "flex", gap: 5 }}>
                      <ActionBtn onClick={() => { setPreviewItem(p); setModal("preview"); }}><Eye size={11} /></ActionBtn>
                      <ActionBtn onClick={() => openEdit(p)}><Edit2 size={11} /></ActionBtn>
                      <ActionBtn variant="danger" onClick={() => setConfirm(p)}><Trash2 size={11} /></ActionBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
      </div>

      <Modal open={modal === "add" || modal === "edit"} onClose={() => setModal(null)} title={modal === "add" ? "New Promotion" : "Edit Promotion"} width={600}>
        <PromotionForm value={form} onChange={setForm} />
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setModal(null)}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={save}>{modal === "add" ? "Create" : "Save"}</button>
        </div>
      </Modal>

      <Modal open={modal === "preview"} onClose={() => setModal(null)} title="Promotion Preview">
        <PreviewModal promo={previewItem} onClose={() => setModal(null)} />
      </Modal>

      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => deletePromo(confirm)}
        title="Delete Promotion" message={`Delete "${confirm?.name}"? This cannot be undone.`} />
    </>
  );
}
