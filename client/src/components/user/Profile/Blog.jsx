import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Search, X, Clock, ChevronRight, ChevronLeft } from "lucide-react";
import { CMS_BLOG_POSTS } from "../../../store/cmsStore";

const CATEGORIES = ["All", ...new Set(CMS_BLOG_POSTS.map((p) => p.category))];

const CATEGORY_COLORS = {
  Technology: { bg: "var(--accent-info)", light: "rgba(74,144,164,0.1)" },
  Curated:    { bg: "var(--accent-amber)", light: "rgba(139,111,71,0.1)" },
  Wellness:   { bg: "var(--accent-sage)",  light: "rgba(92,122,94,0.1)" },
  Default:    { bg: "var(--text-muted)",   light: "var(--bg-surface)" },
};

function categoryStyle(cat) {
  return CATEGORY_COLORS[cat] || CATEGORY_COLORS.Default;
}

const ArticleThumbnail = ({ category, featured }) => {
  const { bg, light } = categoryStyle(category);
  return (
    <div style={{
      width: "100%",
      height: featured ? 160 : 110,
      background: light,
      borderBottom: "1px solid var(--border-light)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      flexShrink: 0,
    }}>
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `radial-gradient(circle at 30% 50%, ${bg}18, transparent 60%), radial-gradient(circle at 80% 20%, ${bg}10, transparent 50%)`,
      }} />
      <div style={{
        width: 48, height: 48, borderRadius: "var(--radius-full)",
        background: `${bg}20`, border: `1px solid ${bg}30`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <BookOpen size={20} style={{ color: bg, opacity: 0.8 }} />
      </div>
    </div>
  );
};

const BlogCard = ({ post, featured = false, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    onClick={onClick}
    style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-md)",
      cursor: "pointer",
      transition: "var(--transition)",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}
    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent-sage-ring)"; e.currentTarget.style.boxShadow = "var(--shadow-hover)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
  >
    <ArticleThumbnail category={post.category} featured={featured} />

    <div style={{ padding: featured ? "var(--space-5)" : "var(--space-4)", display: "flex", flexDirection: "column", flex: 1 }}>
      <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center", marginBottom: "var(--space-3)" }}>
        <span style={{
          fontSize: "0.65rem", padding: "2px 10px", borderRadius: "var(--radius-full)",
          background: `${categoryStyle(post.category).bg}15`,
          color: categoryStyle(post.category).bg,
          fontWeight: 700, border: `1px solid ${categoryStyle(post.category).bg}25`,
        }}>
          {post.category}
        </span>
        {featured && (
          <span style={{ fontSize: "0.65rem", padding: "2px 10px", borderRadius: "var(--radius-full)", background: "var(--accent-amber-bg)", color: "var(--accent-amber)", fontWeight: 600 }}>
            Featured
          </span>
        )}
      </div>

      <h3 style={{
        fontFamily: "var(--font-heading)",
        fontSize: featured ? "var(--text-lg)" : "var(--text-sm)",
        fontWeight: 600, color: "var(--text-primary)",
        lineHeight: "var(--leading-snug)",
        marginBottom: "var(--space-2)", flex: "0 0 auto",
      }}>
        {post.title}
      </h3>

      <p style={{
        fontSize: "var(--text-xs)", color: "var(--text-muted)",
        lineHeight: "var(--leading-relaxed)", flex: 1,
        overflow: "hidden", display: "-webkit-box",
        WebkitLineClamp: featured ? 3 : 2, WebkitBoxOrient: "vertical",
      }}>
        {post.summary}
      </p>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "var(--space-4)", paddingTop: "var(--space-3)", borderTop: "1px solid var(--border-light)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--text-faint)" }}>{post.date}</span>
          <span style={{ display: "flex", alignItems: "center", gap: "var(--space-1)", fontSize: "var(--text-xs)", color: "var(--text-faint)" }}>
            <Clock size={10} /> {post.readTime}
          </span>
        </div>
        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--text-xs)", color: "var(--accent-sage)", fontWeight: 600 }}>
          Read <ChevronRight size={12} />
        </span>
      </div>
    </div>
  </motion.div>
);

