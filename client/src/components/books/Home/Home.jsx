import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, BookOpen, Feather, Star } from "lucide-react";
import { fetchRecentBooks } from "../../../services/book.service";
import api from "../../../services/axios";
import BookCard from "../Card/BookCard";

const GENRES = [
  { label: "Fiction",    desc: "Stories that transport", icon: "✦" },
  { label: "Science",    desc: "Ideas that challenge",   icon: "◎" },
  { label: "History",    desc: "Lessons from the past",  icon: "◈" },
  { label: "Romance",    desc: "Hearts and longing",     icon: "❧" },
  { label: "Mystery",    desc: "Puzzles and suspense",   icon: "◉" },
  { label: "Biography",  desc: "Lives worth knowing",    icon: "◇" },
];

const STAFF_PICKS = [
  { quote: "A meditation on time, memory, and the books that shape us.", genre: "Literary Fiction" },
  { quote: "Rarely does non-fiction read with such novelistic grace.", genre: "Biography" },
  { quote: "Essential reading for anyone curious about the natural world.", genre: "Science" },
];

const SkeletonCard = () => (
  <div className="card-book overflow-hidden">
    <div className="skeleton" style={{ height: 220 }} />
    <div className="p-3.5 space-y-2" style={{ borderTop: `1px solid var(--border-light)` }}>
      <div className="skeleton h-3 rounded w-4/5" />
      <div className="skeleton h-3 rounded w-3/5" />
    </div>
  </div>
);

const FadeIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
);

