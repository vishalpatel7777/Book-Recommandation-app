import { useState } from "react";
import { FolderOpen, Upload, Eye, Pencil, Copy, Download, Trash2, X } from "lucide-react";
import { MOCK_MEDIA } from "../cmsData";
import { st, SectionTitle, ConfirmDialog, Drawer, SearchBar, EmptyState, ActionBtn, useToastEmitter } from "../cmsUi";

const FILTER_TYPES = ["all", "image", "banner", "logo"];

export default function MediaLibrarySection() {
  const toast = useToastEmitter();
  const [media, setMedia] = useState(MOCK_MEDIA);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [usedFilter, setUsedFilter] = useState("all");
  const [preview, setPreview] = useState(null);
  const [renaming, setRenaming] = useState(null);
  const [newName, setNewName] = useState("");
  const [confirm, setConfirm] = useState(null);

  const filtered = media.filter(f => {
    const ms = f.name.toLowerCase().includes(search.toLowerCase());
    const mt = typeFilter === "all" || f.type === typeFilter;
    const mu = usedFilter === "all" || (usedFilter === "used" && f.used) || (usedFilter === "unused" && !f.used);
    return ms && mt && mu;
  });

  const deleteFile = (f) => { setMedia(prev => prev.filter(x => x.id !== f.id)); toast?.("File deleted"); };
  const copyUrl = (f) => { navigator.clipboard?.writeText(f.url || `https://cdn.bookmosaic.com/${f.name}`).catch(() => {}); toast?.("URL copied", "info"); };
  const rename = () => {
    if (!newName.trim()) return;
    setMedia(prev => prev.map(f => f.id === renaming.id ? { ...f, name: newName } : f));
    toast?.("File renamed");
    setRenaming(null);
    setNewName("");
  };

  const totalSize = media.reduce((s, f) => s + parseFloat(f.size), 0).toFixed(0);

  return (
    <>
      <SectionTitle action={<button className="btn btn-primary btn-sm" style={{ display: "flex", alignItems: "center", gap: 6 }}><Upload size={13} />Upload Files</button>}>
        Media Library
      </SectionTitle>

      <div style={st.card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <SearchBar value={search} onChange={setSearch} placeholder="Search files…" />
            <div style={{ display: "flex", gap: 6 }}>
              {FILTER_TYPES.map(t => (
                <button key={t} onClick={() => setTypeFilter(t)}
                  style={{ padding: "3px 9px", borderRadius: 20, fontSize: "0.68rem", cursor: "pointer", border: `1px solid ${typeFilter === t ? "var(--accent-sage)" : "var(--border)"}`, background: typeFilter === t ? "var(--accent-sage-bg)" : "none", color: typeFilter === t ? "var(--accent-sage-text)" : "var(--text-muted)" }}>
                  {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {["all", "used", "unused"].map(u => (
                <button key={u} onClick={() => setUsedFilter(u)}
                  style={{ padding: "3px 9px", borderRadius: 20, fontSize: "0.68rem", cursor: "pointer", border: `1px solid ${usedFilter === u ? "var(--accent-info)" : "var(--border)"}`, background: usedFilter === u ? "rgba(59,130,246,0.08)" : "none", color: usedFilter === u ? "var(--accent-info)" : "var(--text-muted)" }}>
                  {u === "all" ? "All" : u.charAt(0).toUpperCase() + u.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <span style={{ fontSize: "0.72rem", color: "var(--text-faint)" }}>{media.length} files · {totalSize} KB total</span>
        </div>

        {filtered.length === 0 ? <EmptyState icon={FolderOpen} title="No files found" desc="Upload your first media file." /> : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
            {filtered.map(f => (
              <div key={f.id} style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--accent-sage)"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}>
                <div style={{ height: 90, background: "var(--bg-page)", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid var(--border-light)", position: "relative", cursor: "pointer" }}
                  onClick={() => setPreview(f)}>
                  <FolderOpen size={24} style={{ color: "var(--border-medium)" }} />
                  <div style={{ position: "absolute", top: 6, right: 6, display: "flex", gap: 4 }}>
                    {f.used
                      ? <span style={{ fontSize: "0.55rem", padding: "1px 5px", borderRadius: 3, background: "var(--accent-sage-bg)", color: "var(--accent-sage-text)", border: "1px solid rgba(92,122,94,0.25)" }}>In use</span>
                      : <span style={{ fontSize: "0.55rem", padding: "1px 5px", borderRadius: 3, background: "var(--bg-page)", color: "var(--text-faint)", border: "1px solid var(--border-light)" }}>Unused</span>
                    }
                  </div>
                </div>
                <div style={{ padding: "8px 10px" }}>
                  <p style={{ fontSize: "0.7rem", fontWeight: 500, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 2 }}>{f.name}</p>
                  <p style={{ fontSize: "0.62rem", color: "var(--text-faint)", marginBottom: 8 }}>{f.size} · {f.uploaded}</p>
                  <div style={{ display: "flex", gap: 4 }}>
                    <ActionBtn onClick={() => setPreview(f)}><Eye size={10} /></ActionBtn>
                    <ActionBtn onClick={() => { setRenaming(f); setNewName(f.name); }}><Pencil size={10} /></ActionBtn>
                    <ActionBtn onClick={() => copyUrl(f)}><Copy size={10} /></ActionBtn>
                    <ActionBtn variant="danger" onClick={() => setConfirm(f)}><Trash2 size={10} /></ActionBtn>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Drawer */}
      <Drawer open={!!preview} onClose={() => setPreview(null)} title="File Preview" width={440}>
        {preview && (
          <div>
            <div style={{ width: "100%", height: 200, background: "var(--bg-page)", borderRadius: 8, border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <FolderOpen size={40} style={{ color: "var(--border-medium)" }} />
            </div>
            {[["Name", preview.name], ["Type", preview.type], ["Size", preview.size], ["Uploaded", preview.uploaded], ["Status", preview.used ? "In use" : "Unused"]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid var(--border-light)" }}>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 500 }}>{k}</span>
                <span style={{ fontSize: "0.82rem", color: "var(--text-primary)" }}>{v}</span>
              </div>
            ))}
            {preview.usedIn?.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <span style={st.label}>Used In</span>
                {preview.usedIn.map(u => <p key={u} style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: 4 }}>{u}</p>)}
              </div>
            )}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <ActionBtn onClick={() => copyUrl(preview)}>Copy URL</ActionBtn>
              <ActionBtn variant="danger" onClick={() => { setPreview(null); setConfirm(preview); }}>Delete</ActionBtn>
            </div>
          </div>
        )}
      </Drawer>

      {/* Rename modal */}
      {renaming && (
        <div style={st.overlay}>
          <div style={{ ...st.modalBox, maxWidth: 380, padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>Rename File</h3>
              <button onClick={() => setRenaming(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={16} /></button>
            </div>
            <input style={st.input} value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && rename()} autoFocus />
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 14 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setRenaming(null)}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={rename}>Rename</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => deleteFile(confirm)}
        title="Delete File" message={`Delete "${confirm?.name}"? This cannot be undone and may break pages using this file.`} />
    </>
  );
}
