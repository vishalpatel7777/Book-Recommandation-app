import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  BookPlus, Link as LinkIcon, Star, FileText,
  AlertCircle, CheckCircle, Upload, X, BookOpen,
  Hash, Tag, Globe, Eye, EyeOff, Search, ChevronDown, Plus,
  Smartphone, Monitor,
} from "lucide-react";
import CustomAlert from "../../common/Alert/CustomAlert";
import api from "../../../services/axios";
import { useFlashAlert } from "../../../hooks";

const GENRES = ["Fiction","Non-Fiction","Science","History","Biography","Fantasy","Mystery","Romance","Self-Help","Technology","Philosophy","Thriller","Horror","Literary Fiction","Young Adult","Children","Poetry","Drama","Other"];
const LANGUAGES = ["English","Hindi","Tamil","Telugu","Bengali","Marathi","Kannada","Malayalam","Gujarati","Punjabi","Urdu","Sanskrit"];
const STATUS_OPTIONS = ["draft", "published", "archived"];

const EMPTY = {
  title: "", author: "", genre: "", subject: "", isbn: "", slug: "",
  language: "English", price: "", mrp: "", ratings: "",
  desc: "", coverUrl: "", externalUrl: "", pdfUrl: "",
  seoTitle: "", seoDesc: "", seoKeywords: "",
  tags: [], category: "", status: "draft", publishedAt: "",
};

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// ── Field primitives ──────────────────────────────────────────────────────────
function FieldLabel({ label, required }) {
  return (
    <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.07em" }}>
      {label}{required && <span style={{ color: "var(--accent-danger)", marginLeft: 3 }}>*</span>}
    </label>
  );
}

function FieldWrap({ label, required, error, hint, children }) {
  return (
    <div>
      <FieldLabel label={label} required={required} />
      {children}
      {hint && !error && <p style={{ fontSize: "0.62rem", color: "var(--text-faint)", marginTop: 3 }}>{hint}</p>}
      {error && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
          <AlertCircle size={10} style={{ color: "var(--accent-danger)", flexShrink: 0 }} />
          <span style={{ fontSize: "0.65rem", color: "var(--accent-danger)" }}>{error}</span>
        </div>
      )}
    </div>
  );
}

function Field({ label, required, error, hint, type = "text", value, onChange, placeholder, min, max, step, disabled, prefix }) {
  const [focused, setFocused] = useState(false);
  const border = error ? "var(--accent-danger)" : focused ? "var(--accent-sage)" : "var(--border)";
  const shadow = error ? "0 0 0 2px rgba(184,84,80,0.15)" : focused ? "0 0 0 2px var(--accent-sage-ring)" : "none";
  return (
    <FieldWrap label={label} required={required} error={error} hint={hint}>
      <div style={{ display: "flex", alignItems: "stretch", border: `1px solid ${border}`, borderRadius: 7, boxShadow: shadow, transition: "border-color 0.15s, box-shadow 0.15s", background: disabled ? "var(--bg-surface)" : "var(--bg-page)" }}>
        {prefix && (
          <div style={{ padding: "0 10px", display: "flex", alignItems: "center", background: "var(--bg-surface)", borderRight: `1px solid ${border}`, borderRadius: "7px 0 0 7px", flexShrink: 0 }}>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>{prefix}</span>
          </div>
        )}
        <input
          type={type} value={value} onChange={onChange} placeholder={placeholder}
          disabled={disabled} min={min} max={max} step={step}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            flex: 1, padding: "9px 11px", background: "transparent",
            border: "none", outline: "none",
            color: "var(--text-primary)", fontSize: "0.83rem",
            fontFamily: "var(--font-body)", boxSizing: "border-box",
            opacity: disabled ? 0.6 : 1, borderRadius: prefix ? "0 7px 7px 0" : 7,
          }}
        />
      </div>
    </FieldWrap>
  );
}

