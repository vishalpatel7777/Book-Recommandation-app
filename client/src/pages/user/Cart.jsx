import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, ArrowRight, Package, Gift, BookOpen, Shield, ChevronRight, Tag, X, Check, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../components/common/Loader/Loader";
import CartBookCard from "../../components/books/Card/CartBookCard";
import CustomAlert from "../../components/common/Alert/CustomAlert";
import api from "../../services/axios";
import { usePromotionsLive } from "../../hooks/useCmsLive";
import { clearCartState } from "../../store/slices/user.slice";

const Cart = () => {
  const [cart, setCart]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [total, setTotal]           = useState(0);
  const [showAlert, setShowAlert]   = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = useSelector((s) => s.auth.user?.id ?? null);

  const [liveCouponsHint, setLiveCouponsHint] = useState([]);
  const livePromos = usePromotionsLive();
  const activeBanner = livePromos.find((p) => p.type === "Banner");

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

  const subtotal = cart.reduce((acc, item) => acc + (Number(item.price) || 0), 0);
  // discount is now authoritative from POST /coupons/validate (server/src/services/cms.service.js:95) — not client-calc from mock
  const discount = appliedCoupon?.discount ?? 0;
  useEffect(()=>{ api.get("/cms/coupons").then(({data})=>{ const list=data?.data??data; const arr=Array.isArray(list)?list:(Array.isArray(list?.data)?list.data:[]); if(Array.isArray(arr)) setLiveCouponsHint(arr.filter(c=>c.status==="active").slice(0,3)); }).catch(()=>{}); },[]);

  useEffect(() => {
    setTotal((subtotal - discount).toFixed(2));
  }, [cart, appliedCoupon]);

  const applyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) { setCouponError("Enter a coupon code."); return; }
    setCouponError("");
    setCouponLoading(true);
    try {
      // API-validated — replaces previous CMS_COUPONS mock lookup (server/src/services/cms.service.js:95 validateCoupon)
      const { data } = await api.post("/coupons/validate", { code, cartTotal: subtotal });
      if (!data?.valid && !data?.success) {
        // /coupons/validate returns {success:true, valid, discount, message}
        const valid = data?.valid ?? data?.success;
        if (!valid) { setCouponError(data?.message || "Invalid coupon code."); return; }
      }
      if (data?.valid === false) { setCouponError(data?.message || "Invalid coupon code."); return; }
      // store authoritative discount from server; keep code for display/removal
      setAppliedCoupon({ code, discount: Number(data.discount)||0, couponId: data.couponId, type: "flat", value: Number(data.discount)||0 });
      // optionally enrich with full coupon doc for richer display
      try {
        if (data.couponId) {
          const { data: cData } = await api.get(`/cms/coupons/${data.couponId}`);
          const full = cData?.data ?? cData;
          if (full?.code) setAppliedCoupon({ ...full, discount: Number(data.discount)||0 });
        }
      } catch {}
    } catch (e) {
      setCouponError(e?.response?.data?.message || "Invalid coupon code.");
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const handleOrder = async () => {
    if (!cart.length) return;
    try {
      const bookIds = cart.map((b) => b._id).filter(Boolean);
      if (!bookIds.length) {
        setAlertMessage("No valid books in cart.");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
        return;
      }
      const orderData = {
        book: bookIds.length === 1 ? bookIds[0] : bookIds,
        paymentMethod: "Online",
        coupon: appliedCoupon?.code,
        discount,
        total: Number(total),
      };
      const res = await api.post("/add-purchase", orderData);
      // Cart API supports both POST and DELETE for clear; use POST for compatibility
      try { await api.post("/clear-cart"); } catch { try { await api.delete("/clear-cart"); } catch {} }
      setCart([]);
      dispatch(clearCartState());
      navigate("/thankyou", { state: { orderId: res.data.orderId || res.data.order?._id, count: bookIds.length } });
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message;
      if (msg?.includes("already purchased")) {
        setAlertMessage("Some books already purchased — those were skipped, others ordered. Check your library.");
        try { await api.post("/clear-cart"); } catch { try { await api.delete("/clear-cart"); } catch {} }
        setCart([]);
        dispatch(clearCartState());
        navigate("/thankyou", { state: { message: msg } });
        return;
      }
      setAlertMessage(msg || "Failed to place order. Please try again.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 4000);
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
            <div style={{ width: 72, height: 72, borderRadius: "var(--radius-full)", background: "var(--bg-surface)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto var(--space-6)", border: `1px solid var(--border)` }}>
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
                <button className="btn btn-primary flex items-center gap-2">Browse books <ArrowRight size={14} /></button>
              </Link>
              <Link to="/wishlist" style={{ textDecoration: "none" }}>
                <button className="btn btn-secondary">My Wishlist</button>
              </Link>
            </div>
            <div style={{ marginTop: "var(--space-12)", padding: "var(--space-5)", background: "var(--bg-card)", border: `1px solid var(--border)`, borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", gap: "var(--space-4)", textAlign: "left" }}>
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
      <section className="page-header">
        <div className="page-container" style={{ maxWidth: "960px" }}>
          <h1>Your Basket</h1>
          <p>{cart.length} item{cart.length !== 1 ? "s" : ""} · Free delivery on all orders</p>
        </div>
      </section>

      {/* ── CMS PROMO BANNER ── */}
      {activeBanner && (
        <div style={{ background: "var(--accent-sage-bg)", borderBottom: `1px solid var(--accent-sage-ring)`, padding: "10px var(--space-6)", display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-3)" }}>
          <Tag size={12} style={{ color: "var(--accent-sage)" }} />
          <p style={{ fontSize: "var(--text-xs)", color: "var(--accent-sage-text)", fontWeight: 500 }}>
            {activeBanner.name} — Save {activeBanner.discount} · Use code: <strong>{activeBanner.badge || liveCouponsHint[0]?.code || "SAVE"}</strong>
          </p>
        </div>
      )}

      <div className="page-container" style={{ maxWidth: "960px", paddingTop: "var(--space-10)", paddingBottom: "var(--space-10)" }}>
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

            {/* ── COUPON ── */}
            <div style={{ marginTop: "var(--space-8)", padding: "var(--space-5)", background: "var(--bg-card)", border: `1px solid var(--border)`, borderRadius: "var(--radius-md)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-4)" }}>
                <Tag size={13} style={{ color: "var(--accent-sage)" }} />
                <p style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-primary)" }}>Apply Coupon</p>
              </div>

              {!appliedCoupon ? (
                <>
                  <div style={{ display: "flex", gap: "var(--space-3)" }}>
                    <input
                      value={couponCode}
                      onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(""); }}
                      placeholder="Enter coupon code"
                      onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                      style={{ flex: 1, padding: "0.55rem 0.875rem", border: `1px solid ${couponError ? "var(--accent-danger)" : "var(--border-medium)"}`, borderRadius: "var(--radius-sm)", background: "var(--bg-page)", color: "var(--text-primary)", fontSize: "var(--text-sm)", fontFamily: "var(--font-body)", outline: "none", letterSpacing: "0.05em", textTransform: "uppercase" }}
                      onFocus={(e) => { e.target.style.borderColor = "var(--accent-sage)"; }}
                      onBlur={(e) => { e.target.style.borderColor = couponError ? "var(--accent-danger)" : "var(--border-medium)"; }}
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={!couponCode.trim() || couponLoading}
                      className="btn btn-primary"
                      style={{ minWidth: 80, fontSize: "var(--text-sm)" }}
                    >
                      {couponLoading ? "…" : "Apply"}
                    </button>
                  </div>
                  {couponError && (
                    <p style={{ fontSize: "var(--text-xs)", color: "var(--accent-danger)", marginTop: "var(--space-2)", display: "flex", alignItems: "center", gap: 4 }}>
                      <AlertCircle size={11} /> {couponError}
                    </p>
                  )}
                  {/* Hint available coupons — live from GET /cms/coupons, not mock CMS_COUPONS */}
                  {liveCouponsHint.length > 0 && (
                    <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap", marginTop: "var(--space-3)" }}>
                      {liveCouponsHint.map((c) => (
                        <button key={c.code} onClick={() => { setCouponCode(c.code); setCouponError(""); }}
                          style={{ padding: "2px 10px", borderRadius: "var(--radius-full)", border: `1px dashed var(--accent-sage-ring)`, background: "var(--accent-sage-bg)", color: "var(--accent-sage-text)", fontSize: "0.7rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)", letterSpacing: "0.04em" }}>
                          {c.code}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "var(--space-3) var(--space-4)", background: "var(--accent-sage-bg)", border: `1px solid var(--accent-sage-ring)`, borderRadius: "var(--radius-sm)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--accent-sage)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Check size={12} style={{ color: "#fff" }} />
                    </div>
                    <div>
                      <p style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--accent-sage-text)" }}>{appliedCoupon.code}</p>
                      <p style={{ fontSize: "var(--text-xs)", color: "var(--accent-sage)", marginTop: 1 }}>
                        ₹{Number(appliedCoupon.discount||appliedCoupon.value||0).toFixed(2)} off applied
                      </p>
                    </div>
                  </div>
                  <button onClick={removeCoupon} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--accent-sage)", padding: 4 }}>
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Gift note */}
            <div style={{ marginTop: "var(--space-4)", padding: "var(--space-4) var(--space-5)", background: "var(--bg-surface)", border: `1px solid var(--border-light)`, borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
              <Gift size={18} style={{ color: "var(--accent-amber)", flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-primary)" }}>Sending as a gift?</p>
                <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: "2px" }}>We can add a handwritten note and gift wrap at checkout.</p>
              </div>
            </div>
          </div>

          {/* ── ORDER SUMMARY ── */}
          <div className="sticky top-24 space-y-3">
            <div style={{ background: "var(--bg-card)", border: `1px solid var(--border)`, borderRadius: "var(--radius-md)", padding: "var(--space-6)", boxShadow: "var(--shadow-card)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-5)" }}>
                <Package size={14} style={{ color: "var(--accent-sage)" }} />
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-base)", fontWeight: 600, color: "var(--text-primary)" }}>Order Summary</h2>
              </div>

              <div className="space-y-3 mb-5">
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-sm)" }}>
                  <span style={{ color: "var(--text-muted)" }}>Subtotal ({cart.length} items)</span>
                  <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>₹{subtotal.toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-sm)" }}>
                    <span style={{ color: "var(--accent-sage)", display: "flex", alignItems: "center", gap: 4 }}>
                      <Tag size={11} /> {appliedCoupon.code}
                    </span>
                    <span style={{ color: "var(--accent-sage)", fontWeight: 500 }}>−₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-sm)" }}>
                  <span style={{ color: "var(--text-muted)" }}>Delivery</span>
                  <span style={{ color: "var(--accent-sage)", fontWeight: 500 }}>Free</span>
                </div>
                <div style={{ borderTop: `1px solid var(--border-light)`, paddingTop: "var(--space-3)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "var(--text-sm)" }}>Total</span>
                  <span style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontWeight: 600, color: "var(--text-primary)" }}>₹{total}</span>
                </div>
              </div>

              <button onClick={handleOrder} className="btn btn-primary w-full flex items-center justify-center gap-2" style={{ padding: "0.75rem" }}>
                Place Order <ArrowRight size={14} />
              </button>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", marginTop: "var(--space-4)" }}>
                {[[Shield, "SSL encrypted checkout"], [BookOpen, "Digital delivery included"]].map(([Icon, text]) => (
                  <div key={text} style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                    <Icon size={11} style={{ color: "var(--text-muted)" }} />
                    <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: "var(--space-4)", background: "var(--accent-sage-bg)", border: `1px solid var(--accent-sage-ring)`, borderRadius: "var(--radius-md)" }}>
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
