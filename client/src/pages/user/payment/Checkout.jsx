import { load } from "@cashfreepayments/cashfree-js";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import api from "../../../services/axios";
import Loader from "../../../components/common/Loader/Loader";

function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { amount, customer_id, customer_email, customer_phone, book } = state || {};
  const [paymentSessionId, setPaymentSessionId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializePayment = async () => {
      if (!amount || !customer_id || !customer_email || !customer_phone || !book) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.post("/create-payment", {
          amount,
          currency: "INR",
          customer_id,
          customer_email,
          customer_phone,
          version: "2025-01-01",
        });

        const { orderToken } = response.data;
        setPaymentSessionId(orderToken);

        if (orderToken) {
          const cashfree = await load({ mode: "sandbox" });
          cashfree.checkout({ paymentSessionId: orderToken, redirectTarget: "_modal" })
            .then((result) => {
              if (result.paymentDetails) {
                navigate("/payment-success", {
                  state: { book, amount, customer_email, paymentDetails: result.paymentDetails },
                });
              } else if (result.error) {
                navigate("/payment-failure", { state: { error: result.error.message } });
              }
            });
        }
      } catch (error) {
        console.error("Error fetching session ID:", error);
      } finally {
        setLoading(false);
      }
    };

    initializePayment();
  }, [amount, customer_id, customer_email, customer_phone, book, navigate]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 var(--space-4)", background: "var(--bg-page)" }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center" }}>
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-4)" }}>
            <Loader />
            <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>Preparing your payment...</p>
          </div>
        ) : (
          <div style={{ borderRadius: "var(--radius-sm)", padding: "var(--space-8)", background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <p style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-base)", color: "var(--text-primary)", marginBottom: "var(--space-5)" }}>Payment gateway ready</p>
            <button
              onClick={() => window.location.reload()}
              disabled={!paymentSessionId}
              className="btn btn-primary"
              style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)", opacity: !paymentSessionId ? 0.5 : 1 }}
            >
              <RefreshCw size={13} /> Retry Payment
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default Checkout;
