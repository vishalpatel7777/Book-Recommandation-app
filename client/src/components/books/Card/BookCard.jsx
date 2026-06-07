import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Star, BookOpen, Heart, ShoppingCart } from "lucide-react";

const BookCard = ({ data, compact = false }) => {
  const [imgErr, setImgErr] = useState(false);
  const rating = Number(data.ratings) || 0;
  const stars  = Math.round(rating);

  const cartIds    = useSelector((s) => s.user.cart);
  const wishIds    = useSelector((s) => s.user.wishlist);
  const inCart     = cartIds.includes(data._id);
  const inWishlist = wishIds.includes(data._id);

  if (compact) {
    return (
      <div
        className="flex items-center gap-3 px-3 py-2.5 cursor-pointer"
        style={{ borderRadius: "var(--radius-sm)", transition: "var(--transition-color)" }}
        onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-surface)"}
        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
      >
        <div style={{ width: 32, height: 44, borderRadius: "var(--radius-xs)", overflow: "hidden", background: "var(--bg-parchment)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {!imgErr ? (
            <img src={data.image} alt={data.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={() => setImgErr(true)} />
          ) : (
            <BookOpen size={12} style={{ color: "var(--text-muted)" }} />
          )}
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{data.title || "Untitled"}</p>
          <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{data.author}</p>
          <p style={{ fontSize: "var(--text-xs)", fontWeight: 500, marginTop: "2px", color: "var(--accent-sage)" }}>₹{data.price}</p>
        </div>
      </div>
    );
  }

  return (
    <Link to={`/view-book-details/${data._id}`} style={{ textDecoration: "none" }}>
      <div className="card-book group cursor-pointer" style={{ position: "relative" }}>
        {/* Cover */}
        <div style={{ height: 232, background: "var(--bg-surface)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
          {!imgErr ? (
            <img
              src={data.image}
              alt={data.title}
              className="h-full object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
              onError={() => setImgErr(true)}
              style={{ maxWidth: "85%" }}
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "var(--space-2)", width: "100%", height: "100%", padding: "var(--space-4)" }}>
              <div style={{ width: 48, height: 48, borderRadius: "var(--radius-md)", background: "var(--accent-sage-bg)", border: "1px solid var(--accent-sage-ring)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <BookOpen size={22} style={{ color: "var(--accent-sage)", opacity: 0.7 }} />
              </div>
              {data.title && (
                <p style={{ fontSize: "0.65rem", color: "var(--text-muted)", textAlign: "center", lineHeight: "var(--leading-snug)", maxWidth: 100, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
                  {data.title}
                </p>
              )}
            </div>
          )}

          {/* Genre badge */}
          {data.genre && (
            <span style={{
              position: "absolute",
              top: "var(--space-2)",
              left: "var(--space-2)",
              padding: "2px 8px",
              borderRadius: "var(--radius-full)",
              fontSize: "0.65rem",
              fontWeight: 500,
              background: "var(--accent-sage-bg)",
              border: `1px solid var(--accent-sage-ring)`,
              color: "var(--accent-sage-text)",
            }}>
              {data.genre}
            </span>
          )}

          {/* Status indicators (top-right) */}
          <div style={{ position: "absolute", top: "var(--space-2)", right: "var(--space-2)", display: "flex", flexDirection: "column", gap: 4 }}>
            {inWishlist && (
              <span style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(184,84,80,0.9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Heart size={10} fill="#fff" color="#fff" />
              </span>
            )}
            {inCart && (
              <span style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(92,122,94,0.9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ShoppingCart size={10} color="#fff" />
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: "var(--space-3) var(--space-4)", borderTop: `1px solid var(--border-light)` }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", lineHeight: "var(--leading-snug)", transition: "var(--transition-color)" }}>
            {data.title || "Untitled"}
          </h3>
          <p style={{ fontSize: "var(--text-xs)", marginTop: "2px", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{data.author}</p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "var(--space-2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={10}
                  fill={s <= stars ? "var(--accent-gold)" : "none"}
                  stroke={s <= stars ? "var(--accent-gold)" : "var(--border-medium)"}
                  strokeWidth={1.5}
                />
              ))}
              {rating > 0 && <span style={{ fontSize: "0.65rem", marginLeft: "var(--space-1)", color: "var(--text-muted)" }}>{rating.toFixed(1)}</span>}
            </div>
            <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--accent-sage)" }}>₹{data.price}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
