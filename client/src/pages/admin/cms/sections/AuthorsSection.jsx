import { useState, useEffect } from "react";
import { CheckCircle, Plus, Edit2, Trash2, Eye } from "lucide-react";
import { MOCK_AUTHORS } from "../cmsData";
import { st, SectionTitle, StatusBadge, Toggle, Modal, ConfirmDialog, Drawer, SearchBar, EmptyState, Field, ActionBtn, Checkbox, Pagination } from "../cmsUi";
import { useToastEmitter } from "../cmsUi";
import api from "../../../../services/axios";

const EMPTY = { name: "", bio: "", website: "", twitter: "", instagram: "", verified: false, featured: false, followers: 0 };

function AuthorForm({ value, onChange }) {
  const f = (key) => (e) => onChange({ ...value, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <Field label="Name">
        <input style={st.input} value={value.name} onChange={f("name")} placeholder="Author full name" />
      </Field>
      <Field label="Bio">
        <textarea style={{ ...st.input, resize: "vertical" }} rows={3} value={value.bio} onChange={f("bio")} placeholder="Short bio..." />
      </Field>
      <Field label="Avatar URL" hint="Paste image URL or upload">
        <div style={{ display: "flex", gap: 8 }}>
          <input style={{ ...st.input, flex: 1 }} value={value.avatarUrl || ""} onChange={f("avatarUrl")} placeholder="https://..." />
          {value.avatarUrl && <img src={value.avatarUrl} alt="" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--border)", flexShrink: 0 }} onError={(e) => e.currentTarget.style.display = "none"} />}
        </div>
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Website"><input style={st.input} value={value.website} onChange={f("website")} placeholder="author.com" /></Field>
        <Field label="Twitter"><input style={st.input} value={value.twitter} onChange={f("twitter")} placeholder="@handle" /></Field>
        <Field label="Instagram"><input style={st.input} value={value.instagram} onChange={f("instagram")} placeholder="@handle" /></Field>
        <Field label="Followers"><input type="number" style={st.input} value={value.followers} onChange={f("followers")} /></Field>
      </div>
      <div style={{ display: "flex", gap: 24, padding: "12px 0" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <input type="checkbox" checked={value.verified} onChange={f("verified")} />
          <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>Verified Author</span>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <input type="checkbox" checked={value.featured} onChange={f("featured")} />
          <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>Featured on Homepage</span>
        </label>
      </div>
    </div>
  );
}

export default function AuthorsSection() {
  const toast = useToastEmitter();
  const [authors, setAuthors] = useState(MOCK_AUTHORS);
  const [live, setLive] = useState(false);
  useEffect(() => {
    api.get("/cms/authors").then(({ data }) => {
      const list = data?.data ?? data;
      if (Array.isArray(list) && list.length) { setAuthors(list.map(a=>({ ...a, id: a._id||a.id, avatarUrl: a.image||a.avatarUrl, books: a.booksCount ?? a.books ?? 0, followers: a.followers ?? 0, joined: a.createdAt ? new Date(a.createdAt).toLocaleDateString() : a.joined })) ); setLive(true); }
    }).catch(()=>{});
  }, []);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [modal, setModal] = useState(null); // null | { mode: "add"|"edit", data }
  const [drawer, setDrawer] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const filtered = authors.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const openAdd = () => { setForm(EMPTY); setModal({ mode: "add" }); };
  const openEdit = (a) => { setForm({ ...a }); setModal({ mode: "edit", id: a.id }); };
  const openView = (a) => setDrawer(a);
  const openDelete = (a) => setConfirm(a);

  const save = async () => {
    if (!form.name.trim()) { toast?.("Name is required", "error"); return; }
    try {
      if (modal.mode === "add") {
        const payload = { name: form.name, bio: form.bio, website: form.website, twitter: form.twitter, instagram: form.instagram, verified: form.verified, featured: form.featured, followers: Number(form.followers)||0, image: form.avatarUrl||form.image||"" };
        const { data } = await api.post("/cms/authors", payload);
        const saved = data?.data ?? data;
        setAuthors((prev) => [...prev, { ...form, ...saved, id: saved._id||saved.id, avatarUrl: saved.image||form.avatarUrl, books: saved.booksCount ?? 0 }]);
        toast?.("Author added (live)");
      } else {
        const payload = { name: form.name, bio: form.bio, website: form.website, twitter: form.twitter, instagram: form.instagram, verified: form.verified, featured: form.featured, followers: Number(form.followers)||0, image: form.avatarUrl||form.image||"" };
        const id = modal.id;
        const { data } = await api.put(`/cms/authors/${id}`, payload);
        const saved = data?.data ?? data;
        setAuthors((prev) => prev.map((a) => a.id === id ? { ...a, ...form, ...saved } : a));
        toast?.("Author updated (live)");
      }
      setModal(null);
    } catch (e) {
      if (live) { toast?.(e?.response?.data?.message||"Save failed","error"); return; }
      // fallback to local when backend not reachable
      if (modal.mode === "add") { setAuthors((prev) => [...prev, { ...form, id: `au${Date.now()}`, books: 0, joined: "Jun 2025" }]); toast?.("Author added (local)"); }
      else { setAuthors((prev) => prev.map((a) => a.id === modal.id ? { ...a, ...form } : a)); toast?.("Author updated (local)"); }
      setModal(null);
    }
  };

  const deleteAuthor = async (a) => {
    const id = a._id || a.id;
    try { await api.delete(`/cms/authors/${id}`); setAuthors((prev) => prev.filter((x) => (x._id||x.id) !== id)); toast?.("Author removed (live)"); }
    catch { setAuthors((prev) => prev.filter((x) => x.id !== a.id)); toast?.("Author removed (local)"); }
  };

  const toggleSelect = (id) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(selected.length === paginated.length ? [] : paginated.map((a) => a.id));

  const bulkDelete = () => {
    setAuthors((prev) => prev.filter((a) => !selected.includes(a.id)));
    setSelected([]);
    toast?.(`${selected.length} author(s) removed`);
  };

  return (
    <>
      <SectionTitle action={<button className="btn btn-primary btn-sm" onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: 6 }}><Plus size={13} />Add Author</button>}>
        Authors Manager
      </SectionTitle>

      <div style={st.card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search authors…" />
            <span style={{ fontSize: "0.72rem", color: "var(--text-faint)" }}>{filtered.length} author{filtered.length !== 1 ? "s" : ""}</span>
          </div>
          {selected.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{selected.length} selected</span>
              <ActionBtn variant="danger" onClick={bulkDelete}>Delete Selected</ActionBtn>
            </div>
          )}
        </div>

        {paginated.length === 0 ? (
          <EmptyState title="No authors found" desc="Try a different search or add a new author." />
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ ...st.th, width: 32 }}><Checkbox checked={selected.length === paginated.length && paginated.length > 0} onChange={toggleAll} /></th>
                {["Author", "Books", "Followers", "Verified", "Featured", "Joined", "Actions"].map((h) => <th key={h} style={st.th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {paginated.map((a) => (
                <tr key={a.id} style={{ background: selected.includes(a.id) ? "var(--accent-sage-bg)" : "transparent" }}>
                  <td style={st.td}><Checkbox checked={selected.includes(a.id)} onChange={() => toggleSelect(a.id)} /></td>
                  <td style={st.td}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--bg-surface)", border: "1px solid var(--border-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                        {a.avatarUrl ? <img src={a.avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--text-muted)" }}>{a.name.charAt(0)}</span>}
                      </div>
                      <div>
                        <p style={{ fontSize: "0.82rem", fontWeight: 500, color: "var(--text-primary)" }}>{a.name}</p>
                        {a.twitter && <p style={{ fontSize: "0.65rem", color: "var(--text-faint)" }}>{a.twitter}</p>}
                      </div>
                    </div>
                  </td>
                  <td style={st.td}>{a.books}</td>
                  <td style={st.td}>{a.followers.toLocaleString()}</td>
                  <td style={st.td}>{a.verified ? <CheckCircle size={14} style={{ color: "var(--accent-sage)" }} /> : <span style={{ color: "var(--text-faint)" }}>—</span>}</td>
                  <td style={st.td}>{a.featured ? <CheckCircle size={14} style={{ color: "var(--accent-info)" }} /> : <span style={{ color: "var(--text-faint)" }}>—</span>}</td>
                  <td style={{ ...st.td, fontSize: "0.72rem", color: "var(--text-faint)" }}>{a.joined}</td>
                  <td style={st.td}>
                    <div style={{ display: "flex", gap: 5 }}>
                      <ActionBtn onClick={() => openView(a)}><Eye size={11} /></ActionBtn>
                      <ActionBtn onClick={() => openEdit(a)}><Edit2 size={11} /></ActionBtn>
                      <ActionBtn variant="danger" onClick={() => openDelete(a)}><Trash2 size={11} /></ActionBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
      </div>

      {/* Add/Edit Modal */}
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === "add" ? "Add Author" : "Edit Author"}>
        <AuthorForm value={form} onChange={setForm} />
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setModal(null)}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={save}>{modal?.mode === "add" ? "Add Author" : "Save Changes"}</button>
        </div>
      </Modal>

      {/* View Drawer */}
      <Drawer open={!!drawer} onClose={() => setDrawer(null)} title="Author Details">
        {drawer && (
          <div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: 20, borderBottom: "1px solid var(--border-light)", marginBottom: 20 }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--bg-surface)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", marginBottom: 12 }}>
                {drawer.avatarUrl ? <img src={drawer.avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-muted)" }}>{drawer.name.charAt(0)}</span>}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>{drawer.name}</h3>
                {drawer.verified && <CheckCircle size={15} style={{ color: "var(--accent-sage)" }} />}
              </div>
              {drawer.bio && <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "center", lineHeight: 1.5 }}>{drawer.bio}</p>}
            </div>
            {[
              ["Followers", drawer.followers?.toLocaleString()],
              ["Books", drawer.books],
              ["Joined", drawer.joined],
              ["Website", drawer.website || "—"],
              ["Twitter", drawer.twitter || "—"],
              ["Instagram", drawer.instagram || "—"],
              ["Featured", drawer.featured ? "Yes" : "No"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border-light)" }}>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 500 }}>{k}</span>
                <span style={{ fontSize: "0.82rem", color: "var(--text-primary)" }}>{v}</span>
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <ActionBtn variant="primary" onClick={() => { setDrawer(null); openEdit(drawer); }}>Edit Author</ActionBtn>
              <ActionBtn variant="danger" onClick={() => { setDrawer(null); openDelete(drawer); }}>Delete</ActionBtn>
            </div>
          </div>
        )}
      </Drawer>

      {/* Confirm delete */}
      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() => deleteAuthor(confirm)}
        title="Delete Author"
        message={`Remove "${confirm?.name}" from the registry? This cannot be undone.`}
      />
    </>
  );
}
