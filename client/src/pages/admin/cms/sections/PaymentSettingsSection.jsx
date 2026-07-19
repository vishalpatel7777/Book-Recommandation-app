import { useState, useEffect } from "react";
import { Settings, Save } from "lucide-react";
import api from "../../../../services/axios";
import { st, SectionTitle, useToastEmitter } from "../cmsUi";

const PROVIDERS = ["cashfree", "razorpay", "stripe", "mock"];
const CURRENCIES = ["INR", "USD", "EUR", "GBP"];

const Field = ({ label, children }) => (
  <div style={{ marginBottom: 20 }}>
    <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{label}</label>
    {children}
  </div>
);

const Toggle = ({ checked, onChange, label }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--border-light)" }}>
    <span style={{ fontSize: "0.88rem", color: "var(--text-primary)" }}>{label}</span>
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: 40, height: 22, borderRadius: 11, border: "none", cursor: "pointer",
        background: checked ? "var(--accent-sage)" : "var(--border-medium)",
        position: "relative", transition: "background 0.2s",
      }}
    >
      <div style={{
        width: 16, height: 16, borderRadius: "50%", background: "#fff",
        position: "absolute", top: 3, left: checked ? 21 : 3,
        transition: "left 0.2s",
      }} />
    </button>
  </div>
);

export default function PaymentSettingsSection() {
  const toast = useToastEmitter();
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/payment-settings")
      .then(({ data }) => setSettings(data))
      .catch(() => toast?.("Failed to load payment settings"))
      .finally(() => setLoading(false));
  }, [toast]);

  const set = (key, value) => setSettings((s) => ({ ...s, [key]: value }));

  const save = async () => {
    setSaving(true);
    try {
      const { data } = await api.put("/admin/payment-settings", {
        provider: settings.provider,
        enabled: settings.enabled,
        testMode: settings.testMode,
        currency: settings.currency,
        taxPercent: Number(settings.taxPercent),
        refundEnabled: settings.refundEnabled,
        emailReceiptsEnabled: settings.emailReceiptsEnabled,
      });
      setSettings(data);
      toast?.("Payment settings saved");
    } catch {
      toast?.("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <>
      <SectionTitle>Payment Settings</SectionTitle>
      <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)", fontSize: "0.82rem" }}>Loading…</div>
    </>
  );

  if (!settings) return null;

  return (
    <>
      <SectionTitle>Payment Settings</SectionTitle>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 20 }}>
        {/* Provider & Mode */}
        <div style={st.card}>
          <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Settings size={14} /> Gateway Configuration
          </p>

          <Field label="Payment Provider">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {PROVIDERS.map((p) => (
                <button key={p} onClick={() => set("provider", p)}
                  style={{
                    padding: "6px 14px", borderRadius: 20, fontSize: "0.78rem", fontWeight: 500, cursor: "pointer",
                    border: `1px solid ${settings.provider === p ? "var(--accent-sage)" : "var(--border)"}`,
                    background: settings.provider === p ? "var(--accent-sage-bg)" : "none",
                    color: settings.provider === p ? "var(--accent-sage-text)" : "var(--text-muted)",
                    textTransform: "capitalize",
                  }}>
                  {p}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Currency">
            <div style={{ display: "flex", gap: 8 }}>
              {CURRENCIES.map((c) => (
                <button key={c} onClick={() => set("currency", c)}
                  style={{
                    padding: "6px 14px", borderRadius: 20, fontSize: "0.78rem", fontWeight: 500, cursor: "pointer",
                    border: `1px solid ${settings.currency === c ? "var(--accent-sage)" : "var(--border)"}`,
                    background: settings.currency === c ? "var(--accent-sage-bg)" : "none",
                    color: settings.currency === c ? "var(--accent-sage-text)" : "var(--text-muted)",
                  }}>
                  {c}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Tax Percent (%)">
            <input
              type="number"
              min="0"
              max="100"
              value={settings.taxPercent ?? 0}
              onChange={(e) => set("taxPercent", e.target.value)}
              style={{
                width: "100%", padding: "8px 12px", border: "1px solid var(--border)",
                borderRadius: 6, background: "var(--bg-page)", color: "var(--text-primary)",
                fontSize: "0.88rem", outline: "none", boxSizing: "border-box",
              }}
            />
          </Field>
        </div>

        {/* Toggles */}
        <div style={st.card}>
          <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>Feature Toggles</p>

          <Toggle label="Payments Enabled" checked={settings.enabled ?? false} onChange={(v) => set("enabled", v)} />
          <Toggle label="Sandbox / Test Mode" checked={settings.testMode ?? true} onChange={(v) => set("testMode", v)} />
          <Toggle label="Refunds Enabled" checked={settings.refundEnabled ?? true} onChange={(v) => set("refundEnabled", v)} />
          <Toggle label="Email Receipts" checked={settings.emailReceiptsEnabled ?? false} onChange={(v) => set("emailReceiptsEnabled", v)} />

          <div style={{ marginTop: 20 }}>
            {settings.testMode && (
              <div style={{ padding: "8px 12px", background: "var(--accent-amber-bg, #fffbeb)", border: "1px solid var(--accent-amber, #f59e0b)", borderRadius: 6, fontSize: "0.75rem", color: "var(--accent-amber-text, #92400e)", marginBottom: 12 }}>
                ⚠ Sandbox mode active — no real charges
              </div>
            )}
            {!settings.enabled && (
              <div style={{ padding: "8px 12px", background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 6, fontSize: "0.75rem", color: "#991b1b", marginBottom: 12 }}>
                Payments are disabled. Users cannot purchase books.
              </div>
            )}
          </div>

          <button
            onClick={save}
            disabled={saving}
            className="btn btn-primary"
            style={{ width: "100%", marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px", opacity: saving ? 0.7 : 1 }}
          >
            {saving ? "Saving…" : <><Save size={13} /> Save Settings</>}
          </button>

          <p style={{ fontSize: "0.68rem", color: "var(--text-faint)", marginTop: 12, textAlign: "center" }}>
            Last updated: {settings.updatedAt ? new Date(settings.updatedAt).toLocaleString("en-IN") : "Never"}
          </p>
        </div>
      </div>
    </>
  );
}
