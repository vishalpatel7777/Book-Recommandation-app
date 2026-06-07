import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Sparkles, Heart, Users } from "lucide-react";

const FEATURES = [
  { icon: <Sparkles size={16} />, title: "Curated Recommendations", desc: "Smart suggestions shaped by your reading taste and habits." },
  { icon: <BookOpen size={16} />, title: "Vast Collection", desc: "Fiction, non-fiction, sci-fi, self-improvement, and more." },
  { icon: <Heart size={16} />, title: "Wishlist & Downloads", desc: "Save favourites and download e-books safely, anytime." },
  { icon: <Users size={16} />, title: "Community & Reviews", desc: "Share insights and explore what fellow readers love." },
];

const About = () => {
  const navigate = useNavigate();

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-page)", paddingTop: "72px" }}>
      {/* Hero */}
      <section style={{ maxWidth: "48rem", margin: "0 auto", padding: "var(--space-16) var(--space-6)", textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--accent-amber)", letterSpacing: "var(--tracking-widest)", textTransform: "uppercase", display: "block", marginBottom: "var(--space-5)" }}>
            Our Story
          </span>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "var(--tracking-tight)", lineHeight: "var(--leading-tight)", marginBottom: "var(--space-6)" }}>
            A home for readers,<br />
            <em style={{ color: "var(--accent-sage)", fontStyle: "italic" }}>built with intention.</em>
          </h1>
          <p style={{ fontSize: "var(--text-base)", color: "var(--text-secondary)", maxWidth: "520px", margin: "0 auto", lineHeight: "var(--leading-relaxed)" }}>
            BookMosaic began with a simple belief — that every reader deserves to find their next great book without sifting through noise. We built a curated space where literature and discovery live together.
          </p>
        </motion.div>
      </section>

      <div style={{ height: "1px", background: "var(--border-light)", maxWidth: "640px", margin: "0 auto" }} />

      {/* Vision */}
      <section style={{ maxWidth: "48rem", margin: "0 auto", padding: "var(--space-14) var(--space-6)" }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <p style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--accent-sage)", letterSpacing: "var(--tracking-widest)", textTransform: "uppercase", marginBottom: "var(--space-3)" }}>
            Our Vision
          </p>
          <p style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 500, color: "var(--text-primary)", lineHeight: "var(--leading-relaxed)", maxWidth: "580px" }}>
            "We aim to build a vibrant reading community where stories bring people together — whether you're a casual reader or a dedicated bookworm."
          </p>
        </motion.div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: "48rem", margin: "0 auto", padding: "0 var(--space-6) var(--space-16)" }}>
        <p style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "var(--tracking-widest)", textTransform: "uppercase", marginBottom: "var(--space-5)" }}>
          What we offer
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              style={{ padding: "var(--space-5)", borderRadius: "var(--radius-sm)", background: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-2)", color: "var(--accent-sage)" }}>
                {f.icon}
                <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-primary)" }}>{f.title}</span>
              </div>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: "var(--leading-relaxed)" }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <div style={{ marginTop: "var(--space-10)", textAlign: "center" }}>
          <button
            onClick={() => navigate("/contact-us")}
            style={{
              display: "inline-flex", alignItems: "center", gap: "var(--space-2)",
              padding: "var(--space-3) var(--space-6)", borderRadius: "var(--radius-sm)",
              fontSize: "var(--text-sm)", fontWeight: 500,
              background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-secondary)",
              cursor: "pointer", transition: "var(--transition)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent-sage)"; e.currentTarget.style.color = "var(--text-primary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
          >
            Get in touch
          </button>
        </div>
      </section>
    </main>
  );
};

export default About;
