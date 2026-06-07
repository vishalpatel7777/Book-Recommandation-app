import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CreditCard, Smartphone, Building2, Wallet, Shield, ArrowLeft, CheckCircle } from "lucide-react";
import { useSelector } from "react-redux";

const PAYMENT_METHODS = [
  { id: "card",        label: "Credit / Debit Card", icon: CreditCard,  desc: "Visa, Mastercard, RuPay" },
  { id: "upi",         label: "UPI",                 icon: Smartphone,  desc: "GPay, PhonePe, Paytm" },
  { id: "netbanking",  label: "Net Banking",          icon: Building2,   desc: "All major banks" },
  { id: "wallet",      label: "Wallet",               icon: Wallet,      desc: "Paytm, Amazon Pay" },
];

function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const authUser = useSelector((s) => s.auth.user);

  const { amount, customer_email, book } = state || {};
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [name, setName] = useState(authUser?.username || authUser?.fullname || "");
  const [email, setEmail] = useState(customer_email || authUser?.email || "");
  const [placing, setPlacing] = useState(false);

  if (!book || !amount) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-page)" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "var(--text-secondary)", marginBottom: "var(--space-4)" }}>No order found.</p>
          <button onClick={() => navigate("/")} className="btn btn-primary">Browse Books</button>
        </div>
      </div>
    );
  }

  const price = Number(amount) || 0;
  const mockOrderId = `BM-${Date.now().toString(36).toUpperCase()}`;

  const handlePlaceOrder = () => {
    if (!name.trim() || !email.trim()) return;
    setPlacing(true);
    setTimeout(() => {
      navigate("/payment-success", {
        state: { book, amount, customer_email: email, orderId: mockOrderId },
      });
    }, 1800);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)", padding: "var(--space-10) var(--space-6)" }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: "flex", alignItems: "center", gap: "var(--space-2)",
            fontSize: "var(--text-sm)", color: "var(--text-muted)",
            background: "none", border: "none", cursor: "pointer",
            transition: "var(--transition-color)", marginBottom: "var(--space-8)",
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
          onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
        >
          <ArrowLeft size={15} /> Back
        </button>

        <div style={{ marginBottom: "var(--space-8)" }}>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 600, color: "var(--text-primary)", marginBottom: "var(--space-1)" }}>
            Checkout
          </h1>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>Review your order and complete your purchase.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--space-8)" }}
          className="checkout-grid"
        >
          {/* LEFT — Payment form */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
            {/* Order Summary */}
            <section style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "var(--space-6)" }}>
              <h2 style={{ fontSize: "var(--text-base)", fontWeight: 600, color: "var(--text-primary)", marginBottom: "var(--space-4)" }}>
                Order Summary
              </h2>
              <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "center" }}>
                {book.image && (
                  <div style={{
                    width: 56, height: 72, flexShrink: 0,
                    background: "var(--bg-surface)", borderRadius: "var(--radius-sm)",
                    overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <img src={book.image} alt={book.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "var(--text-sm)", marginBottom: "var(--space-1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {book.title}
                  </p>
                  <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginBottom: "var(--space-2)" }}>by {book.author}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>Digital Edition</span>
                    <span style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-lg)", fontWeight: 700, color: "var(--text-primary)" }}>₹{price}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "var(--space-6)" }}>
              <h2 style={{ fontSize: "var(--text-base)", fontWeight: 600, color: "var(--text-primary)", marginBottom: "var(--space-4)" }}>
                Payment Method
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  const active = selectedMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: "var(--space-4)",
                        padding: "var(--space-4) var(--space-4)",
                        border: `1.5px solid ${active ? "var(--accent-sage)" : "var(--border)"}`,
                        borderRadius: "var(--radius-sm)",
                        background: active ? "var(--accent-sage-bg)" : "var(--bg-card)",
                        cursor: "pointer", transition: "var(--transition-color)", textAlign: "left", width: "100%",
                      }}
                    >
                      <div style={{
                        width: 36, height: 36, borderRadius: "var(--radius-sm)",
                        background: active ? "var(--accent-sage)" : "var(--bg-surface)",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        <Icon size={16} style={{ color: active ? "#fff" : "var(--text-muted)" }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-primary)", marginBottom: "2px" }}>{method.label}</p>
                        <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{method.desc}</p>
                      </div>
                      <div style={{
                        width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                        border: `2px solid ${active ? "var(--accent-sage)" : "var(--border-medium)"}`,
                        background: active ? "var(--accent-sage)" : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {active && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Billing Details */}
            <section style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "var(--space-6)" }}>
              <h2 style={{ fontSize: "var(--text-base)", fontWeight: 600, color: "var(--text-primary)", marginBottom: "var(--space-4)" }}>
                Billing Details
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                <div>
                  <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "var(--space-2)", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)" }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    style={{
                      width: "100%", padding: "var(--space-3) var(--space-4)",
                      border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
                      background: "var(--bg-page)", color: "var(--text-primary)",
                      fontSize: "var(--text-sm)", outline: "none",
                      transition: "border-color 0.15s ease", boxSizing: "border-box",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--accent-sage)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "var(--space-2)", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)" }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    style={{
                      width: "100%", padding: "var(--space-3) var(--space-4)",
                      border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
                      background: "var(--bg-page)", color: "var(--text-primary)",
                      fontSize: "var(--text-sm)", outline: "none",
                      transition: "border-color 0.15s ease", boxSizing: "border-box",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--accent-sage)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                  />
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT — Place Order */}
          <div>
            <div style={{
              background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)", padding: "var(--space-6)",
              boxShadow: "var(--shadow-card)", position: "sticky", top: "var(--space-8)",
            }}>
              <h2 style={{ fontSize: "var(--text-base)", fontWeight: 600, color: "var(--text-primary)", marginBottom: "var(--space-5)" }}>
                Price Details
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", marginBottom: "var(--space-5)" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>Book price</span>
                  <span style={{ fontSize: "var(--text-sm)", color: "var(--text-primary)", fontWeight: 500 }}>₹{price}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>Platform fee</span>
                  <span style={{ fontSize: "var(--text-sm)", color: "var(--accent-sage)", fontWeight: 500 }}>Free</span>
                </div>
              </div>

              <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "var(--space-4)", marginBottom: "var(--space-6)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-primary)" }}>Total Amount</span>
                  <span style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontWeight: 700, color: "var(--text-primary)" }}>₹{price}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placing || !name.trim() || !email.trim()}
                className="btn btn-primary"
                style={{
                  width: "100%", padding: "var(--space-4)", fontSize: "var(--text-sm)",
                  fontWeight: 600, marginBottom: "var(--space-4)",
                  opacity: (placing || !name.trim() || !email.trim()) ? 0.6 : 1,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-2)",
                }}
              >
                {placing ? (
                  <>
                    <span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                    Processing…
                  </>
                ) : (
                  <>
                    <CheckCircle size={15} /> Place Order · ₹{price}
                  </>
                )}
              </button>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-2)" }}>
                <Shield size={11} style={{ color: "var(--text-muted)" }} />
                <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>Secure & encrypted payment</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (min-width: 768px) {
          .checkout-grid {
            grid-template-columns: 1fr 300px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Checkout;
