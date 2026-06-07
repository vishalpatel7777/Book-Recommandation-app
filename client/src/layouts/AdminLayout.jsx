import React, { Suspense, createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import ErrorBoundary from '../components/common/ErrorBoundary/ErrorBoundary';
import Loader from '../components/common/Loader/Loader';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Bell, ChevronDown, User, Settings, LogOut,
  X, BookOpen, Users, BarChart3,
  PlusCircle, Home, LayoutDashboard, Layers,
  ShoppingBag, Star, LogIn, LogOut as LogOutIcon,
  Heart, MessageSquare, CreditCard, AlertTriangle,
  CheckCircle, Info, Package, Edit,
} from 'lucide-react';
import AdminNav from '../components/Admin/AdminNav';
import { logout } from '../store/slices/auth.slice';

export const SidebarContext = createContext({ collapsed: false, setCollapsed: () => {} });
export const useSidebar = () => useContext(SidebarContext);

// ── Notification data structure ──────────────────────────────────────────────
// In production this would come from a websocket or polling API.
// Shape: { id, type, title, body, time, read, path? }
const EVENT_ICON = {
  purchase:        ShoppingBag,
  review:          Star,
  login:           LogIn,
  logout:          LogOutIcon,
  wishlist:        Heart,
  cart:            Package,
  refund:          CreditCard,
  'failed-login':  AlertTriangle,
  system:          Info,
  'book-added':    BookOpen,
  'profile-update':Edit,
};

const EVENT_COLOR = {
  purchase:        'var(--accent-sage)',
  review:          'var(--accent-gold)',
  login:           'var(--accent-info)',
  logout:          'var(--text-faint)',
  wishlist:        'var(--accent-danger)',
  cart:            'var(--accent-amber)',
  refund:          'var(--accent-danger)',
  'failed-login':  'var(--accent-danger)',
  system:          'var(--accent-info)',
  'book-added':    'var(--accent-sage)',
  'profile-update':'var(--text-muted)',
};

const SEED_NOTIFICATIONS = [
  { id: '1', type: 'purchase',       title: 'New purchase',           body: 'anjali_r purchased Atomic Habits',               time: '2m ago',  read: false, path: '/admin/users' },
  { id: '2', type: 'review',         title: 'New review',             body: 'meera_k left a 5★ review on Project Hail Mary', time: '11m ago', read: false, path: '/admin/books' },
  { id: '3', type: 'failed-login',   title: 'Failed login attempt',   body: 'Unknown IP tried to access admin panel',         time: '18m ago', read: false },
  { id: '4', type: 'refund',         title: 'Refund requested',       body: 'rohan_d requested refund for The Alchemist',     time: '34m ago', read: false, path: '/admin/users' },
  { id: '5', type: 'book-added',     title: 'Book published',         body: 'Sapiens added to catalog by system import',      time: '1h ago',  read: true,  path: '/admin/books' },
  { id: '6', type: 'login',          title: 'Admin login',            body: 'Admin session started from Chrome / Windows',   time: '2h ago',  read: true },
  { id: '7', type: 'profile-update', title: 'Profile updated',        body: 'priya_m updated her account information',       time: '3h ago',  read: true,  path: '/admin/users' },
  { id: '8', type: 'purchase',       title: 'New purchase',           body: 'kartik_j purchased The Midnight Library',       time: '4h ago',  read: true,  path: '/admin/users' },
];

function timeAgo(isoString) {
  return isoString; // In production: compute from timestamp
}

