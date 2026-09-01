import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ChevronRight, ChevronLeft, BookOpen, Feather, Star,
  Bell, Users, Award, TrendingUp, X,
} from "lucide-react";
import { fetchRecentBooks } from "../../../services/book.service";
import api from "../../../services/axios";
import BookCard from "../Card/BookCard";
import {
  CMS_SOCIAL_PROOF,
} from "../../../store/cmsStore";
import { useHomepageBlocksLive, usePromotionsLive, useAuthorsLive, useCategoriesLive, useFeatureFlagsLive, useSocialProofLive } from "../../../hooks/useCmsLive";

const GENRE_ICONS = {
  Fiction: "✦", Science: "◎", History: "◈", Romance: "❧",
  Mystery: "◉", Biography: "◇", "Self-Help": "❂", Fantasy: "✧",
  Technology: "⊞", Philosophy: "∞",
};

const SkeletonCard = () => (
  <div className="card-book overflow-hidden">
    <div className="skeleton" style={{ height: 220 }} />
    <div style={{ padding: "var(--space-3) var(--space-4)", borderTop: `1px solid var(--border-light)`, display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <div className="skeleton" style={{ height: 10, borderRadius: "var(--radius-sm)", width: "80%" }} />
      <div className="skeleton" style={{ height: 10, borderRadius: "var(--radius-sm)", width: "60%" }} />
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

function PromoBanner({ promo, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      style={{
        background: `linear-gradient(135deg, var(--accent-sage) 0%, var(--accent-sage-dark) 100%)`,
        color: "#fff",
        padding: "12px var(--space-6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--space-4)",
        position: "relative",
      }}
    >
      <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, letterSpacing: "var(--tracking-wider)", textTransform: "uppercase", opacity: 0.8 }}>
        {promo.name}
      </span>
      <span style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>
        Save {promo.discount} — ends {promo.ends}
      </span>
      <Link to={promo.ctaUrl || "/allbooks"} style={{ textDecoration: "none" }}>
        <span style={{
          fontSize: "var(--text-xs)",
          fontWeight: 600,
          padding: "4px 14px",
          borderRadius: "var(--radius-full)",
          background: "rgba(255,255,255,0.2)",
          border: "1px solid rgba(255,255,255,0.35)",
          color: "#fff",
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}>
          {promo.cta} →
        </span>
      </Link>
      <button
        onClick={onClose}
        style={{ position: "absolute", right: "var(--space-4)", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.7)", padding: 4 }}
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

function HeroCarousel({ books }) {
  const [idx, setIdx] = useState(0);
  const total = books?.length || 0;
  const timerRef = useRef(null);

  const go = (n) => {
    setIdx((p) => (p + n + total) % total);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setIdx((p) => (p + 1) % total), 5000);
  };

  useEffect(() => {
    if (total < 2) return;
    timerRef.current = setInterval(() => setIdx((p) => (p + 1) % total), 5000);
    return () => clearInterval(timerRef.current);
  }, [total]);

  if (!books || !total) {
    return (
      <div style={{ width: "100%", maxWidth: 420, height: 300, background: "var(--bg-surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div className="skeleton" style={{ width: 120, height: 160, borderRadius: "var(--radius-sm)", margin: "0 auto var(--space-3)" }} />
          <div className="skeleton" style={{ width: 80, height: 10, borderRadius: "var(--radius-full)", margin: "0 auto" }} />
        </div>
      </div>
    );
  }

  const book = books[idx];
  const prev1 = books[(idx + total - 1) % total];
  const next1 = books[(idx + 1) % total];

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 420 }}>
      {/* Background plate */}
      <div style={{
        position: "absolute", inset: "-16px",
        background: "linear-gradient(145deg, var(--bg-parchment) 0%, var(--bg-surface-alt) 100%)",
        borderRadius: "var(--radius-lg)", zIndex: 0,
        border: "1px solid var(--border-light)",
      }} />

      <div style={{ position: "relative", zIndex: 1, padding: "var(--space-6)", display: "flex", gap: "var(--space-4)", alignItems: "center", minHeight: 300 }}>
        {/* Side ghost — previous */}
        <div style={{ opacity: 0.3, transform: "scale(0.82) translateX(8px)", transformOrigin: "right center", transition: "all 0.35s", flexShrink: 0 }}>
          <div style={{ borderRadius: "var(--radius-sm)", overflow: "hidden", background: "var(--bg-card)", width: 72, boxShadow: "var(--shadow-card)" }}>
            <img src={prev1.image} alt="" style={{ width: "100%", height: 92, objectFit: "contain", background: "var(--bg-surface)", padding: 4 }} loading="lazy" />
          </div>
        </div>

        {/* Active book */}
        <AnimatePresence mode="wait">
          <motion.div
            key={book._id}
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -8 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            style={{ flex: 1, display: "flex", justifyContent: "center" }}
          >
            <Link to={`/view-book-details/${book._id}`} style={{ textDecoration: "none" }}>
              <div style={{ borderRadius: "var(--radius-md)", overflow: "hidden", boxShadow: "0 12px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)", background: "var(--bg-card)", width: 160, transition: "transform 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                <div style={{ height: 210, background: "var(--bg-surface)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  <img
                    src={book.image}
                    alt={book.title}
                    style={{ width: "100%", height: "100%", objectFit: "contain", padding: "var(--space-3)" }}
                    loading="lazy"
                  />
                </div>
                <div style={{ padding: "var(--space-3)", borderTop: "1px solid var(--border-light)", background: "var(--bg-card)" }}>
                  <p style={{ fontSize: "0.7rem", fontFamily: "var(--font-heading)", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{book.title}</p>
                  <p style={{ fontSize: "0.62rem", color: "var(--text-muted)", marginTop: 2 }}>{book.author}</p>
                  <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--accent-sage)", marginTop: "var(--space-1)" }}>₹{book.price}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Side ghost — next */}
        <div style={{ opacity: 0.3, transform: "scale(0.82) translateX(-8px)", transformOrigin: "left center", transition: "all 0.35s", flexShrink: 0 }}>
          <div style={{ borderRadius: "var(--radius-sm)", overflow: "hidden", background: "var(--bg-card)", width: 72, boxShadow: "var(--shadow-card)" }}>
            <img src={next1.image} alt="" style={{ width: "100%", height: 92, objectFit: "contain", background: "var(--bg-surface)", padding: 4 }} loading="lazy" />
          </div>
        </div>
      </div>

      {/* Controls */}
      {total > 1 && (
        <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-3)", paddingBottom: "var(--space-2)" }}>
          <button onClick={() => go(-1)} style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--bg-card)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "var(--shadow-soft)" }}>
            <ChevronLeft size={13} style={{ color: "var(--text-muted)" }} />
          </button>
          {books.slice(0, 8).map((_, i) => (
            <div
              key={i}
              onClick={() => { setIdx(i); clearInterval(timerRef.current); timerRef.current = setInterval(() => setIdx((p) => (p + 1) % total), 5000); }}
              style={{ width: i === idx ? 20 : 6, height: 6, borderRadius: 3, background: i === idx ? "var(--accent-sage)" : "var(--border-medium)", cursor: "pointer", transition: "all 0.25s" }}
            />
          ))}
          <button onClick={() => go(1)} style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--bg-card)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "var(--shadow-soft)" }}>
            <ChevronRight size={13} style={{ color: "var(--text-muted)" }} />
          </button>
        </div>
      )}
    </div>
  );
}

