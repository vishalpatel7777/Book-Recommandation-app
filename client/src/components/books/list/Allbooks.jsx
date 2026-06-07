import React, { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, Search, X, SlidersHorizontal, Grid3x3, List,
  ChevronDown, Star, ArrowUpDown,
} from "lucide-react";
import BookCard from "../Card/BookCard";
import { fetchAllBooks } from "../../../services/book.service";

const PRICE_RANGES = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under ₹200", min: 0, max: 200 },
  { label: "₹200 – ₹500", min: 200, max: 500 },
  { label: "₹500 – ₹1000", min: 500, max: 1000 },
  { label: "Above ₹1000", min: 1000, max: Infinity },
];

const SORT_OPTIONS = [
  { value: "newest",   label: "Newest First" },
  { value: "oldest",   label: "Oldest First" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "rating",  label: "Highest Rated" },
  { value: "title",   label: "A → Z" },
];

const RATING_OPTIONS = [
  { label: "All ratings", value: 0 },
  { label: "4+ stars", value: 4 },
  { label: "3+ stars", value: 3 },
];

const PER_PAGE = 20;

const SkeletonCard = () => (
  <div className="card-book overflow-hidden">
    <div className="skeleton" style={{ height: 232 }} />
    <div style={{ padding: "var(--space-3) var(--space-4)", borderTop: `1px solid var(--border-light)`, display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <div className="skeleton h-3 rounded w-4/5" />
      <div className="skeleton h-3 rounded w-3/5" />
    </div>
  </div>
);

const SkeletonRow = () => (
  <div style={{ display: "flex", gap: "var(--space-4)", padding: "var(--space-4)", background: "var(--bg-card)", border: `1px solid var(--border)`, borderRadius: "var(--radius-sm)" }}>
    <div className="skeleton" style={{ width: 64, height: 88, borderRadius: "var(--radius-xs)", flexShrink: 0 }} />
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <div className="skeleton h-3 rounded w-2/3" />
      <div className="skeleton h-3 rounded w-1/3" />
      <div className="skeleton h-3 rounded w-1/4" />
    </div>
  </div>
);

function BookListRow({ data }) {
  const [imgErr, setImgErr] = useState(false);
  const navigate = useNavigate();
  const rating = Number(data.ratings) || 0;
  const stars = Math.round(rating);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", gap: "var(--space-4)", padding: "var(--space-4)", background: "var(--bg-card)", border: `1px solid var(--border)`, borderRadius: "var(--radius-sm)", cursor: "pointer", transition: "var(--transition)" }}
      onClick={() => navigate(`/view-book-details/${data._id}`)}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent-sage)"; e.currentTarget.style.boxShadow = "var(--shadow-card)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ width: 64, height: 88, borderRadius: "var(--radius-xs)", overflow: "hidden", background: "var(--bg-surface)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {!imgErr ? (
          <img src={data.image} alt={data.title} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 4 }} onError={() => setImgErr(true)} loading="lazy" />
        ) : (
          <BookOpen size={20} style={{ color: "var(--border-medium)" }} />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--space-4)" }}>
          <div>
            {data.genre && (
              <span style={{ fontSize: "0.65rem", padding: "2px 8px", borderRadius: "var(--radius-full)", background: "var(--accent-sage-bg)", color: "var(--accent-sage-text)", fontWeight: 500, display: "inline-block", marginBottom: "var(--space-1)" }}>{data.genre}</span>
            )}
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-base)", fontWeight: 600, color: "var(--text-primary)", lineHeight: "var(--leading-snug)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 340 }}>{data.title}</h3>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", marginTop: 2 }}>{data.author}</p>
          </div>
          <span style={{ fontSize: "var(--text-lg)", fontWeight: 700, color: "var(--accent-sage)", flexShrink: 0 }}>₹{data.price}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1)", marginTop: "var(--space-2)" }}>
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} size={11}
              fill={s <= stars ? "var(--accent-gold)" : "none"}
              stroke={s <= stars ? "var(--accent-gold)" : "var(--border-medium)"}
              strokeWidth={1.5}
            />
          ))}
          {rating > 0 && <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginLeft: 4 }}>{rating.toFixed(1)}</span>}
        </div>
      </div>
    </motion.div>
  );
}

