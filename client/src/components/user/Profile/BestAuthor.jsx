import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Users, BookOpen, ExternalLink, Check, AtSign, ChevronLeft, Star } from "lucide-react";
import { useAuthorsLive } from "../../../hooks/useCmsLive";

const PALETTE = [
  "var(--accent-sage)", "var(--accent-amber)", "var(--accent-info)",
  "var(--accent-danger)", "#7B68A8", "#4A90A4",
];

function avatarColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffffff;
  return PALETTE[Math.abs(h) % PALETTE.length];
}

const AuthorDetailPanel = ({ author, onBack }) => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
    <button
      onClick={onBack}
      style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", marginBottom: "var(--space-6)", padding: 0 }}
    >
      <ChevronLeft size={14} /> All Authors
    </button>

    <div style={{ display: "flex", gap: "var(--space-6)", alignItems: "flex-start", flexWrap: "wrap", marginBottom: "var(--space-6)" }}>
      <div style={{
        width: 88, height: 88, borderRadius: "50%",
        background: avatarColor(author.name),
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "2rem", fontWeight: 700, color: "#fff",
        fontFamily: "var(--font-heading)", flexShrink: 0,
        border: "3px solid var(--border)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
      }}>
        {author.name.charAt(0)}
      </div>

      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-1)" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontWeight: 600, color: "var(--text-primary)" }}>{author.name}</h2>
          {author.verified && (
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--accent-sage)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Check size={10} style={{ color: "#fff" }} />
            </div>
          )}
        </div>

        {author.featured && (
          <span style={{ display: "inline-flex", fontSize: "0.65rem", padding: "2px 10px", borderRadius: "var(--radius-full)", background: "var(--accent-amber-bg)", color: "var(--accent-amber)", fontWeight: 600, marginBottom: "var(--space-4)" }}>
            Featured Author
          </span>
        )}

        <div style={{ display: "flex", gap: "var(--space-6)", marginBottom: "var(--space-4)", flexWrap: "wrap" }}>
          {[
            [author.books, "Books"],
            [author.followers?.toLocaleString(), "Followers"],
          ].map(([val, label]) => (
            <div key={label}>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1 }}>{val}</p>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: 2 }}>{label}</p>
            </div>
          ))}
        </div>

        <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-5)", maxWidth: 480 }}>
          {author.bio}
        </p>

        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
          {author.website && (
            <a href={`https://${author.website}`} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: "var(--space-1)", fontSize: "var(--text-xs)", color: "var(--accent-sage)", textDecoration: "none", padding: "4px 12px", border: `1px solid var(--accent-sage-ring)`, borderRadius: "var(--radius-full)", background: "var(--accent-sage-bg)" }}>
              <ExternalLink size={11} /> Website
            </a>
          )}
          {author.twitter && (
            <span style={{ display: "flex", alignItems: "center", gap: "var(--space-1)", fontSize: "var(--text-xs)", color: "var(--text-secondary)", padding: "4px 12px", border: `1px solid var(--border)`, borderRadius: "var(--radius-full)" }}>
              <AtSign size={11} /> {author.twitter}
            </span>
          )}
        </div>
      </div>
    </div>

    <div style={{ padding: "var(--space-5)", background: "var(--bg-surface)", borderRadius: "var(--radius-md)", border: `1px solid var(--border-light)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
        <BookOpen size={14} style={{ color: "var(--accent-sage)" }} />
        <p style={{ fontSize: "var(--text-xs)", fontWeight: 600, letterSpacing: "var(--tracking-wider)", textTransform: "uppercase", color: "var(--text-muted)" }}>In our collection</p>
      </div>
      <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
        We carry {author.books} title{author.books !== 1 ? "s" : ""} by {author.name}. Browse the full library to find them.
      </p>
    </div>
  </motion.div>
);

const AuthorCard = ({ author, onSelect, index }) => {
  const color = avatarColor(author.name);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={() => onSelect(author)}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        cursor: "pointer",
        transition: "var(--transition)",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent-sage-ring)"; e.currentTarget.style.boxShadow = "var(--shadow-hover)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* Card header band */}
      <div style={{ height: 56, background: `${color}18`, position: "relative" }}>
        {author.featured && (
          <span style={{ position: "absolute", top: 8, right: 10, fontSize: "0.6rem", padding: "2px 8px", borderRadius: "var(--radius-full)", background: "var(--accent-amber-bg)", color: "var(--accent-amber)", fontWeight: 700, border: "1px solid rgba(139,111,71,0.2)" }}>
            Featured
          </span>
        )}
      </div>

      <div style={{ padding: "0 var(--space-4) var(--space-4)", marginTop: -28, flex: 1 }}>
        {/* Avatar */}
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          background: color,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "var(--text-xl)", fontWeight: 700, color: "#fff",
          fontFamily: "var(--font-heading)",
          border: "3px solid var(--bg-card)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          marginBottom: "var(--space-3)",
        }}>
          {author.name.charAt(0)}
        </div>

        {/* Name + verified */}
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1)", marginBottom: "var(--space-1)" }}>
          <p style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-primary)" }}>{author.name}</p>
          {author.verified && (
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: "var(--accent-sage)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Check size={8} style={{ color: "#fff" }} />
            </div>
          )}
        </div>

        {/* Bio */}
        <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", lineHeight: "var(--leading-snug)", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", marginBottom: "var(--space-4)" }}>
          {author.bio}
        </p>

        {/* Stats row */}
        <div style={{ display: "flex", gap: "var(--space-4)", paddingTop: "var(--space-3)", borderTop: "1px solid var(--border-light)" }}>
          <div>
            <p style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-base)", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1 }}>{author.books}</p>
            <p style={{ fontSize: "0.6rem", color: "var(--text-faint)", marginTop: 2 }}>books</p>
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-base)", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1 }}>{(author.followers / 1000).toFixed(1)}k</p>
            <p style={{ fontSize: "0.6rem", color: "var(--text-faint)", marginTop: 2 }}>followers</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AuthorGrid = ({ authors, onSelect }) => {
  if (!authors.length) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <Users size={24} style={{ color: "var(--text-muted)" }} />
        </div>
        <h2>No authors featured yet</h2>
        <p>Check back soon — we highlight new voices regularly.</p>
      </div>
    );
  }

  const featured = authors.filter((a) => a.featured);
  const rest = authors.filter((a) => !a.featured);

  return (
    <div>
      {featured.length > 0 && (
        <div style={{ marginBottom: "var(--space-10)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-6)" }}>
            <Star size={14} style={{ color: "var(--accent-amber)" }} />
            <p style={{ fontSize: "var(--text-xs)", fontWeight: 700, letterSpacing: "var(--tracking-wider)", textTransform: "uppercase", color: "var(--text-muted)" }}>Featured Authors</p>
            <div style={{ flex: 1, height: "1px", background: "var(--border-light)" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "var(--space-4)" }}>
            {featured.map((a, i) => (
              <AuthorCard key={a.id} author={a} onSelect={onSelect} index={i} />
            ))}
          </div>
        </div>
      )}

      {rest.length > 0 && (
        <div>
          {featured.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-6)" }}>
              <Users size={14} style={{ color: "var(--text-muted)" }} />
              <p style={{ fontSize: "var(--text-xs)", fontWeight: 700, letterSpacing: "var(--tracking-wider)", textTransform: "uppercase", color: "var(--text-muted)" }}>More Authors</p>
              <div style={{ flex: 1, height: "1px", background: "var(--border-light)" }} />
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "var(--space-4)" }}>
            {rest.map((a, i) => (
              <AuthorCard key={a.id} author={a} onSelect={onSelect} index={featured.length + i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const BestAuthors = () => {
  const [selected, setSelected] = useState(null);
  const liveAuthors = useAuthorsLive();
  const authors = liveAuthors.map(a=>({ ...a, id: a._id||a.id, followers: a.followers??0, books: a.booksCount ?? a.books ?? 0, verified: !!a.verified }));
  const location = useLocation();
  const isStandalone = location.pathname === "/authors";

  const content = selected ? (
    <AuthorDetailPanel author={selected} onBack={() => setSelected(null)} />
  ) : (
    <>
      {!isStandalone && (
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-6)" }}>
          <Award size={16} style={{ color: "var(--accent-amber)" }} />
          <div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 600, color: "var(--text-primary)" }}>Featured Authors</h2>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: 2 }}>Writers whose work we champion</p>
          </div>
        </div>
      )}
      <AuthorGrid authors={authors} onSelect={setSelected} />
    </>
  );

  if (isStandalone) {
    return (
      <div style={{ background: "var(--bg-page)", minHeight: "100vh" }}>
        <section className="page-header">
          <div className="page-container">
            <h1>Featured Authors</h1>
            <p>{authors.length} writers we champion</p>
          </div>
        </section>
        <div className="page-container" style={{ paddingTop: "var(--space-10)", paddingBottom: "var(--space-16)" }}>
          {content}
        </div>
      </div>
    );
  }

  return <div>{content}</div>;
};

export default BestAuthors;
