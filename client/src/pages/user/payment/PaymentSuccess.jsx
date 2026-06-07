import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Download } from "lucide-react";
import api from "../../../services/axios";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { book } = state || {};
  const securePdfUrl = book?.pdf;
  const hasRun = useRef(false);

  useEffect(() => {
    if (!book) {
      navigate("/login");
      return;
    }

    if (hasRun.current) return;
    hasRun.current = true;

    const handlePurchase = async () => {
      try {
        await api.post("/add-purchase", { book: book._id, paymentMethod: "Online" });
        await api.post("/add-notification", {
          book: book._id,
          title: book.title || "Untitled",
          image: book.image || "",
          author: book.author || "Unknown",
          price: Number(book.price) || 0,
          description: "Purchase Successful!",
        });

        if (Notification.permission === "granted") {
          new Notification("Payment Successful!", {
            body: `Your book "${book?.title}" is ready for download.`,
            icon: book?.image || "/default-book.png",
          });
        }
      } catch (err) {
        console.error("Error in payment success:", err.response?.data || err.message);
      }
    };

    handlePurchase();
  }, [navigate, book]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 var(--space-4)", background: "var(--bg-page)" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{ width: "100%", maxWidth: "24rem", textAlign: "center" }}
      >
        <div style={{ borderRadius: "var(--radius-sm)", padding: "var(--space-10)", background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-card)" }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            style={{
              width: 64, height: 64, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto var(--space-6)",
              background: "var(--accent-sage-bg)", border: "1px solid var(--accent-sage-mid)",
            }}
          >
            <CheckCircle size={28} style={{ color: "var(--accent-sage)" }} />
          </motion.div>

          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontWeight: 600, color: "var(--text-primary)", marginBottom: "var(--space-3)" }}>Payment Successful</h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: "var(--space-8)", fontSize: "var(--text-sm)", lineHeight: "var(--leading-relaxed)" }}>
            Your book is ready. Happy reading!
          </p>

          {securePdfUrl && (
            <a
              href={securePdfUrl}
              download
              className="btn btn-primary"
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "var(--space-2)", width: "100%", textDecoration: "none" }}
            >
              <Download size={14} /> Download PDF
            </a>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
