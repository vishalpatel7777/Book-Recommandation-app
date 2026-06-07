import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Tag, Shield, BookOpen, Zap, Monitor, Infinity } from "lucide-react";
import { useSelector } from "react-redux";
import Loader from "../../components/common/Loader/Loader";
import BookCard from "../../components/books/Card/BookCard";
import api from "../../services/axios";
import { getBookById, fetchAllBooks } from "../../services/book.service";

const BENEFITS = [
  { icon: Zap,      text: "Instant digital access" },
  { icon: BookOpen, text: "Added automatically to your library" },
  { icon: Monitor,  text: "Read on any device" },
  { icon: Infinity, text: "Lifetime access — no expiry" },
];

const TRUST = [
  "SSL Protected Checkout",
  "Secure Payment Processing",
  "No Subscription Required",
  "One-time Purchase",
];

const Buy = () => {
  const { id } = useParams();
  const [book, setBook]           = useState(null);
  const [user, setUser]           = useState(null);
  const [userError, setUserError] = useState(null);
  const [related, setRelated]     = useState([]);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role       = useSelector((state) => state.auth.user?.role);
  const navigate   = useNavigate();

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

  useEffect(() => {
    fetchAllBooks()
      .then((books) => setRelated(books.filter((b) => b._id !== id).slice(0, 4)))
      .catch(() => {});
  }, [id]);

  const handleProceed = () => {
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

  const isUser     = isLoggedIn && role !== "admin";
  const stars      = Math.round(book.ratings || 0);
  const price      = Number(book.price) || 0;
  const total      = price;

  return (
    <div style={{ background: "var(--bg-page)", padding: "var(--space-10) var(--space-6) var(--space-20)" }}>
      <div style={{ maxWidth: "var(--content-wide)", margin: "0 auto" }}>

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          style={{
            display: "flex", alignItems: "center", gap: "var(--space-2)",
            fontSize: "var(--text-sm)", color: "var(--text-muted)",
            background: "none", border: "none", cursor: "pointer",
            transition: "var(--transition-color)", marginBottom: "var(--space-10)",
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
          onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
        >
          <ArrowLeft size={15} /> Back to Book
        </button>

        {/* Main purchase grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--space-12)", alignItems: "start" }}
          className="buy-grid"
        >
          {/* LEFT — Book info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
            {/* Cover + meta row */}
            <div style={{ display: "flex", gap: "var(--space-10)", flexWrap: "wrap" }}>
              <div style={{
                background: "var(--bg-surface)", width: "240px", height: "320px", flexShrink: 0,
                borderRadius: "var(--radius-sm)", boxShadow: "var(--shadow-book)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <img
                  src={book.image || "/placeholder.jpg"}
                  alt={book.title}
                  style={{ maxWidth: "88%", maxHeight: "300px", objectFit: "contain", filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.14))" }}
                />
              </div>

              <div style={{ flex: 1, minWidth: "220px", paddingTop: "var(--space-2)" }}>
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

                <h1 style={{
                  fontFamily: "var(--font-heading)", fontSize: "clamp(1.5rem, 3vw, 2.1rem)",
                  fontWeight: 600, color: "var(--text-primary)", letterSpacing: "var(--tracking-snug)",
                  marginBottom: "var(--space-3)",
                }}>
                  {book.title || "Untitled"}
                </h1>
                <p style={{ color: "var(--text-secondary)", marginBottom: "var(--space-5)", fontSize: "var(--text-sm)" }}>
                  by <em style={{ color: "var(--text-primary)", fontStyle: "normal", fontWeight: 500 }}>{book.author || "Unknown"}</em>
                </p>

                {stars > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1)", marginBottom: "var(--space-5)" }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={13}
                        fill={i < stars ? "var(--accent-gold)" : "none"}
                        stroke={i < stars ? "var(--accent-gold)" : "var(--border-medium)"}
                        strokeWidth={1.5}
                      />
                    ))}
                    <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginLeft: "var(--space-1)" }}>
                      {book.ratings?.toFixed(1)}
                    </span>
                  </div>
                )}

                {book.desc && (
                  <p style={{
                    fontSize: "var(--text-sm)", color: "var(--text-secondary)",
                    lineHeight: "var(--leading-relaxed)", maxWidth: "480px",
                  }}>
                    {book.desc.length > 240 ? book.desc.slice(0, 240) + "…" : book.desc}
                  </p>
                )}
              </div>
            </div>

            {/* Purchase Benefits */}
            <div style={{
              background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)", padding: "var(--space-5) var(--space-6)",
            }}>
              <p style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)", marginBottom: "var(--space-4)" }}>
                Purchase Benefits
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                {BENEFITS.map(({ icon: Icon, text }) => (
                  <div key={text} style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                      background: "var(--accent-sage-bg)", border: "1px solid var(--accent-sage-mid)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon size={12} style={{ color: "var(--accent-sage)" }} />
                    </div>
                    <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — Order Summary */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", paddingTop: "var(--space-2)" }}>
            <div style={{
              background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)", padding: "var(--space-8)",
              boxShadow: "var(--shadow-card)", position: "sticky", top: "var(--space-8)",
            }}>
              <h2 style={{
                fontFamily: "var(--font-heading)", fontSize: "var(--text-lg)",
                fontWeight: 600, color: "var(--text-primary)", marginBottom: "var(--space-6)",
              }}>
                Order Summary
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", marginBottom: "var(--space-6)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
                    {book.title?.length > 28 ? book.title.slice(0, 28) + "…" : book.title}
                  </span>
                  <span style={{ fontSize: "var(--text-sm)", color: "var(--text-primary)", fontWeight: 500 }}>₹{price}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>Platform fee</span>
                  <span style={{ fontSize: "var(--text-sm)", color: "var(--accent-sage)", fontWeight: 500 }}>Free</span>
                </div>
                {book.discount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>Discount</span>
                    <span style={{ fontSize: "var(--text-sm)", color: "var(--accent-danger)", fontWeight: 500 }}>−₹{book.discount}</span>
                  </div>
                )}
              </div>

              <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "var(--space-4)", marginBottom: "var(--space-6)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: "var(--text-sm)", color: "var(--text-primary)", fontWeight: 600 }}>Total</span>
                  <span style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontWeight: 700, color: "var(--text-primary)" }}>
                    ₹{total}
                  </span>
                </div>
                <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: "var(--space-1)" }}>One-time purchase · No subscription</p>
              </div>

              {isUser ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  {userError && (
                    <p style={{ fontSize: "var(--text-xs)", color: "var(--accent-danger)", textAlign: "center" }}>{userError}</p>
                  )}
                  <button
                    onClick={handleProceed}
                    disabled={!user || !!userError}
                    className="btn btn-primary"
                    style={{
                      width: "100%", padding: "var(--space-3) var(--space-6)",
                      fontSize: "var(--text-sm)", fontWeight: 600,
                      opacity: (!user || userError) ? 0.5 : 1,
                    }}
                  >
                    Proceed to Checkout
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="btn btn-secondary"
                    style={{ width: "100%", padding: "var(--space-3) var(--space-6)", fontSize: "var(--text-sm)" }}
                  >
                    Continue Browsing
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="btn btn-primary"
                  style={{ width: "100%", padding: "var(--space-3) var(--space-6)", fontSize: "var(--text-sm)" }}
                >
                  Sign in to Purchase
                </button>
              )}
            </div>

            {/* Trust section */}
            <div style={{
              background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)", padding: "var(--space-5) var(--space-6)",
            }}>
              <p style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)", marginBottom: "var(--space-3)" }}>
                Secure Purchase
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                {TRUST.map((t) => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                    <Shield size={10} style={{ color: "var(--accent-sage)", flexShrink: 0 }} />
                    <span style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)" }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Related Books */}
        {related.length > 0 && (
          <div style={{ marginTop: "var(--space-20)", paddingTop: "var(--space-8)", borderTop: "1px solid var(--border-light)" }}>
            <h2 style={{
              fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)",
              fontWeight: 600, color: "var(--text-primary)", marginBottom: "var(--space-8)",
            }}>
              You may also enjoy
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "var(--space-6)" }}>
              {related.map((b) => (
                <BookCard key={b._id} data={b} />
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 768px) {
          .buy-grid {
            grid-template-columns: 1fr 380px !important;
          }
        }
        @media (max-width: 767px) {
          .buy-grid > div:first-child > div:first-child {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Buy;
