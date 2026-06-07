import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Sparkles, BookOpen, TrendingUp, Grid3x3 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import BookCard from "../Card/BookCard";
import Loader from "../../common/Loader/Loader";
import CustomAlert from "../../common/Alert/CustomAlert";
import api from "../../../services/axios";

const GENRES = [
  "Fiction", "Science", "History", "Romance", "Mystery", "Biography",
  "Fantasy", "Thriller", "Self-Help", "Poetry", "Philosophy", "Travel",
  "Children", "Drama", "Business", "Cooking", "Art", "Technology",
  "Psychology", "Politics",
];

const TRENDING = ["Fiction", "Mystery", "Self-Help", "Romance"];

const COLLECTIONS = [
  { name: "Weekend Reads", genres: ["Fiction", "Thriller", "Mystery"], desc: "Gripping stories for a Saturday afternoon" },
  { name: "Mind Expanding", genres: ["Science", "Philosophy", "Psychology"], desc: "Books that rewire how you think" },
  { name: "Personal Growth", genres: ["Self-Help", "Biography", "Business"], desc: "Invest in yourself, one page at a time" },
  { name: "Escape & Wander", genres: ["Fantasy", "Travel", "Romance"], desc: "Let the world fall away" },
];

const GENRE_META = {
  Fiction:     { icon: "✦", color: "var(--accent-sage-bg)", accent: "var(--accent-sage)" },
  Science:     { icon: "◎", color: "var(--accent-amber-bg)", accent: "var(--accent-amber)" },
  History:     { icon: "◈", color: "rgba(90,122,138,0.08)", accent: "var(--accent-info)" },
  Romance:     { icon: "❧", color: "var(--accent-danger-bg)", accent: "var(--accent-danger)" },
  Mystery:     { icon: "◉", color: "rgba(92,74,110,0.08)", accent: "#7A5A8A" },
  Biography:   { icon: "◇", color: "var(--accent-amber-bg)", accent: "var(--accent-amber)" },
  Fantasy:     { icon: "✧", color: "rgba(80,100,140,0.08)", accent: "#5064A0" },
  Thriller:    { icon: "▲", color: "rgba(60,60,60,0.06)", accent: "#4A4A4A" },
  "Self-Help": { icon: "❂", color: "var(--accent-gold-bg)", accent: "var(--accent-gold)" },
  Poetry:      { icon: "∿", color: "var(--accent-sage-bg)", accent: "var(--accent-sage)" },
  Philosophy:  { icon: "∞", color: "rgba(90,122,138,0.08)", accent: "var(--accent-info)" },
  Travel:      { icon: "⊕", color: "var(--accent-gold-bg)", accent: "var(--accent-gold)" },
  Children:    { icon: "☆", color: "rgba(198,150,58,0.08)", accent: "var(--accent-gold)" },
  Drama:       { icon: "⊙", color: "var(--accent-danger-bg)", accent: "var(--accent-danger)" },
  Business:    { icon: "◆", color: "var(--accent-amber-bg)", accent: "var(--accent-amber)" },
  Cooking:     { icon: "⊗", color: "rgba(198,150,58,0.1)", accent: "var(--accent-gold)" },
  Art:         { icon: "❀", color: "var(--accent-sage-bg)", accent: "var(--accent-sage)" },
  Technology:  { icon: "⊞", color: "rgba(90,122,138,0.08)", accent: "var(--accent-info)" },
  Psychology:  { icon: "⊿", color: "rgba(92,74,110,0.08)", accent: "#7A5A8A" },
  Politics:    { icon: "⬡", color: "rgba(60,60,60,0.06)", accent: "#4A4A4A" },
};

