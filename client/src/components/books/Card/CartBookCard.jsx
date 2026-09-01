import { useState } from "react";
import { useDispatch } from "react-redux";
import { Trash2, Star, BookOpen } from "lucide-react";
import api from "../../../services/axios";
import { removeFromCart } from "../../../store/slices/user.slice";
import { useToast } from "../../common/Toast/ToastProvider";

const CartBookCard = ({ data, cart }) => {
  const dispatch = useDispatch();
  const toast    = useToast();
  const [imgErr, setImgErr]     = useState(false);
  const [removing, setRemoving] = useState(false);
  if (!data || !data._id) return null;
  const rating = Number(data.ratings) || 0;
  const stars  = Math.round(rating);

  const handleRemove = async () => {
    setRemoving(true);
    try {
      await api.put("/remove-book-from-cart", {}, { headers: { bookid: data._id } });
      dispatch(removeFromCart(data._id));
      if (typeof cart === "function") {
        cart((prev) => prev.filter((item) => item._id !== data._id));
      }
      toast({ type: "info", title: "Removed from Cart", message: data.title, duration: 3000 });
    } catch {
      toast({ type: "error", title: "Failed", message: "Could not remove from cart", duration: 3000 });
      setRemoving(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      gap: "var(--space-4)",
      padding: "var(--space-4)",
      background: "var(--bg-card)",
      border: `1px solid var(--border)`,
      borderRadius: "var(--radius-md)",
      opacity: removing ? 0.5 : 1,
      transition: "var(--transition)",
    }}>
      {/* Cover */}
      <div style={{ width: 56, height: 72, borderRadius: "var(--radius-xs)", overflow: "hidden", flexShrink: 0, background: "var(--bg-surface)", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid var(--border-light)` }}>
        {!imgErr ? (
          <img src={data.image} alt={data.title} style={{ width: "100%", height: "100%", objectFit: "contain", padding: "4px" }} onError={() => setImgErr(true)} />
        ) : (
          <BookOpen size={16} style={{ color: "var(--text-muted)" }} />
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "2px" }}>{data.title || "Untitled"}</h3>
        <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginBottom: "var(--space-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{data.author}</p>
        <div style={{ display: "flex", alignItems: "center", gap: "2px", marginBottom: "var(--space-2)" }}>
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

      {/* Remove */}
      <button
        onClick={handleRemove}
        disabled={removing}
        style={{ alignSelf: "flex-start", padding: "var(--space-1)", borderRadius: "var(--radius-sm)", color: "var(--border-medium)", background: "none", border: "none", cursor: removing ? "not-allowed" : "pointer", transition: "var(--transition-color)" }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent-danger)"; e.currentTarget.style.background = "var(--accent-danger-bg)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "var(--border-medium)"; e.currentTarget.style.background = "none"; }}
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};

export default CartBookCard;
