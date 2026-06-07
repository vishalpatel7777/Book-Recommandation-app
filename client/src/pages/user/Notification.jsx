import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Star, Trash2, MessageSquare, BookOpen, CheckCircle, Package } from "lucide-react";
import CustomAlert from "../../components/common/Alert/CustomAlert";
import Loader from "../../components/common/Loader/Loader";
import api from "../../services/axios";
import { useFlashAlert } from "../../hooks/useFlashAlert";

const StarRating = ({ bookId, rating, onRate, disabled }) => (
  <div style={{ display: "flex", gap: "var(--space-1)" }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <button
        key={s}
        onClick={() => !disabled && onRate(bookId, s)}
        disabled={disabled}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: disabled ? "default" : "pointer",
          transition: "var(--transition-fast)",
        }}
      >
        <Star
          size={20}
          fill={s <= (rating || 0) ? "var(--accent-gold)" : "none"}
          stroke={s <= (rating || 0) ? "var(--accent-gold)" : "var(--border-medium)"}
          strokeWidth={1.5}
        />
      </button>
    ))}
  </div>
);

const Notification = () => {
  const { showAlert, alertMessage, flashAlert, setShowAlert } = useFlashAlert();
  const userId   = useSelector((s) => s.auth.user?.id ?? null);
  const navigate = useNavigate();

  const [notifications, setNotifications]       = useState([]);
  const [loading, setLoading]                   = useState(true);
  const [ratings, setRatings]                   = useState({});
  const [reviews, setReviews]                   = useState({});
  const [submittedReviews, setSubmittedReviews] = useState({});
  const [expanded, setExpanded]                 = useState({});

  useEffect(() => {
    if (!userId) { navigate("/login"); return; }
    fetchAll();
  }, [userId]);

  const fetchAll = async () => {
    try {
      const res   = await api.get(`/get-notifications/${userId}`);
      const notifs = res.data;
      setNotifications(notifs);
      const [rMap, rvMap] = await Promise.all([fetchRatings(notifs), fetchReviews(notifs)]);
      setRatings(rMap);
      setSubmittedReviews(rvMap);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRatings = async (notifs) => {
    const results = await Promise.allSettled(
      notifs.filter((n) => n.book).map((n) =>
        api.get(`/get-rating/${userId}/${n.book}`).then((r) => ({ bookId: n.book, rate: r.data?.rate }))
      )
    );
    return results.reduce((acc, r) => {
      if (r.status === "fulfilled" && r.value.rate !== undefined) acc[r.value.bookId] = r.value.rate;
      return acc;
    }, {});
  };

  const fetchReviews = async (notifs) => {
    const results = await Promise.allSettled(
      notifs.filter((n) => n.book).map((n) =>
        api.get(`/get-review/${userId}/${n.book}`).then((r) => ({ bookId: n.book, review: r.data?.review }))
      )
    );
    return results.reduce((acc, r) => {
      if (r.status === "fulfilled" && r.value.review) acc[r.value.bookId] = r.value.review;
      return acc;
    }, {});
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/delete-notification/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch {
      flashAlert("Failed to delete notification.");
    }
  };

  const handleRating = async (bookId, star) => {
    if (ratings[bookId] !== undefined) { flashAlert("Already rated."); return; }
    try {
      await api.post("/store-rating", { book: bookId, rate: star, user: userId });
      setRatings((prev) => ({ ...prev, [bookId]: star }));
      flashAlert("Rating saved!");
    } catch (err) {
      flashAlert(err.response?.data?.error || "Rating failed.");
    }
  };

  const handleReview = async (bookId, notifId) => {
    const text = (reviews[notifId] || "").trim();
    if (!text) { flashAlert("Review cannot be empty."); return; }
    if (submittedReviews[bookId]) { flashAlert("Already reviewed."); return; }
    try {
      await api.post("/store-review", { userId, bookId, rating: ratings[bookId] || 0, review: text });
      setReviews((prev) => ({ ...prev, [notifId]: "" }));
      setSubmittedReviews((prev) => ({ ...prev, [bookId]: text }));
      flashAlert("Review published!");
    } catch (err) {
      flashAlert(err.response?.data?.error || "Review failed.");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ background: "var(--bg-page)" }}>
        <Loader />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)" }}>

      {/* ── HEADER ── */}
      <section className="page-header">
        <div className="page-container" style={{ maxWidth: "768px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-2)" }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: "var(--radius-full)",
              background: notifications.length ? "var(--accent-sage-bg)" : "var(--bg-surface)",
              border: `1px solid ${notifications.length ? "var(--accent-sage-ring)" : "var(--border)"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Bell size={15} style={{ color: notifications.length ? "var(--accent-sage)" : "var(--text-muted)" }} />
            </div>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontWeight: 600, color: "var(--text-primary)" }}>
              Notifications
            </h1>
            {notifications.length > 0 && (
              <span className="badge badge-sage">{notifications.length}</span>
            )}
          </div>
          {notifications.length > 0 && (
            <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", paddingLeft: "48px" }}>
              Rate and review your purchases below
            </p>
          )}
        </div>
      </section>

      <div style={{ maxWidth: "768px", margin: "0 auto", padding: "var(--space-8) var(--space-6)" }}>
        {!notifications.length ? (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="empty-state">
            <div className="empty-state-icon">
              <Bell size={24} style={{ color: "var(--text-muted)" }} />
            </div>
            <h2>Nothing here yet</h2>
            <p>When you purchase a book, it will appear here for rating and review.</p>
            <a href="/allbooks" className="btn btn-secondary" style={{ marginTop: "var(--space-2)", textDecoration: "none" }}>Browse books</a>
          </motion.div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <AnimatePresence>
              {notifications.map((n, i) => {
                const isExpanded = expanded[n._id];
                const hasRated   = ratings[n.book] !== undefined;
                const hasReviewed = !!submittedReviews[n.book];
                const bothDone   = hasRated && hasReviewed;

                return (
                  <motion.div
                    key={n._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: i * 0.04 }}
                    style={{
                      background: "var(--bg-card)",
                      border: `1px solid ${bothDone ? "var(--border-light)" : "var(--border)"}`,
                      borderRadius: "var(--radius-md)",
                      overflow: "hidden",
                      opacity: bothDone ? 0.75 : 1,
                    }}
                  >
                    {/* Notification row */}
                    <div style={{ padding: "var(--space-5)", display: "flex", gap: "var(--space-4)", alignItems: "flex-start" }}>
                      {/* Book cover */}
                      <div style={{
                        width: 48,
                        height: 64,
                        borderRadius: "var(--radius-xs)",
                        overflow: "hidden",
                        flexShrink: 0,
                        background: "var(--bg-surface)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: `1px solid var(--border-light)`,
                      }}>
                        {n.image ? (
                          <img src={n.image} alt={n.title} style={{ width: "100%", height: "100%", objectFit: "contain", padding: "4px" }}
                            onError={(e) => { e.target.style.display = "none"; }} />
                        ) : (
                          <BookOpen size={16} style={{ color: "var(--text-muted)" }} />
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--space-3)" }}>
                          <div>
                            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-primary)", marginBottom: "2px", lineHeight: "var(--leading-snug)" }}>
                              {n.title}
                            </h3>
                            <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>by {n.author || "Unknown"}</p>
                            {n.price && (
                              <p style={{ fontSize: "var(--text-xs)", fontWeight: 500, color: "var(--accent-sage)", marginTop: "var(--space-1)" }}>₹{n.price}</p>
                            )}
                          </div>
                          <button
                            onClick={() => handleDelete(n._id)}
                            style={{ padding: "var(--space-1)", borderRadius: "var(--radius-sm)", background: "none", border: "none", cursor: "pointer", color: "var(--border-medium)", flexShrink: 0, transition: "var(--transition-color)" }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent-danger)"; e.currentTarget.style.background = "var(--accent-danger-bg)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--border-medium)"; e.currentTarget.style.background = "none"; }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        {/* Status pills */}
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginTop: "var(--space-3)", flexWrap: "wrap" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
                            <Package size={10} style={{ color: "var(--accent-sage)" }} />
                            <span style={{ fontSize: "var(--text-xs)", color: "var(--accent-sage)", fontWeight: 500 }}>Purchased</span>
                          </div>
                          {hasRated && (
                            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
                              <CheckCircle size={10} style={{ color: "var(--accent-gold)" }} />
                              <span style={{ fontSize: "var(--text-xs)", color: "var(--accent-gold)", fontWeight: 500 }}>Rated</span>
                            </div>
                          )}
                          {hasReviewed && (
                            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
                              <CheckCircle size={10} style={{ color: "var(--accent-info)" }} />
                              <span style={{ fontSize: "var(--text-xs)", color: "var(--accent-info)", fontWeight: 500 }}>Reviewed</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Rate & review section */}
                    {n.book && !bothDone && (
                      <div style={{ borderTop: `1px solid var(--border-light)`, padding: "var(--space-4) var(--space-5)" }}>
                        {!isExpanded ? (
                          <button
                            onClick={() => setExpanded((p) => ({ ...p, [n._id]: true }))}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "var(--space-2)",
                              fontSize: "var(--text-xs)",
                              fontWeight: 500,
                              color: "var(--accent-sage)",
                              background: "var(--accent-sage-bg)",
                              border: `1px solid var(--accent-sage-ring)`,
                              borderRadius: "var(--radius-sm)",
                              padding: "var(--space-2) var(--space-4)",
                              cursor: "pointer",
                              transition: "var(--transition)",
                            }}
                          >
                            <Star size={11} /> Rate &amp; review this book
                          </button>
                        ) : (
                          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
                            {/* Rating */}
                            {!hasRated && (
                              <div>
                                <p style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "var(--space-2)", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                                  <Star size={11} style={{ color: "var(--accent-gold)" }} /> How would you rate it?
                                </p>
                                <StarRating bookId={n.book} rating={ratings[n.book]} onRate={handleRating} disabled={hasRated} />
                              </div>
                            )}

                            {/* Review */}
                            {!hasReviewed && (
                              <div>
                                <p style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "var(--space-2)", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                                  <MessageSquare size={11} style={{ color: "var(--text-muted)" }} /> Write a review
                                </p>
                                <div style={{ display: "flex", gap: "var(--space-2)" }}>
                                  <textarea
                                    value={reviews[n._id] || ""}
                                    onChange={(e) => setReviews((p) => ({ ...p, [n._id]: e.target.value }))}
                                    placeholder="Share your thoughts about this book…"
                                    rows={3}
                                    style={{
                                      flex: 1,
                                      padding: "var(--space-3)",
                                      background: "var(--bg-page)",
                                      border: `1px solid var(--border-medium)`,
                                      borderRadius: "var(--radius-sm)",
                                      color: "var(--text-primary)",
                                      fontSize: "var(--text-sm)",
                                      fontFamily: "var(--font-body)",
                                      resize: "none",
                                      outline: "none",
                                      transition: "var(--transition)",
                                    }}
                                    onFocus={(e) => { e.target.style.borderColor = "var(--accent-sage)"; e.target.style.boxShadow = `0 0 0 3px var(--accent-sage-ring)`; }}
                                    onBlur={(e) => { e.target.style.borderColor = "var(--border-medium)"; e.target.style.boxShadow = "none"; }}
                                  />
                                  <button
                                    onClick={() => handleReview(n.book, n._id)}
                                    className="btn btn-primary"
                                    style={{ alignSelf: "flex-end", padding: "var(--space-2) var(--space-4)", fontSize: "var(--text-xs)" }}
                                  >
                                    Publish
                                  </button>
                                </div>
                              </div>
                            )}

                            {submittedReviews[n.book] && (
                              <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", fontStyle: "italic", padding: "var(--space-3)", background: "var(--bg-surface)", borderRadius: "var(--radius-sm)", border: `1px solid var(--border-light)` }}>
                                "{submittedReviews[n.book]}"
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {showAlert && <CustomAlert message={alertMessage} onClose={() => setShowAlert(false)} />}
    </div>
  );
};

export default Notification;
