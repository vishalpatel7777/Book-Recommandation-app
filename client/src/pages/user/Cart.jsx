import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, ArrowRight, Package, Gift, BookOpen, Shield, ChevronRight, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../../components/common/Loader/Loader";
import CartBookCard from "../../components/books/Card/CartBookCard";
import CustomAlert from "../../components/common/Alert/CustomAlert";
import api from "../../services/axios";

const BUNDLE_SUGGESTIONS = [
  { icon: "📚", label: "Reading Bundle", desc: "3 books · Save 10%", tag: "Popular" },
  { icon: "🎁", label: "Gift Set",        desc: "Beautifully wrapped", tag: "New" },
];

const Cart = () => {
  const [cart, setCart]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [total, setTotal]           = useState(0);
  const [showAlert, setShowAlert]   = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useNavigate();
  const userId = useSelector((s) => s.auth.user?.id ?? null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/get-user-cart");
        setCart(res.data?.data ?? []);
      } catch {
        setCart([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    setTotal(cart.reduce((acc, item) => acc + (item.price || 0), 0).toFixed(2));
  }, [cart]);

  const handleOrder = async () => {
    try {
      const orderData = {
        user: userId,
        book: cart.map((b) => b._id),
        paymentMethod: "Online",
      };
      const res = await api.post("/add-purchase", orderData);
      await api.delete("/clear-cart");
      setCart([]);
      navigate("/thankyou", { state: { orderId: res.data.orderId } });
    } catch {
      setAlertMessage("Order placement coming soon — payment integration in progress.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ background: "var(--bg-page)" }}>
        <Loader />
      </div>
    );
  }

  if (!cart.length) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-page)" }}>
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <div style={{
              width: 72,
              height: 72,
              borderRadius: "var(--radius-full)",
              background: "var(--bg-surface)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto var(--space-6)",
              border: `1px solid var(--border)`,
            }}>
              <ShoppingCart size={28} style={{ color: "var(--text-muted)" }} />
            </div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontWeight: 600, color: "var(--text-primary)", marginBottom: "var(--space-3)" }}>
              Your basket is empty
            </h2>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", marginBottom: "var(--space-8)", lineHeight: "var(--leading-relaxed)" }}>
              Browse our library and add books you'd like to purchase.
            </p>
            <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "center" }}>
              <Link to="/category" style={{ textDecoration: "none" }}>
                <button className="btn btn-primary flex items-center gap-2">
                  Browse books <ArrowRight size={14} />
                </button>
              </Link>
              <Link to="/wishlist" style={{ textDecoration: "none" }}>
                <button className="btn btn-secondary">My Wishlist</button>
              </Link>
            </div>

            {/* Gift hint */}
            <div style={{
              marginTop: "var(--space-12)",
              padding: "var(--space-5)",
              background: "var(--bg-card)",
              border: `1px solid var(--border)`,
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              gap: "var(--space-4)",
              textAlign: "left",
            }}>
              <Gift size={20} style={{ color: "var(--accent-amber)", flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-primary)" }}>Looking for a gift?</p>
                <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: "2px" }}>We offer beautifully curated gift sets for book lovers.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)" }}>

      {/* ── HEADER ── */}
      <section style={{ padding: "48px 0 0", borderBottom: `1px solid var(--border-light)` }}>
        <div className="max-w-5xl mx-auto px-6 sm:px-8 pb-6">
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-3xl)", fontWeight: 600, color: "var(--text-primary)", marginBottom: "var(--space-1)" }}>
            Your Basket
          </h1>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
            {cart.length} item{cart.length !== 1 ? "s" : ""} · Free delivery on all orders
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-8 items-start">

          {/* ── ITEMS ── */}
          <div className="lg:col-span-2">
            <div className="space-y-3">
              <AnimatePresence>
                {cart.map((book) => (
                  <motion.div key={book._id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CartBookCard data={book} cart={setCart} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Bundle suggestions */}
            <div style={{ marginTop: "var(--space-8)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-4)" }}>
                <Sparkles size={12} style={{ color: "var(--accent-amber)" }} />
                <p style={{ fontSize: "var(--text-xs)", fontWeight: 600, letterSpacing: "var(--tracking-wider)", textTransform: "uppercase", color: "var(--text-muted)" }}>You might also like</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {BUNDLE_SUGGESTIONS.map((s) => (
                  <div key={s.label} style={{
                    padding: "var(--space-4)",
                    background: "var(--bg-card)",
                    border: `1px solid var(--border)`,
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-3)",
                    cursor: "pointer",
                    transition: "var(--transition)",
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent-sage)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
                  >
                    <span style={{ fontSize: "1.5rem" }}>{s.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                        <p style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-primary)" }}>{s.label}</p>
                        <span style={{ fontSize: "0.6rem", padding: "1px 6px", borderRadius: "var(--radius-full)", background: "var(--accent-sage-bg)", color: "var(--accent-sage-dark)", fontWeight: 600 }}>{s.tag}</span>
                      </div>
                      <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{s.desc}</p>
                    </div>
                    <ChevronRight size={14} style={{ color: "var(--text-muted)" }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Gift recommendation */}
            <div style={{
              marginTop: "var(--space-6)",
              padding: "var(--space-5)",
              background: "var(--bg-surface)",
              border: `1px solid var(--border-light)`,
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              gap: "var(--space-4)",
            }}>
              <Gift size={18} style={{ color: "var(--accent-amber)", flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-primary)" }}>Sending as a gift?</p>
                <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: "2px" }}>We can add a handwritten note and gift wrap at checkout.</p>
              </div>
            </div>
          </div>

          {/* ── ORDER SUMMARY ── */}
          <div className="sticky top-24 space-y-3">
            <div style={{
              background: "var(--bg-card)",
              border: `1px solid var(--border)`,
              borderRadius: "var(--radius-md)",
              padding: "var(--space-6)",
              boxShadow: "var(--shadow-card)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-5)" }}>
                <Package size={14} style={{ color: "var(--accent-sage)" }} />
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-base)", fontWeight: 600, color: "var(--text-primary)" }}>Order Summary</h2>
              </div>

              <div className="space-y-3 mb-5">
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-sm)" }}>
                  <span style={{ color: "var(--text-muted)" }}>Subtotal ({cart.length} items)</span>
                  <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>₹{total}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-sm)" }}>
                  <span style={{ color: "var(--text-muted)" }}>Delivery</span>
                  <span style={{ color: "var(--accent-sage)", fontWeight: 500 }}>Free</span>
                </div>
                <div style={{ borderTop: `1px solid var(--border-light)`, paddingTop: "var(--space-3)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "var(--text-sm)" }}>Total</span>
                  <span style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontWeight: 600, color: "var(--text-primary)" }}>₹{total}</span>
                </div>
              </div>

              <button
                onClick={handleOrder}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
                style={{ padding: "0.75rem" }}
              >
                Place Order <ArrowRight size={14} />
              </button>

              {/* Trust signals */}
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", marginTop: "var(--space-4)" }}>
                {[
                  [Shield, "SSL encrypted checkout"],
                  [BookOpen, "Digital delivery included"],
                ].map(([Icon, text]) => (
                  <div key={text} style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                    <Icon size={11} style={{ color: "var(--text-muted)" }} />
                    <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Promo */}
            <div style={{
              padding: "var(--space-4)",
              background: "var(--accent-sage-bg)",
              border: `1px solid var(--accent-sage-ring)`,
              borderRadius: "var(--radius-md)",
            }}>
              <p style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--accent-sage-dark)", marginBottom: "var(--space-1)" }}>📖 BookMosaic Member</p>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--accent-sage-dark)", opacity: 0.8 }}>Free delivery on all orders, forever.</p>
            </div>
          </div>
        </div>
      </div>

      {showAlert && <CustomAlert message={alertMessage} onClose={() => setShowAlert(false)} />}
    </div>
  );
};

export default Cart;
