import React, { useEffect, useState, useMemo } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Library, PlusCircle, Edit3, Trash2, Search,
  BookOpen, Star, Tag, LayoutGrid, List, Filter,
} from "lucide-react";
import Loader from "../common/Loader/Loader";
import { fetchAllBooks } from "../../services/book.service";

const BOOK_ACTIONS = [
  { name: "Add Book", path: "/admin/books/add-book", icon: PlusCircle, accent: "var(--accent-sage)" },
  { name: "Edit Books", path: "/admin/books/edit-books", icon: Edit3, accent: "var(--accent-info)" },
  { name: "Delete Books", path: "/admin/books/delete-book", icon: Trash2, accent: "var(--accent-danger)" },
];

const TABS = ["All", "Top Rated", "Recent"];

function BookCard({ book, view }) {
  if (view === "list") {
    return (
      <div
        style={{ display: "grid", gridTemplateColumns: "44px 1fr 100px 80px 80px 80px", alignItems: "center", gap: 12, padding: "10px 16px", borderBottom: "1px solid var(--border-light)", transition: "background 0.12s" }}
        onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-surface-hover)"}
        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
      >
        <div style={{ width: 36, height: 48, borderRadius: 4, background: "var(--bg-surface)", border: "1px solid var(--border-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
          {book.image ? <img src={book.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <BookOpen size={14} style={{ color: "var(--text-faint)" }} />}
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.83rem", fontWeight: 500, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{book.title}</p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{book.author}</p>
        </div>
        <span style={{ fontSize: "0.72rem", padding: "2px 8px", borderRadius: 3, background: "var(--accent-sage-bg)", color: "var(--accent-sage-text)", border: "1px solid var(--accent-sage-ring)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{book.genre || "—"}</span>
        <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--accent-sage)", fontFamily: "var(--font-heading)" }}>₹{book.price}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Star size={10} style={{ color: "var(--accent-gold)", fill: "var(--accent-gold)" }} />
          <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "var(--accent-gold-dark)" }}>{book.ratings || "—"}</span>
        </div>
        <span style={{ fontSize: "0.68rem", color: "var(--text-faint)" }}>{book.createdAt ? new Date(book.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}</span>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", transition: "border-color 0.15s, box-shadow 0.15s, transform 0.15s" }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-medium)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.07)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ height: 120, background: "var(--bg-surface)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        {book.image ? (
          <img src={book.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <BookOpen size={28} style={{ color: "var(--text-faint)" }} />
        )}
        {book.ratings && (
          <div style={{ position: "absolute", top: 8, right: 8, display: "flex", alignItems: "center", gap: 3, padding: "2px 7px", borderRadius: 20, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}>
            <Star size={9} style={{ color: "#FFD166", fill: "#FFD166" }} />
            <span style={{ fontSize: "0.65rem", fontWeight: 600, color: "#fff" }}>{book.ratings}</span>
          </div>
        )}
      </div>
      <div style={{ padding: "12px 14px" }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.83rem", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 2 }}>{book.title}</p>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 8 }}>{book.author}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.68rem", padding: "2px 6px", borderRadius: 3, background: "var(--accent-sage-bg)", color: "var(--accent-sage-text)", border: "1px solid var(--accent-sage-ring)" }}>{book.genre || "—"}</span>
          <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--accent-sage)", fontFamily: "var(--font-heading)" }}>₹{book.price}</span>
        </div>
      </div>
    </div>
  );
}

const AdminBooks = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isBase = location.pathname === "/admin/books";
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [view, setView] = useState("grid");
  const isLoggedIn = useSelector((s) => s.auth.isLoggedIn);
  const role = useSelector((s) => s.auth.user?.role);

  useEffect(() => {
    if (isBase) {
      fetchAllBooks().then(setBooks).catch(() => setBooks([])).finally(() => setLoading(false));
    }
  }, [isBase]);

  const filtered = useMemo(() => {
    let list = books;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((b) => b.title?.toLowerCase().includes(q) || b.author?.toLowerCase().includes(q) || b.genre?.toLowerCase().includes(q));
    }
    if (activeTab === "Top Rated") list = [...list].sort((a, b) => (b.ratings || 0) - (a.ratings || 0)).slice(0, 20);
    if (activeTab === "Recent") list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 20);
    return list;
  }, [books, search, activeTab]);

  if (!isLoggedIn || role !== "admin") return null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)", padding: "28px 28px 60px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Catalog</h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 3 }}>Manage your book collection</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {BOOK_ACTIONS.map((action) => {
              const Icon = action.icon;
              const isActive = location.pathname === action.path;
              return (
                <button
                  key={action.path}
                  onClick={() => navigate(action.path)}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 7, border: `1px solid ${isActive ? action.accent : "var(--border)"}`, background: isActive ? `${action.accent}12` : "var(--bg-card)", cursor: "pointer", transition: "all 0.15s" }}
                  onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.borderColor = action.accent; e.currentTarget.style.background = `${action.accent}08`; } }}
                  onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg-card)"; } }}
                >
                  <Icon size={13} style={{ color: action.accent }} />
                  <span style={{ fontSize: "0.78rem", fontWeight: 500, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>{action.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Outlet for sub-pages */}
        {!isBase ? (
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", padding: 24 }}>
            <Outlet />
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              {/* Tabs */}
              <div style={{ display: "flex", gap: 2, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, padding: 3 }}>
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{ padding: "5px 12px", borderRadius: 6, border: activeTab === tab ? "1px solid var(--border)" : "1px solid transparent", background: activeTab === tab ? "var(--bg-page)" : "transparent", cursor: "pointer", fontSize: "0.78rem", fontWeight: activeTab === tab ? 600 : 400, color: activeTab === tab ? "var(--text-primary)" : "var(--text-secondary)", boxShadow: activeTab === tab ? "0 1px 3px rgba(0,0,0,0.05)" : "none", transition: "all 0.12s" }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div style={{ position: "relative", flex: 1, maxWidth: 280 }}>
                <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  type="text" placeholder="Search title, author, genre..." value={search} onChange={(e) => setSearch(e.target.value)}
                  style={{ width: "100%", padding: "7px 10px 7px 32px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 7, fontSize: "0.78rem", color: "var(--text-primary)", fontFamily: "var(--font-body)", outline: "none", boxSizing: "border-box" }}
                  onFocus={(e) => { e.target.style.borderColor = "var(--accent-sage)"; e.target.style.boxShadow = "0 0 0 2px var(--accent-sage-ring)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
                />
              </div>

              <span style={{ fontSize: "0.72rem", color: "var(--text-faint)", marginLeft: "auto", fontFamily: "var(--font-body)" }}>{filtered.length} titles</span>

              {/* View toggle */}
              <div style={{ display: "flex", gap: 2, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 7, padding: 2 }}>
                {[{ v: "grid", Icon: LayoutGrid }, { v: "list", Icon: List }].map(({ v, Icon }) => (
                  <button key={v} onClick={() => setView(v)}
                    style={{ width: 28, height: 28, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", background: view === v ? "var(--bg-page)" : "transparent", border: view === v ? "1px solid var(--border)" : "1px solid transparent", cursor: "pointer", transition: "all 0.12s" }}>
                    <Icon size={13} style={{ color: view === v ? "var(--text-primary)" : "var(--text-muted)" }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Book list */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
              {loading ? (
                <div style={{ padding: 48, display: "flex", justifyContent: "center" }}><Loader /></div>
              ) : filtered.length === 0 ? (
                <div style={{ padding: 48, textAlign: "center" }}>
                  <Library size={28} style={{ color: "var(--border-medium)", margin: "0 auto 12px" }} />
                  <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>No books found</p>
                </div>
              ) : view === "grid" ? (
                <div style={{ padding: 16, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 12 }}>
                  {filtered.map((book) => <BookCard key={book._id} book={book} view="grid" />)}
                </div>
              ) : (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "44px 1fr 100px 80px 80px 80px", alignItems: "center", gap: 12, padding: "8px 16px", background: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }}>
                    {["", "Title / Author", "Genre", "Price", "Rating", "Added"].map((h, i) => (
                      <span key={i} style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</span>
                    ))}
                  </div>
                  {filtered.map((book) => <BookCard key={book._id} book={book} view="list" />)}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminBooks;
