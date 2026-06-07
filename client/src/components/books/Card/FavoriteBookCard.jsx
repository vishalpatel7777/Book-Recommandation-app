import { useState } from "react";
import { Trash2, Star, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useFlashAlert } from "../../../hooks";
import CustomAlert from "../../common/Alert/CustomAlert";
import api from "../../../services/axios";

const FavoriteBookCard = ({ data, setFavorite }) => {
  const { showAlert, alertMessage, flashAlert, setShowAlert } = useFlashAlert();
  const [imgErr, setImgErr]     = useState(false);
  const [removing, setRemoving] = useState(false);
  const rating = Number(data?.ratings) || 0;
  const stars  = Math.round(rating);

  if (!data) return null;

  const handleRemove = async () => {
    setRemoving(true);
    try {
      const res = await api.put("/remove-book-from-wishlist", {}, { headers: { bookid: data._id } });
      flashAlert(res.data.message);
      if (typeof setFavorite === "function") {
        setFavorite((prev) => prev.filter((item) => item._id !== data._id));
      }
    } catch (err) {
      flashAlert(err.response?.data?.message || "Failed to remove from wishlist");
      setRemoving(false);
    }
  };

  return (
    <>
      <div className="card-book group" style={{ opacity: removing ? 0.5 : 1, transition: "opacity 0.2s" }}>
        <Link to={`/view-book-details/${data._id}`} style={{ textDecoration: "none" }}>
          <div style={{ height: 220, background: "var(--bg-surface)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
            {!imgErr ? (
              <img
                src={data.image || "/placeholder.jpg"}
                alt={data.title}
                className="h-full object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
                style={{ maxWidth: "85%" }}
                onError={() => setImgErr(true)}
              />
            ) : (
              <BookOpen size={40} style={{ color: "var(--border-medium)", opacity: 0.5 }} />
            )}
          </div>
        </Link>

        <div style={{ padding: "var(--space-3) var(--space-4)", borderTop: `1px solid var(--border-light)` }}>
          <Link to={`/view-book-details/${data._id}`} style={{ textDecoration: "none" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "2px", transition: "var(--transition-color)" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent-sage)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-primary)"}
            >{data.title || "Untitled"}</h3>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "var(--space-2)" }}>{data.author || "Unknown"}</p>
          </Link>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-3)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={10}
                  fill={s <= stars ? "var(--accent-gold)" : "none"}
                  stroke={s <= stars ? "var(--accent-gold)" : "var(--border-medium)"}
                  strokeWidth={1.5}
                />
              ))}
            </div>
            <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--accent-sage)" }}>₹{data.price || "—"}</span>
          </div>

          <button
            onClick={handleRemove}
            disabled={removing}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "var(--space-1)",
              padding: "var(--space-2) 0",
              borderRadius: "var(--radius-sm)",
              fontSize: "var(--text-xs)",
              fontWeight: 500,
              border: `1px solid var(--border)`,
              color: "var(--text-muted)",
              background: "transparent",
              cursor: removing ? "not-allowed" : "pointer",
              transition: "var(--transition-color)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent-danger)"; e.currentTarget.style.color = "var(--accent-danger)"; e.currentTarget.style.background = "var(--accent-danger-bg)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "transparent"; }}
          >
            <Trash2 size={11} /> Remove
          </button>
        </div>
      </div>
      {showAlert && <CustomAlert message={alertMessage} onClose={() => setShowAlert(false)} />}
    </>
  );
};

export default FavoriteBookCard;