const Filter = () => {
  const [searchParams] = useSearchParams();
  const [selected, setSelected] = useState([]);
  const [books, setBooks]         = useState(null);
  const [loading, setLoading]     = useState(false);
  const [view, setView]           = useState("browse"); // browse | results
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const g = searchParams.get("genre");
    if (g) {
      setSelected([g]);
      fetchGenre([g]);
    }
  }, []);

  const toggle = (name) =>
    setSelected((prev) => prev.includes(name) ? prev.filter((g) => g !== name) : [...prev, name]);

  const fetchGenre = async (genres = selected) => {
    if (!genres.length) {
      setAlertMessage("Select at least one genre.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2500);
      return;
    }
    setLoading(true);
    setView("results");
    try {
      const res = await api.get(`/get-books-by-genre?genres=${encodeURIComponent(genres.join(","))}`);
      setBooks(res.data?.data ?? []);
    } catch (err) {
      setBooks([]);
      setAlertMessage(err.response?.data?.message || "Error fetching books.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2500);
    } finally {
      setLoading(false);
    }
  };

  const loadCollection = (coll) => {
    setSelected(coll.genres);
    fetchGenre(coll.genres);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)" }}>

      {/* ── HERO BANNER ── */}
      <section style={{
        background: "var(--bg-dark)",
        padding: "72px 0 56px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `radial-gradient(circle at 15% 50%, rgba(92,122,94,0.18) 0%, transparent 55%), radial-gradient(circle at 85% 30%, rgba(139,111,71,0.12) 0%, transparent 55%)`,
        }} />
        <div className="max-w-6xl mx-auto px-6 sm:px-8" style={{ position: "relative" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="overline" style={{ color: "var(--accent-sage-mid)", marginBottom: "var(--space-4)" }}>Discover</p>
            <h1 style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 600,
              color: "var(--text-inverse)",
              lineHeight: "var(--leading-tight)",
              marginBottom: "var(--space-4)",
            }}>
              Explore by Genre
            </h1>
            <p style={{ fontSize: "var(--text-base)", color: "var(--text-faint)", maxWidth: "480px", lineHeight: "var(--leading-relaxed)" }}>
              Every great reader has a genre they return to. Find yours — or discover a new obsession.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-12">

        {/* ── TRENDING ── */}
        <div style={{ marginBottom: "var(--space-12)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-5)" }}>
            <TrendingUp size={14} style={{ color: "var(--accent-amber)" }} />
            <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, letterSpacing: "var(--tracking-wider)", textTransform: "uppercase", color: "var(--text-muted)" }}>Trending now</span>
          </div>
          <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            {TRENDING.map((g) => {
              const meta = GENRE_META[g] || {};
              return (
                <button
                  key={g}
                  onClick={() => { setSelected([g]); fetchGenre([g]); }}
                  style={{
                    padding: "var(--space-2) var(--space-4)",
                    borderRadius: "var(--radius-full)",
                    border: `1px solid var(--border)`,
                    background: "var(--bg-card)",
                    color: "var(--text-primary)",
                    fontSize: "var(--text-sm)",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "var(--transition)",
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = meta.accent || "var(--accent-sage)"; e.currentTarget.style.background = meta.color || "var(--accent-sage-bg)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg-card)"; }}
                >
                  <span style={{ opacity: 0.6 }}>{meta.icon}</span>
                  {g}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── EDITORIAL COLLECTIONS ── */}
        <div style={{ marginBottom: "var(--space-12)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-5)" }}>
            <Sparkles size={14} style={{ color: "var(--accent-amber)" }} />
            <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, letterSpacing: "var(--tracking-wider)", textTransform: "uppercase", color: "var(--text-muted)" }}>Curated collections</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {COLLECTIONS.map((coll, i) => (
              <motion.button
                key={coll.name}
                onClick={() => loadCollection(coll)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                style={{
                  padding: "var(--space-5)",
                  background: "var(--bg-card)",
                  border: `1px solid var(--border)`,
                  borderRadius: "var(--radius-md)",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "var(--transition)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent-sage)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--shadow-card)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <p style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-base)", fontWeight: 600, color: "var(--text-primary)", marginBottom: "var(--space-2)" }}>{coll.name}</p>
                <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", lineHeight: "var(--leading-normal)", marginBottom: "var(--space-3)" }}>{coll.desc}</p>
                <div style={{ display: "flex", gap: "var(--space-1)", flexWrap: "wrap" }}>
                  {coll.genres.map((g) => (
                    <span key={g} style={{ fontSize: "0.65rem", padding: "2px 8px", borderRadius: "var(--radius-full)", background: "var(--bg-surface)", color: "var(--text-muted)", border: `1px solid var(--border-light)` }}>{g}</span>
                  ))}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* ── ALL GENRES GRID ── */}
        <div style={{ marginBottom: "var(--space-8)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-5)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <Grid3x3 size={14} style={{ color: "var(--text-muted)" }} />
              <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, letterSpacing: "var(--tracking-wider)", textTransform: "uppercase", color: "var(--text-muted)" }}>All genres</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
              {selected.length > 0 && (
                <>
                  <span className="badge badge-sage">{selected.length} selected</span>
                  <button onClick={() => { setSelected([]); setBooks(null); setView("browse"); }}
                    style={{ color: "var(--text-muted)", cursor: "pointer", background: "none", border: "none", padding: 0 }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent-danger)"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                  >
                    <X size={14} />
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {GENRES.map((g) => {
              const active = selected.includes(g);
              const meta = GENRE_META[g] || {};
              return (
                <button
                  key={g}
                  onClick={() => toggle(g)}
                  style={{
                    padding: "var(--space-4) var(--space-3)",
                    borderRadius: "var(--radius-sm)",
                    border: `1px solid ${active ? (meta.accent || "var(--accent-sage)") : "var(--border)"}`,
                    background: active ? (meta.color || "var(--accent-sage-bg)") : "var(--bg-card)",
                    cursor: "pointer",
                    transition: "var(--transition)",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => { if (!active) { e.currentTarget.style.borderColor = meta.accent || "var(--accent-sage)"; e.currentTarget.style.background = meta.color || "var(--accent-sage-bg)"; } }}
                  onMouseLeave={(e) => { if (!active) { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg-card)"; } }}
                >
                  <p style={{ fontSize: "1rem", marginBottom: "var(--space-1)", opacity: active ? 0.8 : 0.4 }}>{meta.icon || "◦"}</p>
                  <p style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: active ? (meta.accent || "var(--accent-sage-dark)") : "var(--text-primary)" }}>{g}</p>
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "var(--space-5)" }}>
            <button
              onClick={() => fetchGenre()}
              disabled={loading || !selected.length}
              className="btn"
              style={{
                background: selected.length ? "var(--accent-sage)" : "var(--bg-surface)",
                color: selected.length ? "#fff" : "var(--text-muted)",
                border: `1px solid ${selected.length ? "var(--accent-sage)" : "var(--border)"}`,
                cursor: selected.length ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
              }}
            >
              <Search size={13} />
              {loading ? "Searching..." : `Find Books${selected.length ? ` in ${selected.length} genre${selected.length > 1 ? "s" : ""}` : ""}`}
            </button>
          </div>
        </div>

        {/* ── RESULTS ── */}
        {loading && (
          <div style={{ display: "flex", justifyContent: "center", padding: "var(--space-16) 0" }}>
            <Loader />
          </div>
        )}

        <AnimatePresence>
          {!loading && books && books.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-6)", paddingTop: "var(--space-6)", borderTop: `1px solid var(--border-light)` }}>
                <BookOpen size={14} style={{ color: "var(--text-muted)" }} />
                <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}><strong style={{ color: "var(--text-primary)" }}>{books.length}</strong> books found</span>
                <div style={{ flex: 1, height: "1px", background: "var(--border-light)" }} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {books.map((b) => <BookCard key={b._id} data={b} />)}
              </div>
            </motion.div>
          )}
          {!loading && books && books.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="empty-state">
              <BookOpen size={36} style={{ color: "var(--border-medium)" }} />
              <h2>No books found</h2>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", maxWidth: "260px" }}>Try different genre combinations or explore our collections above.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showAlert && <CustomAlert message={alertMessage} onClose={() => setShowAlert(false)} />}
    </div>
  );
};

export default Filter;
