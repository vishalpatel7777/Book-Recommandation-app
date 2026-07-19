import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, BookOpen, ArrowRight, Calendar, Hash, AlertCircle } from "lucide-react";
import api from "../../../services/axios";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [searchParams] = useSearchParams();
  const hasRun = useRef(false);
  const [status, setStatus] = useState("verifying"); // verifying | success | failed
  const [orderData, setOrderData] = useState(null);

  // Data may come from router state (direct nav) or from Cashfree redirect query params
  const book = state?.book || null;
  const amount = state?.amount || null;
  const cashfreeOrderId = searchParams.get("order_id") || state?.cashfreeOrderId;
  const bookId = state?.book?._id || searchParams.get("book_id");

  const purchaseDate = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  useEffect(() => {
    if (!cashfreeOrderId && !bookId) {
      navigate("/");
      return;
    }
    if (hasRun.current) return;
    hasRun.current = true;

    const verify = async () => {
      try {
        const { data } = await api.post("/verify-payment", {
          order_id: cashfreeOrderId,
          bookId,
          paymentMethod: "Online",
        });

        if (!data.success) {
          setStatus("failed");
          return;
        }

        setOrderData(data);

        // Post notification after successful verification
        if (book) {
          try {
            await api.post("/add-notification", {
              book: book._id,
              title: book.title || "Untitled",
              image: book.image || "",
              author: book.author || "Unknown",
              price: Number(book.price) || 0,
              description: "Purchase Successful!",
            });
          } catch { /* non-fatal */ }
        }

        setStatus("success");
      } catch (err) {
        console.error("Verification error:", err.response?.data || err.message);
        setStatus("failed");
      }
    };

    verify();
  }, [cashfreeOrderId, bookId, navigate, book]);

  const displayOrderId = orderData?.orderId
    ? orderData.orderId.toString().slice(-8).toUpperCase()
    : cashfreeOrderId || `BM-${Date.now().toString(36).toUpperCase()}`;

  if (status === "verifying") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-page)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, border: "3px solid var(--border)", borderTopColor: "var(--accent-sage)", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>Verifying your payment…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--space-8) var(--space-4)", background: "var(--bg-page)" }}>
        <div style={{ textAlign: "center", maxWidth: "28rem", width: "100%", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "var(--space-10)", boxShadow: "var(--shadow-card)" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto var(--space-6)" }}>
            <AlertCircle size={28} style={{ color: "#ef4444" }} />
          </div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontWeight: 600, color: "var(--text-primary)", marginBottom: "var(--space-2)" }}>
            Payment Not Confirmed
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", marginBottom: "var(--space-7)" }}>
            We could not verify your payment. If money was deducted, it will be refunded within 5–7 business days.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <button onClick={() => navigate(-2)} className="btn btn-primary" style={{ width: "100%", padding: "var(--space-3) var(--space-6)" }}>
              Try Again
            </button>
            <button onClick={() => navigate("/")} className="btn btn-secondary" style={{ width: "100%", padding: "var(--space-3) var(--space-6)" }}>
              Browse Books
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--space-8) var(--space-4)", background: "var(--bg-page)" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{ width: "100%", maxWidth: "28rem" }}
      >
        <div style={{
          borderRadius: "var(--radius-sm)", padding: "var(--space-10)",
          background: "var(--bg-card)", border: "1px solid var(--border)",
          boxShadow: "var(--shadow-card)", textAlign: "center",
        }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 220, damping: 16 }}
            style={{
              width: 72, height: 72, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto var(--space-6)",
              background: "var(--accent-sage-bg)", border: "1px solid var(--accent-sage-mid)",
            }}
          >
            <CheckCircle size={32} style={{ color: "var(--accent-sage)" }} />
          </motion.div>

          <h1 style={{
            fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)",
            fontWeight: 600, color: "var(--text-primary)", marginBottom: "var(--space-2)",
          }}>
            Purchase Successful
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-7)" }}>
            Your book has been added to your library.
          </p>

          {book && (
            <div style={{
              display: "flex", gap: "var(--space-3)", alignItems: "center",
              background: "var(--bg-surface)", borderRadius: "var(--radius-sm)",
              padding: "var(--space-3) var(--space-4)", marginBottom: "var(--space-6)",
              textAlign: "left",
            }}>
              {book.image && (
                <div style={{ width: 42, height: 54, flexShrink: 0, borderRadius: "2px", overflow: "hidden" }}>
                  <img src={book.image} alt={book.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "var(--text-sm)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "2px" }}>
                  {book.title}
                </p>
                <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>by {book.author}</p>
              </div>
              {amount && (
                <span style={{
                  fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--text-primary)",
                  fontFamily: "var(--font-heading)", flexShrink: 0,
                }}>
                  ₹{Number(amount)}
                </span>
              )}
            </div>
          )}

          <div style={{
            display: "flex", flexDirection: "column", gap: "var(--space-2)",
            background: "var(--bg-surface)", borderRadius: "var(--radius-sm)",
            padding: "var(--space-4)", marginBottom: "var(--space-7)", textAlign: "left",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <Hash size={11} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>Order ID:</span>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-primary)", fontWeight: 500, fontFamily: "var(--font-mono)" }}>{displayOrderId}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <Calendar size={11} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>Date:</span>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-primary)", fontWeight: 500 }}>{purchaseDate}</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <button
              onClick={() => navigate("/profile/wishlist")}
              className="btn btn-primary"
              style={{
                width: "100%", display: "flex", alignItems: "center",
                justifyContent: "center", gap: "var(--space-2)", padding: "var(--space-3) var(--space-6)",
              }}
            >
              <BookOpen size={14} /> Go to My Library
            </button>
            <button
              onClick={() => navigate("/")}
              className="btn btn-secondary"
              style={{
                width: "100%", display: "flex", alignItems: "center",
                justifyContent: "center", gap: "var(--space-2)", padding: "var(--space-3) var(--space-6)",
              }}
            >
              Browse More Books <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
