import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookHeart, ArrowLeft, Globe, Tag, AlignLeft, Trash2, Star } from "lucide-react";
import CustomAlert from "../../common/Alert/CustomAlert";
import Loader from "../../common/Loader/Loader";
import api from "../../../services/axios";
import { getBookById } from "../../../services/book.service";
import { useFlashAlert } from '../../../hooks';

const MainWishlist = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [Book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showAlert, alertMessage, flashAlert, setShowAlert } = useFlashAlert();

  useEffect(() => {
    getBookById(id)
      .then(setBook)
      .catch(() => setBook(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRemoveBook = async () => {
    try {
      const response = await api.put('/remove-book-from-wishlist', {}, {
        headers: { bookid: Book?._id },
      });
      flashAlert(response.data.message, () => navigate('/profile/wishlist'));
    } catch (error) {
      flashAlert(error.response?.data?.message || 'Failed to remove book from wishlist');
    }
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-page)" }}>
      <Loader />
    </div>
  );

  if (!Book) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "var(--space-4)", background: "var(--bg-page)" }}>
      <BookHeart size={36} style={{ color: "var(--border-medium)" }} />
      <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>Could not load book details.</p>
      <Link to="/profile/wishlist" style={{ fontSize: "var(--text-sm)", color: "var(--accent-sage)", textDecoration: "none" }}>Back to Wishlist</Link>
    </div>
  );

  const stars = Math.round(Book.ratings || 0);

  return (
    <div style={{ minHeight: "100vh", padding: "var(--space-10) var(--space-6)", maxWidth: "64rem", margin: "0 auto", background: "var(--bg-page)" }}>
      <button
        onClick={() => navigate('/profile/wishlist')}
        style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", transition: "var(--transition-color)", marginBottom: "var(--space-10)" }}
        onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
        onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
      >
        <ArrowLeft size={15} /> Back to Wishlist
      </button>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", flexDirection: "column", gap: "var(--space-12)" }} className="md:flex-row">
        {/* Cover */}
        <div style={{ display: "flex", justifyContent: "center" }} className="md:w-64 shrink-0">
          <div style={{
            background: "var(--bg-surface)",
            width: "100%", maxWidth: "240px", minHeight: "320px",
            borderRadius: "var(--radius-sm)",
            boxShadow: "var(--shadow-book)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <img
              src={Book.image}
              alt={Book.title}
              style={{ maxWidth: "80%", maxHeight: "280px", objectFit: "contain", filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.15))" }}
            />
          </div>
        </div>

        {/* Details */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "var(--space-1)",
            padding: "var(--space-1) var(--space-3)", borderRadius: "var(--radius-full)",
            fontSize: "var(--text-xs)", fontWeight: 500,
            background: "var(--accent-sage-bg)", border: "1px solid var(--accent-sage-mid)", color: "var(--accent-sage-text)",
            marginBottom: "var(--space-5)",
          }}>
            <Tag size={10} /> {Book.genre || "Book"}
          </span>

          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 600, color: "var(--text-primary)", marginBottom: "var(--space-2)" }}>{Book.title}</h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: "var(--space-4)" }}>by <em style={{ color: "var(--text-primary)" }}>{Book.author}</em></p>

          {stars > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1)", marginBottom: "var(--space-5)" }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={13}
                  fill={i < stars ? "var(--accent-gold)" : "none"}
                  stroke={i < stars ? "var(--accent-gold)" : "var(--border-medium)"}
                  strokeWidth={1.5}
                />
              ))}
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginLeft: "var(--space-1)" }}>{Book.ratings?.toFixed(1)}</span>
            </div>
          )}

          <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "var(--space-5)", marginBottom: "var(--space-5)" }}>
            {Book.subject && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
                <AlignLeft size={12} style={{ color: "var(--text-muted)", marginTop: "3px", flexShrink: 0 }} />
                <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
                  <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>Subject:</span> {Book.subject}
                </p>
              </div>
            )}
          </div>

          {Book.desc && (
            <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-5)", maxWidth: "480px" }}>{Book.desc}</p>
          )}

          {Book.url && (
            <a href={Book.url} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-1)", fontSize: "var(--text-sm)", color: "var(--accent-sage)", textDecoration: "none", marginBottom: "var(--space-6)", transition: "var(--transition-color)" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent-sage-dark)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--accent-sage)"}
            >
              <Globe size={12} /> More information
            </a>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)" }}>
            <Link to="/profile/wishlist" style={{ textDecoration: "none" }}>
              <button className="btn btn-secondary">Back to Wishlist</button>
            </Link>
            <button
              onClick={handleRemoveBook}
              style={{
                display: "flex", alignItems: "center", gap: "var(--space-2)",
                padding: "var(--space-2) var(--space-5)", borderRadius: "var(--radius-sm)",
                fontSize: "var(--text-sm)", fontWeight: 500,
                border: "1px solid var(--border-medium)", color: "var(--accent-danger)",
                background: "var(--bg-card)", cursor: "pointer", transition: "var(--transition)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent-danger)"; e.currentTarget.style.background = "rgba(184,84,80,0.04)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-medium)"; e.currentTarget.style.background = "var(--bg-card)"; }}
            >
              <Trash2 size={13} /> Remove from Wishlist
            </button>
          </div>
        </div>
      </motion.div>

      {showAlert && <CustomAlert message={alertMessage} onClose={() => setShowAlert(false)} />}
    </div>
  );
};

export default MainWishlist;
