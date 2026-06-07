import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Pencil, X, BookOpen, Star, Tag, Globe,
  FileText, DollarSign, Image, AlertCircle, Check, Upload,
} from "lucide-react";
import CustomAlert from "../../common/Alert/CustomAlert";
import api from "../../../services/axios";
import { fetchAllBooks } from "../../../services/book.service";

const iStyle = {
  base: {
    width: "100%", padding: "8px 11px",
    background: "var(--bg-surface)", border: "1px solid var(--border)",
    borderRadius: 7, color: "var(--text-primary)", fontSize: "0.83rem",
    fontFamily: "var(--font-body)", outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s", boxSizing: "border-box",
  },
};

function Field({ label, icon: Icon, error, children }) {
  return (
    <div>
      <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.68rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {Icon && <Icon size={10} />} {label}
      </label>
      {children}
      {error && (
        <p style={{ fontSize: "0.68rem", color: "var(--accent-danger)", marginTop: 3, display: "flex", alignItems: "center", gap: 3 }}>
          <AlertCircle size={10} /> {error}
        </p>
      )}
    </div>
  );
}

function Input({ label, icon, error, textarea, ...props }) {
  const [focused, setFocused] = useState(false);
  const style = {
    ...iStyle.base,
    borderColor: error ? "var(--accent-danger)" : focused ? "var(--accent-sage)" : "var(--border)",
    boxShadow: focused && !error ? "0 0 0 2px var(--accent-sage-ring)" : error ? "0 0 0 2px rgba(184,84,80,0.15)" : "none",
  };
  const Tag = textarea ? "textarea" : "input";
  return (
    <Field label={label} icon={icon} error={error}>
      <Tag {...props} style={style} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} rows={textarea ? 3 : undefined} />
    </Field>
  );
}

const EMPTY = { url: "", title: "", author: "", subject: "", genre: "", desc: "", price: "", language: "", image: "", ratings: "", pdf: null };

