import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ChevronRight } from "lucide-react";
import BookCard from "../Card/BookCard";
import Loader from "../../common/Loader/Loader";
import { fetchRecentBooks } from "../../../services/book.service";

const SkeletonCard = () => (
  <div className="card-book overflow-hidden">
    <div className="skeleton" style={{ height: 240 }} />
    <div style={{ padding: "var(--space-3)", display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <div className="skeleton h-4 rounded w-4/5" />
      <div className="skeleton h-3 rounded w-3/5" />
      <div className="skeleton h-3 rounded w-2/5" />
    </div>
  </div>
);

const Recentlyaddedbook = () => {
  const [books, setBooks] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecentBooks()
      .then(setBooks)
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: "var(--space-10) var(--space-4)", maxWidth: "80rem", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-7)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          <Clock size={14} style={{ color: "var(--accent-amber)" }} />
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "var(--tracking-snug)" }}>Recently Added</h2>
        </div>
        <button
          onClick={() => navigate("/allbooks")}
          style={{ display: "flex", alignItems: "center", gap: "var(--space-1)", fontSize: "var(--text-sm)", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", transition: "var(--transition-color)" }}
          onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent-sage)"}
          onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
        >
          See all <ChevronRight size={13} />
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : books && books.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          {books.map((b, i) => (
            <motion.div key={b._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <BookCard data={b} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <p style={{ fontSize: "var(--text-sm)", textAlign: "center", padding: "var(--space-8) 0", color: "var(--text-faint)" }}>
          No books available yet.
        </p>
      )}
    </div>
  );
};

export default Recentlyaddedbook;
