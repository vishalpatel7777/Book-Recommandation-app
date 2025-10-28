import { load } from "@cashfreepayments/cashfree-js";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios"; // <-- Unused import removed
import api from "../../../services/axios"; // <-- Corrected path

function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { amount, customer_id, customer_email, customer_phone, book } = state || {};
  const [paymentSessionId, setPaymentSessionId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializePayment = async () => {
      if (!amount || !customer_id || !customer_email || !customer_phone || !book) {
        console.error("Missing payment details");
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
                console.log("Payment Successful");
                navigate("/payment-success", {
                  state: {
                    book: book,
                    amount,
                    customer_email,
                    paymentDetails: result.paymentDetails,
                  },
                });
              } else if (result.error) {
                console.log("Error in payment:", result.error);
                // Handle payment failure (e.g., navigate to a failure page)
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
    <div className="relative pt-[121px] overflow-x-hidden p-6 flex items-center justify-center min-h-[calc(100vh-200px)]">
      {loading ? (
        <p className="text-2xl font-semibold">Loading payment gateway...</p>
      ) : (
        <button 
          onClick={() => window.location.reload()} 
          disabled={!paymentSessionId}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 disabled:bg-gray-400"
        >
          Click to Retry Payment
        </button>
      )}
    </div>
  );
}

export default Checkout;