const PostDetail = ({ post, onBack }) => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
    <button
      onClick={onBack}
      style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", marginBottom: "var(--space-6)", padding: 0 }}
    >
      <ChevronLeft size={14} /> Back to Blog
    </button>

    <ArticleThumbnail category={post.category} featured />

    <div style={{ paddingTop: "var(--space-6)" }}>
      <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-4)" }}>
        <span style={{
          fontSize: "0.65rem", padding: "2px 10px", borderRadius: "var(--radius-full)",
          background: `${categoryStyle(post.category).bg}15`,
          color: categoryStyle(post.category).bg, fontWeight: 700,
        }}>
          {post.category}
        </span>
      </div>
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-3xl)", fontWeight: 600, color: "var(--text-primary)", lineHeight: "var(--leading-snug)", marginBottom: "var(--space-3)" }}>
        {post.title}
      </h1>
      <div style={{ display: "flex", gap: "var(--space-4)", marginBottom: "var(--space-8)", paddingBottom: "var(--space-6)", borderBottom: "1px solid var(--border-light)" }}>
        <span style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>{post.date}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
          <Clock size={12} /> {post.readTime} read
        </span>
      </div>
      <div style={{ fontSize: "var(--text-base)", color: "var(--text-secondary)", lineHeight: "var(--leading-relaxed)" }}>
        <p>{post.summary}</p>
        <div style={{ marginTop: "var(--space-6)", padding: "var(--space-5)", background: "var(--bg-surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
          <p>{post.content}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

const BlogContent = ({ selectedPost, setSelectedPost, search, setSearch, category, setCategory, filtered, featured, rest }) => {
  if (selectedPost) {
    return <PostDetail post={selectedPost} onBack={() => setSelectedPost(null)} />;
  }

  return (
    <div>
      {/* Search + Category */}
      <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", marginBottom: "var(--space-6)" }}>
        <div style={{ position: "relative", flex: "1 1 200px" }}>
          <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles…"
            style={{ width: "100%", paddingLeft: 30, paddingRight: search ? 28 : 10, paddingTop: "0.45rem", paddingBottom: "0.45rem", border: "1px solid var(--border-medium)", borderRadius: "var(--radius-sm)", background: "var(--bg-surface)", color: "var(--text-primary)", fontSize: "var(--text-sm)", fontFamily: "var(--font-body)", outline: "none" }}
            onFocus={(e) => { e.target.style.borderColor = "var(--accent-sage)"; }}
            onBlur={(e) => { e.target.style.borderColor = "var(--border-medium)"; }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 1 }}>
              <X size={11} />
            </button>
          )}
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCategory(c)}
              style={{ padding: "4px 14px", borderRadius: "var(--radius-full)", border: `1px solid ${category === c ? "var(--accent-sage)" : "var(--border)"}`, background: category === c ? "var(--accent-sage-bg)" : "transparent", color: category === c ? "var(--accent-sage-text)" : "var(--text-secondary)", fontSize: "var(--text-xs)", fontWeight: category === c ? 600 : 400, cursor: "pointer", transition: "all 0.12s", fontFamily: "var(--font-body)" }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Featured */}
      {featured.length > 0 && (
        <div style={{ marginBottom: "var(--space-8)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-5)" }}>
            <p style={{ fontSize: "var(--text-xs)", fontWeight: 700, letterSpacing: "var(--tracking-wider)", textTransform: "uppercase", color: "var(--text-muted)" }}>Featured</p>
            <div style={{ flex: 1, height: "1px", background: "var(--border-light)" }} />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {featured.map((p) => (
              <BlogCard key={p.id} post={p} featured onClick={() => setSelectedPost(p)} />
            ))}
          </div>
        </div>
      )}

      {/* Rest */}
      {rest.length > 0 && (
        <div>
          {featured.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-5)" }}>
              <p style={{ fontSize: "var(--text-xs)", fontWeight: 700, letterSpacing: "var(--tracking-wider)", textTransform: "uppercase", color: "var(--text-muted)" }}>More Articles</p>
              <div style={{ flex: 1, height: "1px", background: "var(--border-light)" }} />
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-4">
            {rest.map((p) => (
              <BlogCard key={p.id} post={p} onClick={() => setSelectedPost(p)} />
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <BookOpen size={22} style={{ color: "var(--text-muted)" }} />
          </div>
          <h2>No articles found</h2>
          <p>Try a different search or category filter.</p>
          {search && (
            <button onClick={() => setSearch("")} className="btn btn-secondary" style={{ marginTop: "var(--space-2)" }}>
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const Blog = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedPost, setSelectedPost] = useState(null);
  const location = useLocation();
  const isStandalone = location.pathname === "/blog";

  const filtered = CMS_BLOG_POSTS.filter((p) => {
    if (category !== "All" && p.category !== category) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.summary.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const featured = filtered.filter((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured);

  const sharedProps = { selectedPost, setSelectedPost, search, setSearch, category, setCategory, filtered, featured, rest };

  if (isStandalone) {
    return (
      <div style={{ background: "var(--bg-page)", minHeight: "100vh" }}>
        <section className="page-header">
          <div className="page-container">
            <h1>Blog</h1>
            <p>Reading guides, author spotlights, and curated lists.</p>
          </div>
        </section>
        <div className="page-container" style={{ paddingTop: "var(--space-8)", paddingBottom: "var(--space-16)" }}>
          <BlogContent {...sharedProps} />
        </div>
      </div>
    );
  }

  return (
    <div>
      {!selectedPost && (
        <div style={{ marginBottom: "var(--space-7)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-2)" }}>
            <BookOpen size={16} style={{ color: "var(--accent-sage)" }} />
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 600, color: "var(--text-primary)" }}>BookMosaic Blog</h2>
          </div>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>Reading guides, author spotlights, and curated lists.</p>
        </div>
      )}
      <BlogContent {...sharedProps} />
    </div>
  );
};

export default Blog;