function NewsletterBlock({ headline, subtext }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
  };

  return (
    <section style={{ padding: "var(--space-16) 0", background: "var(--bg-surface)", borderTop: `1px solid var(--border-light)` }}>
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div style={{ maxWidth: 540, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: "50%", background: "var(--accent-sage-bg)", border: `1px solid var(--accent-sage-ring)`, marginBottom: "var(--space-5)" }}>
            <Bell size={18} style={{ color: "var(--accent-sage)" }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontWeight: 600, color: "var(--text-primary)", marginBottom: "var(--space-2)" }}>
            {headline || "Stay in the Loop"}
          </h2>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", marginBottom: "var(--space-6)", lineHeight: "var(--leading-relaxed)" }}>
            {subtext || "Get weekly book picks, author spotlights, and exclusive deals delivered to your inbox."}
          </p>
          {!done ? (
            <form onSubmit={handleSubmit} style={{ display: "flex", gap: "var(--space-3)", maxWidth: 380, margin: "0 auto" }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{ flex: 1, padding: "0.6rem 1rem", border: `1px solid var(--border-medium)`, borderRadius: "var(--radius-sm)", background: "var(--bg-card)", color: "var(--text-primary)", fontSize: "var(--text-sm)", fontFamily: "var(--font-body)", outline: "none" }}
                onFocus={(e) => { e.target.style.borderColor = "var(--accent-sage)"; }}
                onBlur={(e) => { e.target.style.borderColor = "var(--border-medium)"; }}
              />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          ) : (
            <p style={{ fontSize: "var(--text-sm)", color: "var(--accent-sage)", fontWeight: 500 }}>
              You're in! Watch your inbox for the next edition.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function SocialProof({ stats }) {
  const items = [
    [stats.titles, "Titles", BookOpen],
    [stats.avgRating, "Avg Rating", Star],
    [stats.readers, "Readers", Users],
    ["500+", "Authors", Award],
  ];
  return (
    <div style={{ display: "flex", gap: "var(--space-8)", paddingTop: "var(--space-8)", borderTop: `1px solid var(--border-light)`, flexWrap: "wrap" }}>
      {items.map(([val, label, Icon]) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <div style={{ width: 32, height: 32, borderRadius: "var(--radius-sm)", background: "var(--bg-surface)", border: `1px solid var(--border-light)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon size={13} style={{ color: "var(--accent-sage)" }} />
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1 }}>{val}</p>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: 2 }}>{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function AuthorCard({ author }) {
  return (
    <div style={{ padding: "var(--space-5)", background: "var(--bg-card)", border: `1px solid var(--border)`, borderRadius: "var(--radius-md)", display: "flex", gap: "var(--space-4)", alignItems: "flex-start" }}>
      <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--accent-sage)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "var(--text-lg)", fontWeight: 700, color: "#fff", fontFamily: "var(--font-heading)", flexShrink: 0 }}>
        {author.name.charAt(0)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          <p style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-primary)" }}>{author.name}</p>
          {author.verified && (
            <Award size={12} style={{ color: "var(--accent-sage)", flexShrink: 0 }} />
          )}
        </div>
        <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{author.bio}</p>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1)", marginTop: "var(--space-2)" }}>
          <Users size={10} style={{ color: "var(--text-faint)" }} />
          <span style={{ fontSize: "0.65rem", color: "var(--text-faint)" }}>{author.followers.toLocaleString()} followers</span>
        </div>
      </div>
    </div>
  );
}

// CMS section renderer — renders sections in the order defined by Homepage Builder
function renderCMSSection(block, { recentBooks, recommendedBooks, navigate, categories, authors }) {
  if (block.status !== "active") return null;

  switch (block.type) {
    case "New Arrivals":
      return (
        <FadeIn key={block.id} delay={0.05}>
          <section style={{ padding: "var(--space-16) 0", background: "var(--bg-surface)", borderTop: `1px solid var(--border-light)` }}>
            <div className="max-w-6xl mx-auto px-6 sm:px-8">
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "var(--space-8)" }}>
                <div>
                  <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontWeight: 600, color: "var(--text-primary)" }}>{block.headline || "New Arrivals"}</h2>
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
      );

    case "Featured Books":
    case "Best Sellers":
      return (
        <FadeIn key={block.id} delay={0.05}>
          <section style={{ padding: "var(--space-16) 0", background: "var(--bg-page)" }}>
            <div className="max-w-6xl mx-auto px-6 sm:px-8">
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-8)" }}>
                <Feather size={15} style={{ color: "var(--accent-amber)" }} />
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontWeight: 600, color: "var(--text-primary)" }}>{block.headline || "Staff Picks"}</h2>
                <div style={{ flex: 1, height: "1px", background: "var(--border-light)" }} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {!recentBooks
                  ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
                  : recentBooks.slice(3, 8).map((b) => <BookCard key={b._id} data={b} />)
                }
              </div>
            </div>
          </section>
        </FadeIn>
      );

    case "Trending":
      return (
        <FadeIn key={block.id} delay={0.05}>
          <section style={{ padding: "var(--space-16) 0", background: "var(--bg-surface)", borderTop: `1px solid var(--border-light)` }}>
            <div className="max-w-6xl mx-auto px-6 sm:px-8">
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-8)" }}>
                <TrendingUp size={15} style={{ color: "var(--accent-sage)" }} />
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontWeight: 600, color: "var(--text-primary)" }}>{block.headline || "Trending This Week"}</h2>
                <div style={{ flex: 1, height: "1px", background: "var(--border-light)" }} />
                <Link to="/allbooks" style={{ fontSize: "var(--text-sm)", color: "var(--accent-sage)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                  See all <ChevronRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {!recentBooks
                  ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
                  : [...(recentBooks || [])].sort(() => Math.random() - 0.5).slice(0, 5).map((b) => <BookCard key={b._id} data={b} />)
                }
              </div>
            </div>
          </section>
        </FadeIn>
      );

    case "Categories":
      return (
        <FadeIn key={block.id}>
          <section style={{ background: "var(--bg-surface)", borderTop: `1px solid var(--border-light)`, borderBottom: `1px solid var(--border-light)`, padding: "var(--space-16) 0" }}>
            <div className="max-w-6xl mx-auto px-6 sm:px-8">
              <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-4)", marginBottom: "var(--space-8)" }}>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontWeight: 600, color: "var(--text-primary)" }}>{block.headline || "Browse by Genre"}</h2>
                <Link to="/category" className="flex items-center gap-1" style={{ fontSize: "var(--text-sm)", color: "var(--accent-sage)", textDecoration: "none" }}>
                  All genres <ChevronRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {categories.map((c, i) => (
                  <motion.div key={c.id || c.name} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                    <Link to={`/category?genre=${c.name}`} style={{ textDecoration: "none" }}>
                      <div
                        className="py-5 px-4 text-center transition-all cursor-pointer hover-lift"
                        style={{ background: "var(--bg-card)", border: `1px solid var(--border)`, borderRadius: "var(--radius-sm)" }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--accent-sage)"}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                      >
                        <p style={{ fontSize: "1.1rem", marginBottom: "var(--space-2)", opacity: 0.5 }}>{GENRE_ICONS[c.name] || "◦"}</p>
                        <p style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-primary)", marginBottom: 4 }}>{c.name}</p>
                        <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{c.books} books</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </FadeIn>
      );

    case "Authors":
      return (
        <FadeIn key={block.id} delay={0.05}>
          <section style={{ padding: "var(--space-16) 0", background: "var(--bg-page)" }}>
            <div className="max-w-6xl mx-auto px-6 sm:px-8">
              <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-4)", marginBottom: "var(--space-8)" }}>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontWeight: 600, color: "var(--text-primary)" }}>{block.headline || "Featured Authors"}</h2>
                <div style={{ flex: 1, height: "1px", background: "var(--border-light)" }} />
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {authors.map((author) => <AuthorCard key={author.id} author={author} />)}
              </div>
            </div>
          </section>
        </FadeIn>
      );

    case "Promotion Banner":
      return (
        <FadeIn key={block.id} delay={0.05}>
          <section style={{ padding: "var(--space-12) 0" }}>
            <div className="max-w-6xl mx-auto px-6 sm:px-8">
              <div style={{
                borderRadius: "var(--radius-md)",
                background: `linear-gradient(135deg, var(--accent-amber) 0%, var(--accent-amber-dark) 100%)`,
                padding: "var(--space-10) var(--space-10)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "var(--space-6)",
                flexWrap: "wrap",
                position: "relative",
                overflow: "hidden",
              }}>
                <div style={{ position: "absolute", right: -40, top: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
                <div>
                  <p style={{ fontSize: "var(--text-xs)", fontWeight: 600, letterSpacing: "var(--tracking-wider)", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginBottom: "var(--space-2)" }}>Limited Time</p>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 600, color: "#fff", marginBottom: "var(--space-2)" }}>{block.headline || "Summer Sale"}</h3>
                  <p style={{ fontSize: "var(--text-sm)", color: "rgba(255,255,255,0.8)" }}>{block.subtext || "Up to 40% off selected titles"}</p>
                </div>
                <Link to="/allbooks" style={{ textDecoration: "none" }}>
                  <button style={{ padding: "0.7rem 1.75rem", borderRadius: "var(--radius-sm)", background: "#fff", color: "var(--accent-amber-dark)", fontWeight: 600, fontSize: "var(--text-sm)", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", whiteSpace: "nowrap" }}>
                    Shop Sale <ArrowRight size={14} style={{ display: "inline", marginLeft: 6 }} />
                  </button>
                </Link>
              </div>
            </div>
          </section>
        </FadeIn>
      );

    default:
      return null;
  }
}

function Home() {
  const navigate = useNavigate();
  const [recentBooks, setRecentBooks] = useState(null);
  const [recommendedBooks, setRecommendedBooks] = useState(null);
  const [showPromo, setShowPromo] = useState(true);
  const [profile, setProfile] = useState(null);
  const { blocks: liveBlocks } = useHomepageBlocksLive();
  const livePromos = usePromotionsLive();
  const liveAuthors = useAuthorsLive();
  const liveCategories = useCategoriesLive();
  const featureFlags = useFeatureFlagsLive();
  const socialProofLive = useSocialProofLive();
  const activePromo = livePromos.find((p) => (p.type || p.badge) === "Banner" || p.type === "Banner");
  const blocks = (Array.isArray(liveBlocks) ? liveBlocks : []).filter((b) => b.status === "active").sort((a, b) => a.order - b.order);
  const isLoggedIn = useSelector((s) => s.auth?.isLoggedIn || false);

  useEffect(() => {
    fetchRecentBooks().then(setRecentBooks).catch(() => setRecentBooks([]));
    api.get("/get-recommended-books")
      .then((r) => setRecommendedBooks(r.data?.data ?? []))
      .catch(() => setRecommendedBooks([]));
    if (isLoggedIn) {
      api.get("/user-information").then((r) => setProfile(r.data)).catch(() => {});
    }
  }, [isLoggedIn]);

  const rawCats = liveCategories;
  const liveCatsNorm = rawCats.map(c=>({ id:c._id||c.id||c.name, name:c.name, books:c.count??c.books??0 }));
  const rawAuthors = liveAuthors;
  const liveAuthorsNorm = rawAuthors.filter(a=>a.featured!==false).map(a=>({ ...a, id:a._id||a.id, followers:a.followers??0, verified:!!a.verified }));
  const sectionData = {
    recentBooks,
    recommendedBooks: featureFlags && featureFlags.recommendations===false ? [] : recommendedBooks,
    navigate,
    categories: liveCatsNorm,
    authors: liveAuthorsNorm,
  };

  const showNewsletter = blocks.find((b) => b.type === "Newsletter");

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>

      {/* ── PROMO BANNER ── */}
      <AnimatePresence>
        {showPromo && activePromo && (
          <PromoBanner promo={activePromo} onClose={() => setShowPromo(false)} />
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <section style={{ paddingTop: "100px", paddingBottom: "72px", background: "var(--bg-page)" }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
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
                <button onClick={() => navigate("/category")} className="btn btn-primary flex items-center gap-2">
                  Browse Library <ArrowRight size={14} />
                </button>
                {isLoggedIn ? (
                  <button onClick={() => navigate("/profile/wishlist")} className="btn btn-secondary">
                    My Wishlist
                  </button>
                ) : (
                  <button onClick={() => navigate("/signup")} className="btn btn-secondary">
                    Join for free
                  </button>
                )}
              </div>

              <SocialProof stats={socialProofLive || CMS_SOCIAL_PROOF} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="hidden lg:flex items-center justify-center"
            >
              <HeroCarousel books={recentBooks} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CMS-DRIVEN SECTIONS ── */}
      {blocks.map((block) => renderCMSSection(block, sectionData))}

      {/* ── RECOMMENDED ── */}
      {recommendedBooks && recommendedBooks.length > 0 && (
        <FadeIn delay={0.05}>
          <section style={{ background: "var(--bg-surface)", borderTop: `1px solid var(--border-light)`, padding: "var(--space-12) 0" }}>
            <div className="max-w-6xl mx-auto px-6 sm:px-8">
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "var(--space-8)" }}>
                <div>
                  <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontWeight: 600, color: "var(--text-primary)" }}>Recommended for You</h2>
                  <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: "var(--space-1)" }}>Selected based on your reading interests</p>
                </div>
                <Link to="/allbooks" style={{ fontSize: "var(--text-sm)", color: "var(--accent-sage)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                  See all <ChevronRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {recommendedBooks.slice(0, 10).map((b) => <BookCard key={b._id} data={b} />)}
              </div>
            </div>
          </section>
        </FadeIn>
      )}

      {/* ── CMS NEWSLETTER (if enabled) ── */}
      {showNewsletter && (
        <NewsletterBlock headline={showNewsletter.headline} subtext={showNewsletter.subtext} />
      )}

      {/* ── CTA ── */}
      <FadeIn>
        <section style={{ padding: "var(--space-16) 0" }}>
          <div className="max-w-6xl mx-auto px-6 sm:px-8">
            {isLoggedIn ? (
              <div className="text-center px-8 py-14 rounded-sm" style={{ background: "var(--bg-dark)", position: "relative", overflow: "hidden" }}>
                <div style={{
                  position: "absolute", inset: 0,
                  backgroundImage: `radial-gradient(circle at 20% 50%, rgba(92,122,94,0.15), transparent 50%), radial-gradient(circle at 80% 50%, rgba(139,111,71,0.1), transparent 50%)`,
                }} />
                <div style={{ position: "relative" }}>
                  <p className="overline" style={{ color: "var(--accent-sage-mid)", marginBottom: "var(--space-4)" }}>Welcome back</p>
                  <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontWeight: 600, color: "var(--text-inverse)", lineHeight: "var(--leading-snug)", marginBottom: "var(--space-4)" }}>
                    Welcome back, {profile?.fullname?.split(" ")[0] || profile?.username || "there"}.
                  </h2>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--text-faint)", marginBottom: "var(--space-8)", maxWidth: "400px", margin: "0 auto var(--space-8)" }}>
                    Continue exploring books curated for your interests.
                  </p>
                  <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "center", flexWrap: "wrap" }}>
                    <button onClick={() => navigate("/allbooks")} className="btn btn-primary inline-flex items-center gap-2">
                      Browse Library <ArrowRight size={14} />
                    </button>
                    <button onClick={() => navigate("/profile/wishlist")} className="btn btn-secondary inline-flex items-center gap-2" style={{ color: "var(--text-inverse)", borderColor: "rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.08)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.14)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}>
                      My Wishlist
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center px-8 py-14 rounded-sm" style={{ background: "var(--bg-dark)", position: "relative", overflow: "hidden" }}>
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
                  <button onClick={() => navigate("/signup")} className="btn btn-primary inline-flex items-center gap-2">
                    Create free account <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </FadeIn>
    </div>
  );
}

export default Home;
