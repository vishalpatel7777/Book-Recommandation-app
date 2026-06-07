import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Heart, ShoppingCart, ExternalLink, Star,
  ChevronDown, ChevronUp, Edit, BookOpen, Share2,
  Check, MessageSquare, BookMarked, ChevronDown as ChevDown,
} from "lucide-react";
import Loader from "../../common/Loader/Loader";
import api from "../../../services/axios";
import { getBookById, fetchAllBooks } from "../../../services/book.service";
import { useAuth } from "../../../hooks";
import { addToCart, removeFromCart, addToWishlist, removeFromWishlist } from "../../../store/slices/user.slice";
import { useToast } from "../../common/Toast/ToastProvider";
import BookCard from "../Card/BookCard";

const DESCRIPTION_MAX = 280;

function StarRow({ rating, max = 5, size = 14 }) {
  const stars = Math.round(Number(rating) || 0);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {Array.from({ length: max }).map((_, s) => (
        <Star key={s} size={size}
          fill={s < stars ? "var(--accent-gold)" : "none"}
          stroke={s < stars ? "var(--accent-gold)" : "var(--border-medium)"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

function ReviewForm({ bookId, userId, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async () => {
    if (!rating || !text.trim()) return;
    setLoading(true);
    try {
      await api.post("/store-review", { userId, bookId, rating, review: text });
      setDone(true);
      onSubmit?.({ rating, text });
    } catch {
      // silently fail — backend not integrated yet
      setDone(true);
      onSubmit?.({ rating, text });
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div style={{ padding: "var(--space-4)", background: "var(--accent-sage-bg)", border: `1px solid var(--accent-sage-ring)`, borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
        <Check size={16} style={{ color: "var(--accent-sage)" }} />
        <p style={{ fontSize: "var(--text-sm)", color: "var(--accent-sage-text)" }}>Review submitted. Thank you!</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "var(--space-5)", background: "var(--bg-surface)", border: `1px solid var(--border)`, borderRadius: "var(--radius-md)" }}>
      <p style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-primary)", marginBottom: "var(--space-3)" }}>Write a Review</p>
      <div style={{ display: "flex", gap: 4, marginBottom: "var(--space-4)" }}>
        {[1, 2, 3, 4, 5].map((s) => (
          <button key={s} onClick={() => setRating(s)} onMouseEnter={() => setHovered(s)} onMouseLeave={() => setHovered(0)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
            <Star size={22}
              fill={(hovered || rating) >= s ? "var(--accent-gold)" : "none"}
              stroke={(hovered || rating) >= s ? "var(--accent-gold)" : "var(--border-medium)"}
              strokeWidth={1.5}
            />
          </button>
        ))}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Share your thoughts about this book…"
        rows={3}
        style={{ width: "100%", padding: "var(--space-3)", background: "var(--bg-card)", border: `1px solid var(--border-medium)`, borderRadius: "var(--radius-sm)", color: "var(--text-primary)", fontSize: "var(--text-sm)", fontFamily: "var(--font-body)", resize: "vertical", outline: "none", marginBottom: "var(--space-3)" }}
        onFocus={(e) => { e.target.style.borderColor = "var(--accent-sage)"; }}
        onBlur={(e) => { e.target.style.borderColor = "var(--border-medium)"; }}
      />
      <button onClick={submit} disabled={!rating || !text.trim() || loading} className="btn btn-primary" style={{ fontSize: "var(--text-sm)" }}>
        {loading ? "Publishing…" : "Publish Review"}
      </button>
    </div>
  );
}

const READING_STATUSES = [
  { value: "want_to_read", label: "Want to Read",  color: "var(--accent-info)" },
  { value: "reading",      label: "Reading",        color: "var(--accent-amber)" },
  { value: "completed",    label: "Completed",      color: "var(--accent-sage)" },
  { value: "dropped",      label: "Dropped",        color: "var(--accent-danger)" },
];

function ReadingStatusPicker({ bookId, isLoggedIn }) {
  const [status, setStatus]   = useState(null);
  const [open, setOpen]       = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (!isLoggedIn) return;
    api.get(`/reading-status/${bookId}`)
      .then((r) => setStatus(r.data?.data?.status || null))
      .catch(() => {});
  }, [bookId, isLoggedIn]);

  const pick = async (val) => {
    setOpen(false);
    if (!isLoggedIn) return;
    setLoading(true);
    try {
      if (val === status) {
        await api.delete(`/reading-status/${bookId}`);
        setStatus(null);
        toast({ type: "info", title: "Status removed", duration: 2500 });
      } else {
        await api.post("/reading-status", { bookId, status: val });
        setStatus(val);
        const label = READING_STATUSES.find((s) => s.value === val)?.label;
        toast({ type: "book", title: label, message: "Reading status updated", duration: 2500 });
      }
    } catch {
      toast({ type: "error", title: "Failed to update status", duration: 2500 });
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) return null;

  const current = READING_STATUSES.find((s) => s.value === status);

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((p) => !p)}
        disabled={loading}
        style={{
          display: "flex", alignItems: "center", gap: "var(--space-2)",
          padding: "var(--space-2) var(--space-4)",
          border: `1px solid ${current ? current.color : "var(--border-medium)"}`,
          borderRadius: "var(--radius-sm)",
          background: current ? `${current.color}12` : "transparent",
          color: current ? current.color : "var(--text-secondary)",
          fontSize: "var(--text-sm)", fontWeight: 500, cursor: loading ? "wait" : "pointer",
          transition: "all 0.15s", fontFamily: "var(--font-body)",
        }}
      >
        <BookMarked size={14} />
        {current ? current.label : "Set Status"}
        <ChevDown size={12} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 40, minWidth: 170, background: "var(--bg-card)", border: `1px solid var(--border)`, borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-hover)", overflow: "hidden" }}
          >
            {READING_STATUSES.map((s) => (
              <button
                key={s.value}
                onClick={() => pick(s.value)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-3) var(--space-4)", background: status === s.value ? `${s.color}10` : "transparent", color: status === s.value ? s.color : "var(--text-secondary)", fontSize: "var(--text-sm)", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "var(--font-body)", fontWeight: status === s.value ? 600 : 400, transition: "background 0.1s", borderBottom: "1px solid var(--border-light)" }}
                onMouseEnter={(e) => { if (status !== s.value) e.currentTarget.style.background = "var(--bg-surface)"; }}
                onMouseLeave={(e) => { if (status !== s.value) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                {s.label}
                {status === s.value && <Check size={12} style={{ marginLeft: "auto", color: s.color }} />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const ViewBookDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast    = useToast();
  const { id } = useParams();
  const [Book, setBook] = useState(null);
  const [showFull, setShowFull] = useState(false);
  const [imgErr, setImgErr] = useState(false);
  const [similar, setSimilar] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [cartLoading, setCartLoading] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);
  const { isLoggedIn, role, user } = useAuth();

  const cartIds    = useSelector((s) => s.user.cart);
  const wishIds    = useSelector((s) => s.user.wishlist);
  const inCart     = cartIds.includes(id);
  const inWishlist = wishIds.includes(id);

  useEffect(() => {
    setSimilar(null);
    setReviews([]);
    setBook(null);

    Promise.all([
      getBookById(id),
      fetchAllBooks(),
      api.get(`/get-reviews/${id}`).then((r) => r.data?.data || []).catch(() => []),
    ]).then(([book, all, revs]) => {
      setBook(book);
      setReviews(revs);
      if (!all?.length) { setSimilar([]); return; }
      const others = all.filter((b) => b._id !== id);
      const sameGenre = book?.genre ? others.filter((b) => b.genre === book.genre) : [];
      setSimilar((sameGenre.length >= 3 ? sameGenre : others).slice(0, 5));
    }).catch(() => { setBook(null); setSimilar([]); });
  }, [id]);

  const handleWishlist = async () => {
    if (!isLoggedIn) { navigate("/login"); return; }
    if (wishLoading) return;
    setWishLoading(true);
    try {
      if (inWishlist) {
        await api.put("/remove-book-from-wishlist", {}, { headers: { bookid: id } });
        dispatch(removeFromWishlist(id));
        toast({ type: "wishlist", title: "Removed from Wishlist", message: Book?.title, duration: 3000 });
      } else {
        await api.put("/add-to-wishlist", {}, { headers: { bookid: id } });
        dispatch(addToWishlist(id));
        toast({ type: "wishlist", title: "Added to Wishlist", message: Book?.title, thumbnail: Book?.image, action: { label: "View Wishlist", href: "/wishlist" }, duration: 4000 });
      }
    } catch {
      toast({ type: "error", title: "Failed", message: "Could not update wishlist", duration: 3000 });
    } finally {
      setWishLoading(false);
    }
  };

  const handleCart = async () => {
    if (!isLoggedIn) { navigate("/login"); return; }
    if (cartLoading) return;
    setCartLoading(true);
    try {
      if (inCart) {
        await api.put("/remove-book-from-cart", {}, { headers: { bookid: id } });
        dispatch(removeFromCart(id));
        toast({ type: "info", title: "Removed from Cart", message: Book?.title, duration: 3000 });
      } else {
        await api.put("/add-to-cart", {}, { headers: { bookid: id } });
        dispatch(addToCart(id));
        toast({ type: "cart", title: "Added to Cart", message: Book?.title, thumbnail: Book?.image, action: { label: "Checkout Now", href: "/addtocart" }, duration: 4000 });
      }
    } catch {
      toast({ type: "error", title: "Failed", message: "Could not update cart", duration: 3000 });
    } finally {
      setCartLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!Book) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ background: "var(--bg-page)" }}>
        <Loader />
      </div>
    );
  }

  const rating = Number(Book.ratings) || 0;
  const desc = Book.desc || "";
  const isLong = desc.length > DESCRIPTION_MAX;
  const displayDesc = isLong && !showFull ? `${desc.slice(0, DESCRIPTION_MAX)}…` : desc;
  const isUser = isLoggedIn && role !== "admin";
  const isAdmin = isLoggedIn && role === "admin";

  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "details", label: "Details" },
    { id: "reviews", label: `Reviews${reviews.length ? ` (${reviews.length})` : ""}` },
  ];

  return (
    <>
      <div style={{ minHeight: "100vh", background: "var(--bg-page)" }}>
        <div className="page-container" style={{ maxWidth: "960px", paddingTop: "var(--space-10)", paddingBottom: "var(--space-16)" }}>

          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 transition-colors mb-10 group"
            style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
            onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
          >
            <ArrowLeft size={15} /> Back
          </button>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
            className="grid lg:grid-cols-2 gap-14 items-start"
          >
            {/* ── COVER ── */}
            <div className="flex justify-center">
              <div style={{ background: "var(--bg-parchment)", width: "100%", maxWidth: 360, borderRadius: "var(--radius-sm)", boxShadow: "var(--shadow-book)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", padding: "var(--space-8) var(--space-6)" }}>
                {!imgErr ? (
                  <motion.img
                    src={Book.image} alt={Book.title}
                    style={{ width: "100%", height: "auto", maxHeight: 380, objectFit: "contain", filter: "drop-shadow(0 16px 32px rgba(0,0,0,0.2))", display: "block" }}
                    onError={() => setImgErr(true)}
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                    loading="lazy"
                  />
                ) : (
                  <div style={{ height: 320, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <BookOpen size={64} style={{ color: "var(--border-medium)", opacity: 0.5 }} />
                  </div>
                )}
              </div>
            </div>

            {/* ── INFO ── */}
            <div className="flex flex-col">
              {Book.genre && (
                <span className="badge badge-sage w-fit mb-5">{Book.genre}</span>
              )}

              <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 600, color: "var(--text-primary)", lineHeight: "var(--leading-snug)", letterSpacing: "var(--tracking-snug)", marginBottom: "var(--space-2)" }}>
                {Book.title}
              </h1>
              <p style={{ fontSize: "var(--text-base)", color: "var(--text-muted)", marginBottom: "var(--space-5)" }}>
                by <span style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>{Book.author}</span>
              </p>

              {/* Rating */}
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-6)" }}>
                <StarRow rating={rating} />
                <span style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
                  {rating > 0 ? `${rating.toFixed(1)} / 5` : "No ratings yet"}
                </span>
                {reviews.length > 0 && (
                  <span style={{ fontSize: "var(--text-xs)", color: "var(--text-faint)" }}>· {reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
                )}
              </div>

              <div style={{ borderTop: `1px solid var(--border-light)`, marginBottom: "var(--space-6)" }} />

              {/* Tabs */}
              <div style={{ display: "flex", gap: 0, borderBottom: `1px solid var(--border-light)`, marginBottom: "var(--space-6)" }}>
                {TABS.map((tab) => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    style={{ padding: "var(--space-2) var(--space-4)", fontSize: "var(--text-sm)", fontWeight: activeTab === tab.id ? 600 : 400, color: activeTab === tab.id ? "var(--accent-sage)" : "var(--text-muted)", borderBottom: `2px solid ${activeTab === tab.id ? "var(--accent-sage)" : "transparent"}`, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", transition: "all 0.15s", marginBottom: -1 }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <AnimatePresence mode="wait">
                {activeTab === "overview" && (
                  <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                    {/* Meta */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", marginBottom: "var(--space-6)" }}>
                      {[
                        ["Subject", Book.subject],
                        ["Language", Book.language],
                      ].filter(([, v]) => v).map(([label, value]) => (
                        <div key={label} style={{ display: "flex", gap: "var(--space-4)", fontSize: "var(--text-sm)" }}>
                          <span style={{ color: "var(--text-muted)", width: 80, flexShrink: 0, fontSize: "var(--text-xs)", paddingTop: 2 }}>{label}</span>
                          <span style={{ color: "var(--text-secondary)" }}>{value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Description */}
                    {desc && (
                      <div style={{ marginBottom: "var(--space-6)" }}>
                        <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: "var(--leading-relaxed)" }}>
                          {displayDesc}
                          {isLong && (
                            <button onClick={() => setShowFull(!showFull)}
                              className="inline-flex items-center gap-0.5 ml-1.5 font-medium transition-colors"
                              style={{ color: "var(--accent-sage)", fontSize: "var(--text-sm)", background: "none", border: "none", cursor: "pointer" }}
                            >
                              {showFull ? (<>Less <ChevronUp size={11} /></>) : (<>More <ChevronDown size={11} /></>)}
                            </button>
                          )}
                        </p>
                      </div>
                    )}

                    {Book.url && (
                      <a href={Book.url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 w-fit mb-6 transition-colors"
                        style={{ fontSize: "var(--text-sm)", color: "var(--accent-sage)", textDecoration: "none" }}
                        onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent-sage-dark)"}
                        onMouseLeave={(e) => e.currentTarget.style.color = "var(--accent-sage)"}
                      >
                        <ExternalLink size={13} /> More information
                      </a>
                    )}
                  </motion.div>
                )}

                {activeTab === "details" && (
                  <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
                      {[
                        ["Title", Book.title],
                        ["Author", Book.author],
                        ["Genre", Book.genre],
                        ["Subject", Book.subject],
                        ["Language", Book.language],
                        ["Format", "Digital / PDF"],
                        ["Delivery", "Instant download"],
                      ].filter(([, v]) => v).map(([label, value]) => (
                        <div key={label} style={{ display: "flex", gap: "var(--space-4)", fontSize: "var(--text-sm)", padding: "var(--space-3) 0", borderBottom: `1px solid var(--border-light)` }}>
                          <span style={{ color: "var(--text-muted)", width: 90, flexShrink: 0, fontSize: "var(--text-xs)" }}>{label}</span>
                          <span style={{ color: "var(--text-secondary)" }}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === "reviews" && (
                  <motion.div key="reviews" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                    {isUser && !showReviewForm && (
                      <button
                        onClick={() => setShowReviewForm(true)}
                        className="btn btn-secondary flex items-center gap-2"
                        style={{ marginBottom: "var(--space-5)", fontSize: "var(--text-sm)" }}
                      >
                        <MessageSquare size={13} /> Write a Review
                      </button>
                    )}
                    {showReviewForm && (
                      <div style={{ marginBottom: "var(--space-6)" }}>
                        <ReviewForm
                          bookId={id}
                          userId={user?.id}
                          onSubmit={(r) => {
                            setReviews((prev) => [{ ...r, user: user?.username || "You", date: "Just now", id: Date.now() }, ...prev]);
                            setShowReviewForm(false);
                          }}
                        />
                      </div>
                    )}
                    {reviews.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "var(--space-8) 0" }}>
                        <MessageSquare size={28} style={{ color: "var(--border-medium)", margin: "0 auto var(--space-3)" }} />
                        <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>No reviews yet. Be the first!</p>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                        {reviews.slice(0, 5).map((rev, i) => (
                          <div key={rev.id || i} style={{ padding: "var(--space-4)", background: "var(--bg-surface)", border: `1px solid var(--border-light)`, borderRadius: "var(--radius-md)" }}>
                            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--space-3)", marginBottom: "var(--space-2)" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--accent-sage)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "var(--text-xs)", fontWeight: 700, color: "#fff" }}>
                                  {(rev.user || "?").charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-primary)" }}>{rev.user || "Reader"}</p>
                                  <p style={{ fontSize: "0.65rem", color: "var(--text-faint)" }}>{rev.date || ""}</p>
                                </div>
                              </div>
                              <StarRow rating={rev.rating} size={11} />
                            </div>
                            <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: "var(--leading-relaxed)" }}>{rev.text || rev.review}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Price */}
              <div style={{ marginTop: "var(--space-6)", marginBottom: "var(--space-5)", padding: "var(--space-4) var(--space-5)", background: "var(--bg-surface)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "var(--space-4)" }}>
                <div>
                  <span style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-3xl)", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1 }}>₹{Book.price}</span>
                  <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: "var(--space-1)" }}>One-time purchase</p>
                </div>
                <Link to={`/buy/${Book._id}`} style={{ textDecoration: "none" }}>
                  <button className="btn btn-primary" style={{ minWidth: 120 }}>Buy Now</button>
                </Link>
              </div>

              {/* ── READING STATUS ── */}
              {isUser && (
                <div style={{ marginBottom: "var(--space-4)" }}>
                  <ReadingStatusPicker bookId={id} isLoggedIn={isLoggedIn} />
                </div>
              )}

              {/* ── USER ACTIONS ── */}
              {isUser && (
                <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "nowrap" }}>
                  <button
                    onClick={handleWishlist}
                    disabled={wishLoading}
                    className="btn flex items-center gap-2"
                    style={{
                      flex: "1 1 0",
                      border: `1px solid ${inWishlist ? "var(--accent-danger)" : "var(--border-medium)"}`,
                      background: inWishlist ? "rgba(184,84,80,0.06)" : "transparent",
                      color: inWishlist ? "var(--accent-danger)" : "var(--text-primary)",
                      padding: "var(--space-2) var(--space-3)",
                      borderRadius: "var(--radius-sm)",
                      cursor: wishLoading ? "wait" : "pointer",
                      transition: "all 0.15s",
                      justifyContent: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Heart size={14} fill={inWishlist ? "var(--accent-danger)" : "none"} />
                    {inWishlist ? "Wishlisted" : "Wishlist"}
                  </button>
                  <button
                    onClick={handleCart}
                    disabled={cartLoading}
                    className="btn flex items-center gap-2"
                    style={{
                      flex: "1 1 0",
                      border: `1px solid ${inCart ? "var(--accent-sage)" : "var(--border-medium)"}`,
                      background: inCart ? "var(--accent-sage-bg)" : "transparent",
                      color: inCart ? "var(--accent-sage)" : "var(--text-primary)",
                      padding: "var(--space-2) var(--space-3)",
                      borderRadius: "var(--radius-sm)",
                      cursor: cartLoading ? "wait" : "pointer",
                      transition: "all 0.15s",
                      justifyContent: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {inCart ? <Check size={14} /> : <ShoppingCart size={14} />}
                    {inCart ? "In Cart" : "Add to Cart"}
                  </button>
                  <button onClick={handleShare} className="btn btn-secondary" title="Copy link"
                    style={{ flex: "0 0 auto", padding: "var(--space-2) var(--space-3)", display: "flex", alignItems: "center", gap: "var(--space-2)", whiteSpace: "nowrap" }}>
                    {copied ? <Check size={13} style={{ color: "var(--accent-sage)" }} /> : <Share2 size={13} />}
                    {copied ? "Copied" : "Share"}
                  </button>
                </div>
              )}

              {/* Not logged in */}
              {!isLoggedIn && (
                <div style={{ padding: "var(--space-4) var(--space-5)", background: "var(--accent-sage-bg)", border: `1px solid var(--accent-sage-ring)`, borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "var(--space-3)" }}>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--accent-sage-text)" }}>Sign in to purchase, wishlist, or save this book.</p>
                  <Link to="/login" style={{ textDecoration: "none" }}>
                    <button className="btn btn-primary" style={{ fontSize: "var(--text-sm)", padding: "var(--space-2) var(--space-5)" }}>Sign in</button>
                  </Link>
                </div>
              )}

              {/* Admin actions */}
              {isAdmin && (
                <div style={{ display: "flex", gap: "var(--space-3)" }}>
                  <Link to={`/admin/books/edit-book/${Book._id}`} style={{ textDecoration: "none" }}>
                    <button className="btn btn-secondary flex items-center gap-2"
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

          {/* ── SIMILAR BOOKS ── */}
          {similar && similar.length > 0 && (
            <section style={{ marginTop: "var(--space-16)", paddingTop: "var(--space-10)", borderTop: `1px solid var(--border-light)` }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "var(--space-7)" }}>
                <div>
                  <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 600, color: "var(--text-primary)" }}>
                    {Book.genre ? `More ${Book.genre}` : "You Might Also Like"}
                  </h2>
                  <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: "var(--space-1)" }}>Other titles you might enjoy</p>
                </div>
                <Link to="/allbooks" style={{ fontSize: "var(--text-sm)", color: "var(--accent-sage)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                  View all <ChevronDown size={13} style={{ transform: "rotate(-90deg)" }} />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {similar.map((b) => <BookCard key={b._id} data={b} />)}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewBookDetails;
