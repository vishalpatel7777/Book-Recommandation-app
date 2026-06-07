import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import BookCard from "../Card/BookCard";
import { fetchAllBooks } from "../../../services/book.service";

const SkeletonCard = () => (
  <div className="card-book overflow-hidden">
    <div className="skeleton" style={{ height: 232 }} />
    <div style={{ padding: "var(--space-3) var(--space-4)", borderTop: `1px solid var(--border-light)`, display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <div className="skeleton h-3 rounded w-4/5" />
      <div className="skeleton h-3 rounded w-3/5" />
    </div>
  </div>
);

const Allbooks = () => {
  const [books, setBooks] = useState(null);

  useEffect(() => {
    fetchAllBooks().then(setBooks).catch(() => setBooks([]));
  }, []);

  return (
    <div style={{ background: "var(--bg-page)", minHeight: "80vh", padding: "var(--space-10) var(--space-6)" }} className="max-w-6xl mx-auto">
      <div style={{ marginBottom: "var(--space-8)" }}>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontWeight: 600, color: "var(--text-primary)" }}>All Books</h2>
        {books && (
          <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", marginTop: "var(--space-1)" }}>
            {books.length} title{books.length !== 1 ? "s" : ""} in our collection
          </p>
        )}
      </div>

      {books === null && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {books && books.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5"
        >
          {books.map((b, i) => (
            <motion.div key={b._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.4) }}>
              <BookCard data={b} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {books && books.length === 0 && (
        <div className="empty-state">
          <BookOpen size={40} style={{ color: "var(--border-medium)" }} />
          <h2>No books available</h2>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>Check back soon — new titles are added regularly.</p>
        </div>
      )}
    </div>
  );
};

export default Allbooks;
