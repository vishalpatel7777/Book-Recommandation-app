import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Trash2, BookOpen } from "lucide-react";
import Loader from "../../common/Loader/Loader";
import CustomAlert from "../../common/Alert/CustomAlert";
import api from "../../../services/axios";

const DeleteBook = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const flash = (msg) => { setAlertMessage(msg); setShowAlert(true); setTimeout(() => setShowAlert(false), 2500); };

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/get-all-books-search?search=${search}`);
      setBooks(response.data?.data || []);
    } catch {
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (bookId) => {
    try {
      await api.delete(`/delete-book`, {
        headers: { bookid: bookId },
      });
      setBooks((prev) => prev.filter((b) => b._id !== bookId));
      setConfirmId(null);
      flash("Book deleted successfully");
    } catch (error) {
      flash(error.response?.data?.message || "Failed to delete book");
    }
  };

  useEffect(() => { fetchBooks(); }, [search]);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center gap-2 mb-5">
        <Trash2 size={14} style={{ color: "var(--accent-danger)" }} />
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)" }}>Delete Books</h2>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
        <input
          type="text"
          placeholder="Search by book name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2.5 text-sm rounded-sm outline-none transition-all"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
          onFocus={(e) => { e.target.style.borderColor = "var(--accent-sage)"; e.target.style.boxShadow = "0 0 0 2px var(--accent-sage-ring)"; }}
          onBlur={(e) => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
        />
      </div>

      {loading && <div className="py-12 flex justify-center"><Loader /></div>}

      {!loading && (
        <div className="space-y-1.5">
          <AnimatePresence>
            {books.length > 0 ? (
              books.map((book, index) => (
                <motion.div
                  key={book._id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8, height: 0, marginBottom: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="flex items-center justify-between px-4 py-3 rounded-sm"
                  style={{ background: "var(--bg-surface-hover)", border: "1px solid var(--border-light)" }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-6 h-6 rounded-sm flex items-center justify-center shrink-0" style={{ background: "var(--bg-surface-alt)" }}>
                      <BookOpen size={11} style={{ color: "var(--text-muted)" }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{book.title}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>₹{book.price}</p>
                    </div>
                  </div>

                  {confirmId === book._id ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>Delete?</span>
                      <button
                        onClick={() => deleteBook(book._id)}
                        className="px-3 py-1.5 rounded-sm text-xs font-medium transition-all"
                        style={{ background: "var(--accent-danger-bg)", border: "1px solid var(--border-danger)", color: "var(--accent-danger)" }}
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className="px-3 py-1.5 rounded-sm text-xs transition-all"
                        style={{ background: "var(--bg-surface-alt)", color: "var(--text-muted)", border: "none" }}
                        onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
                        onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmId(book._id)}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium ml-3 transition-all"
                      style={{ background: "var(--accent-danger-bg)", border: "1px solid rgba(184,84,80,0.18)", color: "var(--accent-danger)" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(184,84,80,0.13)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "var(--accent-danger-bg)"}
                    >
                      <Trash2 size={11} /> Delete
                    </button>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="py-14 text-center">
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>No books found</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}

      {showAlert && <CustomAlert message={alertMessage} onClose={() => setShowAlert(false)} />}
    </motion.div>
  );
};

export default DeleteBook;