function NotificationPanel({ notifications, onMarkRead, onMarkAllRead, onClose, anchorRef }) {
  const navigate = useNavigate();
  const ref = useRef(null);
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handler = (e) => {
      if (
        ref.current && !ref.current.contains(e.target) &&
        anchorRef.current && !anchorRef.current.contains(e.target)
      ) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose, anchorRef]);

  const handleItem = (n) => {
    onMarkRead(n.id);
    if (n.path) { navigate(n.path); onClose(); }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.97 }}
      style={{
        position: 'absolute', top: 'calc(100% + 8px)', right: 0,
        width: 360,
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        boxShadow: '0 12px 40px rgba(0,0,0,0.14)',
        zIndex: 100,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.83rem', fontWeight: 600, color: 'var(--text-primary)' }}>Notifications</span>
          {unread > 0 && (
            <span style={{ fontSize: '0.62rem', fontWeight: 700, padding: '1px 6px', borderRadius: 10, background: 'var(--accent-danger)', color: '#fff' }}>{unread}</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {unread > 0 && (
            <button
              onClick={onMarkAllRead}
              style={{ fontSize: '0.7rem', color: 'var(--accent-sage)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', padding: '2px 6px', borderRadius: 4 }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-surface)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
            >
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 3, borderRadius: 4, display: 'flex' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-surface)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* List */}
      <div style={{ maxHeight: 380, overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '32px 16px', textAlign: 'center' }}>
            <Bell size={24} style={{ color: 'var(--border-medium)', margin: '0 auto 10px' }} />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No notifications</p>
          </div>
        ) : notifications.map((n, i) => {
          const Icon = EVENT_ICON[n.type] || Info;
          const color = EVENT_COLOR[n.type] || 'var(--text-muted)';
          return (
            <div
              key={n.id}
              onClick={() => handleItem(n)}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '11px 16px',
                background: n.read ? 'transparent' : 'var(--accent-sage-bg)',
                borderBottom: i < notifications.length - 1 ? '1px solid var(--border-light)' : 'none',
                cursor: n.path ? 'pointer' : 'default',
                transition: 'background 0.1s',
              }}
              onMouseEnter={(e) => { if (n.path) e.currentTarget.style.background = n.read ? 'var(--bg-surface)' : 'rgba(92,122,94,0.12)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = n.read ? 'transparent' : 'var(--accent-sage-bg)'; }}
            >
              <div style={{ width: 30, height: 30, borderRadius: 8, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                <Icon size={13} style={{ color }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: n.read ? 400 : 600, color: 'var(--text-primary)', fontFamily: 'var(--font-body)', lineHeight: 1.3 }}>{n.title}</p>
                  <span style={{ fontSize: '0.62rem', color: 'var(--text-faint)', flexShrink: 0, fontFamily: 'var(--font-body)', marginTop: 1 }}>{n.time}</span>
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', lineHeight: 1.4, marginTop: 2 }}>{n.body}</p>
              </div>
              {!n.read && (
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-sage)', marginTop: 6, flexShrink: 0 }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={() => { navigate('/admin/cms'); onClose(); }}
          style={{ fontSize: '0.75rem', color: 'var(--accent-sage)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 500 }}
        >
          View Notification Center →
        </button>
      </div>
    </motion.div>
  );
}

// ── Command Palette ──────────────────────────────────────────────────────────
const CMD_ITEMS = [
  { icon: Home, label: 'Home', path: '/admin/home', group: 'Navigate' },
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard', group: 'Navigate' },
  { icon: BookOpen, label: 'Catalog', path: '/admin/books', group: 'Navigate' },
  { icon: PlusCircle, label: 'Add Book', path: '/admin/books/add-book', group: 'Actions' },
  { icon: Users, label: 'Customers', path: '/admin/users', group: 'Navigate' },
  { icon: BarChart3, label: 'Monthly Analytics', path: '/admin/dashboard/Monthly-analytics', group: 'Navigate' },
  { icon: BarChart3, label: 'Daily Stats', path: '/admin/dashboard/daily-stats', group: 'Navigate' },
  { icon: Layers, label: 'CMS', path: '/admin/cms', group: 'Platform' },
  { icon: Settings, label: 'Settings', path: '/admin/settings', group: 'Account' },
  { icon: User, label: 'Profile', path: '/admin/profile', group: 'Account' },
];

function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (open) { setQuery(''); setSelected(0); setTimeout(() => inputRef.current?.focus(), 40); }
  }, [open]);

  const filtered = CMD_ITEMS.filter(
    (i) => i.label.toLowerCase().includes(query.toLowerCase()) || i.group.toLowerCase().includes(query.toLowerCase())
  );

  const go = (path) => { navigate(path); onClose(); };

  const handleKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected((s) => Math.min(s + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)); }
    if (e.key === 'Enter' && filtered[selected]) go(filtered[selected].path);
    if (e.key === 'Escape') onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '18vh' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          onClick={(e) => e.stopPropagation()}
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)', borderRadius: 12, width: '100%', maxWidth: 520, boxShadow: '0 24px 64px rgba(0,0,0,0.18)', overflow: 'hidden' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: '1px solid var(--border-light)' }}>
            <Search size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
              onKeyDown={handleKey}
              placeholder="Search pages, actions..."
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: '0.875rem', color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
            />
            <kbd style={{ fontSize: '0.6rem', padding: '2px 5px', borderRadius: 3, background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>ESC</kbd>
          </div>
          <div style={{ maxHeight: 320, overflowY: 'auto', padding: '6px 0' }}>
            {filtered.length === 0 ? (
              <p style={{ padding: '24px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>No results</p>
            ) : filtered.map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => go(item.path)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px',
                    background: i === selected ? 'var(--accent-sage-bg)' : 'transparent',
                    border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.1s',
                  }}
                  onMouseEnter={() => setSelected(i)}
                >
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: i === selected ? 'var(--accent-sage)' : 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={13} style={{ color: i === selected ? '#fff' : 'var(--text-muted)' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>{item.label}</p>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-faint)' }}>{item.group}</p>
                  </div>
                  {i === selected && (
                    <kbd style={{ marginLeft: 'auto', fontSize: '0.6rem', padding: '2px 5px', borderRadius: 3, background: 'var(--accent-sage)', color: '#fff', border: 'none' }}>↵</kbd>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── User Dropdown ────────────────────────────────────────────────────────────
function UserDropdown({ user, onClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    navigate('/');
    window.location.reload();
  };

  const initials = (user?.username || 'A').charAt(0).toUpperCase();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6 }}
      style={{
        position: 'absolute', top: 'calc(100% + 8px)', right: 0,
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 10, width: 220, boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        zIndex: 100, overflow: 'hidden',
      }}
    >
      <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-sage)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>{initials}</span>
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.username || 'Admin'}</p>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-faint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email || ''}</p>
        </div>
      </div>
      {[
        { icon: User, label: 'Profile', path: '/admin/profile' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
      ].map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.path}
            onClick={() => { navigate(item.path); onClose(); }}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.12s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-surface)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
          >
            <Icon size={13} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>{item.label}</span>
          </button>
        );
      })}
      <div style={{ borderTop: '1px solid var(--border-light)', margin: '2px 0' }} />
      <button
        onClick={handleLogout}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.12s' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-danger-bg)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
      >
        <LogOut size={13} style={{ color: 'var(--accent-danger)' }} />
        <span style={{ fontSize: '0.83rem', color: 'var(--accent-danger)' }}>Sign out</span>
      </button>
    </motion.div>
  );
}