function SelectField({ label, required, error, hint, value, onChange, options }) {
  const [focused, setFocused] = useState(false);
  return (
    <FieldWrap label={label} required={required} error={error} hint={hint}>
      <select
        value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: "100%", padding: "9px 11px",
          background: "var(--bg-page)",
          border: `1px solid ${error ? "var(--accent-danger)" : focused ? "var(--accent-sage)" : "var(--border)"}`,
          borderRadius: 7, color: value ? "var(--text-primary)" : "var(--text-faint)",
          fontSize: "0.83rem", fontFamily: "var(--font-body)", outline: "none",
          boxShadow: focused ? "0 0 0 2px var(--accent-sage-ring)" : "none",
          cursor: "pointer", transition: "border-color 0.15s",
        }}
      >
        <option value="">Select...</option>
        {options.map((o) => (
          <option key={o} value={o} style={{ color: "var(--text-primary)" }}>{typeof o === "string" ? (o.charAt(0).toUpperCase() + o.slice(1)) : o}</option>
        ))}
      </select>
    </FieldWrap>
  );
}

function TextareaField({ label, required, error, hint, value, onChange, placeholder, rows = 4, maxLen = 500 }) {
  const [focused, setFocused] = useState(false);
  return (
    <FieldWrap label={label} required={required} error={error} hint={hint}>
      <textarea
        value={value} onChange={onChange} placeholder={placeholder} rows={rows}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: "100%", padding: "9px 11px", background: "var(--bg-page)",
          border: `1px solid ${error ? "var(--accent-danger)" : focused ? "var(--accent-sage)" : "var(--border)"}`,
          borderRadius: 7, color: "var(--text-primary)", fontSize: "0.83rem",
          fontFamily: "var(--font-body)", outline: "none", resize: "vertical",
          boxShadow: focused ? "0 0 0 2px var(--accent-sage-ring)" : "none",
          transition: "border-color 0.15s", boxSizing: "border-box",
        }}
      />
      <div style={{ textAlign: "right", marginTop: 3 }}>
        <span style={{ fontSize: "0.62rem", color: value.length > maxLen * 0.85 ? "var(--accent-danger)" : "var(--text-faint)" }}>
          {value.length}/{maxLen}
        </span>
      </div>
    </FieldWrap>
  );
}

function TagInput({ label, hint, tags, onChange }) {
  const [input, setInput] = useState("");
  const add = () => {
    const t = input.trim().toLowerCase().replace(/\s+/g, "-");
    if (t && !tags.includes(t)) onChange([...tags, t]);
    setInput("");
  };
  const remove = (t) => onChange(tags.filter((x) => x !== t));
  const handleKey = (e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } };
  return (
    <FieldWrap label={label} hint={hint}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "7px 10px", border: "1px solid var(--border)", borderRadius: 7, background: "var(--bg-page)", minHeight: 40, cursor: "text" }}
        onClick={() => document.getElementById("tag-input")?.focus()}
      >
        {tags.map((t) => (
          <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 20, background: "var(--accent-sage-bg)", border: "1px solid var(--accent-sage-ring)", fontSize: "0.72rem", fontWeight: 600, color: "var(--accent-sage-text)" }}>
            {t}
            <button onClick={() => remove(t)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 0, color: "var(--accent-sage)", lineHeight: 1 }}>
              <X size={10} />
            </button>
          </span>
        ))}
        <input
          id="tag-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          onBlur={add}
          placeholder={tags.length === 0 ? "Add tag, press Enter" : ""}
          style={{ border: "none", outline: "none", background: "transparent", fontSize: "0.83rem", color: "var(--text-primary)", fontFamily: "var(--font-body)", minWidth: 100, flex: 1 }}
        />
      </div>
    </FieldWrap>
  );
}

