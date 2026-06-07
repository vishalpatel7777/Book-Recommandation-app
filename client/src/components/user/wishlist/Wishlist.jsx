import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BookHeart } from "lucide-react";
import Loader from "../../common/Loader/Loader";
import WishlistBookCard from "../../books/Card/WishlistBookCard";
import api from "../../../services/axios";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/get-all-wishlist")
      .then((r) => setWishlist(r.data?.data ?? []))
      .catch(() => setWishlist([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: "var(--space-12) 0", display: "flex", justifyContent: "center" }}><Loader /></div>;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-5)" }}>
        <BookHeart size={15} style={{ color: "var(--accent-danger)" }} />
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-base)", fontWeight: 600, color: "var(--text-primary)" }}>Your Wishlist</h2>
        {wishlist.length > 0 && (
          <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginLeft: "var(--space-1)" }}>— {wishlist.length} saved</span>
        )}
      </div>

      {!wishlist.length ? (
        <div className="empty-state" style={{ minHeight: "30vh" }}>
          <div className="empty-state-icon">
            <BookHeart size={24} style={{ color: "var(--accent-danger)", opacity: 0.6 }} />
          </div>
          <h2>No saved books yet</h2>
          <p>Heart a book to save it here for later.</p>
          <Link to="/allbooks" className="btn btn-secondary" style={{ marginTop: "var(--space-2)", textDecoration: "none" }}>Browse Library</Link>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <AnimatePresence>
            {wishlist.map((book, i) => (
              <motion.div key={book._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <WishlistBookCard data={book} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default Wishlist;
