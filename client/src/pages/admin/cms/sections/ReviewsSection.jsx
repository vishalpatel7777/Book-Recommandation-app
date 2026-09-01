import { useState, useEffect } from "react";
import { Star, Eye, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { st, SectionTitle, KpiRow, StatusBadge, ConfirmDialog, Drawer, SearchBar, EmptyState, ActionBtn, Checkbox, Pagination, useToastEmitter } from "../cmsUi";
import api from "../../../../services/axios";

function Stars({ n }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1,2,3,4,5].map(i => <Star key={i} size={11} fill={i <= n ? "var(--accent-gold, #F59E0B)" : "none"} stroke={i <= n ? "var(--accent-gold, #F59E0B)" : "var(--border-medium)"} />)}
    </div>
  );
}

export default function ReviewsSection() {
  const toast = useToastEmitter();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    api.get("/cms/reviews")
      .then(({data})=>{
        // cms.service returns { success:true, data:[...], total... } OR {success, data:{blocks}} patterns
        // For reviews: { success:true, data:[normalized], ... } where data.data is array OR data.data.data edge case
        const raw = data?.data ?? data;
        const list = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : []);
        if(Array.isArray(list)){
          // Service already normalizes to {book: title string, user: username string, text, rating, date, status, id}
          // But handle both normalized and raw populated shapes defensively
          const mapped = list.map(r=>{
            const bookStr = (typeof r.book === 'string' && r.book) ? r.book
              : (r.bookId && typeof r.bookId === 'object' ? (r.bookId.title || "") : (typeof r.bookId === 'string' ? r.bookId : "")) || (typeof r.book === 'object' ? (r.book.title || "") : "") || "—";
            const userStr = (typeof r.user === 'string' && r.user) ? r.user
              : (r.userId && typeof r.userId === 'object' ? (r.userId.username || r.userId.email || "") : (typeof r.userId === 'string' ? r.userId : "")) || (typeof r.user === 'object' ? (r.user.username || "") : "") || "—";
            return { id: r._id||r.id, book: String(bookStr), user: String(userStr), rating: r.rating||0, text: r.review||r.comment||r.text||"", date: r.createdAt?new Date(r.createdAt).toLocaleDateString(): (r.date||""), status: r.status||"pending", raw: r };
          });
          setReviews(mapped);
        }
      })
      .catch(()=>{ /* keep empty; ErrorBoundary will show EmptyState not crash */ })
      .finally(()=> setLoading(false));
  },[]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState([]);
  const [drawer, setDrawer] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const filtered = reviews.filter(r => {
    const s = search.toLowerCase();
    const book = String(r.book || "");
    const user = String(r.user || "");
    const text = String(r.text || "");
    const matchSearch = !s || book.toLowerCase().includes(s) || user.toLowerCase().includes(s) || text.toLowerCase().includes(s);
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const paginated = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  const approve = async (id) => {
    try{ const r=reviews.find(x=>x.id===id); const rid=r?.raw?._id||r?._id||id; await api.patch(`/cms/reviews/${rid}/status`,{ status:"published" }); setReviews(prev=>prev.map(x=>x.id===id?{...x,status:"approved"}:x)); toast?.("Review approved (live)"); }catch{ setReviews(prev => prev.map(r => r.id === id ? { ...r, status: "approved" } : r)); toast?.("Review approved (local)"); }
  };
  const reject = async (id) => {
    try{ const r=reviews.find(x=>x.id===id); const rid=r?.raw?._id||r?._id||id; await api.patch(`/cms/reviews/${rid}/status`,{ status:"flagged" }); setReviews(prev=>prev.map(x=>x.id===id?{...x,status:"rejected"}:x)); toast?.("Review rejected (live)"); }catch{ setReviews(prev => prev.map(r => r.id === id ? { ...r, status: "rejected" } : r)); toast?.("Review rejected (local)"); }
  };
  const deleteReview = async (r) => { const rid=r?.raw?._id||r?._id||r.id; try{ await api.delete(`/cms/reviews/${rid}`); setReviews(prev=>prev.filter(x=>x.id!==r.id)); toast?.("Review deleted (live)"); }catch{ setReviews(prev=>prev.filter(x=>x.id!==r.id)); toast?.("Review deleted (local)"); } };

  const toggleSelect = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(selected.length === paginated.length ? [] : paginated.map(r => r.id));

  const pending = reviews.filter(r => r.status === "pending").length;
  const approved = reviews.filter(r => r.status === "approved" || r.status === "published").length;
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + (Number(r.rating)||0), 0) / reviews.length).toFixed(1) : "0.0";

  return (
    <>
      <SectionTitle>Reviews Manager</SectionTitle>

      <KpiRow items={[
        { label: "Total Reviews",  value: reviews.length, icon: Star,         color: "var(--accent-gold, #F59E0B)", sub: "All time" },
        { label: "Pending",        value: pending,         icon: Star,         color: "var(--accent-amber)",         sub: "Awaiting moderation" },
        { label: "Approved",       value: approved,        icon: CheckCircle,  color: "var(--accent-sage)",          sub: "Live on site" },
        { label: "Avg Rating",     value: `${avgRating}★`, icon: Star,         color: "var(--accent-gold, #F59E0B)", sub: "Overall average" },
      ]} />

      <div style={st.card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search book or user…" />
            {["all", "pending", "approved", "rejected"].map(s => (
              <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
                style={{ padding: "3px 10px", borderRadius: 20, fontSize: "0.68rem", fontWeight: 500, cursor: "pointer", border: `1px solid ${statusFilter === s ? "var(--accent-sage)" : "var(--border)"}`, background: statusFilter === s ? "var(--accent-sage-bg)" : "none", color: statusFilter === s ? "var(--accent-sage-text)" : "var(--text-muted)" }}>
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          {selected.length > 0 && (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{selected.length} selected</span>
              <ActionBtn onClick={() => { selected.forEach(id => approve(id)); setSelected([]); }}>Approve All</ActionBtn>
              <ActionBtn variant="danger" onClick={() => { setReviews(p => p.filter(r => !selected.includes(r.id))); setSelected([]); toast?.("Deleted"); }}>Delete</ActionBtn>
            </div>
          )}
        </div>

        {loading ? <div style={{ textAlign:"center", padding:"40px 0", color:"var(--text-muted)", fontSize:"0.82rem" }}>Loading reviews…</div> : paginated.length === 0 ? <EmptyState icon={Star} title="No reviews found" desc={reviews.length===0 ? "No reviews in database." : "Try a different filter."} /> : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ ...st.th, width: 32 }}><Checkbox checked={selected.length === paginated.length && paginated.length > 0} onChange={toggleAll} /></th>
                {["Review", "Book", "User", "Rating", "Date", "Status", "Actions"].map(h => <th key={h} style={st.th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {paginated.map(r => (
                <tr key={r.id} style={{ background: selected.includes(r.id) ? "var(--accent-sage-bg)" : "transparent" }}>
                  <td style={st.td}><Checkbox checked={selected.includes(r.id)} onChange={() => toggleSelect(r.id)} /></td>
                  <td style={{ ...st.td, maxWidth: 200 }}>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.text}</p>
                  </td>
                  <td style={{ ...st.td, fontStyle: "italic", color: "var(--text-primary)", fontWeight: 500, whiteSpace: "nowrap" }}>{r.book}</td>
                  <td style={{ ...st.td, whiteSpace: "nowrap" }}>{r.user}</td>
                  <td style={st.td}><Stars n={r.rating} /></td>
                  <td style={{ ...st.td, fontSize: "0.72rem", color: "var(--text-faint)", whiteSpace: "nowrap" }}>{r.date}</td>
                  <td style={st.td}><StatusBadge status={r.status} /></td>
                  <td style={st.td}>
                    <div style={{ display: "flex", gap: 5 }}>
                      <ActionBtn onClick={() => setDrawer(r)}><Eye size={11} /></ActionBtn>
                      {r.status !== "approved" && <ActionBtn onClick={() => approve(r.id)}><CheckCircle size={11} /></ActionBtn>}
                      {r.status !== "rejected" && <ActionBtn onClick={() => reject(r.id)}><XCircle size={11} /></ActionBtn>}
                      <ActionBtn variant="danger" onClick={() => setConfirm(r)}><Trash2 size={11} /></ActionBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
      </div>

      <Drawer open={!!drawer} onClose={() => setDrawer(null)} title="Review Details">
        {drawer && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Stars n={drawer.rating} />
              <StatusBadge status={drawer.status} />
            </div>
            <div style={{ background: "var(--bg-page)", border: "1px solid var(--border)", borderRadius: 8, padding: 16, marginBottom: 16, fontSize: "0.88rem", color: "var(--text-primary)", lineHeight: 1.6 }}>
              "{drawer.text}"
            </div>
            {[["Book", drawer.book], ["User", drawer.user], ["Date", drawer.date], ["Rating", `${drawer.rating} / 5`]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border-light)" }}>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 500 }}>{k}</span>
                <span style={{ fontSize: "0.82rem", color: "var(--text-primary)" }}>{v}</span>
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              {drawer.status !== "approved" && <ActionBtn variant="primary" onClick={() => { approve(drawer.id); setDrawer(null); }}>Approve</ActionBtn>}
              {drawer.status !== "rejected" && <ActionBtn onClick={() => { reject(drawer.id); setDrawer(null); }}>Reject</ActionBtn>}
              <ActionBtn variant="danger" onClick={() => { setDrawer(null); setConfirm(drawer); }}>Delete</ActionBtn>
            </div>
          </div>
        )}
      </Drawer>

      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => deleteReview(confirm)}
        title="Delete Review" message={`Delete this review by "${confirm?.user}"? This cannot be undone.`} />
    </>
  );
}
