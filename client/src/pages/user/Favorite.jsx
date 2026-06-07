import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookHeart, BookOpen, ChevronRight, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import Loader from "../../components/common/Loader/Loader";
import FavoriteBookCard from "../../components/books/Card/FavoriteBookCard";
import api from "../../services/axios";

const Favorite = () => {
  const [favorite, setFavorite] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    api.get("/get-all-wishlist")
      .then((r) => setFavorite(r.data?.data ?? []))
      .catch(() => setFavorite([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ background: "var(--bg-page)" }}>
        <Loader />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)" }}>

      {/* ── SHELF HEADER ── */}
      <section style={{
        background: "var(--bg-dark)",
        padding: "64px 0 48px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `radial-gradient(circle at 20% 60%, rgba(184,84,80,0.12) 0%, transparent 50%), radial-gradient(circle at 80% 40%, rgba(92,122,94,0.10) 0%, transparent 50%)`,
        }} />
        <div className="max-w-6xl mx-auto px-6 sm:px-8" style={{ position: "relative" }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
              <BookHeart size={18} style={{ color: "var(--accent-danger)" }} />
              <p style={{ fontSize: "var(--text-xs)", fontWeight: 600, letterSpacing: "var(--tracking-widest)", textTransform: "uppercase", color: "var(--accent-danger)" }}>My Reading Shelf</p>
            </div>
            <h1 style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 600,
              color: "var(--text-inverse)",
              lineHeight: "var(--leading-tight)",
              marginBottom: "var(--space-3)",
            }}>
              Books I want to read
            </h1>
            <p style={{ fontSize: "var(--text-base)", color: "var(--text-faint)", maxWidth: "400px" }}>
              {favorite.length > 0
                ? `${favorite.length} book${favorite.length !== 1 ? "s" : ""} saved to your shelf`
                : "Your personal curation of books worth exploring"}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-12">
        {favorite.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            {/* Empty state */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "40vh",
              gap: "var(--space-6)",
              textAlign: "center",
            }}>
              <div style={{
                width: 80,
                height: 80,
                borderRadius: "var(--radius-full)",
                background: "var(--accent-sage-bg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <BookOpen size={32} style={{ color: "var(--accent-sage)" }} />
              </div>
              <div>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 600, color: "var(--text-primary)", marginBottom: "var(--space-3)" }}>
                  Your shelf is waiting
                </h2>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", maxWidth: "300px", lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-6)" }}>
                  Save books you want to read by tapping the heart on any book page. Build your reading intentions here.
                </p>
              </div>
              <div style={{ display: "flex", gap: "var(--space-3)" }}>
                <Link to="/category" style={{ textDecoration: "none" }}>
                  <button className="btn btn-primary flex items-center gap-2">
                    <Plus size={14} /> Discover books
                  </button>
                </Link>
                <Link to="/allbooks" style={{ textDecoration: "none" }}>
                  <button className="btn btn-secondary flex items-center gap-2">
                    Browse library <ChevronRight size={14} />
                  </button>
                </Link>
              </div>
            </div>

            {/* Reading intentions prompts */}
            <div style={{ marginTop: "var(--space-16)", paddingTop: "var(--space-12)", borderTop: `1px solid var(--border-light)` }}>
              <p style={{ fontSize: "var(--text-xs)", fontWeight: 600, letterSpacing: "var(--tracking-widest)", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "var(--space-6)", textAlign: "center" }}>
                Reading intentions
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label: "Want to Read", desc: "Books on your radar", count: 0 },
                  { label: "Currently Reading", desc: "In progress right now", count: 0 },
                  { label: "Read This Year", desc: "Books completed", count: 0 },
                ].map((cat) => (
                  <div key={cat.label} style={{ padding: "var(--space-5)", background: "var(--bg-card)", border: `1px solid var(--border)`, borderRadius: "var(--radius-md)", textAlign: "center" }}>
                    <p style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-3xl)", fontWeight: 600, color: "var(--accent-sage)", marginBottom: "var(--space-1)" }}>{cat.count}</p>
                    <p style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-primary)" }}>{cat.label}</p>
                    <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: "2px" }}>{cat.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Shelf stats bar */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-6)",
              marginBottom: "var(--space-8)",
              padding: "var(--space-4) var(--space-5)",
              background: "var(--bg-card)",
              border: `1px solid var(--border)`,
              borderRadius: "var(--radius-md)",
            }}>
              {[
                { val: favorite.length, label: "Books saved" },
                { val: `₹${favorite.reduce((a, b) => a + (b.price || 0), 0).toLocaleString()}`, label: "Total value" },
                { val: [...new Set(favorite.map((b) => b.genre).filter(Boolean))].length, label: "Genres" },
              ].map(({ val, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: "var(--space-5)" }}>
                  <div>
                    <p style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 600, color: "var(--text-primary)" }}>{val}</p>
                    <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{label}</p>
                  </div>
                  <div style={{ width: "1px", height: "32px", background: "var(--border-light)" }} />
                </div>
              ))}
              <div style={{ flex: 1 }} />
              <Link to="/category" style={{ textDecoration: "none" }}>
                <button className="btn btn-secondary flex items-center gap-2" style={{ fontSize: "var(--text-xs)" }}>
                  <Plus size={12} /> Add more
                </button>
              </Link>
            </div>

            {/* Book grid */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5"
            >
              <AnimatePresence>
                {favorite.map((book, i) => (
                  <motion.div key={book._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <FavoriteBookCard data={book} setFavorite={setFavorite} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Continue exploring */}
            <div style={{
              marginTop: "var(--space-16)",
              padding: "var(--space-8)",
              background: "var(--bg-surface)",
              border: `1px solid var(--border-light)`,
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "var(--space-4)",
            }}>
              <div>
                <p style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--text-primary)", marginBottom: "var(--space-1)" }}>Continue exploring</p>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>Discover books similar to what you love</p>
              </div>
              <div style={{ display: "flex", gap: "var(--space-3)" }}>
                <Link to="/category" style={{ textDecoration: "none" }}>
                  <button className="btn btn-primary flex items-center gap-2">Browse genres <ChevronRight size={14} /></button>
                </Link>
                <Link to="/allbooks" style={{ textDecoration: "none" }}>
                  <button className="btn btn-secondary">All books</button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Favorite;
