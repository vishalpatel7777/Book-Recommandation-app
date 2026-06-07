import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, Library, Settings, UserCircle,
  ChevronDown, BookOpen, Layers,
  Home, TrendingUp, PlusCircle, Edit3, Trash2, ChevronRight,
} from "lucide-react";

const GROUPS = [
  {
    label: "Overview",
    items: [
      { text: "Home", path: "/admin/home", icon: Home },
      { text: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Catalog",
    items: [
      {
        text: "Books", path: "/admin/books", icon: Library,
        children: [
          { text: "All Books", path: "/admin/books", icon: BookOpen },
          { text: "Add Book", path: "/admin/books/add-book", icon: PlusCircle },
          { text: "Edit Books", path: "/admin/books/edit-books", icon: Edit3 },
          { text: "Delete Books", path: "/admin/books/delete-book", icon: Trash2 },
        ],
      },
    ],
  },
  {
    label: "People",
    items: [
      { text: "Users", path: "/admin/users", icon: Users },
    ],
  },
  {
    label: "Platform",
    items: [
      { text: "Analytics", path: "/admin/dashboard/Monthly-analytics", icon: TrendingUp },
      { text: "CMS", path: "/admin/cms", icon: Layers },
    ],
  },
  {
    label: "Account",
    items: [
      { text: "Profile", path: "/admin/profile", icon: UserCircle },
      { text: "Settings", path: "/admin/settings", icon: Settings },
    ],
  },
];

function NavItem({ item, depth = 0, collapsed }) {
  const location = useLocation();
  const isExact = location.pathname === item.path;
  const isPrefix = item.path !== "/admin/home" && location.pathname.startsWith(item.path);
  const isActive = item.children ? isPrefix : (item.path === "/admin/books" ? isExact : isPrefix || isExact);
  const [open, setOpen] = useState(isActive);
  const Icon = item.icon;

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setOpen((o) => !o)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: collapsed ? "8px 16px" : "8px 16px",
            border: "none",
            background: isActive ? "var(--accent-sage-bg)" : "transparent",
            borderLeft: `2px solid ${isActive ? "var(--accent-sage)" : "transparent"}`,
            cursor: "pointer",
            transition: "all 0.15s",
            justifyContent: collapsed ? "center" : "space-between",
          }}
          title={collapsed ? item.text : undefined}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Icon size={15} style={{ color: isActive ? "var(--accent-sage)" : "var(--text-muted)", flexShrink: 0 }} />
            {!collapsed && (
              <span style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)",
                fontWeight: isActive ? 500 : 400,
                color: isActive ? "var(--accent-sage-text)" : "var(--text-secondary)",
              }}>
                {item.text}
              </span>
            )}
          </div>
          {!collapsed && (
            <ChevronDown size={12} style={{ color: "var(--text-muted)", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
          )}
        </button>
        <AnimatePresence>
          {open && !collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              style={{ overflow: "hidden" }}
            >
              {item.children.map((child) => (
                <NavItem key={child.path} item={child} depth={depth + 1} collapsed={collapsed} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <Link to={item.path} style={{ textDecoration: "none", display: "block" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: collapsed ? "8px 16px" : depth > 0 ? "6px 16px 6px 42px" : "8px 16px",
          background: isActive ? "var(--accent-sage-bg)" : "transparent",
          borderLeft: `2px solid ${isActive ? "var(--accent-sage)" : "transparent"}`,
          transition: "all 0.15s",
          cursor: "pointer",
          justifyContent: collapsed ? "center" : "flex-start",
        }}
        onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "var(--bg-surface)"; }}
        onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
        title={collapsed ? item.text : undefined}
      >
        <Icon size={depth > 0 ? 13 : 15} style={{ color: isActive ? "var(--accent-sage)" : "var(--text-muted)", flexShrink: 0 }} />
        {!collapsed && (
          <span style={{
            fontFamily: "var(--font-body)",
            fontSize: depth > 0 ? "var(--text-xs)" : "var(--text-sm)",
            fontWeight: isActive ? 500 : 400,
            color: isActive ? "var(--accent-sage-text)" : depth > 0 ? "var(--text-muted)" : "var(--text-secondary)",
          }}>
            {item.text}
          </span>
        )}
      </div>
    </Link>
  );
}

const AdminNav = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);

  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: collapsed ? 56 : 220,
        height: "100vh",
        background: "var(--bg-card)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        zIndex: 50,
        transition: "width 0.2s ease",
        overflow: "hidden",
      }}
    >
      {/* Logo row */}
      <div
        style={{
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          padding: "0 14px",
          borderBottom: "1px solid var(--border-light)",
          flexShrink: 0,
          gap: 8,
        }}
      >
        {!collapsed && (
          <button
            onClick={() => navigate("/admin/home")}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, padding: 0, minWidth: 0 }}
          >
            <div style={{ width: 26, height: 26, background: "var(--accent-sage)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M2 2.5h10M2 5h10M2 7.5h6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <rect x="7" y="6.5" width="5" height="5" rx="0.75" fill="white" opacity="0.7" />
              </svg>
            </div>
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "0.88rem", color: "var(--text-primary)", whiteSpace: "nowrap" }}>
              BookMosaic
            </span>
            <span style={{ fontSize: "0.58rem", fontWeight: 700, padding: "1px 5px", borderRadius: 3, background: "var(--accent-amber-bg)", color: "var(--accent-amber-dark)", border: "1px solid rgba(139,111,71,0.22)", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap", flexShrink: 0 }}>
              Admin
            </span>
          </button>
        )}
        {collapsed && (
          <div style={{ width: 26, height: 26, background: "var(--accent-sage)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M2 2.5h10M2 5h10M2 7.5h6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <rect x="7" y="6.5" width="5" height="5" rx="0.75" fill="white" opacity="0.7" />
            </svg>
          </div>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4, borderRadius: 4, display: "flex", flexShrink: 0 }}
          title={collapsed ? "Expand" : "Collapse"}
        >
          <ChevronRight size={13} style={{ transform: collapsed ? "rotate(0deg)" : "rotate(180deg)", transition: "transform 0.2s" }} />
        </button>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", paddingTop: 8, paddingBottom: 8 }}>
        {GROUPS.map((group, gi) => (
          <div key={group.label} style={{ marginBottom: 4 }}>
            {!collapsed && (
              <div style={{ padding: "8px 16px 3px", fontFamily: "var(--font-body)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-faint)" }}>
                {group.label}
              </div>
            )}
            {collapsed && gi > 0 && (
              <div style={{ margin: "6px 14px", borderTop: "1px solid var(--border-light)" }} />
            )}
            {group.items.map((item) => (
              <NavItem key={item.path} item={item} collapsed={collapsed} />
            ))}
          </div>
        ))}
      </div>

      {/* User footer */}
      <div style={{ borderTop: "1px solid var(--border-light)", padding: "10px 14px", flexShrink: 0 }}>
        {!collapsed ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--accent-sage)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.65rem", fontWeight: 700, color: "#fff" }}>
                {(user?.username || "A").charAt(0).toUpperCase()}
              </span>
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", fontWeight: 500, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user?.username || "Admin"}
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.6rem", color: "var(--text-faint)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                Administrator
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--accent-sage)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.65rem", fontWeight: 700, color: "#fff" }}>
                {(user?.username || "A").charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default AdminNav;
