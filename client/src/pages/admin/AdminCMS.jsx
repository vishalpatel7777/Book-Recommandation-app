import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Section data ── */
import { SECTIONS } from "./cms/cmsData";

/* ── Shared UI ── */
import { ToastContainer } from "./cms/cmsUi";

/* ── Inline sections (small, no separate file needed) ── */
import {
  Upload, Check, Shield,
  Palette, Globe, Zap, Settings,
  Users, BookOpen, Activity, UserCheck,
  AlertTriangle, Search as SearchIcon, Eye,
  Heart, Package, ShoppingBag, CheckCircle, XCircle,
  Edit, UserCog, Star, LogIn, LogOut,
  DollarSign, Repeat, BarChart2, Clock,
} from "lucide-react";

/* ── Section components ── */
import AuthorsSection        from "./cms/sections/AuthorsSection";
import CategoriesSection     from "./cms/sections/CategoriesSection";
import CouponsSection        from "./cms/sections/CouponsSection";
import PromotionsSection     from "./cms/sections/PromotionsSection";
import NotificationCenterSection from "./cms/sections/NotificationCenterSection";
import NotificationSettingsSection from "./cms/sections/NotificationSettingsSection";
import ReviewsSection        from "./cms/sections/ReviewsSection";
import OrdersSection         from "./cms/sections/OrdersSection";
import RefundsSection        from "./cms/sections/RefundsSection";
import SupportSection        from "./cms/sections/SupportSection";
import SearchAnalyticsSection from "./cms/sections/SearchAnalyticsSection";
import RecommendationsSection from "./cms/sections/RecommendationsSection";
import MediaLibrarySection   from "./cms/sections/MediaLibrarySection";
import HomepageBuilderSection from "./cms/sections/HomepageBuilderSection";
import ThemeSection          from "./cms/sections/ThemeSection";
import SchedulerSection      from "./cms/sections/SchedulerSection";

/* ── Inline section data ── */
import {
  PRESETS, FEATURE_DEFAULTS, FEATURE_LABELS,
  TOP_BUYERS, REFUND_HISTORY, REV_BY_USER,
  EVENT_TYPES, MOCK_EVENTS, EVENT_VOLUME, MOCK_AUDIT,
} from "./cms/cmsData";
import { st, SectionTitle, StatusBadge, Toggle, KpiRow } from "./cms/cmsUi";

/* ── Inline section primitives ── */
const label = st.label;
const inputSt = st.input;
const card = st.card;
const tableHeader = st.th;
const tableCell = st.td;

/* ── Inline sections (Branding, Metadata, UserAnalytics, BookAnalytics, EventTracking, AuditLogs, Features, Integrations) ── */

function BrandingSection() {
  return (
    <>
      <SectionTitle>Website Branding</SectionTitle>
      <div style={card}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {["Logo", "Favicon"].map((name) => (
            <div key={name}>
              <span style={label}>{name}</span>
              <div style={{ border: "2px dashed var(--border-medium)", borderRadius: 8, padding: 24, textAlign: "center", cursor: "pointer", background: "var(--bg-surface)" }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--accent-sage)"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border-medium)"}>
                <Upload size={18} style={{ color: "var(--text-faint)", margin: "0 auto 6px" }} />
                <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Upload {name} (SVG, PNG)</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 16 }}>
          <div><span style={label}>Site Title</span><input style={inputSt} placeholder="e.g. BookMosaic" /></div>
          <div><span style={label}>Tagline</span><input style={inputSt} placeholder="e.g. A World of Literature" /></div>
        </div>
        <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
          <button className="btn btn-primary btn-sm">Save Branding</button>
          <button className="btn btn-secondary btn-sm">Reset</button>
        </div>
      </div>
    </>
  );
}

