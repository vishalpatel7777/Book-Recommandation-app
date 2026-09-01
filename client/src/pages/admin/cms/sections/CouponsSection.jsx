import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Copy, ToggleLeft } from "lucide-react";
import api from "../../../../services/axios";
import { st, SectionTitle, StatusBadge, Toggle, Modal, ConfirmDialog, SearchBar, EmptyState, Field, ActionBtn, Checkbox, Pagination, useToastEmitter } from "../cmsUi";

const EMPTY = { code: "", type: "percent", value: "", maxDiscount: "", min: 0, maxUses: "", perUser: 1, startDate: "", expiry: "", categories: [], books: [], status: "draft" };

function CouponForm({ value, onChange }) {
  const f = (key) => (e) => onChange({ ...value, [key]: e.target.value });
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Coupon Code" hint="Uppercase letters and numbers">
          <input style={{ ...st.input, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, fontFamily: "monospace" }} value={value.code} onChange={(e) => onChange({ ...value, code: e.target.value.toUpperCase() })} placeholder="SUMMER20" />
        </Field>
        <Field label="Status">
          <select style={st.input} value={value.status} onChange={f("status")}>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </Field>
        <Field label="Discount Type">
          <select style={st.input} value={value.type} onChange={f("type")}>
            <option value="percent">Percentage (%)</option>
            <option value="flat">Flat (₹)</option>
          </select>
        </Field>
        <Field label={value.type === "percent" ? "Discount %" : "Discount ₹"}>
          <input type="number" style={st.input} value={value.value} onChange={f("value")} placeholder="20" />
        </Field>
        {value.type === "percent" && (
          <Field label="Max Discount (₹)" hint="Cap for percentage discounts">
            <input type="number" style={st.input} value={value.maxDiscount} onChange={f("maxDiscount")} placeholder="200" />
          </Field>
        )}
        <Field label="Min Order (₹)">
          <input type="number" style={st.input} value={value.min} onChange={f("min")} placeholder="0" />
        </Field>
        <Field label="Max Uses" hint="Leave blank for unlimited">
          <input type="number" style={st.input} value={value.maxUses} onChange={f("maxUses")} placeholder="∞" />
        </Field>
        <Field label="Uses Per User">
          <input type="number" style={st.input} value={value.perUser} onChange={f("perUser")} placeholder="1" />
        </Field>
        <Field label="Start Date">
          <input type="date" style={st.input} value={value.startDate} onChange={f("startDate")} />
        </Field>
        <Field label="Expiry Date" hint="Leave blank for no expiry">
          <input type="date" style={st.input} value={value.expiry} onChange={f("expiry")} />
        </Field>
      </div>
      <Field label="Applicable Categories" hint="Comma-separated, blank = all">
        <input style={st.input} value={value.categories?.join(", ") || ""} onChange={(e) => onChange({ ...value, categories: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} placeholder="Fiction, Self-Help" />
      </Field>
    </div>
  );
}

export default function CouponsSection() {
  const toast = useToastEmitter();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ api.get("/cms/coupons").then(({data})=>{ const raw=data?.data??data; const list=Array.isArray(raw)?raw:(Array.isArray(raw?.data)?raw.data:[]); if(Array.isArray(list)) setCoupons(list.map(c=>({ ...c, id:c._id||c.id, _id:c._id||c.id, code:c.code, type:c.type, value:c.value, min:c.minOrder??c.min??0, maxDiscount:c.maxDiscount??"", maxUses:c.maxUses??"", uses:c.uses??0, expiry:c.expiry||"", status:c.status||"active" })) ); }).catch((e)=>{ toast?.(e?.response?.data?.message||"Failed to load coupons","error"); }).finally(()=>setLoading(false)); },[]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState([]);
  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const filtered = coupons.filter((c) => {
    const s=search.toLowerCase();
    const matchSearch = !s || String(c.code||"").toLowerCase().includes(s);
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const openAdd = () => { setForm(EMPTY); setModal({ mode: "add" }); };
  const openEdit = (c) => { setForm({ ...c }); setModal({ mode: "edit", id: c.id }); };
  const duplicate = async (c) => {
    try{
      const payload={ code: `${c.code}_COPY`, type:c.type, value:c.value, maxDiscount:c.maxDiscount||null, minOrder:c.min||0, maxUses:c.maxUses||null, perUser:c.perUser||1, categories:c.categories||[], books:c.books||[], status:"draft", expiry:c.expiry||"", startDate:c.startDate||"" };
      const {data}=await api.post("/cms/coupons", payload);
      const saved=data?.data??data;
      setCoupons((prev)=>[...prev,{...saved, id:saved._id||saved.id, _id:saved._id||saved.id, code:saved.code}]);
      toast?.("Coupon duplicated (live)");
    }catch(e){ toast?.(e?.response?.data?.message||"Duplicate failed","error"); }
  };

  const save = async () => {
    if (!form.code.trim()) { toast?.("Code is required", "error"); return; }
    if (!form.value) { toast?.("Discount value is required", "error"); return; }
    const payload={ code: form.code.toUpperCase(), type: form.type, value: Number(form.value), maxDiscount: form.maxDiscount?Number(form.maxDiscount):null, minOrder: Number(form.min)||0, min: Number(form.min)||0, maxUses: form.maxUses?Number(form.maxUses):null, perUser: Number(form.perUser)||1, categories: form.categories||[], books: form.books||[], status: form.status||"draft", expiry: form.expiry||"", startDate: form.startDate||"" };
    try{
      if (modal.mode === "add") { const {data}=await api.post("/cms/coupons", payload); const saved=data?.data??data; setCoupons((prev)=>[...prev,{...saved, id:saved._id||saved.id, code:saved.code, type:saved.type, value:saved.value}]); toast?.("Coupon created (live)"); }
      else { const id=modal.id; const {data}=await api.put(`/cms/coupons/${id}`, payload); const saved=data?.data??data; setCoupons((prev)=>prev.map(c=>(c._id||c.id)===id?{...c,...saved, id:saved._id||saved.id}:c)); toast?.("Coupon updated (live)"); }
      setModal(null);
    }catch(e){ toast?.(e?.response?.data?.message||"Save failed","error"); }
  };

  const deleteCoupon = async (c) => { const id=c._id||c.id; try{ await api.delete(`/cms/coupons/${id}`); setCoupons((prev)=>prev.filter(x=>(x._id||x.id)!==id)); toast?.("Coupon deleted (live)"); }catch(e){ toast?.(e?.response?.data?.message||"Delete failed","error"); } };
  const toggleSelect = (id) => setSelected((s) => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(selected.length === paginated.length ? [] : paginated.map(c => c.id));

  return (
    <>
      <SectionTitle action={<button className="btn btn-primary btn-sm" onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: 6 }}><Plus size={13} />Create Coupon</button>}>
        Coupons
      </SectionTitle>

      <div style={st.card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search codes…" />
            {["all", "active", "draft", "expired"].map((s) => (
              <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
                style={{ padding: "3px 10px", borderRadius: 20, fontSize: "0.68rem", fontWeight: 500, cursor: "pointer", border: `1px solid ${statusFilter === s ? "var(--accent-sage)" : "var(--border)"}`, background: statusFilter === s ? "var(--accent-sage-bg)" : "none", color: statusFilter === s ? "var(--accent-sage-text)" : "var(--text-muted)" }}>
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          {selected.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{selected.length} selected</span>
              <ActionBtn variant="danger" onClick={async () => { try{ await Promise.all(selected.map(id=>api.delete(`/cms/coupons/${id}`))); setCoupons(p => p.filter(c => !selected.includes(c.id) && !selected.includes(c._id))); toast?.("Deleted (live)"); }catch(e){ toast?.(e?.response?.data?.message||"Bulk delete failed","error"); } setSelected([]); }}>Delete</ActionBtn>
            </div>
          )}
        </div>

        {loading ? <div style={{textAlign:"center",padding:"40px 0",color:"var(--text-muted)",fontSize:"0.82rem"}}>Loading coupons…</div> : paginated.length === 0 ? (
          <EmptyState title="No coupons found" desc={coupons.length===0 ? "No coupons in database. Create a discount code to get started." : "Try a different filter."} />
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ ...st.th, width: 32 }}><Checkbox checked={selected.length === paginated.length && paginated.length > 0} onChange={toggleAll} /></th>
                {["Code", "Type", "Value", "Min Order", "Uses", "Expiry", "Status", "Actions"].map((h) => <th key={h} style={st.th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {paginated.map((c) => (
                <tr key={c.id} style={{ background: selected.includes(c.id) ? "var(--accent-sage-bg)" : "transparent" }}>
                  <td style={st.td}><Checkbox checked={selected.includes(c.id)} onChange={() => toggleSelect(c.id)} /></td>
                  <td style={{ ...st.td, fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.05em", color: "var(--text-primary)", fontSize: "0.82rem" }}>{c.code}</td>
                  <td style={st.td}><span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{c.type === "percent" ? "% off" : "₹ off"}</span></td>
                  <td style={{ ...st.td, fontWeight: 700, color: "var(--accent-danger)" }}>{c.type === "percent" ? `${c.value}%` : `₹${c.value}`}</td>
                  <td style={{ ...st.td, fontSize: "0.75rem" }}>{c.min > 0 ? `₹${c.min}` : "—"}</td>
                  <td style={st.td}><span style={{ fontSize: "0.75rem" }}>{c.uses}</span>{c.maxUses && <span style={{ color: "var(--text-faint)", fontSize: "0.68rem" }}>/{c.maxUses}</span>}</td>
                  <td style={{ ...st.td, fontSize: "0.72rem", color: "var(--text-faint)" }}>{c.expiry ?? "Never"}</td>
                  <td style={st.td}><StatusBadge status={c.status} /></td>
                  <td style={st.td}>
                    <div style={{ display: "flex", gap: 5 }}>
                      <ActionBtn onClick={() => openEdit(c)}><Edit2 size={11} /></ActionBtn>
                      <ActionBtn onClick={() => duplicate(c)}><Copy size={11} /></ActionBtn>
                      <ActionBtn variant="danger" onClick={() => setConfirm(c)}><Trash2 size={11} /></ActionBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
      </div>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === "add" ? "Create Coupon" : "Edit Coupon"} width={620}>
        <CouponForm value={form} onChange={setForm} />
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setModal(null)}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={save}>{modal?.mode === "add" ? "Create Coupon" : "Save Changes"}</button>
        </div>
      </Modal>

      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => deleteCoupon(confirm)}
        title="Delete Coupon" message={`Delete coupon "${confirm?.code}"? This action cannot be undone.`} />
    </>
  );
}
