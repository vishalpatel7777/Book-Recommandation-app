import { useState } from "react";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";
import { MOCK_CATEGORIES } from "../cmsData";
import { st, SectionTitle, Toggle, Modal, ConfirmDialog, Drawer, SearchBar, EmptyState, Field, ActionBtn, Checkbox, Pagination, useToastEmitter } from "../cmsUi";

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const EMPTY = { name: "", slug: "", desc: "", seoTitle: "", seoDesc: "", featured: false };

function CategoryForm({ value, onChange }) {
  const f = (key) => (e) => {
    const updated = { ...value, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value };
    if (key === "name" && !value._slugManual) updated.slug = slugify(updated.name);
    onChange(updated);
  };
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Name"><input style={st.input} value={value.name} onChange={f("name")} placeholder="e.g. Fiction" /></Field>
        <Field label="Slug" hint="Auto-generated from name">
          <input style={st.input} value={value.slug} onChange={(e) => onChange({ ...value, slug: e.target.value, _slugManual: true })} placeholder="e.g. fiction" />
        </Field>
      </div>
      <Field label="Description">
        <textarea style={{ ...st.input, resize: "vertical" }} rows={2} value={value.desc} onChange={f("desc")} placeholder="Short category description" />
      </Field>
      <Field label="Category Image URL" hint="Used as thumbnail in category listings">
        <input style={st.input} value={value.imageUrl || ""} onChange={f("imageUrl")} placeholder="https://..." />
      </Field>
      <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: 14, marginTop: 4 }}>
        <p style={{ ...st.label, marginBottom: 12 }}>SEO</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="SEO Title"><input style={st.input} value={value.seoTitle} onChange={f("seoTitle")} /></Field>
          <Field label="SEO Description"><input style={st.input} value={value.seoDesc} onChange={f("seoDesc")} /></Field>
        </div>
      </div>
      <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginTop: 4 }}>
        <input type="checkbox" checked={value.featured} onChange={f("featured")} />
        <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>Featured on Homepage</span>
      </label>
    </div>
  );
}

export default function CategoriesSection() {
  const toast = useToastEmitter();
  const [cats, setCats] = useState(MOCK_CATEGORIES);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [modal, setModal] = useState(null);
  const [drawer, setDrawer] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const filtered = cats.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const openAdd = () => { setForm(EMPTY); setModal({ mode: "add" }); };
  const openEdit = (c) => { setForm({ ...c }); setModal({ mode: "edit", id: c.id }); };

  const save = () => {
    if (!form.name.trim()) { toast?.("Name is required", "error"); return; }
    if (!form.slug.trim()) { toast?.("Slug is required", "error"); return; }
    if (modal.mode === "add") {
      setCats((prev) => [...prev, { ...form, id: `c${Date.now()}`, books: 0 }]);
      toast?.("Category created");
    } else {
      setCats((prev) => prev.map((c) => c.id === modal.id ? { ...c, ...form } : c));
      toast?.("Category updated");
    }
    setModal(null);
  };

  const deleteCat = (c) => { setCats((prev) => prev.filter((x) => x.id !== c.id)); toast?.("Category deleted"); };
  const toggleFeatured = (id) => { setCats((cs) => cs.map((c) => c.id === id ? { ...c, featured: !c.featured } : c)); };
  const toggleSelect = (id) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(selected.length === paginated.length ? [] : paginated.map((c) => c.id));

  return (
    <>
      <SectionTitle action={<button className="btn btn-primary btn-sm" onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: 6 }}><Plus size={13} />Add Category</button>}>
        Categories Manager
      </SectionTitle>

      <div style={st.card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search categories…" />
            <span style={{ fontSize: "0.72rem", color: "var(--text-faint)" }}>{filtered.length} categories · {cats.filter(c => c.featured).length} featured</span>
          </div>
          {selected.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{selected.length} selected</span>
              <ActionBtn variant="danger" onClick={() => { setCats(p => p.filter(c => !selected.includes(c.id))); setSelected([]); toast?.("Deleted"); }}>Delete Selected</ActionBtn>
            </div>
          )}
        </div>

        {paginated.length === 0 ? (
          <EmptyState title="No categories found" desc="Add your first category." />
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ ...st.th, width: 32 }}><Checkbox checked={selected.length === paginated.length && paginated.length > 0} onChange={toggleAll} /></th>
                {["Name", "Slug", "Books", "Featured", "Actions"].map((h) => <th key={h} style={st.th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {paginated.map((c) => (
                <tr key={c.id} style={{ background: selected.includes(c.id) ? "var(--accent-sage-bg)" : "transparent" }}>
                  <td style={st.td}><Checkbox checked={selected.includes(c.id)} onChange={() => toggleSelect(c.id)} /></td>
                  <td style={{ ...st.td, fontWeight: 500, color: "var(--text-primary)" }}>{c.name}</td>
                  <td style={{ ...st.td, fontFamily: "monospace", fontSize: "0.72rem", color: "var(--text-faint)" }}>{c.slug}</td>
                  <td style={st.td}>{c.books}</td>
                  <td style={st.td}><Toggle on={c.featured} onToggle={() => toggleFeatured(c.id)} /></td>
                  <td style={st.td}>
                    <div style={{ display: "flex", gap: 5 }}>
                      <ActionBtn onClick={() => setDrawer(c)}><Eye size={11} /></ActionBtn>
                      <ActionBtn onClick={() => openEdit(c)}><Edit2 size={11} /></ActionBtn>
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

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === "add" ? "Add Category" : "Edit Category"}>
        <CategoryForm value={form} onChange={setForm} />
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setModal(null)}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={save}>{modal?.mode === "add" ? "Create Category" : "Save Changes"}</button>
        </div>
      </Modal>

      <Drawer open={!!drawer} onClose={() => setDrawer(null)} title="Category Details">
        {drawer && (
          <div>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.15rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>{drawer.name}</h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 20 }}>{drawer.desc}</p>
            {[["Slug", drawer.slug], ["Books", drawer.books], ["Featured", drawer.featured ? "Yes" : "No"], ["SEO Title", drawer.seoTitle || "—"], ["SEO Description", drawer.seoDesc || "—"]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border-light)" }}>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 500 }}>{k}</span>
                <span style={{ fontSize: "0.82rem", color: "var(--text-primary)" }}>{v}</span>
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <ActionBtn variant="primary" onClick={() => { setDrawer(null); openEdit(drawer); }}>Edit</ActionBtn>
              <ActionBtn variant="danger" onClick={() => { setDrawer(null); setConfirm(drawer); }}>Delete</ActionBtn>
            </div>
          </div>
        )}
      </Drawer>

      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => deleteCat(confirm)}
        title="Delete Category" message={`Remove "${confirm?.name}"? All books in this category will become uncategorised.`} />
    </>
  );
}
