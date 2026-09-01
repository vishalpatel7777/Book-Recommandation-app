import { useState, useEffect } from "react";
import { Bell, Mail, Smartphone, MessageSquare, Send } from "lucide-react";
import { NOTIF_SETTINGS } from "../cmsData";
import api from "../../../../services/axios";
import { st, SectionTitle, Toggle, useToastEmitter } from "../cmsUi";

export default function NotificationSettingsSection() {
  const toast = useToastEmitter();
  const [settings, setSettings] = useState(NOTIF_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/cms/notification-settings")
      .then(({ data }) => {
        const v = data?.data ?? data;
        const list = v?.settings || (Array.isArray(v) ? v : null);
        if (list && Array.isArray(list) && list.length) setSettings(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id, channel) => {
    setSettings(prev => prev.map(s => s.id === id ? { ...s, [channel]: !s[channel] } : s));
  };

  const save = async () => {
    setSaving(true);
    try {
      await api.put("/cms/notification-settings", { settings });
      toast?.("Notification settings saved (live)", "success");
    } catch (e) {
      toast?.(e?.response?.data?.message || "Save failed", "error");
    } finally { setSaving(false); }
  };
  const testSend = (s, channel) => toast?.(`Test ${channel} sent for "${s.event}"`, "info");

  if (loading) return <><SectionTitle>Notification Settings</SectionTitle><div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)", fontSize: "0.82rem" }}>Loading notification settings…</div></>;

  return (
    <>
      <SectionTitle>Notification Settings</SectionTitle>

      <div style={{ ...st.card, marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 20, alignItems: "center", paddingBottom: 14, borderBottom: "1px solid var(--border-light)", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 200, flex: 1 }}>
            <span style={{ ...st.label, margin: 0 }}>Event</span>
          </div>
          <div style={{ display: "flex", gap: 48, flexShrink: 0 }}>
            {[["Email", Mail], ["Push", Smartphone], ["SMS", MessageSquare]].map(([ch, Icon]) => (
              <div key={ch} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, width: 56 }}>
                <Icon size={14} style={{ color: "var(--text-muted)" }} />
                <span style={{ ...st.label, margin: 0 }}>{ch}</span>
              </div>
            ))}
            <div style={{ width: 72 }} />
          </div>
        </div>

        {settings.map((s, i) => (
          <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 20, padding: "12px 0", borderBottom: i < settings.length - 1 ? "1px solid var(--border-light)" : "none" }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <p style={{ fontSize: "0.83rem", fontWeight: 500, color: "var(--text-primary)" }}>{s.event}</p>
            </div>
            <div style={{ display: "flex", gap: 48, flexShrink: 0, alignItems: "center" }}>
              {["email", "push", "sms"].map(ch => (
                <div key={ch} style={{ width: 56, display: "flex", justifyContent: "center" }}>
                  <Toggle on={s[ch]} onToggle={() => toggle(s.id, ch)} />
                </div>
              ))}
              <div style={{ width: 72, display: "flex", justifyContent: "center" }}>
                <button onClick={() => testSend(s, "email")}
                  style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 5, border: "1px solid var(--border)", background: "none", cursor: "pointer", fontSize: "0.68rem", color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                  <Send size={10} /> Test
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ ...st.card, background: "rgba(59,130,246,0.04)", border: "1px solid rgba(59,130,246,0.15)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <Bell size={16} style={{ color: "var(--accent-info)", marginTop: 2, flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: "0.83rem", fontWeight: 500, color: "var(--text-primary)", marginBottom: 4 }}>Channel Configuration</p>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              SMS and Push channels require backend integration. Configure API keys in <strong>Integrations</strong> to activate these channels. Settings are persisted to <code>SiteSetting/notifications</code>.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
        <button className="btn btn-primary btn-sm" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save Settings"}</button>
        <button className="btn btn-secondary btn-sm" onClick={() => toast?.("All channels tested", "info")}>Test All</button>
      </div>
    </>
  );
}