function MetadataSection() {
  return (
    <>
      <SectionTitle>SEO & Metadata</SectionTitle>
      <div style={card}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { lbl: "SEO Title", ph: "BookMosaic — Discover Your Next Read" },
            { lbl: "Meta Description", ph: "Curated book recommendations...", area: true },
            { lbl: "Keywords", ph: "buy books online, book recommendations, ebooks" },
            { lbl: "OpenGraph Title", ph: "BookMosaic" },
            { lbl: "OpenGraph Description", ph: "Open Graph description", area: true },
          ].map(({ lbl: l, ph, area }) => (
            <div key={l}>
              <span style={label}>{l}</span>
              {area ? <textarea placeholder={ph} rows={2} style={{ ...inputSt, resize: "vertical" }} /> : <input style={inputSt} placeholder={ph} />}
            </div>
          ))}
          <div>
            <span style={label}>OpenGraph Image</span>
            <div style={{ display: "flex", gap: 8 }}>
              <input style={{ ...inputSt, flex: 1 }} placeholder="https://yourdomain.com/og-image.png" />
              <button className="btn btn-secondary btn-sm" style={{ whiteSpace: "nowrap" }}>Upload</button>
            </div>
          </div>
        </div>
        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 14, marginTop: 16 }}>
          <span style={{ ...label, marginBottom: 8, display: "block" }}>Google Preview</span>
          <div style={{ fontFamily: "var(--font-body)" }}>
            <div style={{ fontSize: "0.9rem", color: "var(--accent-info)", fontWeight: 500 }}>BookMosaic — Discover Your Next Read</div>
            <div style={{ fontSize: "0.72rem", color: "var(--accent-sage)", margin: "2px 0" }}>https://yourdomain.com</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Meta description will appear here once configured above.</div>
          </div>
        </div>
        <div style={{ marginTop: 16 }}><button className="btn btn-primary btn-sm">Save Metadata</button></div>
      </div>
    </>
  );
}

