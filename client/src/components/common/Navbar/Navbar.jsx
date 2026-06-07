import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, ShoppingCart, Bell, X, Menu, BookOpen, Compass, Library } from "lucide-react";
import api from "../../../services/axios";

const NAV_LOGGED_OUT = [
  { path: "/home",     text: "Home" },
  { path: "/category", text: "Discover" },
  { path: "/allbooks", text: "Library" },
  { path: "/about",    text: "About" },
];

const NAV_LOGGED_IN = [
  { path: "/home",         text: "Home" },
  { path: "/category",     text: "Discover" },
  { path: "/allbooks",     text: "Library" },
  { path: "/profile",      text: "Profile" },
];

const Navbar = () => {
  const [query, setQuery]         = useState("");
  const [results, setResults]     = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const isLoggedIn = useSelector((s) => s.auth.isLoggedIn);
  const location   = useLocation();
  const searchRef  = useRef(null);
  const navigate   = useNavigate();
  const links      = isLoggedIn ? NAV_LOGGED_IN : NAV_LOGGED_OUT;

  useEffect(() => {
    setQuery(""); setResults([]); setSearchOpen(false); setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setResults([]); setQuery(""); setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = async (e) => {
    const val = e.target.value;
    setQuery(val);
    if (!val.trim()) { setResults([]); return; }
    try {
      const res = await api.get("/get-all-books-search", { params: { search: val } });
      setResults(res.data?.data ?? []);
    } catch {
      setResults([]);
    }
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? "rgba(250,248,243,0.97)" : "rgba(250,248,243,0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: `1px solid ${scrolled ? "var(--border-medium)" : "var(--border-light)"}`,
          boxShadow: scrolled ? "var(--shadow-navbar)" : "none",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 sm:px-8 h-[60px] flex items-center justify-between gap-4">

          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 shrink-0"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            <div style={{ width: 28, height: 28, borderRadius: "var(--radius-sm)", background: "var(--accent-sage)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 2.5h10M2 5h10M2 7.5h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <rect x="7" y="6.5" width="5" height="5" rx="0.75" fill="white" opacity="0.7"/>
              </svg>
            </div>
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "var(--text-base)", color: "var(--text-primary)", letterSpacing: "var(--tracking-snug)" }}>
              BookMosaic
            </span>
          </button>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-6" style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {links.map((r) => {
              const active = location.pathname === r.path || location.pathname.startsWith(r.path + "/");
              return (
                <li key={r.path}>
                  <Link
                    to={r.path}
                    style={{
                      fontSize: "var(--text-sm)",
                      fontWeight: active ? 500 : 400,
                      color: active ? "var(--text-primary)" : "var(--text-secondary)",
                      textDecoration: "none",
                      borderBottom: `1px solid ${active ? "var(--accent-sage)" : "transparent"}`,
                      paddingBottom: "1px",
                      transition: "var(--transition-color)",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = active ? "var(--text-primary)" : "var(--text-secondary)"; }}
                  >
                    {r.text}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right cluster */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative" ref={searchRef}>
              {searchOpen ? (
                <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 220, opacity: 1 }} className="flex items-center">
                  <div className="relative w-full">
                    <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text-muted)" }} />
                    <input
                      autoFocus
                      value={query}
                      onChange={handleSearch}
                      placeholder="Search books..."
                      style={{
                        width: "220px",
                        paddingLeft: "2rem",
                        paddingRight: "1.5rem",
                        paddingTop: "0.4rem",
                        paddingBottom: "0.4rem",
                        background: "var(--bg-card)",
                        border: `1px solid var(--border-medium)`,
                        borderRadius: "var(--radius-sm)",
                        color: "var(--text-primary)",
                        fontSize: "var(--text-sm)",
                        outline: "none",
                      }}
                      onFocus={(e) => { e.target.style.borderColor = "var(--accent-sage)"; e.target.style.boxShadow = `0 0 0 3px var(--accent-sage-ring)`; }}
                      onBlur={(e) => { e.target.style.borderColor = "var(--border-medium)"; e.target.style.boxShadow = "none"; }}
                    />
                    {query && (
                      <button
                        onClick={() => { setQuery(""); setResults([]); }}
                        style={{ position: "absolute", right: "0.5rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}
                      >
                        <X size={11} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  style={{ padding: "var(--space-1)", color: "var(--text-secondary)", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", transition: "var(--transition-color)" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
                >
                  <Search size={17} />
                </button>
              )}

              {/* Search dropdown */}
              <AnimatePresence>
                {results.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    style={{
                      position: "absolute",
                      top: "2.5rem",
                      right: 0,
                      width: "320px",
                      background: "var(--bg-card)",
                      border: `1px solid var(--border)`,
                      borderRadius: "var(--radius-md)",
                      boxShadow: "var(--shadow-hover)",
                      overflow: "hidden",
                      zIndex: 50,
                    }}
                  >
                    {results.slice(0, 6).map((book) => (
                      <Link
                        key={book._id}
                        to={`/view-book-details/${book._id}`}
                        onClick={() => { setResults([]); setQuery(""); setSearchOpen(false); }}
                        style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-3) var(--space-4)", borderBottom: `1px solid var(--border-light)`, textDecoration: "none", transition: "var(--transition-color)" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-surface)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      >
                        <div style={{ width: 32, height: 44, borderRadius: "var(--radius-xs)", overflow: "hidden", background: "var(--bg-surface)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <img src={book.image} alt={book.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => e.target.style.display = "none"} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-primary)", fontFamily: "var(--font-heading)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{book.title}</p>
                          <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{book.author}</p>
                        </div>
                      </Link>
                    ))}
                    {results.length > 6 && (
                      <div style={{ padding: "var(--space-2) var(--space-4)", fontSize: "var(--text-xs)", color: "var(--text-muted)", background: "var(--bg-surface)" }}>
                        +{results.length - 6} more results
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Logged-in icons */}
            {isLoggedIn && (
              <div className="flex items-center gap-0.5">
                <NavIcon to="/wishlist"     label="Wishlist"><Heart      size={17} /></NavIcon>
                <NavIcon to="/addtocart"    label="Cart"><ShoppingCart   size={17} /></NavIcon>
                <NavIcon to="/notification" label="Notifications"><Bell  size={17} /></NavIcon>
              </div>
            )}

            {/* Auth buttons */}
            {!isLoggedIn && (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", textDecoration: "none", padding: "var(--space-1) var(--space-3)", transition: "var(--transition-color)" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="btn btn-primary"
                  style={{ fontSize: "var(--text-sm)", padding: "var(--space-2) var(--space-4)", textDecoration: "none" }}
                >
                  Join
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden"
              style={{ padding: "var(--space-1)", color: "var(--text-secondary)", background: "none", border: "none", cursor: "pointer" }}
            >
              {mobileOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
              style={{ borderTop: `1px solid var(--border-light)`, background: "var(--bg-page)" }}
            >
              <div style={{ padding: "var(--space-4) var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
                {links.map((r) => (
                  <Link
                    key={r.path}
                    to={r.path}
                    style={{ padding: "var(--space-2) 0", fontSize: "var(--text-sm)", color: "var(--text-secondary)", textDecoration: "none" }}
                  >
                    {r.text}
                  </Link>
                ))}
                {isLoggedIn && (
                  <div style={{ paddingTop: "var(--space-3)", marginTop: "var(--space-2)", borderTop: `1px solid var(--border-light)`, display: "flex", gap: "var(--space-3)" }}>
                    <Link to="/wishlist"     style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", textDecoration: "none" }}>Wishlist</Link>
                    <Link to="/addtocart"    style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", textDecoration: "none" }}>Cart</Link>
                    <Link to="/notification" style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", textDecoration: "none" }}>Notifications</Link>
                  </div>
                )}
                {!isLoggedIn && (
                  <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-3)", paddingTop: "var(--space-3)", borderTop: `1px solid var(--border-light)` }}>
                    <Link to="/login"  className="btn btn-secondary" style={{ flex: 1, textAlign: "center", textDecoration: "none" }}>Sign in</Link>
                    <Link to="/signup" className="btn btn-primary"   style={{ flex: 1, textAlign: "center", textDecoration: "none" }}>Join</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

const NavIcon = ({ to, label, children }) => (
  <Link
    to={to}
    title={label}
    style={{ padding: "var(--space-1) var(--space-2)", color: "var(--text-secondary)", display: "flex", alignItems: "center", textDecoration: "none", borderRadius: "var(--radius-sm)", transition: "var(--transition-color)" }}
    onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "var(--bg-surface)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "transparent"; }}
  >
    {children}
  </Link>
);

export default Navbar;
