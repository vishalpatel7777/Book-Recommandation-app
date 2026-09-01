import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Star, BookOpen } from "lucide-react";

const WishlistBookCard = ({ data }) => {
  const [imgErr, setImgErr] = useState(false);
  if (!data || !data._id) return null;
  const rating = Number(data.ratings) || 0;
  const stars  = Math.round(rating);

  return (
    <Link to={`/view-book-details/${data._id}`} style={{ textDecoration: "none" }}>
      <div
        className="card-book group cursor-pointer"
        onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--accent-sage-ring)"}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}
      >
        <div style={{ height: 200, background: "var(--bg-surface)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          {!imgErr ? (
            <img
              src={data.image}
              alt={data.title}
              className="w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
              onError={() => setImgErr(true)}
            />
          ) : (
            <BookOpen size={32} style={{ color: "var(--border-medium)", opacity: 0.5 }} />
          )}
        </div>
        <div style={{ padding: "var(--space-3)" }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{data.title || "Untitled"}</h3>
          <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{data.author}</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "var(--space-2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={10}
                  fill={s <= stars ? "var(--accent-gold)" : "none"}
                  stroke={s <= stars ? "var(--accent-gold)" : "var(--border-medium)"}
                  strokeWidth={1.5}
                />
              ))}
            </div>
            <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--accent-sage)" }}>₹{data.price}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default WishlistBookCard;
