import { useState } from "react";
import { Check, Download, Upload, Copy, Trash2, Plus } from "lucide-react";
import { PRESETS } from "../cmsData";
import { st, SectionTitle, ConfirmDialog, Modal, Field, ActionBtn, useToastEmitter } from "../cmsUi";

const DEFAULT_THEME = { primary: "#5C7A5E", accent: "#8B6F47", bg: "#FAF8F3", text: "#1a1a1a", secondary: "#5a6b5c", radius: "6", shadow: "md" };

export default function ThemeSection() {
  const toast = useToastEmitter();
  const [presets, setPresets] = useState(PRESETS.map(p => ({ ...p, colors: { primary: p.primary, accent: p.accent, bg: p.bg, text: "#1a1a1a", secondary: "#5a6b5c" } })));
  const [selected, setSelected] = useState("matcha");
  const [colors, setColors] = useState(DEFAULT_THEME);
  const [radius, setRadius] = useState("6");
  const [shadow, setShadow] = useState("md");
  const [cloneModal, setCloneModal] = useState(false);
  const [cloneName, setCloneName] = useState("");
  const [importModal, setImportModal] = useState(false);
  const [importText, setImportText] = useState("");
  const [confirm, setConfirm] = useState(null);

  const selectPreset = (p) => {
    setSelected(p.id);
    setColors({ ...DEFAULT_THEME, primary: p.primary || p.colors?.primary, accent: p.accent || p.colors?.accent, bg: p.bg || p.colors?.bg });
  };

  const apply = () => toast?.("Theme applied to storefront");
  const saveTheme = () => toast?.("Theme saved");

  const cloneTheme = () => {
    if (!cloneName.trim()) { toast?.("Name is required", "error"); return; }
    const id = cloneName.toLowerCase().replace(/\s+/g, "-");
    setPresets(prev => [...prev, { id, label: cloneName, primary: colors.primary, accent: colors.accent, bg: colors.bg }]);
    toast?.(`Theme "${cloneName}" cloned`);
    setCloneModal(false);
    setCloneName("");
  };

  const deleteTheme = (p) => {
    setPresets(prev => prev.filter(x => x.id !== p.id));
    if (selected === p.id) setSelected("matcha");
    toast?.(`Theme "${p.label}" deleted`);
  };

  const exportCSS = () => {
    const css = `:root {\n  --color-primary: ${colors.primary};\n  --color-accent: ${colors.accent};\n  --color-bg: ${colors.bg};\n  --color-text: ${colors.text};\n  --radius: ${radius}px;\n}`;
    const blob = new Blob([css], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "theme.css"; a.click();
    URL.revokeObjectURL(url);
    toast?.("CSS exported");
  };

  const importTheme = () => {
    try {
      const parsed = JSON.parse(importText);
      if (parsed.primary && parsed.bg) {
        setColors(c => ({ ...c, ...parsed }));
        toast?.("Theme imported");
        setImportModal(false);
        setImportText("");
      } else {
        toast?.("Invalid theme JSON", "error");
      }
    } catch {
      toast?.("Invalid JSON", "error");
    }
  };

  return (
    <>
      <SectionTitle>Theme Manager</SectionTitle>

      <div style={st.card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={st.label}>Presets</span>
          <div style={{ display: "flex", gap: 6 }}>
            <ActionBtn onClick={() => setCloneModal(true)}><Copy size={11} /> Clone</ActionBtn>
            <ActionBtn onClick={exportCSS}><Download size={11} /> Export CSS</ActionBtn>
            <ActionBtn onClick={() => setImportModal(true)}><Upload size={11} /> Import</ActionBtn>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {presets.map((p) => (
            <div key={p.id} style={{ position: "relative" }}>
              <button onClick={() => selectPreset(p)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 6, cursor: "pointer", border: selected === p.id ? "1.5px solid var(--accent-sage)" : "1px solid var(--border-medium)", background: selected === p.id ? "var(--accent-sage-bg)" : "var(--bg-card)", fontFamily: "var(--font-body)", fontSize: "0.78rem", fontWeight: selected === p.id ? 600 : 400, color: selected === p.id ? "var(--accent-sage-text)" : "var(--text-secondary)", transition: "all 0.12s", paddingRight: presets.length > 5 ? 28 : 12 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: p.primary, flexShrink: 0 }} />
                {p.label}
                {selected === p.id && <Check size={10} />}
              </button>
              {presets.length > 5 && (
                <button onClick={() => setConfirm(p)}
                  style={{ position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-faint)", padding: 2, borderRadius: 3, display: "flex" }}>
                  <Trash2 size={10} />
                </button>
              )}
            </div>
          ))}
          <button onClick={() => setCloneModal(true)}
            style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 6, cursor: "pointer", border: "1px dashed var(--border-medium)", background: "none", fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--text-faint)" }}>
            <Plus size={11} /> New
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 16 }}>
          {[["primary","Primary Color"],["accent","Accent Color"],["bg","Background"],["text","Text Color"],["secondary","Secondary"]].map(([key, lbl]) => (
            <div key={key}>
              <span style={st.label}>{lbl}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="color" value={colors[key]} onChange={(e) => setColors(c => ({ ...c, [key]: e.target.value }))} style={{ width: 32, height: 32, borderRadius: 4, border: "1px solid var(--border)", cursor: "pointer", padding: 2 }} />
                <input value={colors[key]} onChange={(e) => setColors(c => ({ ...c, [key]: e.target.value }))} style={{ ...st.input, flex: 1, fontFamily: "monospace", fontSize: "0.78rem" }} />
              </div>
            </div>
          ))}
          <div>
            <span style={st.label}>Border Radius</span>
            <select value={radius} onChange={(e) => setRadius(e.target.value)} style={st.input}>
              {[["0","Sharp"],["4","Subtle"],["6","Default"],["10","Rounded"],["20","Pill"]].map(([v,l]) => <option key={v} value={v}>{l} ({v}px)</option>)}
            </select>
          </div>
          <div>
            <span style={st.label}>Shadow Level</span>
            <select value={shadow} onChange={(e) => setShadow(e.target.value)} style={st.input}>
              {[["none","None"],["sm","Subtle"],["md","Default"],["lg","Elevated"],["xl","Dramatic"]].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
        </div>

        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 14, marginBottom: 16 }}>
          <span style={{ ...st.label, marginBottom: 10, display: "block" }}>Live Preview</span>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: `${radius}px`, background: colors.primary }} />
            <div style={{ flex: 1, height: 36, borderRadius: `${radius}px`, background: colors.bg, border: `1px solid ${colors.accent}40`, display: "flex", alignItems: "center", paddingLeft: 12 }}>
              <span style={{ fontSize: "0.8rem", color: colors.text, fontFamily: "var(--font-body)" }}>Sample text</span>
            </div>
            <div style={{ height: 36, padding: "0 1rem", borderRadius: `${radius}px`, background: colors.primary, display: "flex", alignItems: "center", fontSize: "0.78rem", fontWeight: 600, color: "#fff" }}>Buy Now</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-primary btn-sm" onClick={apply}>Apply Theme</button>
          <button className="btn btn-secondary btn-sm" onClick={saveTheme}>Save Theme</button>
          <button className="btn btn-secondary btn-sm" onClick={exportCSS}>Export CSS</button>
        </div>
      </div>

      <Modal open={cloneModal} onClose={() => setCloneModal(false)} title="Clone Theme" width={380}>
        <Field label="New Theme Name">
          <input style={st.input} value={cloneName} onChange={(e) => setCloneName(e.target.value)} placeholder="e.g. My Custom Theme" autoFocus onKeyDown={(e) => e.key === "Enter" && cloneTheme()} />
        </Field>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setCloneModal(false)}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={cloneTheme}>Clone</button>
        </div>
      </Modal>

      <Modal open={importModal} onClose={() => setImportModal(false)} title="Import Theme" width={460}>
        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: 12 }}>Paste exported theme JSON below:</p>
        <Field label="Theme JSON">
          <textarea style={{ ...st.input, resize: "vertical", fontFamily: "monospace", fontSize: "0.78rem" }} rows={6} value={importText} onChange={(e) => setImportText(e.target.value)} placeholder={'{\n  "primary": "#5C7A5E",\n  "accent": "#8B6F47",\n  "bg": "#FAF8F3"\n}'} />
        </Field>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setImportModal(false)}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={importTheme}>Import</button>
        </div>
      </Modal>

      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => deleteTheme(confirm)}
        title="Delete Theme" message={`Delete theme "${confirm?.label}"? This cannot be undone.`} />
    </>
  );
}