function StarRating({ value }) {
  const num = parseFloat(value) || 0;
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1,2,3,4,5].map((i) => (
        <Star key={i} size={11}
          style={{ color: i <= Math.round(num) ? "var(--accent-gold)" : "var(--border-medium)", fill: i <= Math.round(num) ? "var(--accent-gold)" : "transparent" }}
        />
      ))}
    </div>
  );
}

// ── Live Preview ──────────────────────────────────────────────────────────────
function LivePreview({ values }) {
  const [viewMode, setViewMode] = useState("card");
  const hasImage = values.coverUrl && (values.coverUrl.startsWith("http") || values.coverUrl.startsWith("/"));

  return (
    <div style={{ position: "sticky", top: 72 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-faint)" }}>
          Storefront Preview
        </p>
        <div style={{ display: "flex", gap: 4 }}>
          {[{ id: "card", Icon: Monitor }, { id: "mobile", Icon: Smartphone }].map(({ id, Icon }) => (
            <button key={id} onClick={() => setViewMode(id)}
              style={{ width: 26, height: 26, borderRadius: 5, background: viewMode === id ? "var(--accent-sage-bg)" : "none", border: `1px solid ${viewMode === id ? "var(--accent-sage-ring)" : "var(--border)"}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <Icon size={11} style={{ color: viewMode === id ? "var(--accent-sage)" : "var(--text-muted)" }} />
            </button>
          ))}
        </div>
      </div>

      {/* Status badge */}
      {values.status && (
        <div style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "2px 8px", borderRadius: 20,
            background: values.status === "published" ? "rgba(92,122,94,0.12)" : values.status === "archived" ? "var(--bg-surface)" : "rgba(139,111,71,0.1)",
            border: `1px solid ${values.status === "published" ? "rgba(92,122,94,0.25)" : values.status === "archived" ? "var(--border)" : "rgba(139,111,71,0.2)"}`,
          }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: values.status === "published" ? "var(--accent-sage)" : values.status === "archived" ? "var(--text-muted)" : "var(--accent-amber)" }} />
            <span style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: values.status === "published" ? "var(--accent-sage-text)" : values.status === "archived" ? "var(--text-muted)" : "var(--accent-amber-dark)" }}>
              {values.status}
            </span>
          </div>
        </div>
      )}

      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: 12, overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
        maxWidth: viewMode === "mobile" ? 220 : "100%",
        margin: viewMode === "mobile" ? "0 auto" : undefined,
        transition: "max-width 0.25s ease",
      }}>
        {/* Cover */}
        <div style={{ height: viewMode === "mobile" ? 160 : 200, background: "var(--bg-surface)", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {hasImage ? (
            <img src={values.coverUrl} alt="cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.style.display = "none"; }} />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <BookOpen size={28} style={{ color: "var(--border-medium)" }} />
              <span style={{ fontSize: "0.65rem", color: "var(--text-faint)" }}>No cover</span>
            </div>
          )}
          {values.genre && (
            <div style={{ position: "absolute", top: 10, right: 10, padding: "2px 8px", borderRadius: 20, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}>
              <span style={{ fontSize: "0.6rem", fontWeight: 600, color: "#fff" }}>{values.genre}</span>
            </div>
          )}
          {values.mrp && values.price && parseFloat(values.mrp) > parseFloat(values.price) && (
            <div style={{ position: "absolute", top: 10, left: 10, padding: "2px 6px", borderRadius: 4, background: "var(--accent-danger)", color: "#fff", fontSize: "0.6rem", fontWeight: 700 }}>
              {Math.round((1 - parseFloat(values.price) / parseFloat(values.mrp)) * 100)}% OFF
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: viewMode === "mobile" ? "10px 12px" : "14px 16px" }}>
          <p style={{ fontFamily: "var(--font-heading)", fontSize: viewMode === "mobile" ? "0.9rem" : "1rem", fontWeight: 600, color: values.title ? "var(--text-primary)" : "var(--text-faint)", marginBottom: 3, lineHeight: 1.3 }}>
            {values.title || "Book Title"}
          </p>
          <p style={{ fontSize: "0.75rem", color: values.author ? "var(--text-secondary)" : "var(--text-faint)", marginBottom: 6 }}>
            {values.author ? `by ${values.author}` : "Author Name"}
          </p>

          {values.tags?.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
              {values.tags.slice(0, 3).map((t) => (
                <span key={t} style={{ fontSize: "0.6rem", padding: "1px 6px", borderRadius: 10, background: "var(--bg-surface)", border: "1px solid var(--border-light)", color: "var(--text-faint)" }}>{t}</span>
              ))}
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <StarRating value={values.ratings} />
            {values.language && <span style={{ fontSize: "0.62rem", color: "var(--text-faint)", padding: "1px 5px", background: "var(--bg-surface)", borderRadius: 3, border: "1px solid var(--border-light)" }}>{values.language}</span>}
          </div>

          {values.desc && !viewMode === "mobile" && (
            <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", lineHeight: 1.5, marginBottom: 8, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
              {values.desc}
            </p>
          )}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid var(--border-light)" }}>
            <div>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: viewMode === "mobile" ? "1rem" : "1.1rem", fontWeight: 700, color: values.price ? "var(--accent-sage)" : "var(--text-faint)" }}>
                {values.price ? `₹${parseFloat(values.price).toFixed(0)}` : "₹—"}
              </span>
              {values.mrp && parseFloat(values.mrp) > parseFloat(values.price) && (
                <span style={{ fontSize: "0.68rem", color: "var(--text-faint)", textDecoration: "line-through", marginLeft: 5 }}>₹{values.mrp}</span>
              )}
            </div>
            <div style={{ padding: "5px 10px", borderRadius: 6, background: "var(--accent-sage)" }}>
              <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "#fff" }}>Buy Now</span>
            </div>
          </div>
        </div>
      </div>

      {/* SEO preview */}
      {values.seoTitle && (
        <div style={{ marginTop: 10, padding: "10px 12px", borderRadius: 8, background: "var(--bg-card)", border: "1px solid var(--border-light)" }}>
          <p style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-faint)", marginBottom: 5 }}>SEO Preview</p>
          <p style={{ fontSize: "0.8rem", color: "var(--accent-info)", fontWeight: 500, marginBottom: 1, lineHeight: 1.3 }}>{values.seoTitle}</p>
          {values.slug && <p style={{ fontSize: "0.65rem", color: "var(--accent-sage)", marginBottom: 3 }}>yourdomain.com/books/{values.slug}</p>}
          {values.seoDesc && <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", lineHeight: 1.4 }}>{values.seoDesc.slice(0, 120)}{values.seoDesc.length > 120 ? "..." : ""}</p>}
        </div>
      )}

      <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 6, background: "var(--bg-surface)", border: "1px solid var(--border-light)" }}>
        <p style={{ fontSize: "0.65rem", color: "var(--text-faint)", lineHeight: 1.5 }}>Preview updates as you type. Discount badge appears when MRP &gt; Price.</p>
      </div>
    </div>
  );
}

// ── PDF Drop Zone ─────────────────────────────────────────────────────────────
function PdfDropZone({ file, onChange, error }) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type === "application/pdf") onChange(dropped);
  }, [onChange]);

  return (
    <div>
      <FieldLabel label="PDF File" />
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragOver ? "var(--accent-sage)" : file ? "var(--accent-sage)" : error ? "var(--accent-danger)" : "var(--border-medium)"}`,
          borderRadius: 8, padding: "18px 16px", textAlign: "center", cursor: "pointer",
          background: dragOver ? "var(--accent-sage-bg)" : file ? "rgba(92,122,94,0.04)" : "var(--bg-page)",
          transition: "all 0.15s",
        }}
      >
        <input ref={inputRef} type="file" accept="application/pdf" style={{ display: "none" }} onChange={(e) => onChange(e.target.files[0])} />
        {file ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <CheckCircle size={16} style={{ color: "var(--accent-sage)", flexShrink: 0 }} />
              <div style={{ textAlign: "left" }}>
                <p style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>{file.name}</p>
                <p style={{ fontSize: "0.65rem", color: "var(--text-faint)" }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); onChange(null); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-faint)", padding: 4, borderRadius: 4 }}>
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            <Upload size={20} style={{ color: "var(--text-faint)", margin: "0 auto 8px" }} />
            <p style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--text-secondary)", fontFamily: "var(--font-body)", marginBottom: 3 }}>Drop PDF here or click to browse</p>
            <p style={{ fontSize: "0.68rem", color: "var(--text-faint)" }}>PDF only · Max 50MB</p>
          </>
        )}
      </div>
      {error && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
          <AlertCircle size={10} style={{ color: "var(--accent-danger)" }} />
          <span style={{ fontSize: "0.65rem", color: "var(--accent-danger)" }}>{error}</span>
        </div>
      )}
    </div>
  );
}