const Allbooks = () => {
  const [books, setBooks] = useState(null);
  const [search, setSearch] = useState("");
  const [genres, setGenres] = useState([]);
  const [priceRange, setPriceRange] = useState(0);
  const [sortBy, setSortBy] = useState("newest");
  const [minRating, setMinRating] = useState(0);
  const [viewMode, setViewMode] = useState("grid");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchAllBooks().then(setBooks).catch(() => setBooks([]));
  }, []);

  // Derive available genres from actual book data
  const availableGenres = useMemo(() => {
    if (!books) return [];
    const g = [...new Set(books.map((b) => b.genre).filter(Boolean))].sort();
    return g;
  }, [books]);

  const toggleGenre = useCallback((g) => {
    setPage(1);
    setGenres((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]);
  }, []);

  const clearFilters = () => {
    setSearch(""); setGenres([]); setPriceRange(0);
    setSortBy("newest"); setMinRating(0); setPage(1);
  };

  const filtered = useMemo(() => {
    if (!books) return [];
    const pRange = PRICE_RANGES[priceRange];
    let result = books.filter((b) => {
      const q = search.toLowerCase();
      if (q && !b.title?.toLowerCase().includes(q) && !b.author?.toLowerCase().includes(q) && !b.genre?.toLowerCase().includes(q)) return false;
      if (genres.length && !genres.includes(b.genre)) return false;
      const price = Number(b.price) || 0;
      if (price < pRange.min || price > pRange.max) return false;
      if (minRating > 0 && (Number(b.ratings) || 0) < minRating) return false;
      return true;
    });

    switch (sortBy) {
      case "oldest": result = [...result].reverse(); break;
      case "price-asc": result = [...result].sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0)); break;
      case "price-desc": result = [...result].sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0)); break;
      case "rating": result = [...result].sort((a, b) => (Number(b.ratings) || 0) - (Number(a.ratings) || 0)); break;
      case "title": result = [...result].sort((a, b) => (a.title || "").localeCompare(b.title || "")); break;
      default: break;
    }
    return result;
  }, [books, search, genres, priceRange, sortBy, minRating]);

  const paginated = filtered.slice(0, page * PER_PAGE);
  const hasMore = paginated.length < filtered.length;
  const activeFilterCount = genres.length + (priceRange > 0 ? 1 : 0) + (minRating > 0 ? 1 : 0) + (search ? 1 : 0);

  return (
    <div style={{ background: "var(--bg-page)", minHeight: "100vh" }}>

      {/* ── PAGE HEADER ── */}
      <section className="page-header">
        <div className="page-container">
          <h1>All Books</h1>
          {books && (
            <p>{filtered.length} of {books.length} title{books.length !== 1 ? "s" : ""} in our collection</p>
          )}
        </div>
      </section>

      <div className="page-container" style={{ paddingTop: "var(--space-8)", paddingBottom: "var(--space-8)" }}>

        {/* ── TOOLBAR ── */}
        <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center", flexWrap: "wrap", marginBottom: "var(--space-6)" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 220px", minWidth: 180, maxWidth: 340 }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search title, author, genre…"
              style={{ width: "100%", paddingLeft: 36, paddingRight: search ? 32 : 12, paddingTop: "0.5rem", paddingBottom: "0.5rem", border: `1px solid var(--border-medium)`, borderRadius: "var(--radius-sm)", background: "var(--bg-card)", color: "var(--text-primary)", fontSize: "var(--text-sm)", fontFamily: "var(--font-body)", outline: "none", transition: "border-color 0.15s" }}
              onFocus={(e) => { e.target.style.borderColor = "var(--accent-sage)"; }}
              onBlur={(e) => { e.target.style.borderColor = "var(--border-medium)"; }}
            />
            {search && (
              <button onClick={() => { setSearch(""); setPage(1); }} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 2 }}>
                <X size={12} />
              </button>
            )}
          </div>

          {/* Sort */}
          <div style={{ position: "relative" }}>
            <ArrowUpDown size={12} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              style={{ paddingLeft: 28, paddingRight: 28, paddingTop: "0.5rem", paddingBottom: "0.5rem", border: `1px solid var(--border-medium)`, borderRadius: "var(--radius-sm)", background: "var(--bg-card)", color: "var(--text-primary)", fontSize: "var(--text-sm)", fontFamily: "var(--font-body)", outline: "none", appearance: "none", cursor: "pointer" }}
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={12} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
          </div>

          {/* Filters toggle */}
          <button
            onClick={() => setShowFilters((p) => !p)}
            style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", padding: "0.5rem 0.875rem", border: `1px solid ${showFilters ? "var(--accent-sage)" : "var(--border-medium)"}`, borderRadius: "var(--radius-sm)", background: showFilters ? "var(--accent-sage-bg)" : "var(--bg-card)", color: showFilters ? "var(--accent-sage-text)" : "var(--text-secondary)", fontSize: "var(--text-sm)", cursor: "pointer", transition: "all 0.15s", fontFamily: "var(--font-body)" }}
          >
            <SlidersHorizontal size={13} />
            Filters
            {activeFilterCount > 0 && (
              <span style={{ minWidth: 18, height: 18, borderRadius: 9, background: "var(--accent-sage)", color: "#fff", fontSize: "0.65rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", marginLeft: 2 }}>{activeFilterCount}</span>
            )}
          </button>

          {/* View toggle */}
          <div style={{ display: "flex", border: `1px solid var(--border)`, borderRadius: "var(--radius-sm)", overflow: "hidden", marginLeft: "auto" }}>
            {[["grid", Grid3x3], ["list", List]].map(([v, Icon]) => (
              <button key={v} onClick={() => setViewMode(v)} style={{ padding: "0.45rem 0.7rem", background: viewMode === v ? "var(--accent-sage-bg)" : "var(--bg-card)", color: viewMode === v ? "var(--accent-sage)" : "var(--text-muted)", border: "none", cursor: "pointer", borderRight: v === "grid" ? `1px solid var(--border)` : "none" }}>
                <Icon size={14} />
              </button>
            ))}
          </div>
        </div>

        {/* ── FILTER PANEL ── */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: "hidden", marginBottom: "var(--space-6)" }}
            >
              <div style={{ padding: "var(--space-5)", background: "var(--bg-card)", border: `1px solid var(--border)`, borderRadius: "var(--radius-md)", display: "flex", flexWrap: "wrap", gap: "var(--space-6)" }}>
                {/* Genres */}
                {availableGenres.length > 0 && (
                  <div>
                    <p style={{ fontSize: "var(--text-xs)", fontWeight: 600, letterSpacing: "var(--tracking-wider)", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "var(--space-3)" }}>Genre</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                      {availableGenres.map((g) => (
                        <button
                          key={g}
                          onClick={() => toggleGenre(g)}
                          style={{ padding: "3px 12px", borderRadius: "var(--radius-full)", border: `1px solid ${genres.includes(g) ? "var(--accent-sage)" : "var(--border)"}`, background: genres.includes(g) ? "var(--accent-sage-bg)" : "transparent", color: genres.includes(g) ? "var(--accent-sage-text)" : "var(--text-secondary)", fontSize: "var(--text-xs)", fontWeight: genres.includes(g) ? 600 : 400, cursor: "pointer", transition: "all 0.12s", fontFamily: "var(--font-body)" }}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price */}
                <div>
                  <p style={{ fontSize: "var(--text-xs)", fontWeight: 600, letterSpacing: "var(--tracking-wider)", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "var(--space-3)" }}>Price</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                    {PRICE_RANGES.map((r, i) => (
                      <button key={r.label} onClick={() => { setPriceRange(i); setPage(1); }}
                        style={{ padding: "3px 12px", borderRadius: "var(--radius-full)", border: `1px solid ${priceRange === i ? "var(--accent-amber)" : "var(--border)"}`, background: priceRange === i ? "var(--accent-amber-bg)" : "transparent", color: priceRange === i ? "var(--accent-amber)" : "var(--text-secondary)", fontSize: "var(--text-xs)", fontWeight: priceRange === i ? 600 : 400, cursor: "pointer", transition: "all 0.12s", fontFamily: "var(--font-body)" }}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <p style={{ fontSize: "var(--text-xs)", fontWeight: 600, letterSpacing: "var(--tracking-wider)", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "var(--space-3)" }}>Rating</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                    {RATING_OPTIONS.map((r) => (
                      <button key={r.value} onClick={() => { setMinRating(r.value); setPage(1); }}
                        style={{ padding: "3px 12px", borderRadius: "var(--radius-full)", border: `1px solid ${minRating === r.value ? "var(--accent-gold)" : "var(--border)"}`, background: minRating === r.value ? "var(--accent-gold-bg)" : "transparent", color: minRating === r.value ? "var(--accent-gold)" : "var(--text-secondary)", fontSize: "var(--text-xs)", fontWeight: minRating === r.value ? 600 : 400, cursor: "pointer", transition: "all 0.12s", fontFamily: "var(--font-body)" }}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {activeFilterCount > 0 && (
                  <div style={{ display: "flex", alignItems: "flex-end" }}>
                    <button onClick={clearFilters} style={{ display: "flex", alignItems: "center", gap: "var(--space-1)", fontSize: "var(--text-xs)", color: "var(--accent-danger)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-body)" }}>
                      <X size={11} /> Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── ACTIVE FILTER CHIPS ── */}
        {(genres.length > 0 || priceRange > 0 || minRating > 0) && (
          <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap", marginBottom: "var(--space-5)" }}>
            {genres.map((g) => (
              <span key={g} style={{ display: "flex", alignItems: "center", gap: "var(--space-1)", padding: "3px 10px 3px 12px", borderRadius: "var(--radius-full)", background: "var(--accent-sage-bg)", border: `1px solid var(--accent-sage-ring)`, color: "var(--accent-sage-text)", fontSize: "0.72rem", fontWeight: 500 }}>
                {g}
                <button onClick={() => toggleGenre(g)} style={{ background: "none", border: "none", cursor: "pointer", padding: 1, color: "var(--accent-sage)", display: "flex" }}><X size={10} /></button>
              </span>
            ))}
            {priceRange > 0 && (
              <span style={{ display: "flex", alignItems: "center", gap: "var(--space-1)", padding: "3px 10px 3px 12px", borderRadius: "var(--radius-full)", background: "var(--accent-amber-bg)", border: `1px solid rgba(139,111,71,0.2)`, color: "var(--accent-amber)", fontSize: "0.72rem", fontWeight: 500 }}>
                {PRICE_RANGES[priceRange].label}
                <button onClick={() => { setPriceRange(0); setPage(1); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 1, color: "var(--accent-amber)", display: "flex" }}><X size={10} /></button>
              </span>
            )}
            {minRating > 0 && (
              <span style={{ display: "flex", alignItems: "center", gap: "var(--space-1)", padding: "3px 10px 3px 12px", borderRadius: "var(--radius-full)", background: "var(--accent-gold-bg)", border: `1px solid rgba(198,150,58,0.2)`, color: "var(--accent-gold)", fontSize: "0.72rem", fontWeight: 500 }}>
                {RATING_OPTIONS.find((r) => r.value === minRating)?.label}
                <button onClick={() => { setMinRating(0); setPage(1); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 1, color: "var(--accent-gold)", display: "flex" }}><X size={10} /></button>
              </span>
            )}
          </div>
        )}

        {/* ── LOADING STATE ── */}
        {books === null && (
          viewMode === "grid"
            ? <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">{Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}</div>
            : <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>{Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}</div>
        )}

        {/* ── RESULTS ── */}
        <AnimatePresence mode="wait">
          {books !== null && filtered.length > 0 && (
            <motion.div key={viewMode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                  {paginated.map((b, i) => (
                    <motion.div key={b._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, delay: Math.min(i * 0.025, 0.35) }}>
                      <BookCard data={b} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  {paginated.map((b) => <BookListRow key={b._id} data={b} />)}
                </div>
              )}

              {hasMore && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "var(--space-10)" }}>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className="btn btn-secondary"
                    style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}
                  >
                    Load more · {filtered.length - paginated.length} remaining
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── EMPTY STATE ── */}
        {books !== null && filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <BookOpen size={24} style={{ color: "var(--text-muted)" }} />
            </div>
            <h2>{books.length === 0 ? "No books available" : "No results"}</h2>
            <p>
              {books.length === 0 ? "Check back soon — new titles are added regularly." : "Try adjusting your search or filters."}
            </p>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="btn btn-secondary" style={{ marginTop: "var(--space-2)" }}>Clear filters</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Allbooks;
