import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/axios";
import { useToast } from "./cms/cmsUi";

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
import PaymentSettingsSection from "./cms/sections/PaymentSettingsSection";
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
  const toast = useToast();
  const [form, setForm] = useState({ siteTitle: "", tagline: "", logoUrl: "", faviconUrl: "" });
  const [loading, setLoading] = useState(true);
  const logoRef = useRef(null);
  const favRef = useRef(null);
  useEffect(() => {
    api.get("/branding").then(({ data }) => {
      const v = data?.data ?? data;
      setForm({ siteTitle: v.siteTitle || "", tagline: v.tagline || "", logoUrl: v.logoUrl || "", faviconUrl: v.faviconUrl || "" });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);
  const save = async () => {
    try {
      const { data } = await api.put("/cms/branding", { siteTitle: form.siteTitle, tagline: form.tagline });
      const v = data?.data?.value ?? data?.data ?? data;
      setForm((f) => ({ ...f, siteTitle: v.siteTitle ?? f.siteTitle, tagline: v.tagline ?? f.tagline }));
      toast("Branding saved", "success");
    } catch (e) { toast(e?.response?.data?.message || "Save failed", "error"); }
  };
  const upload = async (file, kind) => {
    if (!file) return;
    const fd = new FormData(); fd.append("file", file);
    try {
      const { data } = await api.post(`/cms/branding/${kind}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      const v = data?.data?.value ?? data?.data ?? data;
      setForm((f) => ({ ...f, logoUrl: v.logoUrl ?? f.logoUrl, faviconUrl: v.faviconUrl ?? f.faviconUrl }));
      toast(`${kind} uploaded`, "success");
    } catch (e) { toast(e?.response?.data?.message || "Upload failed", "error"); }
  };
  if (loading) return <p style={{ color: "var(--text-muted)" }}>Loading branding…</p>;
  return (
    <>
      <SectionTitle>Website Branding</SectionTitle>
      <div style={card}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {[
            { name: "Logo", key: "logo", ref: logoRef, url: form.logoUrl },
            { name: "Favicon", key: "favicon", ref: favRef, url: form.faviconUrl },
          ].map(({ name, key, ref, url }) => (
            <div key={name}>
              <span style={label}>{name}</span>
              <input ref={ref} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => upload(e.target.files[0], key)} />
              <div onClick={() => ref.current?.click()} style={{ border: "2px dashed var(--border-medium)", borderRadius: 8, padding: 24, textAlign: "center", cursor: "pointer", background: "var(--bg-surface)" }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--accent-sage)"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border-medium)"}>
                {url ? <img src={url} alt={name} style={{ maxHeight: 32, margin: "0 auto 6px", display: "block" }} /> : <Upload size={18} style={{ color: "var(--text-faint)", margin: "0 auto 6px" }} />}
                <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{url ? "Click to replace" : `Upload ${name} (SVG, PNG)`}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 16 }}>
          <div><span style={label}>Site Title</span><input style={inputSt} value={form.siteTitle} onChange={(e) => setForm((f) => ({ ...f, siteTitle: e.target.value }))} placeholder="e.g. BookMosaic" /></div>
          <div><span style={label}>Tagline</span><input style={inputSt} value={form.tagline} onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))} placeholder="e.g. A World of Literature" /></div>
        </div>
        <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
          <button onClick={save} className="btn btn-primary btn-sm">Save Branding</button>
          <button onClick={() => api.get("/branding").then(({ data }) => { const v = data?.data ?? data; setForm({ siteTitle: v.siteTitle||"", tagline: v.tagline||"", logoUrl: v.logoUrl||"", faviconUrl: v.faviconUrl||""}); toast("Reset", "success"); })} className="btn btn-secondary btn-sm">Reset</button>
        </div>
      </div>
    </>
  );
}

function MetadataSection() {
  const toast = useToast();
  const [form, setForm] = useState({ seoTitle: "", metaDescription: "", keywords: "", ogTitle: "", ogDescription: "", ogImage: "" });
  const [loading, setLoading] = useState(true);
  const ogRef = useRef(null);
  useEffect(() => {
    api.get("/seo").then(({ data }) => {
      const v = data?.data ?? data;
      setForm({ seoTitle: v.seoTitle || "", metaDescription: v.metaDescription||"", keywords: v.keywords||"", ogTitle: v.ogTitle||"", ogDescription: v.ogDescription||"", ogImage: v.ogImage||"" });
    }).catch(()=>{}).finally(()=>setLoading(false));
  }, []);
  const save = async () => {
    try { await api.put("/cms/seo", form); toast("SEO saved", "success"); } catch(e){ toast(e?.response?.data?.message||"Save failed","error"); }
  };
  const uploadOg = async (file) => {
    if(!file) return;
    const fd=new FormData(); fd.append("file", file);
    try{ const {data}=await api.post("/cms/seo/og-image", fd, {headers:{"Content-Type":"multipart/form-data"}}); const v=data?.data??data; setForm(f=>({...f, ogImage: v.ogImage||f.ogImage})); toast("OG image uploaded","success"); }catch(e){ toast(e?.response?.data?.message||"Upload failed","error"); }
  };
  if(loading) return <p style={{color:"var(--text-muted)"}}>Loading SEO…</p>;
  const fields = [
    { key:"seoTitle", lbl:"SEO Title", ph:"BookMosaic — Discover Your Next Read" },
    { key:"metaDescription", lbl:"Meta Description", ph:"Curated book recommendations...", area:true },
    { key:"keywords", lbl:"Keywords", ph:"buy books online, book recommendations, ebooks" },
    { key:"ogTitle", lbl:"OpenGraph Title", ph:"BookMosaic" },
    { key:"ogDescription", lbl:"OpenGraph Description", ph:"Open Graph description", area:true },
  ];
  return (
    <>
      <SectionTitle>SEO & Metadata</SectionTitle>
      <div style={card}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {fields.map(({ key, lbl, ph, area }) => (
            <div key={key}>
              <span style={label}>{lbl}</span>
              {area ? <textarea value={form[key]} onChange={(e)=>setForm(f=>({...f,[key]:e.target.value}))} placeholder={ph} rows={2} style={{ ...inputSt, resize: "vertical" }} /> : <input value={form[key]} onChange={(e)=>setForm(f=>({...f,[key]:e.target.value}))} style={inputSt} placeholder={ph} />}
            </div>
          ))}
          <div>
            <span style={label}>OpenGraph Image</span>
            <div style={{ display: "flex", gap: 8 }}>
              <input value={form.ogImage} onChange={(e)=>setForm(f=>({...f, ogImage:e.target.value}))} style={{ ...inputSt, flex: 1 }} placeholder="https://yourdomain.com/og-image.png" />
              <input ref={ogRef} type="file" accept="image/*" style={{display:"none"}} onChange={(e)=>uploadOg(e.target.files[0])} />
              <button onClick={()=>ogRef.current?.click()} className="btn btn-secondary btn-sm" style={{ whiteSpace: "nowrap" }}>Upload</button>
            </div>
          </div>
        </div>
        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 14, marginTop: 16 }}>
          <span style={{ ...label, marginBottom: 8, display: "block" }}>Google Preview</span>
          <div style={{ fontFamily: "var(--font-body)" }}>
            <div style={{ fontSize: "0.9rem", color: "var(--accent-info)", fontWeight: 500 }}>{form.seoTitle || "BookMosaic — Discover Your Next Read"}</div>
            <div style={{ fontSize: "0.72rem", color: "var(--accent-sage)", margin: "2px 0" }}>https://yourdomain.com</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{form.metaDescription || "Meta description will appear here once configured above."}</div>
          </div>
        </div>
        <div style={{ marginTop: 16 }}><button onClick={save} className="btn btn-primary btn-sm">Save Metadata</button></div>
      </div>
    </>
  );
}

function UserAnalyticsSection() {
  const [live, setLive] = useState(null);
  useEffect(() => {
    api.get("/cms/analytics/users").then(({ data }) => setLive(data?.data ?? data)).catch(()=>setLive(null));
  }, []);
  const topBuyers = live ? (live.topBuyers || []) : TOP_BUYERS;
  const rev = live ? (live.clvDistribution || []) : REV_BY_USER;
  const refunds = live ? (live.recentRefunds || []) : REFUND_HISTORY;
  const hasLive = live !== null;
  const kpis = live?.kpis || {};
  const totalUsers = kpis.totalUsers ?? "646";
  const activeUsers = kpis.activeUsers ?? "418";
  return (
    <>
      <SectionTitle>User-Centric Analytics</SectionTitle>
      <KpiRow items={[
        { label: "Total Users",    value: String(totalUsers),    icon: Users,      color: "var(--accent-sage)",  sub: hasLive ? "live" : "+28 this week" },
        { label: "Active (30d)",   value: String(activeUsers),    icon: UserCheck,  color: "var(--accent-info)",  sub: hasLive ? "live" : "64.7% retention" },
        { label: "Avg CLV",        value: "₹2,840", icon: DollarSign, color: "var(--accent-gold, #F59E0B)", sub: "Customer lifetime" },
        { label: "Purchase Freq",  value: "2.8×",   icon: Repeat,     color: "var(--accent-amber)", sub: "Orders/user avg" },
      ]} />
      <div style={card}>
        <p style={{ ...label, marginBottom: 14 }}>Top Buyers — Customer Lifetime Value {hasLive ? "· live" : "(demo)"}</p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{["Customer","Email","Orders","CLV","Avg Order","Last Order"].map((h) => <th key={h} style={tableHeader}>{h}</th>)}</tr></thead>
          <tbody>
            {topBuyers.map((b) => (
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
        <p style={{ ...label, marginBottom: 14 }}>Revenue Distribution by User Tier {hasLive ? "· live" : ""}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {rev.map(({ label: lbl, count, pct }) => (
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
        <p style={{ ...label, marginBottom: 14 }}>Refund History {hasLive ? "· live" : "(demo)"} {hasLive && refunds.length===0 ? "(no refunds yet)" : ""}</p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{["Refund ID","Customer","Book","Amount","Status","Date"].map((h) => <th key={h} style={tableHeader}>{h}</th>)}</tr></thead>
          <tbody>
            {refunds.map((r) => (
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
  const [books, setBooks] = useState(null);
  useEffect(() => {
    api.get("/cms/analytics/books").then(({ data }) => setBooks(data?.data ?? data)).catch(()=>setBooks([]));
  }, []);
  const hasLive = books !== null;
  const rows = hasLive && books.length ? books : (hasLive ? [] : [
    { title: "Atomic Habits",        author: "James Clear",   views: 2987, purchases: 341 },
    { title: "The Midnight Library", author: "Matt Haig",     views: 3214, purchases: 218 },
    { title: "Sapiens",              author: "Yuval Harari",  views: 1998, purchases: 162 },
    { title: "The Alchemist",        author: "Paulo Coelho",  views: 2310, purchases: 276 },
    { title: "Project Hail Mary",    author: "Andy Weir",     views: 2654, purchases: 195 },
  ]);
  return (
    <>
      <SectionTitle>Book Analytics</SectionTitle>
      <div style={card}>
        <p style={{ ...label, marginBottom: 14 }}>Top Performing Books {books ? "" : "(demo)"}</p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{["#","Title","Author","Views","Purchases","Conv."].map((h) => <th key={h} style={tableHeader}>{h}</th>)}</tr></thead>
          <tbody>
            {rows.map((b, i) => (
              <tr key={b.title}>
                <td style={{ ...tableCell, color: "var(--text-faint)", width: 28 }}>{i + 1}</td>
                <td style={{ ...tableCell, fontStyle: "italic", color: "var(--text-primary)", fontWeight: 500 }}>{b.title}</td>
                <td style={tableCell}>{b.author}</td>
                <td style={{ ...tableCell, fontWeight: 500 }}>{Number(b.views||0).toLocaleString()}</td>
                <td style={tableCell}>
                  <span style={{ padding: "2px 8px", borderRadius: 4, background: "var(--accent-sage-bg)", color: "var(--accent-sage-text)", fontSize: "0.72rem", fontWeight: 600, border: "1px solid rgba(92,122,94,0.2)" }}>{b.purchases}</span>
                </td>
                <td style={{ ...tableCell, fontSize: "0.72rem", color: "var(--text-muted)" }}>{b.views ? ((b.purchases / b.views) * 100).toFixed(1) : "0.0"}%</td>
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
  const [liveEvents, setLiveEvents] = useState(null);
  useEffect(() => {
    api.get("/cms/events", { params: { limit: 20 } }).then(({ data }) => {
      const list = data?.data ?? data;
      if (Array.isArray(list) && list.length) {
        setLiveEvents(list.map(e=>({ id:e._id||e.id, type:e.type||"login", user:e.user||"user", meta:e.meta||"", time:e.createdAt?new Date(e.createdAt).toLocaleTimeString(): "", ip:e.ip||"" })));
      }
    }).catch(()=>{});
  }, []);

  const eventColor = (type) => EVENT_TYPES.find((e) => e.id === type)?.color || "var(--text-faint)";
  const eventIcon = (type) => EVENT_TYPES.find((e) => e.id === type)?.icon || Activity;

  const FILTER_GROUPS = [
    { id: "all", label: "All Events" },
    { id: "login", label: "Auth" },
    { id: "payment", label: "Payments" },
    { id: "review", label: "Reviews" },
    { id: "search", label: "Search" },
  ];

  const source = liveEvents || MOCK_EVENTS;
  const filtered = activeFilter === "all" ? source : source.filter((e) =>
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
  const toast = useToast();
  const severityColor = (s) => ({ info: "var(--accent-info)", warn: "var(--accent-amber-dark)", danger: "var(--accent-danger)" }[s] || "var(--text-faint)");
  const severityBg = (s) => ({ info: "rgba(59,130,246,0.08)", warn: "rgba(139,111,71,0.1)", danger: "rgba(184,84,80,0.1)" }[s] || "var(--bg-surface)");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get("/cms/audit-logs", { params: { limit: 50 } }).then(({ data }) => setLogs(data?.logs ?? data?.data ?? [])).catch(() => setLogs(MOCK_AUDIT)).finally(()=>setLoading(false));
  }, []);
  const exportCsv = () => {
    api.get("/cms/audit-logs/export", { responseType: "blob" }).then(({ data }) => {
      const url = URL.createObjectURL(new Blob([data]));
      const a = document.createElement("a"); a.href = url; a.download = "audit-logs.csv"; a.click(); URL.revokeObjectURL(url);
      toast("CSV exported", "success");
    }).catch(()=>toast("Export failed","error"));
  };
  return (
    <>
      <SectionTitle>Audit Logs</SectionTitle>
      <div style={card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <p style={{ fontSize: "0.83rem", color: "var(--text-muted)" }}>All admin and system actions are immutable {loading ? "(loading…)" : `(${logs.length})`}</p>
          <button onClick={exportCsv} className="btn btn-secondary btn-sm">Export CSV</button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{["Actor","Action","Target","Time","IP","Severity"].map((h) => <th key={h} style={tableHeader}>{h}</th>)}</tr></thead>
          <tbody>
            {logs.map((a) => (
              <tr key={a._id || a.id}>
                <td style={{ ...tableCell, fontWeight: 500, color: "var(--text-primary)" }}>{a.actor ? String(a.actor).slice(-6) : a.actor || "system"}</td>
                <td style={tableCell}><span style={{ fontFamily: "monospace", fontSize: "0.72rem", padding: "2px 6px", borderRadius: 3, background: severityBg(a.severity), color: severityColor(a.severity), border: `1px solid ${severityColor(a.severity)}30` }}>{a.action}</span></td>
                <td style={{ ...tableCell, color: "var(--text-muted)", fontSize: "0.75rem" }}>{a.target}</td>
                <td style={{ ...tableCell, color: "var(--text-faint)", fontSize: "0.72rem", whiteSpace: "nowrap" }}>{a.createdAt ? new Date(a.createdAt).toLocaleString() : a.time}</td>
                <td style={{ ...tableCell, fontFamily: "monospace", fontSize: "0.68rem", color: "var(--text-faint)" }}>{a.ip || "—"}</td>
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
  const toast = useToast();
  const [features, setFeatures] = useState(FEATURE_DEFAULTS);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get("/cms/features").then(({ data }) => {
      const v = data?.data ?? data;
      if (v && typeof v === "object") setFeatures((f) => ({ ...f, ...v }));
    }).catch(()=>{}).finally(()=>setLoading(false));
  }, []);
  const toggle = (key) => setFeatures((f) => ({ ...f, [key]: !f[key] }));
  const save = async () => {
    try { await api.put("/cms/features", features); toast("Feature flags saved", "success"); } catch(e){ toast(e?.response?.data?.message||"Save failed","error"); }
  };
  if (loading) return <p style={{color:"var(--text-muted)"}}>Loading features…</p>;
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
              <Toggle on={!!features[key]} onToggle={() => toggle(key)} />
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16 }}><button onClick={save} className="btn btn-primary btn-sm">Save Feature Flags</button></div>
      </div>
    </>
  );
}

function IntegrationsSection() {
  const toast = useToast();
  const FIELDS = [
    { key: "cashfreeApiKey", lbl: "Cashfree API Key", ph: "cf_live_xxxxxxxxxxxx" },
    { key: "smtpHost", lbl: "SMTP Host", ph: "smtp.gmail.com" },
    { key: "cloudinaryCloudName", lbl: "Cloudinary Cloud Name", ph: "your-cloud-name" },
    { key: "googleAnalyticsId", lbl: "Google Analytics ID", ph: "G-XXXXXXXXXX" },
    { key: "cdnBaseUrl", lbl: "CDN Base URL", ph: "https://cdn.yourdomain.com" },
  ];
  const [form, setForm] = useState({ cashfreeApiKey:"", smtpHost:"", cloudinaryCloudName:"", googleAnalyticsId:"", cdnBaseUrl:"" });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get("/cms/integrations").then(({ data }) => {
      const v = data?.data?.value ?? data?.data ?? data;
      if (v) setForm((f)=>({ ...f, ...v }));
    }).catch(()=>{}).finally(()=>setLoading(false));
  }, []);
  const save = async () => {
    try { await api.put("/cms/integrations", form); toast("Integrations saved (stored securely)", "success"); } catch(e){ toast(e?.response?.data?.message||"Save failed","error"); }
  };
  if (loading) return <p style={{color:"var(--text-muted)"}}>Loading integrations…</p>;
  return (
    <>
      <SectionTitle>Integrations</SectionTitle>
      <div style={card}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {FIELDS.map(({ key, lbl, ph }) => (
            <div key={key}>
              <span style={label}>{lbl}</span>
              <input type="password" value={form[key]} onChange={(e)=>setForm(f=>({...f,[key]:e.target.value}))} style={inputSt} placeholder={ph} />
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(92,122,94,0.08)", border: "1px solid rgba(92,122,94,0.2)", borderRadius: 8, padding: 14, marginTop: 16, display: "flex", gap: 10, alignItems: "flex-start" }}>
          <Shield size={14} style={{ color: "var(--accent-sage)", marginTop: 2, flexShrink: 0 }} />
          <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            Credentials are stored encrypted server-side and never exposed via public APIs. Saving here updates <code>SiteSetting/integrations</code> immediately.
          </p>
        </div>
        <div style={{ marginTop: 16 }}><button onClick={save} className="btn btn-primary btn-sm">Save Integrations</button></div>
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
  "payment-settings":      PaymentSettingsSection,
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