function Home() {
  const navigate = useNavigate();
  const [recentBooks, setRecentBooks]           = useState(null);
  const [recommendedBooks, setRecommendedBooks] = useState(null);

  useEffect(() => {
    fetchRecentBooks().then(setRecentBooks).catch(() => setRecentBooks([]));
    api.get("/get-recommended-books")
      .then((r) => setRecommendedBooks(r.data?.data ?? []))
      .catch(() => setRecommendedBooks([]));
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>

      {/* ── HERO ── */}
      <section style={{ paddingTop: "100px", paddingBottom: "72px", background: "var(--bg-page)" }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left copy */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-6)" }}>
                <div style={{ width: "32px", height: "1px", background: "var(--accent-sage)" }} />
                <span className="overline">A curated library</span>
              </div>

              <h1 style={{
                fontFamily: "var(--font-heading)",
                fontSize: "var(--text-display)",
                fontWeight: 600,
                color: "var(--text-primary)",
                lineHeight: "var(--leading-tight)",
                letterSpacing: "var(--tracking-tight)",
                marginBottom: "var(--space-5)",
              }}>
                Find your next<br />
                <em style={{ fontStyle: "italic", color: "var(--accent-sage)" }}>great read.</em>
              </h1>

              <p style={{
                fontSize: "var(--text-base)",
                color: "var(--text-secondary)",
                lineHeight: "var(--leading-relaxed)",
                maxWidth: "420px",
                marginBottom: "var(--space-8)",
              }}>
                Thousands of titles across every genre, personally curated and ready for you to explore.
              </p>

              <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
                <button
                  onClick={() => navigate("/category")}
                  className="btn btn-primary flex items-center gap-2"
                >
                  Browse Library <ArrowRight size={14} />
                </button>
                <button
                  onClick={() => navigate("/wishlist")}
                  className="btn btn-secondary"
                >
                  My Wishlist
                </button>
              </div>

              <div style={{
                display: "flex",
                gap: "var(--space-8)",
                marginTop: "var(--space-12)",
                paddingTop: "var(--space-8)",
                borderTop: `1px solid var(--border-light)`,
              }}>
                {[["10K+", "Titles"], ["4.8", "Avg Rating"], ["50K+", "Readers"]].map(([val, label]) => (
                  <div key={label}>
                    <p style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontWeight: 600, color: "var(--text-primary)" }}>{val}</p>
                    <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: "var(--space-1)" }}>{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — book showcase */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="hidden lg:flex items-center justify-center"
            >
              {recentBooks && recentBooks.length > 0 ? (
                <div className="relative">
                  <div style={{
                    position: "absolute", inset: "-24px", borderRadius: "var(--radius-sm)",
                    background: "linear-gradient(145deg, var(--bg-parchment) 0%, var(--bg-surface-alt) 100%)",
                    zIndex: 0,
                  }} />
                  <div className="relative grid grid-cols-3 gap-4" style={{ zIndex: 1, padding: "var(--space-6)" }}>
                    {recentBooks.slice(0, 3).map((book, i) => (
                      <motion.div
                        key={book._id}
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
                      >
                        <Link to={`/view-book-details/${book._id}`}>
                          <div style={{ borderRadius: "var(--radius-sm)", overflow: "hidden", boxShadow: "var(--shadow-book)", background: "var(--bg-card)" }}>
                            <img src={book.image} alt={book.title}
                              className="w-full object-contain"
                              style={{ height: 180, background: "var(--bg-surface)", padding: "var(--space-2)" }}
                            />
                            <div style={{ padding: "var(--space-2) var(--space-3)", borderTop: `1px solid var(--border-light)` }}>
                              <p style={{ fontSize: "var(--text-xs)", fontFamily: "var(--font-heading)", fontWeight: 500, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{book.title}</p>
                              <p style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "2px" }}>{book.author}</p>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                  <div style={{ position: "absolute", bottom: "-8px", left: "24px", right: "24px", height: "8px", background: "rgba(0,0,0,0.05)", borderRadius: "0 0 4px 4px", filter: "blur(4px)" }} />
                </div>
              ) : (
                <div style={{ width: 320, height: 260, background: "var(--bg-parchment)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <BookOpen size={48} style={{ color: "var(--border-medium)", opacity: 0.5 }} />
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── GENRE SHELF ── */}
      <FadeIn>
        <section style={{ background: "var(--bg-surface)", borderTop: `1px solid var(--border-light)`, borderBottom: `1px solid var(--border-light)`, padding: "var(--space-16) 0" }}>
          <div className="max-w-6xl mx-auto px-6 sm:px-8">
            <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-4)", marginBottom: "var(--space-8)" }}>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontWeight: 600, color: "var(--text-primary)" }}>Browse by Genre</h2>
              <Link to="/category" className="flex items-center gap-1" style={{ fontSize: "var(--text-sm)", color: "var(--accent-sage)", textDecoration: "none" }}>
                All genres <ChevronRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {GENRES.map((g, i) => (
                <motion.div key={g.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <Link to={`/category?genre=${g.label}`} style={{ textDecoration: "none" }}>
                    <div
                      className="py-5 px-4 text-center transition-all cursor-pointer hover-lift"
                      style={{ background: "var(--bg-card)", border: `1px solid var(--border)`, borderRadius: "var(--radius-sm)" }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--accent-sage)"}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                    >
                      <p style={{ fontSize: "1.1rem", marginBottom: "var(--space-2)", opacity: 0.5 }}>{g.icon}</p>
                      <p style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-primary)", marginBottom: "4px" }}>{g.label}</p>
                      <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{g.desc}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ── STAFF PICKS ── */}
      <FadeIn delay={0.05}>
        <section style={{ padding: "var(--space-16) 0", background: "var(--bg-page)" }}>
          <div className="max-w-6xl mx-auto px-6 sm:px-8">
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-8)" }}>
              <Feather size={15} style={{ color: "var(--accent-amber)" }} />
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontWeight: 600, color: "var(--text-primary)" }}>Staff Picks</h2>
              <div style={{ flex: 1, height: "1px", background: "var(--border-light)" }} />
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {STAFF_PICKS.map((pick, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div style={{ padding: "var(--space-6)", background: "var(--bg-card)", border: `1px solid var(--border)`, borderRadius: "var(--radius-md)", height: "100%" }}>
                    <p style={{ fontSize: "var(--text-xs)", fontWeight: 600, letterSpacing: "var(--tracking-wider)", textTransform: "uppercase", color: "var(--accent-amber)", marginBottom: "var(--space-3)" }}>{pick.genre}</p>
                    <blockquote style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-base)", fontStyle: "italic", color: "var(--text-primary)", lineHeight: "var(--leading-relaxed)" }}>
                      "{pick.quote}"
                    </blockquote>
                    <div style={{ marginTop: "var(--space-4)", display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} size={10} fill="var(--accent-gold)" stroke="none" />
                      ))}
                      <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginLeft: "var(--space-2)" }}>Staff recommendation</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ── NEW ARRIVALS ── */}
      <FadeIn delay={0.05}>
        <section style={{ padding: "var(--space-16) 0", background: "var(--bg-surface)", borderTop: `1px solid var(--border-light)` }}>
          <div className="max-w-6xl mx-auto px-6 sm:px-8">
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "var(--space-8)" }}>
              <div>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontWeight: 600, color: "var(--text-primary)" }}>New Arrivals</h2>
                <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: "var(--space-1)" }}>The latest additions to our collection</p>
              </div>
              <Link to="/allbooks" className="flex items-center gap-1" style={{ fontSize: "var(--text-sm)", color: "var(--accent-sage)", textDecoration: "none" }}>
                View all <ChevronRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {!recentBooks
                ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
                : recentBooks.slice(0, 10).map((b) => <BookCard key={b._id} data={b} />)
              }
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ── AUTHOR SPOTLIGHT ── */}
      <FadeIn delay={0.05}>
        <section style={{ padding: "var(--space-16) 0", background: "var(--bg-page)" }}>
          <div className="max-w-6xl mx-auto px-6 sm:px-8">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-12)", alignItems: "center" }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-5)" }}>
                  <div style={{ width: "24px", height: "1px", background: "var(--accent-amber)" }} />
                  <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, letterSpacing: "var(--tracking-widest)", textTransform: "uppercase", color: "var(--accent-amber)" }}>Author Spotlight</span>
                </div>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-3xl)", fontWeight: 600, color: "var(--text-primary)", lineHeight: "var(--leading-snug)", marginBottom: "var(--space-4)" }}>
                  Writing that endures
                </h2>
                <p style={{ fontSize: "var(--text-base)", color: "var(--text-secondary)", lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-6)", maxWidth: "400px" }}>
                  We curate authors whose work stands apart — writers who have shaped the way we see the world, one sentence at a time.
                </p>
                <Link to="/allbooks" style={{ textDecoration: "none" }}>
                  <button className="btn btn-secondary flex items-center gap-2">
                    Explore authors <ChevronRight size={14} />
                  </button>
                </Link>
              </div>
              <div className="hidden md:grid grid-cols-2 gap-4">
                {["Literary depth", "Fresh voices", "Award-winning", "Local authors"].map((tag, i) => (
                  <div key={tag} style={{ padding: "var(--space-5)", background: i % 2 === 0 ? "var(--bg-surface)" : "var(--bg-parchment)", borderRadius: "var(--radius-md)", border: `1px solid var(--border-light)` }}>
                    <p style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-primary)" }}>{tag}</p>
                    <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: "var(--space-1)" }}>Handpicked collection</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ── RECOMMENDED ── */}
      {recommendedBooks && recommendedBooks.length > 0 && (
        <FadeIn delay={0.05}>
          <section style={{ background: "var(--bg-surface)", borderTop: `1px solid var(--border-light)`, padding: "var(--space-16) 0" }}>
            <div className="max-w-6xl mx-auto px-6 sm:px-8">
              <div style={{ marginBottom: "var(--space-8)" }}>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontWeight: 600, color: "var(--text-primary)" }}>Recommended for You</h2>
                <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: "var(--space-1)" }}>Selected based on your reading interests</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {recommendedBooks.slice(0, 10).map((b) => <BookCard key={b._id} data={b} />)}
              </div>
            </div>
          </section>
        </FadeIn>
      )}

      {/* ── CTA ── */}
      <FadeIn>
        <section style={{ padding: "var(--space-20) 0" }}>
          <div className="max-w-6xl mx-auto px-6 sm:px-8">
            <div className="text-center px-8 py-16 rounded-sm" style={{ background: "var(--bg-dark)", position: "relative", overflow: "hidden" }}>
              <div style={{
                position: "absolute", inset: 0,
                backgroundImage: `radial-gradient(circle at 20% 50%, rgba(92,122,94,0.15), transparent 50%), radial-gradient(circle at 80% 50%, rgba(139,111,71,0.1), transparent 50%)`,
              }} />
              <div style={{ position: "relative" }}>
                <p className="overline" style={{ color: "var(--accent-sage-mid)", marginBottom: "var(--space-4)" }}>Join the community</p>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontWeight: 600, color: "var(--text-inverse)", lineHeight: "var(--leading-snug)", marginBottom: "var(--space-4)" }}>
                  Start your reading journey today
                </h2>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--text-faint)", marginBottom: "var(--space-8)", maxWidth: "400px", margin: "0 auto var(--space-8)" }}>
                  Thousands of readers discover their next favourite book every week.
                </p>
                <button
                  onClick={() => navigate("/signup")}
                  className="btn btn-primary inline-flex items-center gap-2"
                >
                  Create free account <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>
    </div>
  );
}

export default Home;