function EditDrawer({ book, onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY);
  const [original, setOriginal] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState(null);
  const [tab, setTab] = useState("details");
  const drawerRef = useRef(null);

  useEffect(() => {
    if (book) {
      const init = {
        url: book.url || "", title: book.title || "", author: book.author || "",
        subject: book.subject || "", genre: book.genre || "", desc: book.desc || "",
        price: book.price || "", language: book.language || "", image: book.image || "",
        ratings: book.ratings || "", pdf: null,
      };
      setForm(init);
      setOriginal(init);
      setErrors({});
      setTab("details");
    }
  }, [book]);

  const isDirty = Object.keys(form).some((k) => k !== "pdf" && form[k] !== original[k]) || form.pdf !== null;

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const err = (k, msg) => setErrors((e) => ({ ...e, [k]: msg }));
  const clearErr = (k) => setErrors((e) => { const n = { ...e }; delete n[k]; return n; });

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.author.trim()) e.author = "Author is required";
    if (form.price && isNaN(Number(form.price))) e.price = "Must be a number";
    if (form.ratings && (isNaN(Number(form.ratings)) || Number(form.ratings) > 5 || Number(form.ratings) < 0)) e.ratings = "0 – 5";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== null && v !== "") payload.append(k, v); });
      if (form.price) payload.set("price", parseFloat(form.price));
      if (form.ratings) payload.set("ratings", parseFloat(form.ratings));
      await api.put(`/update-book/${book._id}`, payload, { headers: { "Content-Type": "multipart/form-data" } });
      setFlash({ type: "success", msg: "Changes saved" });
      onSaved();
      setTimeout(() => { setFlash(null); }, 1800);
    } catch (e) {
      setFlash({ type: "error", msg: e.response?.data?.message || "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  const TABS = [
    { key: "details", label: "Details" },
    { key: "preview", label: "Preview" },
    { key: "media", label: "Media" },
  ];

  return (
    <AnimatePresence>
      {book && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.28)", zIndex: 300, backdropFilter: "blur(2px)" }}
          />
          <motion.div
            ref={drawerRef}
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            style={{
              position: "fixed", top: 0, right: 0, bottom: 0, width: 520,
              background: "var(--bg-card)", borderLeft: "1px solid var(--border)",
              zIndex: 301, display: "flex", flexDirection: "column", overflow: "hidden",
            }}
          >
            {/* Header */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-light)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 2 }}>Editing</p>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{book.title}</h2>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {isDirty && (
                  <span style={{ fontSize: "0.65rem", padding: "2px 7px", borderRadius: 20, background: "var(--accent-amber-bg)", color: "var(--accent-amber-dark)", border: "1px solid rgba(139,111,71,0.2)", fontWeight: 600 }}>
                    Unsaved
                  </span>
                )}
                <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 7, background: "none", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-muted)" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-surface)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                >
                  <X size={13} />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 2, padding: "8px 20px 0", borderBottom: "1px solid var(--border-light)", flexShrink: 0 }}>
              {TABS.map((t) => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  style={{ padding: "6px 14px", fontSize: "0.78rem", fontWeight: tab === t.key ? 600 : 400, color: tab === t.key ? "var(--text-primary)" : "var(--text-muted)", background: "none", border: "none", cursor: "pointer", borderBottom: tab === t.key ? "2px solid var(--accent-sage)" : "2px solid transparent", marginBottom: -1, transition: "all 0.12s" }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
              {tab === "details" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <Input label="Title" icon={BookOpen} error={errors.title}
                      value={form.title} onChange={(e) => { set("title", e.target.value); clearErr("title"); }} placeholder="Book title" />
                    <Input label="Author" error={errors.author}
                      value={form.author} onChange={(e) => { set("author", e.target.value); clearErr("author"); }} placeholder="Author name" />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <Input label="Genre" icon={Tag}
                      value={form.genre} onChange={(e) => set("genre", e.target.value)} placeholder="e.g. Fiction" />
                    <Input label="Language" icon={Globe}
                      value={form.language} onChange={(e) => set("language", e.target.value)} placeholder="e.g. English" />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <Input label="Price (₹)" icon={DollarSign} error={errors.price}
                      type="number" value={form.price} onChange={(e) => { set("price", e.target.value); clearErr("price"); }} placeholder="0.00" />
                    <Input label="Rating (0–5)" icon={Star} error={errors.ratings}
                      type="number" value={form.ratings} onChange={(e) => { set("ratings", e.target.value); clearErr("ratings"); }} step="0.1" min="0" max="5" placeholder="4.5" />
                  </div>
                  <Input label="Subject" value={form.subject} onChange={(e) => set("subject", e.target.value)} placeholder="Academic subject or category" />
                  <Input label="External URL" icon={Globe} value={form.url} onChange={(e) => set("url", e.target.value)} placeholder="https://..." />
                  <Input label="Description" icon={FileText} textarea
                    value={form.desc} onChange={(e) => set("desc", e.target.value)} placeholder="Book synopsis or description…" />
                </div>
              )}

              {tab === "preview" && (
                <div>
                  <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
                    {/* Cover */}
                    <div style={{ height: 180, background: "var(--bg-page)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                      {form.image ? (
                        <img src={form.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ textAlign: "center" }}>
                          <BookOpen size={32} style={{ color: "var(--border-medium)", margin: "0 auto 8px" }} />
                          <p style={{ fontSize: "0.72rem", color: "var(--text-faint)" }}>No cover image</p>
                        </div>
                      )}
                      {form.ratings && (
                        <div style={{ position: "absolute", top: 10, right: 10, display: "flex", alignItems: "center", gap: 3, padding: "3px 8px", borderRadius: 20, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
                          <Star size={9} style={{ color: "#FFD166", fill: "#FFD166" }} />
                          <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#fff" }}>{form.ratings}</span>
                        </div>
                      )}
                    </div>
                    <div style={{ padding: "16px 18px" }}>
                      <p style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>{form.title || "Book Title"}</p>
                      <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: 10 }}>{form.author || "Author"}</p>
                      {form.genre && (
                        <span style={{ display: "inline-block", fontSize: "0.68rem", padding: "2px 8px", borderRadius: 20, background: "var(--accent-sage-bg)", color: "var(--accent-sage-text)", border: "1px solid var(--accent-sage-ring)", marginBottom: 10 }}>{form.genre}</span>
                      )}
                      {form.desc && (
                        <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 12 }}>{form.desc}</p>
                      )}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid var(--border-light)" }}>
                        <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 700, color: "var(--accent-sage)" }}>
                          {form.price ? `₹${form.price}` : "Price not set"}
                        </span>
                        {form.language && <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>{form.language}</span>}
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: "0.68rem", color: "var(--text-faint)", textAlign: "center", marginTop: 10 }}>Live preview — edit in Details tab</p>
                </div>
              )}

              {tab === "media" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <Input label="Cover Image URL" icon={Image}
                    value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://…/cover.jpg" />
                  {form.image && (
                    <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid var(--border)", height: 160 }}>
                      <img src={form.image} alt="cover" style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => { e.target.style.display = "none"; }} />
                    </div>
                  )}
                  <div>
                    <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Replace PDF</label>
                    <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 7, border: "1px dashed var(--border-medium)", background: "var(--bg-surface)", cursor: "pointer" }}>
                      <Upload size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                      <span style={{ fontSize: "0.78rem", color: form.pdf ? "var(--text-primary)" : "var(--text-muted)" }}>
                        {form.pdf ? form.pdf.name : "Choose PDF file…"}
                      </span>
                      <input type="file" accept="application/pdf" onChange={(e) => set("pdf", e.target.files[0] || null)} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
                    </div>
                    {form.pdf && (
                      <p style={{ fontSize: "0.68rem", color: "var(--accent-sage)", marginTop: 4, display: "flex", alignItems: "center", gap: 3 }}>
                        <Check size={10} /> {form.pdf.name}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sticky footer */}
            <div style={{ padding: "14px 20px", borderTop: "1px solid var(--border-light)", display: "flex", alignItems: "center", gap: 10, flexShrink: 0, background: "var(--bg-card)" }}>
              {flash && (
                <span style={{ fontSize: "0.75rem", fontWeight: 500, color: flash.type === "success" ? "var(--accent-sage)" : "var(--accent-danger)", display: "flex", alignItems: "center", gap: 4 }}>
                  {flash.type === "success" ? <Check size={12} /> : <AlertCircle size={12} />} {flash.msg}
                </span>
              )}
              <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                <button onClick={onClose} style={{ padding: "8px 16px", borderRadius: 7, border: "1px solid var(--border)", background: "none", cursor: "pointer", fontSize: "0.83rem", color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-surface)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                >
                  Discard
                </button>
                <button onClick={handleSave} disabled={saving || !isDirty}
                  style={{ padding: "8px 18px", borderRadius: 7, border: "none", background: isDirty ? "var(--accent-sage)" : "var(--bg-surface)", color: isDirty ? "#fff" : "var(--text-faint)", cursor: isDirty ? "pointer" : "not-allowed", fontSize: "0.83rem", fontWeight: 600, fontFamily: "var(--font-body)", transition: "background 0.15s", opacity: saving ? 0.7 : 1 }}
                  onMouseEnter={(e) => { if (isDirty && !saving) e.currentTarget.style.background = "var(--accent-sage-dark)"; }}
                  onMouseLeave={(e) => { if (isDirty) e.currentTarget.style.background = "var(--accent-sage)"; }}
                >
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

const EditBook = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => fetchAllBooks().then(setBooks).catch(() => setBooks([])).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const filtered = books.filter((b) => b.title?.toLowerCase().includes(search.toLowerCase()) || b.author?.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
        <Pencil size={14} style={{ color: "var(--accent-amber)" }} />
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)" }}>Edit Books</h2>
        <span style={{ fontSize: "0.68rem", color: "var(--text-faint)", marginLeft: 2 }}>{books.length} total</span>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 14 }}>
        <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
        <input
          type="text" placeholder="Search by title or author…" value={search} onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", padding: "8px 10px 8px 32px", background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 7, fontSize: "0.83rem", color: "var(--text-primary)", fontFamily: "var(--font-body)", outline: "none", boxSizing: "border-box" }}
          onFocus={(e) => { e.target.style.borderColor = "var(--accent-sage)"; e.target.style.boxShadow = "0 0 0 2px var(--accent-sage-ring)"; }}
          onBlur={(e) => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
        />
      </div>

      {/* List */}
      {loading ? (
        <div style={{ padding: "32px", textAlign: "center" }}>
          <div style={{ width: 20, height: 20, border: "2px solid var(--border)", borderTopColor: "var(--accent-sage)", borderRadius: "50%", margin: "0 auto", animation: "spin 0.8s linear infinite" }} />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: "40px 20px", textAlign: "center" }}>
          <BookOpen size={24} style={{ color: "var(--border-medium)", margin: "0 auto 10px" }} />
          <p style={{ fontSize: "0.83rem", color: "var(--text-muted)" }}>{search ? "No books match your search" : "No books available"}</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 420, overflowY: "auto" }}>
          {filtered.map((book) => (
            <div key={book._id}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 8, border: `1px solid ${selected?._id === book._id ? "var(--accent-sage-ring)" : "var(--border-light)"}`, background: selected?._id === book._id ? "var(--accent-sage-bg)" : "var(--bg-surface)", transition: "all 0.12s", cursor: "pointer" }}
              onClick={() => setSelected(book)}
              onMouseEnter={(e) => { if (selected?._id !== book._id) e.currentTarget.style.background = "var(--bg-surface-hover)"; }}
              onMouseLeave={(e) => { if (selected?._id !== book._id) e.currentTarget.style.background = "var(--bg-surface)"; }}
            >
              <div style={{ width: 34, height: 44, borderRadius: 4, background: "var(--bg-page)", border: "1px solid var(--border-light)", flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {book.image ? <img src={book.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <BookOpen size={12} style={{ color: "var(--text-faint)" }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "0.83rem", fontWeight: 500, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{book.title}</p>
                <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>by {book.author}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                {book.ratings && (
                  <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Star size={9} style={{ color: "var(--accent-gold)", fill: "var(--accent-gold)" }} />
                    <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>{book.ratings}</span>
                  </div>
                )}
                <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--accent-sage)" }}>₹{book.price}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); setSelected(book); }}
                  style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg-card)", cursor: "pointer", fontSize: "0.72rem", fontWeight: 500, color: "var(--text-secondary)", transition: "all 0.12s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent-amber)"; e.currentTarget.style.color = "var(--accent-amber-dark)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <EditDrawer
        book={selected}
        onClose={() => setSelected(null)}
        onSaved={() => { load(); }}
      />
    </motion.div>
  );
};

export default EditBook;
