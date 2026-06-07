import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, ShoppingCart, ExternalLink, Star, ChevronDown, ChevronUp, Edit, Trash2, BookOpen } from "lucide-react";
import Loader from "../../common/Loader/Loader";
import CustomAlert from "../../common/Alert/CustomAlert";
import api from "../../../services/axios";
import { getBookById } from "../../../services/book.service";
import { useAuth, useFlashAlert } from "../../../hooks";

const DESCRIPTION_MAX_LENGTH = 280;

const ViewBookDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [Book, setBook]       = useState(null);
  const [showFull, setShowFull] = useState(false);
  const [imgErr, setImgErr]   = useState(false);
  const { isLoggedIn, role }  = useAuth();
  const { showAlert, alertMessage, flashAlert, setShowAlert } = useFlashAlert();

  useEffect(() => {
    getBookById(id).then(setBook).catch(() => setBook(null));
  }, [id]);

  const handleWishlist = async () => {
    if (!isLoggedIn) { navigate("/login"); return; }
    try {
      const res = await api.put("/add-to-wishlist", {}, { headers: { bookid: id } });
      flashAlert(res.data.message);
    } catch (err) {
      flashAlert(err.response?.data?.message || "Failed to add to wishlist");
    }
  };

  const handleCart = async () => {
    if (!isLoggedIn) { navigate("/login"); return; }
    try {
      const res = await api.put("/add-to-cart", {}, { headers: { bookid: id } });
      flashAlert(res.data.message);
    } catch (err) {
      flashAlert(err.response?.data?.message || "Failed to add to cart");
    }
  };

  if (!Book) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ background: "var(--bg-page)" }}>
        <Loader />
      </div>
    );
  }

  const rating     = Number(Book.ratings) || 0;
  const stars      = Math.round(rating);
  const desc       = Book.desc || "";
  const isLong     = desc.length > DESCRIPTION_MAX_LENGTH;
  const displayDesc = isLong && !showFull ? `${desc.slice(0, DESCRIPTION_MAX_LENGTH)}…` : desc;

  // Show user actions when: logged in and not admin
  // This fixes the "Buy Now not visible after login" bug — role may be null on first render
  // but isLoggedIn persists from localStorage, so we also check the user object directly
  const isUser  = isLoggedIn && role !== "admin";
  const isAdmin = isLoggedIn && role === "admin";

  return (
    <>
      <div style={{ minHeight: "100vh", background: "var(--bg-page)" }}>
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-10">

          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 transition-colors mb-10 group"
            style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
            onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            Back
          </button>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="grid lg:grid-cols-2 gap-14 items-start"
          >
            {/* Cover */}
            <div className="flex justify-center">
              <div style={{
                background: "var(--bg-parchment)",
                width: "100%",
                maxWidth: 360,
                minHeight: 460,
                borderRadius: "var(--radius-sm)",
                boxShadow: "var(--shadow-book)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}>
                {!imgErr ? (
                  <motion.img
                    src={Book.image}
                    alt={Book.title}
                    style={{ maxHeight: 420, maxWidth: "80%", objectFit: "contain", filter: "drop-shadow(0 16px 32px rgba(0,0,0,0.2))" }}
                    onError={() => setImgErr(true)}
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                  />
                ) : (
                  <BookOpen size={64} style={{ color: "var(--border-medium)", opacity: 0.5 }} />
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col">
              {Book.genre && (
                <span className="badge badge-sage w-fit mb-5">
                  {Book.genre}
                </span>
              )}

              <h1 style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                fontWeight: 600,
                color: "var(--text-primary)",
                lineHeight: "var(--leading-snug)",
                letterSpacing: "var(--tracking-snug)",
                marginBottom: "var(--space-2)",
              }}>
                {Book.title}
              </h1>
              <p style={{ fontSize: "var(--text-base)", color: "var(--text-muted)", marginBottom: "var(--space-5)" }}>
                by <span style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>{Book.author}</span>
              </p>

              {/* Rating */}
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-6)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14}
                      fill={s <= stars ? "var(--accent-gold)" : "none"}
                      stroke={s <= stars ? "var(--accent-gold)" : "var(--border-medium)"}
                      strokeWidth={1.5}
                    />
                  ))}
                </div>
                <span style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
                  {rating > 0 ? `${rating.toFixed(1)} / 5` : "No ratings yet"}
                </span>
              </div>

              <div style={{ borderTop: `1px solid var(--border-light)`, marginBottom: "var(--space-6)" }} />

              {/* Meta */}
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", marginBottom: "var(--space-6)" }}>
                {Book.subject && (
                  <div style={{ display: "flex", gap: "var(--space-4)", fontSize: "var(--text-sm)" }}>
                    <span style={{ color: "var(--text-muted)", width: 80, flexShrink: 0, fontSize: "var(--text-xs)", paddingTop: "2px" }}>Subject</span>
                    <span style={{ color: "var(--text-secondary)" }}>{Book.subject}</span>
                  </div>
                )}
                {Book.language && (
                  <div style={{ display: "flex", gap: "var(--space-4)", fontSize: "var(--text-sm)" }}>
                    <span style={{ color: "var(--text-muted)", width: 80, flexShrink: 0, fontSize: "var(--text-xs)", paddingTop: "2px" }}>Language</span>
                    <span style={{ color: "var(--text-secondary)" }}>{Book.language}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {desc && (
                <div style={{ marginBottom: "var(--space-6)" }}>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: "var(--leading-relaxed)" }}>
                    {displayDesc}
                    {isLong && (
                      <button
                        onClick={() => setShowFull(!showFull)}
                        className="inline-flex items-center gap-0.5 ml-1.5 font-medium transition-colors"
                        style={{ color: "var(--accent-sage)", fontSize: "var(--text-sm)", background: "none", border: "none", cursor: "pointer" }}
                      >
                        {showFull ? (<>Less <ChevronUp size={11} /></>) : (<>More <ChevronDown size={11} /></>)}
                      </button>
                    )}
                  </p>
                </div>
              )}

              {/* External link */}
              {Book.url && (
                <a
                  href={Book.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 w-fit mb-6 transition-colors"
                  style={{ fontSize: "var(--text-sm)", color: "var(--accent-sage)", textDecoration: "none" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent-sage-dark)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "var(--accent-sage)"}
                >
                  <ExternalLink size={13} /> More information
                </a>
              )}

              {/* Price */}
              <div style={{ marginBottom: "var(--space-8)" }}>
                <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)", marginBottom: "var(--space-1)" }}>Price</p>
                <span style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-4xl)", fontWeight: 600, color: "var(--text-primary)" }}>₹{Book.price}</span>
                <span style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", marginLeft: "var(--space-2)" }}>one-time</span>
              </div>

              {/* ── USER ACTIONS ── */}
              {isUser && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)" }}>
                  <button
                    onClick={handleWishlist}
                    className="btn btn-secondary flex items-center gap-2"
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent-danger)"; e.currentTarget.style.color = "var(--accent-danger)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-medium)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                  >
                    <Heart size={14} /> Wishlist
                  </button>
                  <button
                    onClick={handleCart}
                    className="btn btn-secondary flex items-center gap-2"
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent-sage)"; e.currentTarget.style.color = "var(--accent-sage)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-medium)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                  >
                    <ShoppingCart size={14} /> Add to Cart
                  </button>
                  <Link to={`/buy/${Book._id}`} style={{ textDecoration: "none" }}>
                    <button className="btn btn-primary flex items-center gap-2">
                      Buy Now
                    </button>
                  </Link>
                </div>
              )}

              {/* Not logged in — prompt */}
              {!isLoggedIn && (
                <div style={{
                  padding: "var(--space-4) var(--space-5)",
                  background: "var(--accent-sage-bg)",
                  border: `1px solid var(--accent-sage-ring)`,
                  borderRadius: "var(--radius-md)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "var(--space-3)",
                }}>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--accent-sage-text)" }}>Sign in to purchase, wishlist, or save this book.</p>
                  <Link to="/login" style={{ textDecoration: "none" }}>
                    <button className="btn btn-primary" style={{ fontSize: "var(--text-sm)", padding: "var(--space-2) var(--space-5)" }}>
                      Sign in
                    </button>
                  </Link>
                </div>
              )}

              {/* ── ADMIN ACTIONS ── */}
              {isAdmin && (
                <div style={{ display: "flex", gap: "var(--space-3)" }}>
                  <Link to={`/admin/books/edit-book/${Book._id}`} style={{ textDecoration: "none" }}>
                    <button
                      className="btn btn-secondary flex items-center gap-2"
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--accent-amber)"}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border-medium)"}
                    >
                      <Edit size={13} /> Edit Book
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      {showAlert && <CustomAlert message={alertMessage} onClose={() => setShowAlert(false)} />}
    </>
  );
};

export default ViewBookDetails;
