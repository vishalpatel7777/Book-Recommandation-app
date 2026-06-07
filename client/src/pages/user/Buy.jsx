import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Tag, Layers, Globe } from "lucide-react";
import { useSelector } from "react-redux";
import Loader from "../../components/common/Loader/Loader";
import api from "../../services/axios";
import { getBookById } from "../../services/book.service";

const Buy = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [user, setUser] = useState(null);
  const [userError, setUserError] = useState(null);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.user?.role);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) { setBook(null); return; }
    getBookById(id).then((b) => setBook(b || null)).catch(() => setBook(null));
  }, [id]);

  useEffect(() => {
    if (!isLoggedIn) { setUserError("Please log in to proceed."); return; }
    api.get("/user-information")
      .then((r) => setUser(r.data))
      .catch(() => setUserError("Failed to load user data. Please log in again."));
  }, [isLoggedIn]);

  const handleBuy = () => {
    if (!book || !isLoggedIn || !user) return;
    navigate("/checkout", {
      state: {
        book, bookId: id, amount: book.price,
        customer_id: user._id, customer_email: user.email, customer_phone: user.phone,
      },
    });
  };

  if (!book) return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-page)" }}>
      <Loader />
    </div>
  );

  const isUser = isLoggedIn && role !== "admin";
  const stars = Math.round(book.ratings || 0);

  return (
    <div style={{ minHeight: "100vh", padding: "var(--space-10) var(--space-6)", maxWidth: "64rem", margin: "0 auto", background: "var(--bg-page)" }}>
      <button
        onClick={() => navigate(-1)}
        style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", transition: "var(--transition-color)", marginBottom: "var(--space-10)" }}
        onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
        onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
      >
        <ArrowLeft size={15} /> Back
      </button>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", gap: "var(--space-12)" }} className="flex-col md:flex-row">
        {/* Cover */}
        <div style={{ display: "flex", justifyContent: "center" }} className="md:w-64 shrink-0">
          <div style={{
            background: "var(--bg-surface)", width: "100%", maxWidth: "240px", minHeight: "320px",
            borderRadius: "var(--radius-sm)", boxShadow: "var(--shadow-book)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <img
              src={book.image || "/placeholder.jpg"}
              alt={book.title}
              style={{ maxWidth: "80%", maxHeight: "280px", objectFit: "contain", filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.15))" }}
            />
          </div>
        </div>

        {/* Details */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {book.genre && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "var(--space-1)",
              padding: "var(--space-1) var(--space-3)", borderRadius: "var(--radius-full)",
              fontSize: "var(--text-xs)", fontWeight: 500,
              background: "var(--accent-sage-bg)", border: "1px solid var(--accent-sage-mid)", color: "var(--accent-sage-text)",
              marginBottom: "var(--space-5)",
            }}>
              <Tag size={10} /> {book.genre}
            </span>
          )}

          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "var(--tracking-snug)", marginBottom: "var(--space-2)" }}>
            {book.title || "Untitled"}
          </h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: "var(--space-4)" }}>by <em style={{ color: "var(--text-primary)" }}>{book.author || "Unknown"}</em></p>

          {stars > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1)", marginBottom: "var(--space-5)" }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={13}
                  fill={i < stars ? "var(--accent-gold)" : "none"}
                  stroke={i < stars ? "var(--accent-gold)" : "var(--border-medium)"}
                  strokeWidth={1.5}
                />
              ))}
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginLeft: "var(--space-1)" }}>{book.ratings?.toFixed(1)}</span>
            </div>
          )}

          <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "var(--space-5)", marginBottom: "var(--space-5)", display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            {book.subject && (
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                <Layers size={12} style={{ color: "var(--text-muted)" }} />
                <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}><span style={{ color: "var(--text-primary)", fontWeight: 500 }}>Subject:</span> {book.subject}</span>
              </div>
            )}
            {book.language && (
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                <Globe size={12} style={{ color: "var(--text-muted)" }} />
                <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}><span style={{ color: "var(--text-primary)", fontWeight: 500 }}>Language:</span> {book.language}</span>
              </div>
            )}
          </div>

          {book.desc && (
            <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-6)", maxWidth: "480px" }}>{book.desc}</p>
          )}

          <div style={{ marginBottom: "var(--space-7)" }}>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)", marginBottom: "var(--space-1)" }}>Price</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-2)" }}>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-4xl)", fontWeight: 600, color: "var(--text-primary)" }}>₹{book.price}</span>
              <span style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>one-time</span>
            </div>
          </div>

          {isUser && (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              {userError && <p style={{ fontSize: "var(--text-xs)", color: "var(--accent-danger)", marginBottom: "var(--space-1)" }}>{userError}</p>}
              <button
                onClick={handleBuy}
                disabled={!user || !!userError}
                className="btn btn-primary"
                style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "var(--space-2)", padding: "var(--space-3) var(--space-7)", width: "fit-content", opacity: (!user || userError) ? 0.5 : 1 }}
              >
                Purchase Now
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Buy;
