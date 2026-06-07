import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import BookCard from "../Card/BookCard";
import Loader from "../../common/Loader/Loader";
import api from "../../../services/axios";

const RecommendedBooks = () => {
  const [books, setBooks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    api.get("/get-recommended-books")
      .then((r) => setBooks(r.data?.data ?? []))
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  }, []);

  const VISIBLE = 5;
  const total = books?.length || 0;

  const prev = () => setIdx((i) => Math.max(0, i - 1));
  const next = () => setIdx((i) => Math.min(total - VISIBLE, i + 1));

  const visible = books?.slice(idx, idx + VISIBLE) ?? [];

  return (
    <div style={{ padding: "var(--space-10) var(--space-4)", maxWidth: "80rem", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-7)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          <Sparkles size={14} style={{ color: "var(--accent-sage)" }} />
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "var(--tracking-snug)" }}>Recommended For You</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
          {total > VISIBLE && (
            <>
              <button
                onClick={prev}
                disabled={idx === 0}
                style={{
                  width: 28, height: 28, borderRadius: "var(--radius-sm)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "var(--bg-surface)", border: "1px solid var(--border)",
                  color: idx === 0 ? "var(--text-faint)" : "var(--text-secondary)",
                  cursor: idx === 0 ? "default" : "pointer", transition: "var(--transition)",
                }}
              >
                <ChevronLeft size={13} />
              </button>
              <button
                onClick={next}
                disabled={idx >= total - VISIBLE}
                style={{
                  width: 28, height: 28, borderRadius: "var(--radius-sm)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "var(--bg-surface)", border: "1px solid var(--border)",
                  color: idx >= total - VISIBLE ? "var(--text-faint)" : "var(--text-secondary)",
                  cursor: idx >= total - VISIBLE ? "default" : "pointer", transition: "var(--transition)",
                }}
              >
                <ChevronRight size={13} />
              </button>
            </>
          )}
        </div>
      </div>

      {loading && <div style={{ display: "flex", justifyContent: "center", padding: "var(--space-12) 0" }}><Loader /></div>}

      {!loading && books && books.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 overflow-hidden">
          {visible.map((b, i) => (
            <motion.div
              key={b._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <BookCard data={b} />
            </motion.div>
          ))}
        </div>
      )}

      {!loading && books && books.length === 0 && (
        <p style={{ fontSize: "var(--text-sm)", textAlign: "center", padding: "var(--space-8) 0", color: "var(--text-faint)" }}>
          Rate some books to get personalised recommendations.
        </p>
      )}
    </div>
  );
};

export default RecommendedBooks;