function UserAnalyticsSection() {
  return (
    <>
      <SectionTitle>User-Centric Analytics</SectionTitle>
      <KpiRow items={[
        { label: "Total Users",    value: "646",    icon: Users,      color: "var(--accent-sage)",  sub: "+28 this week" },
        { label: "Active (30d)",   value: "418",    icon: UserCheck,  color: "var(--accent-info)",  sub: "64.7% retention" },
        { label: "Avg CLV",        value: "₹2,840", icon: DollarSign, color: "var(--accent-gold, #F59E0B)", sub: "Customer lifetime" },
        { label: "Purchase Freq",  value: "2.8×",   icon: Repeat,     color: "var(--accent-amber)", sub: "Orders/user avg" },
      ]} />
      <div style={card}>
        <p style={{ ...label, marginBottom: 14 }}>Top Buyers — Customer Lifetime Value</p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{["Customer","Email","Orders","CLV","Avg Order","Last Order"].map((h) => <th key={h} style={tableHeader}>{h}</th>)}</tr></thead>
          <tbody>
            {TOP_BUYERS.map((b) => (
              <tr key={b.user}>
                <td style={tableCell}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--accent-sage-bg)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid var(--accent-sage-ring, var(--accent-sage))" }}>
                      <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--accent-sage-text)" }}>{b.user.charAt(0).toUpperCase()}</span>
                    </div>
                    <span style={{ fontWeight: 500, color: "var(--text-primary)" }}>{b.user}</span>
                  </div>
                </td>
                <td style={{ ...tableCell, color: "var(--text-faint)", fontSize: "0.72rem" }}>{b.email}</td>
                <td style={tableCell}>{b.orders}</td>
                <td style={{ ...tableCell, fontWeight: 600, color: "var(--accent-sage-text)" }}>{b.clv}</td>
                <td style={tableCell}>{b.avg}</td>
                <td style={{ ...tableCell, color: "var(--text-faint)", fontSize: "0.72rem" }}>{b.lastOrder}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={card}>
        <p style={{ ...label, marginBottom: 14 }}>Revenue Distribution by User Tier</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {REV_BY_USER.map(({ label: lbl, count, pct }) => (
            <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", width: 70, flexShrink: 0 }}>{lbl}</span>
              <div style={{ flex: 1, height: 8, borderRadius: 4, background: "var(--bg-surface)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, borderRadius: 4, background: "var(--accent-sage)", transition: "width 0.6s" }} />
              </div>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", width: 80, flexShrink: 0, textAlign: "right" }}>{count} users ({pct}%)</span>
            </div>
          ))}
        </div>
      </div>
      <div style={card}>
        <p style={{ ...label, marginBottom: 14 }}>Refund History</p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{["Refund ID","Customer","Book","Amount","Status","Date"].map((h) => <th key={h} style={tableHeader}>{h}</th>)}</tr></thead>
          <tbody>
            {REFUND_HISTORY.map((r) => (
              <tr key={r.id}>
                <td style={{ ...tableCell, fontFamily: "monospace", fontSize: "0.72rem", color: "var(--text-faint)" }}>{r.id}</td>
                <td style={tableCell}>{r.user}</td>
                <td style={{ ...tableCell, fontStyle: "italic", color: "var(--text-primary)" }}>{r.book}</td>
                <td style={{ ...tableCell, fontWeight: 600 }}>{r.amount}</td>
                <td style={tableCell}><StatusBadge status={r.status} /></td>
                <td style={{ ...tableCell, color: "var(--text-faint)", fontSize: "0.72rem" }}>{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function BookAnalyticsSection() {
  return (
    <>
      <SectionTitle>Book Analytics</SectionTitle>
      <div style={card}>
        <p style={{ ...label, marginBottom: 14 }}>Top Performing Books</p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{["#","Title","Author","Views","Purchases","Conv."].map((h) => <th key={h} style={tableHeader}>{h}</th>)}</tr></thead>
          <tbody>
            {[
              { title: "Atomic Habits",        author: "James Clear",   views: 2987, purchases: 341 },
              { title: "The Midnight Library", author: "Matt Haig",     views: 3214, purchases: 218 },
              { title: "Sapiens",              author: "Yuval Harari",  views: 1998, purchases: 162 },
              { title: "The Alchemist",        author: "Paulo Coelho",  views: 2310, purchases: 276 },
              { title: "Project Hail Mary",    author: "Andy Weir",     views: 2654, purchases: 195 },
            ].map((b, i) => (
              <tr key={b.title}>
                <td style={{ ...tableCell, color: "var(--text-faint)", width: 28 }}>{i + 1}</td>
                <td style={{ ...tableCell, fontStyle: "italic", color: "var(--text-primary)", fontWeight: 500 }}>{b.title}</td>
                <td style={tableCell}>{b.author}</td>
                <td style={{ ...tableCell, fontWeight: 500 }}>{b.views.toLocaleString()}</td>
                <td style={tableCell}>
                  <span style={{ padding: "2px 8px", borderRadius: 4, background: "var(--accent-sage-bg)", color: "var(--accent-sage-text)", fontSize: "0.72rem", fontWeight: 600, border: "1px solid rgba(92,122,94,0.2)" }}>{b.purchases}</span>
                </td>
                <td style={{ ...tableCell, fontSize: "0.72rem", color: "var(--text-muted)" }}>{((b.purchases / b.views) * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function EventTrackingSection() {
  const [activeFilter, setActiveFilter] = useState("all");

  const eventColor = (type) => EVENT_TYPES.find((e) => e.id === type)?.color || "var(--text-faint)";
  const eventIcon = (type) => EVENT_TYPES.find((e) => e.id === type)?.icon || Activity;

  const FILTER_GROUPS = [
    { id: "all", label: "All Events" },
    { id: "login", label: "Auth" },
    { id: "payment", label: "Payments" },
    { id: "review", label: "Reviews" },
    { id: "search", label: "Search" },
  ];

  const filtered = activeFilter === "all" ? MOCK_EVENTS : MOCK_EVENTS.filter((e) =>
    e.type === activeFilter || e.type.startsWith(activeFilter)
  );

  return (
    <>
      <SectionTitle>Real-Time Event Tracking</SectionTitle>
      <KpiRow items={[
        { label: "Events Today",  value: "1,842", icon: Activity,      color: "var(--accent-sage)",   sub: "+14% vs yesterday" },
        { label: "Failed Logins", value: "7",     icon: AlertTriangle, color: "var(--accent-danger)", sub: "Last 24 hours" },
        { label: "Conversions",   value: "12.4%", icon: CheckCircle,   color: "var(--accent-gold, #F59E0B)", sub: "View → Purchase" },
        { label: "Search Rate",   value: "38%",   icon: SearchIcon,    color: "var(--accent-info)",   sub: "Sessions with search" },
      ]} />
      <div style={card}>
        <p style={{ ...label, marginBottom: 14 }}>Event Volume — Last 7 Days</p>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 100 }}>
          {EVENT_VOLUME.map((d) => {
            const max = 250;
            return (
              <div key={d.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", height: 80, gap: 1 }}>
                  <div title={`Logins: ${d.logins}`} style={{ width: "100%", height: `${(d.logins / max) * 100}%`, background: "var(--accent-info)", borderRadius: "2px 2px 0 0", opacity: 0.7 }} />
                  <div title={`Purchases: ${d.purchases}`} style={{ width: "100%", height: `${(d.purchases / max) * 100}%`, background: "var(--accent-sage)", borderRadius: "2px 2px 0 0" }} />
                  <div title={`Searches: ${d.searches}`} style={{ width: "100%", height: `${(d.searches / max) * 100}%`, background: "var(--accent-amber)", borderRadius: "2px 2px 0 0", opacity: 0.5 }} />
                </div>
                <span style={{ fontSize: "0.58rem", color: "var(--text-faint)", whiteSpace: "nowrap" }}>{d.date}</span>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
          {[["var(--accent-info)","Logins"],["var(--accent-sage)","Purchases"],["var(--accent-amber)","Searches"]].map(([c, l]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
              <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={card}>
        <p style={{ ...label, marginBottom: 14 }}>Tracked Event Types ({EVENT_TYPES.length})</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {EVENT_TYPES.map(({ id, label: lbl, icon: Icon, color }) => (
            <div key={id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 7, background: "var(--bg-surface)", border: "1px solid var(--border-light)" }}>
              <Icon size={12} style={{ color, flexShrink: 0 }} />
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{lbl}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <p style={label}>Live Event Feed</p>
          <div style={{ display: "flex", gap: 6 }}>
            {FILTER_GROUPS.map(({ id, label: lbl }) => (
              <button key={id} onClick={() => setActiveFilter(id)}
                style={{ padding: "3px 10px", borderRadius: 20, fontSize: "0.68rem", fontWeight: 500, cursor: "pointer", border: `1px solid ${activeFilter === id ? "var(--accent-sage)" : "var(--border)"}`, background: activeFilter === id ? "var(--accent-sage-bg)" : "none", color: activeFilter === id ? "var(--accent-sage-text)" : "var(--text-muted)", transition: "all 0.12s" }}>
                {lbl}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {filtered.map((evt, i) => {
            const Icon = eventIcon(evt.type);
            const color = eventColor(evt.type);
            return (
              <div key={evt.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: i < filtered.length - 1 ? "1px solid var(--border-light)" : "none" }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: `${color}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={12} style={{ color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: "0.78rem", fontWeight: 500, color: "var(--text-primary)" }}>{evt.user}</span>
                    <span style={{ fontSize: "0.65rem", padding: "1px 6px", borderRadius: 3, background: `${color}14`, color, fontWeight: 600 }}>{evt.type}</span>
                  </div>
                  <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 1 }}>{evt.meta}</p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontSize: "0.65rem", color: "var(--text-faint)" }}>{evt.time}</p>
                  <p style={{ fontSize: "0.6rem", color: "var(--text-faint)", fontFamily: "monospace" }}>{evt.ip}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function AuditLogsSection() {
  const severityColor = (s) => ({ info: "var(--accent-info)", warn: "var(--accent-amber-dark)", danger: "var(--accent-danger)" }[s] || "var(--text-faint)");
  const severityBg = (s) => ({ info: "rgba(59,130,246,0.08)", warn: "rgba(139,111,71,0.1)", danger: "rgba(184,84,80,0.1)" }[s] || "var(--bg-surface)");
  return (
    <>
      <SectionTitle>Audit Logs</SectionTitle>
      <div style={card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <p style={{ fontSize: "0.83rem", color: "var(--text-muted)" }}>All admin and system actions are immutable</p>
          <button className="btn btn-secondary btn-sm">Export CSV</button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{["Actor","Action","Target","Time","IP","Severity"].map((h) => <th key={h} style={tableHeader}>{h}</th>)}</tr></thead>
          <tbody>
            {MOCK_AUDIT.map((a) => (
              <tr key={a.id}>
                <td style={{ ...tableCell, fontWeight: 500, color: "var(--text-primary)" }}>{a.actor}</td>
                <td style={tableCell}><span style={{ fontFamily: "monospace", fontSize: "0.72rem", padding: "2px 6px", borderRadius: 3, background: severityBg(a.severity), color: severityColor(a.severity), border: `1px solid ${severityColor(a.severity)}30` }}>{a.action}</span></td>
                <td style={{ ...tableCell, color: "var(--text-muted)", fontSize: "0.75rem" }}>{a.target}</td>
                <td style={{ ...tableCell, color: "var(--text-faint)", fontSize: "0.72rem", whiteSpace: "nowrap" }}>{a.time}</td>
                <td style={{ ...tableCell, fontFamily: "monospace", fontSize: "0.68rem", color: "var(--text-faint)" }}>{a.ip}</td>
                <td style={tableCell}><StatusBadge status={a.severity === "danger" ? "rejected" : a.severity === "warn" ? "pending" : "active"} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function FeaturesSection() {
  const [features, setFeatures] = useState(FEATURE_DEFAULTS);
  const toggle = (key) => setFeatures((f) => ({ ...f, [key]: !f[key] }));
  return (
    <>
      <SectionTitle>Feature Toggles</SectionTitle>
      <div style={card}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {Object.entries(FEATURE_LABELS).map(([key, lbl], i, arr) => (
            <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--border-light)" : "none" }}>
              <div>
                <p style={{ fontSize: "0.83rem", fontWeight: 500, color: "var(--text-primary)" }}>{lbl}</p>
                <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2 }}>{features[key] ? "Enabled — visible to users" : "Disabled — hidden from users"}</p>
              </div>
              <Toggle on={features[key]} onToggle={() => toggle(key)} />
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16 }}><button className="btn btn-primary btn-sm">Save Feature Flags</button></div>
      </div>
    </>
  );
}

function IntegrationsSection() {
  return (
    <>
      <SectionTitle>Integrations</SectionTitle>
      <div style={card}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { lbl: "Cashfree API Key",      ph: "cf_live_xxxxxxxxxxxx" },
            { lbl: "SMTP Host",             ph: "smtp.gmail.com" },
            { lbl: "Cloudinary Cloud Name", ph: "your-cloud-name" },
            { lbl: "Google Analytics ID",   ph: "G-XXXXXXXXXX" },
            { lbl: "CDN Base URL",          ph: "https://cdn.yourdomain.com" },
          ].map(({ lbl: l, ph }) => (
            <div key={l}>
              <span style={label}>{l}</span>
              <input type="password" style={inputSt} placeholder={ph} />
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(139,111,71,0.08)", border: "1px solid rgba(139,111,71,0.2)", borderRadius: 8, padding: 14, marginTop: 16, display: "flex", gap: 10, alignItems: "flex-start" }}>
          <Shield size={14} style={{ color: "var(--accent-amber)", marginTop: 2, flexShrink: 0 }} />
          <p style={{ fontSize: "0.75rem", color: "var(--accent-amber-dark)", lineHeight: 1.5 }}>
            Credentials are stored as server-side environment variables. Values entered here are not persisted until the backend settings API is connected.
          </p>
        </div>
        <div style={{ marginTop: 16 }}><button className="btn btn-primary btn-sm">Save Integrations</button></div>
      </div>
    </>
  );
}

/* ── RENDERERS map ── */
const RENDERERS = {
  branding:                BrandingSection,
  theme:                   ThemeSection,
  metadata:                MetadataSection,
  "homepage-builder":      HomepageBuilderSection,
  "media-library":         MediaLibrarySection,
  "user-analytics":        UserAnalyticsSection,
  "book-analytics":        BookAnalyticsSection,
  "event-tracking":        EventTrackingSection,
  "search-analytics":      SearchAnalyticsSection,
  recommendations:         RecommendationsSection,
  authors:                 AuthorsSection,
  categories:              CategoriesSection,
  reviews:                 ReviewsSection,
  promotions:              PromotionsSection,
  coupons:                 CouponsSection,
  orders:                  OrdersSection,
  refunds:                 RefundsSection,
  notifications:           NotificationCenterSection,
  "notification-settings": NotificationSettingsSection,
  scheduler:               SchedulerSection,
  support:                 SupportSection,
  "audit-logs":            AuditLogsSection,
  features:                FeaturesSection,
  integrations:            IntegrationsSection,
};

/* ── Sidebar group rendering ── */
const GROUPS = ["Content", "Analytics", "Catalog", "Commerce", "System"];

export default function AdminCMS() {
  const [active, setActive] = useState("branding");
  const ActiveSection = RENDERERS[active] || (() => <p>Coming Soon</p>);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)", display: "flex" }}>
      {/* Sidebar */}
      <aside style={{
        width: 230, flexShrink: 0, background: "var(--bg-card)", borderRight: "1px solid var(--border)",
        position: "sticky", top: 52, height: "calc(100vh - 52px)", overflowY: "auto", padding: "12px 0",
      }}>
        <div style={{ padding: "0 16px 8px" }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-faint)" }}>Platform CMS</span>
        </div>
        <nav>
          {GROUPS.map(group => {
            const items = SECTIONS.filter(s => s.group === group);
            return (
              <div key={group} style={{ marginBottom: 4 }}>
                <div style={{ padding: "6px 16px 2px", fontFamily: "var(--font-body)", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-faint)", marginTop: 6 }}>
                  {group}
                </div>
                {items.map(({ id, label: lbl, icon: Icon }) => {
                  const isActive = active === id;
                  return (
                    <button key={id} onClick={() => setActive(id)}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", gap: 9,
                        padding: "6px 16px", border: "none", cursor: "pointer", textAlign: "left",
                        background: isActive ? "var(--accent-sage-bg)" : "transparent",
                        borderLeft: `2px solid ${isActive ? "var(--accent-sage)" : "transparent"}`,
                        fontFamily: "var(--font-body)", fontSize: "0.8rem",
                        fontWeight: isActive ? 500 : 400,
                        color: isActive ? "var(--accent-sage-text)" : "var(--text-secondary)",
                        transition: "all 0.12s",
                      }}
                      onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = "var(--bg-surface)"; e.currentTarget.style.color = "var(--text-primary)"; } }}
                      onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; } }}
                    >
                      <Icon size={13} style={{ color: isActive ? "var(--accent-sage)" : "var(--text-muted)", flexShrink: 0 }} />
                      {lbl}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: "28px 32px", maxWidth: 960, overflowX: "hidden" }}>
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent-sage)", marginBottom: 4 }}>Platform</p>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.7rem", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Control Center</h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.83rem", color: "var(--text-muted)", marginTop: 4 }}>
            Manage branding, content, analytics, catalogue, and platform settings.
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.16 }}>
            <ActiveSection />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global toast */}
      <ToastContainer />
    </div>
  );
}