function SectionCard({ title, children, badge }) {
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", marginBottom: 14 }}>
      <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border-light)", background: "var(--bg-surface)", display: "flex", alignItems: "center", gap: 8 }}>
        <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)" }}>{title}</p>
        {badge && <span style={{ fontSize: "0.6rem", fontWeight: 700, padding: "1px 6px", borderRadius: 10, background: "var(--accent-sage-bg)", color: "var(--accent-sage-text)", border: "1px solid var(--accent-sage-ring)" }}>{badge}</span>}
      </div>
      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
        {children}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
const AddBook = () => {
  const isLoggedIn = useSelector((s) => s.auth.isLoggedIn);
  const role = useSelector((s) => s.auth.user?.role);
  const navigate = useNavigate();
  const { showAlert, alertMessage, flashAlert, setShowAlert } = useFlashAlert();

  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  const change = (field) => (e) => {
    const val = e && e.target ? e.target.value : e;
    setValues((v) => {
      const next = { ...v, [field]: val };
      if (field === "title" && !v._slugManual) {
        next.slug = slugify(val);
        if (!next.seoTitle) next.seoTitle = val;
      }
      return next;
    });
    setIsDirty(true);
    if (errors[field]) setErrors((er) => ({ ...er, [field]: null }));
  };

  const changeSlug = (e) => {
    setValues((v) => ({ ...v, slug: slugify(e.target.value), _slugManual: true }));
    setIsDirty(true);
  };

  const validate = () => {
    const errs = {};
    if (!values.title.trim()) errs.title = "Title is required";
    if (!values.author.trim()) errs.author = "Author is required";
    if (!values.price || isNaN(parseFloat(values.price))) errs.price = "Valid price is required";
    if (values.mrp && isNaN(parseFloat(values.mrp))) errs.mrp = "Valid MRP required";
    if (!pdfFile && !values.pdfUrl) errs.pdf = "PDF file or URL is required";
    if (values.ratings && (parseFloat(values.ratings) < 0 || parseFloat(values.ratings) > 5)) errs.ratings = "Rating must be 0–5";
    if (values.isbn && !/^(\d{10}|\d{13})$/.test(values.isbn.replace(/-/g, ""))) errs.isbn = "Must be 10 or 13 digits";
    return errs;
  };

  const submit = async (publishNow = true) => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const formData = new FormData();
      const payload = { ...values };
      delete payload._slugManual;
      payload.status = publishNow ? "published" : "draft";
      payload.tags = JSON.stringify(values.tags);
      Object.entries(payload).forEach(([k, v]) => { if (v !== "" && v !== undefined) formData.append(k, v); });
      if (pdfFile) formData.append("pdf", pdfFile);
      formData.set("price", parseFloat(values.price));
      if (values.mrp) formData.set("mrp", parseFloat(values.mrp));
      if (values.ratings) formData.set("ratings", parseFloat(values.ratings));
      await api.post("/add-book", formData, { headers: { "Content-Type": "multipart/form-data" } });
      flashAlert(`Book ${publishNow ? "published" : "saved as draft"} successfully`, () => navigate("/admin/books"));
    } catch (err) {
      flashAlert(err.response?.data?.message || "Failed to save book");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn || role !== "admin") return null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)", padding: "28px 28px 80px" }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 1160, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <BookPlus size={15} style={{ color: "var(--accent-sage)" }} />
              <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem", fontWeight: 600, color: "var(--text-primary)" }}>Add New Book</h1>
              {isDirty && (
                <span style={{ fontSize: "0.6rem", fontWeight: 700, padding: "1px 6px", borderRadius: 4, background: "rgba(139,111,71,0.12)", color: "var(--accent-amber-dark)", border: "1px solid rgba(139,111,71,0.2)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Unsaved</span>
              )}
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--text-muted)" }}>Fill in book details — storefront preview updates in real time</p>
          </div>

          {/* Status selector in header */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <select
              value={values.status}
              onChange={change("status")}
              style={{ padding: "6px 12px", borderRadius: 7, border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-secondary)", fontSize: "0.8rem", fontFamily: "var(--font-body)", cursor: "pointer", outline: "none" }}
            >
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
        </div>

        {/* Two-column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 24, alignItems: "start" }}>

          {/* Left — Storefront Preview */}
          <LivePreview values={values} />

          {/* Right — Form */}
          <div>
            {/* Book Details */}
            <SectionCard title="Book Details">
              <Field label="Title" required error={errors.title} value={values.title} onChange={change("title")} placeholder="e.g. Atomic Habits" />
              <Field label="Author" required error={errors.author} value={values.author} onChange={change("author")} placeholder="e.g. James Clear" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <SelectField label="Genre" value={values.genre} onChange={change("genre")} options={GENRES} />
                <Field label="Subject / Topic" value={values.subject} onChange={change("subject")} placeholder="e.g. Productivity" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field
                  label="ISBN" error={errors.isbn} value={values.isbn} onChange={change("isbn")}
                  placeholder="978-3-16-148410-0" hint="10 or 13 digit identifier"
                />
                <Field
                  label="Category" value={values.category} onChange={change("category")}
                  placeholder="e.g. Business & Finance"
                />
              </div>
              <TagInput label="Tags" hint="Press Enter or comma to add" tags={values.tags} onChange={(t) => { setValues((v) => ({ ...v, tags: t })); setIsDirty(true); }} />
            </SectionCard>

            {/* Publishing */}
            <SectionCard title="Publishing">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <SelectField label="Language" value={values.language} onChange={change("language")} options={LANGUAGES} />
                <Field label="Sale Price (₹)" required type="number" error={errors.price} value={values.price} onChange={change("price")} placeholder="299" prefix="₹" />
                <Field label="MRP (₹)" type="number" error={errors.mrp} value={values.mrp} onChange={change("mrp")} placeholder="349" hint="Discount badge auto-calculates" prefix="₹" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Rating (0–5)" type="number" error={errors.ratings} value={values.ratings} onChange={change("ratings")} placeholder="4.5" min="0" max="5" step="0.1" />
                <Field label="Publish Date" type="date" value={values.publishedAt} onChange={change("publishedAt")} hint="Leave blank to use today" />
              </div>
            </SectionCard>

            {/* Content */}
            <SectionCard title="Content">
              <TextareaField label="Description" required={false} value={values.desc} onChange={change("desc")} placeholder="A compelling description of the book..." rows={4} maxLen={500} />
            </SectionCard>

            {/* Media */}
            <SectionCard title="Media">
              <Field label="Cover Image URL" value={values.coverUrl} onChange={change("coverUrl")} placeholder="https://example.com/cover.jpg" />
              {values.coverUrl && (values.coverUrl.startsWith("http") || values.coverUrl.startsWith("/")) && (
                <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 12px", background: "var(--bg-surface)", borderRadius: 7, border: "1px solid var(--border-light)" }}>
                  <img src={values.coverUrl} alt="preview" style={{ width: 36, height: 46, objectFit: "cover", borderRadius: 3, border: "1px solid var(--border-light)" }} onError={(e) => e.target.style.display = "none"} />
                  <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Cover preview — visible in storefront card</p>
                </div>
              )}
              <Field label="External URL" value={values.externalUrl} onChange={change("externalUrl")} placeholder="https://..." hint="Optional link to book's external page" />
              <Field label="PDF URL" value={values.pdfUrl} onChange={change("pdfUrl")} placeholder="https://storage.example.com/book.pdf" hint="OR upload a file below" />
              <PdfDropZone file={pdfFile} onChange={setPdfFile} error={errors.pdf} />
            </SectionCard>

            {/* URL & SEO */}
            <SectionCard title="URL & SEO" badge="Affects search ranking">
              <Field
                label="URL Slug" value={values.slug} onChange={changeSlug}
                placeholder="atomic-habits-james-clear" hint="Auto-generated from title — edit to customise"
                prefix="books/"
              />
              <Field
                label="SEO Title" value={values.seoTitle} onChange={change("seoTitle")}
                placeholder="Atomic Habits by James Clear — BookMosaic" hint="Recommended: 50–60 characters"
              />
              <TextareaField
                label="Meta Description" value={values.seoDesc} onChange={change("seoDesc")}
                placeholder="Discover how tiny changes lead to remarkable results..." rows={2} maxLen={160}
                hint="Recommended: 120–160 characters"
              />
              <Field
                label="Keywords" value={values.seoKeywords} onChange={change("seoKeywords")}
                placeholder="atomic habits, habit formation, self-help books" hint="Comma-separated"
              />
            </SectionCard>
          </div>
        </div>
      </motion.div>

      {/* Sticky footer */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "var(--bg-card)", borderTop: "1px solid var(--border)",
        padding: "10px 28px", display: "flex", alignItems: "center", justifyContent: "space-between",
        zIndex: 30,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {isDirty && <span style={{ fontSize: "0.7rem", color: "var(--accent-amber-dark)", fontFamily: "var(--font-body)" }}>Unsaved changes</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => navigate("/admin/books")}
            style={{ padding: "8px 16px", borderRadius: 7, background: "none", border: "1px solid var(--border)", color: "var(--text-secondary)", fontSize: "0.83rem", fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-body)", transition: "background 0.15s" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-surface)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "none"}
          >
            Cancel
          </button>
          <button
            onClick={() => submit(false)}
            disabled={loading || !isDirty}
            style={{ padding: "8px 16px", borderRadius: 7, background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-secondary)", fontSize: "0.83rem", fontWeight: 500, cursor: loading || !isDirty ? "not-allowed" : "pointer", fontFamily: "var(--font-body)", opacity: loading || !isDirty ? 0.5 : 1, transition: "background 0.15s" }}
            onMouseEnter={(e) => { if (!loading && isDirty) e.currentTarget.style.background = "var(--bg-page)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg-surface)"; }}
          >
            Save Draft
          </button>
          <button
            onClick={() => submit(true)}
            disabled={loading}
            style={{
              padding: "8px 22px", borderRadius: 7,
              background: loading ? "var(--border-medium)" : "var(--accent-sage)",
              border: "none", color: "#fff", fontSize: "0.83rem", fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer", fontFamily: "var(--font-body)",
              transition: "background 0.15s", display: "flex", alignItems: "center", gap: 7,
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "var(--accent-sage-dark)"; }}
            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "var(--accent-sage)"; }}
          >
            {loading ? "Publishing..." : "Publish Book"}
          </button>
        </div>
      </div>

      {showAlert && <CustomAlert message={alertMessage} onClose={() => setShowAlert(false)} />}
    </div>
  );
};

export default AddBook;
