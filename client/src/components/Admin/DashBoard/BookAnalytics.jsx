import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Star, ShoppingBag, Clock, TrendingUp, PlusCircle } from "lucide-react";
import Loader from "../../common/Loader/Loader";
import api from "../../../services/axios";
import { useNavigate } from "react-router-dom";

function KPICard({ icon: Icon, label, value, accent }) {
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 18px", display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 36, height: 36, borderRadius: 9, background: `${accent}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={15} style={{ color: accent }} />
      </div>
      <div>
        <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1 }}>{value ?? "—"}</p>
        <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 3 }}>{label}</p>
      </div>
    </div>
  );
}

function ListCard({ title, icon: Icon, accent, children, empty }) {
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
      <div style={{ padding: "13px 16px", borderBottom: "1px solid var(--border-light)", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 24, height: 24, borderRadius: 6, background: `${accent}14`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={11} style={{ color: accent }} />
        </div>
        <span style={{ fontFamily: "var(--font-body)", fontSize: "0.83rem", fontWeight: 600, color: "var(--text-primary)" }}>{title}</span>
      </div>
      {empty ? (
        <div style={{ padding: "28px 16px", textAlign: "center" }}>
          <p style={{ fontSize: "0.78rem", color: "var(--text-faint)" }}>No data yet</p>
        </div>
      ) : (
        <div>{children}</div>
      )}
    </div>
  );
}

export default function BookAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/book-analytics")
      .then((r) => setAnalytics(r.data))
      .catch(() => setError("Failed to load book analytics."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: "48px", display: "flex", justifyContent: "center" }}><Loader /></div>;

  if (error) return (
    <div style={{ padding: "48px 20px", textAlign: "center" }}>
      <BookOpen size={28} style={{ color: "var(--border-medium)", margin: "0 auto 12px" }} />
      <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>Failed to load analytics</p>
      <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{error}</p>
    </div>
  );

  if (!analytics || analytics.totalBooks === 0) return (
    <div style={{ padding: "56px 20px", textAlign: "center" }}>
      <div style={{ width: 56, height: 56, borderRadius: 14, background: "var(--accent-sage-bg)", border: "1px solid var(--accent-sage-ring)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
        <BookOpen size={24} style={{ color: "var(--accent-sage)" }} />
      </div>
      <p style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>No books in catalog yet</p>
      <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: 18 }}>Add your first book to start seeing analytics here.</p>
      <button
        onClick={() => navigate("/admin/books/add-book")}
        style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: 8, background: "var(--accent-sage)", border: "none", color: "#fff", fontSize: "0.83rem", fontWeight: 600, cursor: "pointer" }}
        onMouseEnter={(e) => e.currentTarget.style.background = "var(--accent-sage-dark)"}
        onMouseLeave={(e) => e.currentTarget.style.background = "var(--accent-sage)"}
      >
        <PlusCircle size={13} /> Add First Book
      </button>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        <KPICard icon={BookOpen} label="Total Books" value={analytics.totalBooks} accent="var(--accent-sage)" />
        <KPICard icon={Star} label="Top Rated" value={analytics.topRatedBooks?.length || 0} accent="var(--accent-gold)" />
        <KPICard icon={ShoppingBag} label="Most Purchased" value={analytics.mostPurchasedBooks?.length || 0} accent="var(--accent-amber)" />
        <KPICard icon={Clock} label="Recent Adds" value={analytics.recentBooks?.length || 0} accent="var(--accent-info)" />
      </div>

      {/* Lists */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <ListCard title="Top Rated" icon={Star} accent="var(--accent-gold)" empty={!analytics.topRatedBooks?.length}>
          {analytics.topRatedBooks?.map((book, i) => (
            <div key={book._id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", borderBottom: "1px solid var(--border-light)" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-surface-hover)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--text-faint)", width: 14, flexShrink: 0 }}>{i + 1}</span>
              <div style={{ width: 28, height: 36, borderRadius: 3, background: "var(--bg-surface)", border: "1px solid var(--border-light)", flexShrink: 0, overflow: "hidden" }}>
                {book.image ? <img src={book.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}
              </div>
              <p style={{ flex: 1, fontSize: "0.78rem", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>{book.title}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
                <Star size={10} style={{ color: "var(--accent-gold)", fill: "var(--accent-gold)" }} />
                <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--accent-gold-dark)" }}>{book.ratings}</span>
              </div>
            </div>
          ))}
        </ListCard>

        <ListCard title="Most Purchased" icon={ShoppingBag} accent="var(--accent-amber)" empty={!analytics.mostPurchasedBooks?.length}>
          {analytics.mostPurchasedBooks?.map((book, i) => (
            <div key={book._id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", borderBottom: "1px solid var(--border-light)" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-surface-hover)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--text-faint)", width: 14, flexShrink: 0 }}>{i + 1}</span>
              <div style={{ width: 28, height: 36, borderRadius: 3, background: "var(--bg-surface)", border: "1px solid var(--border-light)", flexShrink: 0, overflow: "hidden" }}>
                {book.image ? <img src={book.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}
              </div>
              <p style={{ flex: 1, fontSize: "0.78rem", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>{book.title}</p>
              <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--accent-amber-dark)", flexShrink: 0, background: "var(--accent-amber-bg)", padding: "1px 7px", borderRadius: 20, border: "1px solid rgba(139,111,71,0.18)" }}>{book.purchases ?? 0} sold</span>
            </div>
          ))}
        </ListCard>
      </div>

      {/* Recently added */}
      {analytics.recentBooks?.length > 0 && (
        <ListCard title="Recently Added" icon={Clock} accent="var(--accent-info)" empty={false}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
            {analytics.recentBooks.map((book) => (
              <div key={book._id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", borderBottom: "1px solid var(--border-light)" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-surface-hover)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <div style={{ width: 28, height: 36, borderRadius: 3, background: "var(--bg-surface)", border: "1px solid var(--border-light)", flexShrink: 0, overflow: "hidden" }}>
                  {book.image ? <img src={book.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{book.title}</p>
                  <p style={{ fontSize: "0.65rem", color: "var(--text-faint)" }}>{new Date(book.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                </div>
              </div>
            ))}
          </div>
        </ListCard>
      )}
    </motion.div>
  );
}