// ── Top Header ───────────────────────────────────────────────────────────────
function TopHeader({ sidebarWidth, onOpenCmd, notifications, onMarkRead, onMarkAllRead }) {
  const user = useSelector((s) => s.auth.user);
  const location = useLocation();
  const [showUser, setShowUser] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const bellRef = useRef(null);
  const initials = (user?.username || 'A').charAt(0).toUpperCase();
  const unread = notifications.filter((n) => !n.read).length;

  const CRUMBS = {
    '/admin/home': ['Home'],
    '/admin/dashboard': ['Analytics', 'Overview'],
    '/admin/dashboard/daily-stats': ['Analytics', 'Daily Stats'],
    '/admin/dashboard/user-activity': ['Analytics', 'User Activity'],
    '/admin/dashboard/book-analytics': ['Analytics', 'Book Analytics'],
    '/admin/dashboard/Monthly-analytics': ['Analytics', 'Monthly Stats'],
    '/admin/books': ['Catalog', 'All Books'],
    '/admin/books/add-book': ['Catalog', 'Add Book'],
    '/admin/books/edit-books': ['Catalog', 'Edit Books'],
    '/admin/books/delete-book': ['Catalog', 'Delete Books'],
    '/admin/users': ['Customers'],
    '/admin/cms': ['Platform', 'CMS'],
    '/admin/profile': ['Account', 'Profile'],
    '/admin/settings': ['Account', 'Settings'],
  };

  const crumbs = CRUMBS[location.pathname] || ['Admin'];

  return (
    <header style={{
      position: 'fixed', top: 0, left: sidebarWidth, right: 0,
      height: 52, zIndex: 40,
      background: 'var(--bg-card)',
      borderBottom: '1px solid var(--border-light)',
      display: 'flex', alignItems: 'center',
      padding: '0 20px',
      gap: 12,
      transition: 'left 0.2s ease',
    }}>
      {/* Breadcrumb */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
        {crumbs.map((crumb, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>/</span>}
            <span style={{
              fontSize: '0.78rem',
              fontWeight: i === crumbs.length - 1 ? 600 : 400,
              color: i === crumbs.length - 1 ? 'var(--text-primary)' : 'var(--text-muted)',
              fontFamily: 'var(--font-body)',
            }}>{crumb}</span>
          </React.Fragment>
        ))}
      </div>

      {/* Search trigger */}
      <button
        onClick={onOpenCmd}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '5px 10px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 7,
          cursor: 'pointer',
          transition: 'border-color 0.15s',
          minWidth: 180,
        }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-medium)'}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
      >
        <Search size={12} style={{ color: 'var(--text-muted)' }} />
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flex: 1, textAlign: 'left', fontFamily: 'var(--font-body)' }}>Search...</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <kbd style={{ fontSize: '0.58rem', padding: '1px 4px', borderRadius: 3, background: 'var(--bg-page)', border: '1px solid var(--border)', color: 'var(--text-faint)' }}>⌘</kbd>
          <kbd style={{ fontSize: '0.58rem', padding: '1px 4px', borderRadius: 3, background: 'var(--bg-page)', border: '1px solid var(--border)', color: 'var(--text-faint)' }}>K</kbd>
        </div>
      </button>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            ref={bellRef}
            onClick={() => { setShowNotif((s) => !s); setShowUser(false); }}
            style={{
              width: 32, height: 32, borderRadius: 7,
              background: showNotif ? 'var(--bg-surface)' : 'none',
              border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-muted)',
              position: 'relative', transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-surface)'}
            onMouseLeave={(e) => { if (!showNotif) e.currentTarget.style.background = 'none'; }}
            title="Notifications"
          >
            <Bell size={13} />
            {unread > 0 && (
              <div style={{
                position: 'absolute', top: 5, right: 5,
                minWidth: unread > 9 ? 14 : 8,
                height: unread > 9 ? 14 : 8,
                borderRadius: '50%',
                background: 'var(--accent-danger)',
                border: '1.5px solid var(--bg-card)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {unread > 9 && <span style={{ fontSize: '0.48rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>9+</span>}
              </div>
            )}
          </button>
          <AnimatePresence>
            {showNotif && (
              <NotificationPanel
                notifications={notifications}
                onMarkRead={onMarkRead}
                onMarkAllRead={onMarkAllRead}
                onClose={() => setShowNotif(false)}
                anchorRef={bellRef}
              />
            )}
          </AnimatePresence>
        </div>

        {/* User */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowUser((s) => !s); setShowNotif(false); }}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '4px 8px 4px 4px', background: 'none', border: '1px solid var(--border)', borderRadius: 7, cursor: 'pointer', transition: 'background 0.15s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-surface)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
          >
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent-sage)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.65rem', fontWeight: 700, color: '#fff' }}>{initials}</span>
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.username || 'Admin'}</span>
            <ChevronDown size={11} style={{ color: 'var(--text-muted)', transform: showUser ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
          </button>
          <AnimatePresence>
            {showUser && <UserDropdown user={user} onClose={() => setShowUser(false)} />}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

// ── Root Layout ──────────────────────────────────────────────────────────────
const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [notifications, setNotifications] = useState(SEED_NOTIFICATIONS);
  const sidebarWidth = collapsed ? 56 : 220;

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCmdOpen(true); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const markRead = useCallback((id) => {
    setNotifications((ns) => ns.map((n) => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((ns) => ns.map((n) => ({ ...n, read: true })));
  }, []);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <div style={{ background: 'var(--bg-page)', minHeight: '100vh', display: 'flex' }}>
        <AdminNav collapsed={collapsed} setCollapsed={setCollapsed} />
        <TopHeader
          sidebarWidth={sidebarWidth}
          onOpenCmd={() => setCmdOpen(true)}
          notifications={notifications}
          onMarkRead={markRead}
          onMarkAllRead={markAllRead}
        />
        <main
          style={{
            flex: 1,
            marginLeft: sidebarWidth,
            marginTop: 52,
            transition: 'margin-left 0.2s ease',
            minHeight: 'calc(100vh - 52px)',
            minWidth: 0,
          }}
        >
          <ErrorBoundary>
            <Suspense fallback={<Loader />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </SidebarContext.Provider>
  );
};

export default AdminLayout;
