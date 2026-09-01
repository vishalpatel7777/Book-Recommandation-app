import { useState, useEffect } from "react";
import { BookOpen, ShoppingBag, Eye, DollarSign, Edit, Save, LogOut } from "lucide-react";
import api from "../../services/axios";
import { st, KpiRow } from "../admin/cms/cmsUi";

export default function AuthorDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ penName: "", bio: "" });

  useEffect(() => {
    api.get("/author/dashboard").then(({ data }) => {
      const d = data?.data ?? data;
      setData(d);
      setForm({ penName: d.profile?.penName || "", bio: d.profile?.bio || "" });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const saveProfile = async () => {
    try {
      await api.put("/author/profile", { penName: form.penName, bio: form.bio });
      setEditing(false);
      const { data: refreshed } = await api.get("/author/dashboard");
      const d = refreshed?.data ?? refreshed;
      setData(d);
    } catch (e) { alert(e.response?.data?.message || "Save failed"); }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>Loading author dashboard…</div>;
  if (!data) return <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>Unable to load dashboard. Please sign in as author.</div>;

  const { profile, stats, books = [], recentOrders = [] } = data;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)", padding: "28px 32px", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent-sage)", marginBottom: 4 }}>Author Portal</p>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.7rem", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Dashboard</h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.83rem", color: "var(--text-muted)", marginTop: 4 }}>Welcome back, {profile.penName || profile.username}</p>
        </div>
        <button onClick={async () => { await api.post("/logout"); window.location.href = "/author/login"; }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg-card)", cursor: "pointer", fontSize: "0.78rem", color: "var(--text-muted)" }}><LogOut size={13} /> Sign out</button>
      </div>

      <KpiRow items={[
        { label: "Total Books", value: stats.totalBooks, icon: BookOpen, color: "var(--accent-sage)", sub: `as "${stats.penName}"` },
        { label: "Total Sales", value: stats.totalSales, icon: ShoppingBag, color: "var(--accent-info)", sub: "Completed orders" },
        { label: "Pen Name", value: profile.penName || "—", icon: Edit, color: "var(--accent-amber)", sub: profile.verified ? "Verified ✓" : "Unverified" },
        { label: "Avg Rating", value: "—", icon: DollarSign, color: "var(--accent-gold)", sub: "Coming soon" },
      ]} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Profile card */}
        <div style={st.card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>Profile</h3>
            {!editing ? (
              <button onClick={() => setEditing(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 5, border: "1px solid var(--border)", background: "none", cursor: "pointer", fontSize: "0.72rem", color: "var(--text-muted)" }}><Edit size={11} /> Edit</button>
            ) : (
              <button onClick={saveProfile} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 5, border: "none", background: "var(--accent-sage)", cursor: "pointer", fontSize: "0.72rem", color: "#fff" }}><Save size={11} /> Save</button>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <span style={st.label}>Pen Name</span>
              {editing ? <input style={st.input} value={form.penName} onChange={(e) => setForm(f => ({ ...f, penName: e.target.value }))} /> : <p style={{ fontSize: "0.88rem", color: "var(--text-primary)", fontWeight: 500 }}>{profile.penName || "—"}</p>}
            </div>
            <div>
              <span style={st.label}>Bio</span>
              {editing ? <textarea style={{ ...st.input, resize: "vertical" }} rows={3} value={form.bio} onChange={(e) => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Short bio..." /> : <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{profile.bio || "No bio yet."}</p>}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 8 }}>
              <div><span style={st.label}>Email</span><p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{profile.email}</p></div>
              <div><span style={st.label}>Username</span><p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{profile.username}</p></div>
            </div>
          </div>
        </div>

        {/* Recent orders */}
        <div style={st.card}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 16px 0" }}>Recent Sales</h3>
          {recentOrders.length === 0 ? (
            <p style={{ fontSize: "0.82rem", color: "var(--text-faint)", textAlign: "center", padding: "20px 0" }}>No sales yet</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {recentOrders.map(o => (
                <div key={o._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid var(--border-light)" }}>
                  <div>
                    <p style={{ fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: 500 }}>{o.user?.username || "—"}</p>
                    <p style={{ fontSize: "0.68rem", color: "var(--text-faint)" }}>{new Date(o.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--accent-sage-text)" }}>₹{o.totalPrice ?? o.amount ?? 0}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Books */}
      <div style={{ ...st.card, marginTop: 20 }}>
        <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 16px 0" }}>My Books ({books.length})</h3>
        {books.length === 0 ? (
          <p style={{ fontSize: "0.82rem", color: "var(--text-faint)", textAlign: "center", padding: "20px 0" }}>No books yet. Create books via Admin → Books or contact admin to assign.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>{["Title", "Genre", "Price", "Ratings", "Created"].map(h => <th key={h} style={st.th}>{h}</th>)}</tr></thead>
            <tbody>
              {books.map(b => (
                <tr key={b._id}>
                  <td style={{ ...st.td, fontWeight: 500, color: "var(--text-primary)", fontStyle: "italic" }}>{b.title}</td>
                  <td style={st.td}>{b.genre}</td>
                  <td style={{ ...st.td, fontWeight: 600 }}>₹{b.price}</td>
                  <td style={st.td}>{b.ratings ?? 0}★</td>
                  <td style={{ ...st.td, fontSize: "0.72rem", color: "var(--text-faint)" }}>{new Date(b.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
