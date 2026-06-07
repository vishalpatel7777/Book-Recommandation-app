import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LogOut, Settings, BookHeart, ShoppingBag, Bell, Star, Heart,
  BookMarked, CheckCircle, Clock, User, BarChart2, BookOpen,
  TrendingUp, Target, Activity, Info,
} from "lucide-react";
import Loader from "../../components/common/Loader/Loader";
import { logout } from "../../store/slices/auth.slice";
import api from "../../services/axios";

const SIDEBAR_ITEMS = [
  { name: "Dashboard",         path: "/profile",                  icon: <BarChart2 size={14} /> },
  { name: "Wishlist",          path: "/profile/wishlist",         icon: <BookHeart size={14} /> },
  { name: "Reading Activity",  path: "/profile/reading-activity", icon: <Activity size={14} /> },
  { name: "Notifications",     path: "/profile/notifications",    icon: <Bell size={14} /> },
  { name: "Edit Profile",      path: "/profile/edit-profile",     icon: <Settings size={14} /> },
  { name: "About BookMosaic",  path: "/profile/about",            icon: <Info size={14} /> },
];

function StatCard({ icon: Icon, label, value, color = "var(--accent-sage)" }) {
  return (
    <div style={{ padding: "var(--space-4)", background: "var(--bg-surface)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
      <div style={{ width: 36, height: 36, borderRadius: "var(--radius-sm)", background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={15} style={{ color }} />
      </div>
      <div>
        <p style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1 }}>{value}</p>
        <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: 2 }}>{label}</p>
      </div>
    </div>
  );
}

function ReadingGoalWidget({ readingCounts }) {
  const goal = 24;
  const completed = readingCounts.completed || 0;
  const pct = Math.min(100, Math.round((completed / goal) * 100));
  const remaining = Math.max(0, goal - completed);

  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "var(--space-5)", marginBottom: "var(--space-5)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-4)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          <Target size={14} style={{ color: "var(--accent-sage)" }} />
          <p style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-primary)" }}>Reading Goal 2025</p>
        </div>
        <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: pct >= 100 ? "var(--accent-sage)" : "var(--text-muted)" }}>{pct}%</span>
      </div>
      <div style={{ height: 6, background: "var(--bg-surface)", borderRadius: "var(--radius-full)", overflow: "hidden", marginBottom: "var(--space-3)" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ height: "100%", background: pct >= 100 ? "var(--accent-sage)" : "linear-gradient(90deg, var(--accent-sage) 0%, var(--accent-sage-dark) 100%)", borderRadius: "var(--radius-full)" }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
          <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{completed}</span> of {goal} books read
        </p>
        {remaining > 0 && (
          <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{remaining} to go</p>
        )}
        {pct >= 100 && (
          <p style={{ fontSize: "var(--text-xs)", color: "var(--accent-sage)", fontWeight: 600 }}>Goal reached!</p>
        )}
      </div>
    </div>
  );
}

function RecentActivityWidget() {
  const activities = [
    { icon: BookOpen,    color: "var(--accent-sage)",   text: "Added 'Atomic Habits' to wishlist",      time: "2h ago" },
    { icon: Star,        color: "var(--accent-gold)",   text: "Rated 'The Alchemist' 5 stars",          time: "1d ago" },
    { icon: CheckCircle, color: "var(--accent-info)",   text: "Marked 'Sapiens' as completed",          time: "3d ago" },
    { icon: ShoppingBag, color: "var(--accent-amber)",  text: "Purchased 'Deep Work'",                  time: "5d ago" },
  ];

  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "var(--space-5)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-4)" }}>
        <Activity size={14} style={{ color: "var(--accent-sage)" }} />
        <p style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-primary)" }}>Recent Activity</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
        {activities.map(({ icon: Icon, color, text, time }, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-3) 0", borderBottom: i < activities.length - 1 ? "1px solid var(--border-light)" : "none" }}>
            <div style={{ width: 28, height: 28, borderRadius: "var(--radius-full)", background: `${color}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={12} style={{ color }} />
            </div>
            <p style={{ flex: 1, fontSize: "var(--text-xs)", color: "var(--text-secondary)", lineHeight: "var(--leading-snug)" }}>{text}</p>
            <span style={{ fontSize: "0.65rem", color: "var(--text-faint)", whiteSpace: "nowrap" }}>{time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Dashboard({ profile }) {
  const [stats, setStats] = useState({ orders: 0, wishlist: 0, reviews: 0, notifications: 0 });
  const [readingCounts, setReadingCounts] = useState({ want_to_read: 0, reading: 0, completed: 0, dropped: 0 });

  useEffect(() => {
    Promise.allSettled([
      api.get(`/get-notifications/${profile._id || ""}`),
      api.get("/reading-status-counts"),
    ]).then(([notifRes, readingRes]) => {
      setStats((prev) => ({
        ...prev,
        notifications: notifRes.status === "fulfilled" ? (notifRes.value.data?.length || 0) : 0,
      }));
      if (readingRes.status === "fulfilled") {
        setReadingCounts(readingRes.value.data?.data || {});
      }
    });
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      {/* Profile overview */}
      <div style={{ borderRadius: "var(--radius-sm)", padding: "var(--space-6)", marginBottom: "var(--space-5)", background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--space-4)", flexWrap: "wrap", marginBottom: "var(--space-6)" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 600, color: "var(--text-primary)", marginBottom: "var(--space-1)" }}>
              Your Library
            </h2>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>Member since {new Date().getFullYear()}</p>
          </div>
          <Link to="/profile/edit-profile" style={{ textDecoration: "none" }}>
            <button className="btn btn-secondary" style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-xs)" }}>
              <Settings size={12} /> Edit Profile
            </button>
          </Link>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <StatCard icon={ShoppingBag}  label="Purchases"     value={stats.orders || "—"}        color="var(--accent-sage)" />
          <StatCard icon={Heart}        label="Wishlist"      value={stats.wishlist || "—"}       color="var(--accent-danger)" />
          <StatCard icon={Star}         label="Reviews"       value={stats.reviews || "—"}        color="var(--accent-gold)" />
          <StatCard icon={Bell}         label="Notifications" value={stats.notifications || "—"}  color="var(--accent-info)" />
        </div>

        {/* Reading status counts */}
        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", marginBottom: "var(--space-2)" }}>
          {[
            { label: "Books Read",   value: readingCounts.completed,    icon: CheckCircle, color: "var(--accent-sage)" },
            { label: "Reading Now",  value: readingCounts.reading,      icon: BookOpen,    color: "var(--accent-amber)" },
            { label: "Want to Read", value: readingCounts.want_to_read, icon: BookMarked,  color: "var(--accent-info)" },
            { label: "Dropped",      value: readingCounts.dropped,      icon: Clock,       color: "var(--accent-danger)" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} style={{ flex: "1 1 140px", padding: "var(--space-3)", background: "var(--bg-page)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <Icon size={13} style={{ color, flexShrink: 0 }} />
              <div>
                <p style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1 }}>{value || 0}</p>
                <p style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: 1 }}>{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Profile fields */}
        <div className="grid sm:grid-cols-2 gap-3" style={{ marginTop: "var(--space-5)" }}>
          {[
            { label: "Full Name",       value: profile.fullname || "—" },
            { label: "Username",        value: `@${profile.username}` },
            { label: "Email",           value: profile.email || "—" },
            { label: "Phone",           value: profile.phone ? `+91 ${profile.phone}` : "—" },
            { label: "Age",             value: profile.age || "—" },
            { label: "Favourite Genre", value: profile.genre || "—" },
          ].map(({ label, value }) => (
            <div key={label} style={{ padding: "var(--space-4)", borderRadius: "var(--radius-sm)", background: "var(--bg-surface)", border: "1px solid var(--border-light)" }}>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)", marginBottom: "var(--space-1)" }}>{label}</p>
              <p style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reading Goal Widget */}
      <ReadingGoalWidget readingCounts={readingCounts} />

      {/* Recent Activity Widget */}
      <RecentActivityWidget />
    </motion.div>
  );
}

function ReadingActivityPage({ profile }) {
  const [readingCounts, setReadingCounts] = useState({ want_to_read: 0, reading: 0, completed: 0, dropped: 0 });

  useEffect(() => {
    api.get("/reading-status-counts")
      .then((r) => setReadingCounts(r.data?.data || {}))
      .catch(() => {});
  }, []);

  const shelves = [
    { label: "Currently Reading", value: readingCounts.reading,      icon: BookOpen,    color: "var(--accent-amber)",  desc: "Books you're actively reading" },
    { label: "Want to Read",      value: readingCounts.want_to_read, icon: BookMarked,  color: "var(--accent-info)",   desc: "Your reading backlog" },
    { label: "Completed",         value: readingCounts.completed,    icon: CheckCircle, color: "var(--accent-sage)",   desc: "Books you've finished" },
    { label: "Dropped",           value: readingCounts.dropped,      icon: Clock,       color: "var(--accent-danger)", desc: "Titles you set aside" },
  ];

  const goal = 24;
  const completed = readingCounts.completed || 0;
  const pct = Math.min(100, Math.round((completed / goal) * 100));

  const recentActions = [
    { icon: CheckCircle, color: "var(--accent-sage)",   label: "Marked as completed",  title: "Sapiens",                    time: "3 days ago" },
    { icon: BookOpen,    color: "var(--accent-amber)",  label: "Started reading",       title: "The Pragmatic Programmer",   time: "5 days ago" },
    { icon: Star,        color: "var(--accent-gold)",   label: "Left a review",         title: "The Alchemist",              time: "1 week ago" },
    { icon: BookMarked,  color: "var(--accent-info)",   label: "Added to Want to Read", title: "Thinking, Fast and Slow",    time: "2 weeks ago" },
    { icon: CheckCircle, color: "var(--accent-sage)",   label: "Marked as completed",   title: "Atomic Habits",              time: "3 weeks ago" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-2)" }}>
        <TrendingUp size={16} style={{ color: "var(--accent-sage)" }} />
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 600, color: "var(--text-primary)" }}>Reading Activity</h2>
      </div>
      <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", marginBottom: "var(--space-7)" }}>Your reading progress and shelf summary.</p>

      {/* Goal card */}
      <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-sm)", padding: "var(--space-6)", marginBottom: "var(--space-6)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-4)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <Target size={14} style={{ color: "var(--accent-sage)" }} />
            <p style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-base)", fontWeight: 600, color: "var(--text-primary)" }}>2025 Reading Goal</p>
          </div>
          <span style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: pct >= 100 ? "var(--accent-sage)" : "var(--text-muted)" }}>{pct}%</span>
        </div>
        <div style={{ height: 8, background: "var(--border-light)", borderRadius: "var(--radius-full)", overflow: "hidden", marginBottom: "var(--space-3)" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ height: "100%", background: "linear-gradient(90deg, var(--accent-sage) 0%, var(--accent-sage-dark) 100%)", borderRadius: "var(--radius-full)" }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
            <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{completed}</span> of {goal} books completed this year
          </p>
          {pct >= 100 && (
            <p style={{ fontSize: "var(--text-sm)", color: "var(--accent-sage)", fontWeight: 600 }}>Goal reached!</p>
          )}
        </div>
      </div>

      {/* Shelf stat cards */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
        <p style={{ fontSize: "var(--text-xs)", fontWeight: 700, letterSpacing: "var(--tracking-wider)", textTransform: "uppercase", color: "var(--text-muted)" }}>My Shelves</p>
        <div style={{ flex: 1, height: "1px", background: "var(--border-light)" }} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4" style={{ marginBottom: "var(--space-8)" }}>
        {shelves.map(({ label, value, icon: Icon, color, desc }) => (
          <div key={label} style={{ padding: "var(--space-5)", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", display: "flex", gap: "var(--space-4)", alignItems: "flex-start" }}>
            <div style={{ width: 40, height: 40, borderRadius: "var(--radius-sm)", background: `${color}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={16} style={{ color }} />
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1 }}>{value || 0}</p>
              <p style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-primary)", marginTop: "var(--space-1)" }}>{label}</p>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: 2 }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent reading actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
        <p style={{ fontSize: "var(--text-xs)", fontWeight: 700, letterSpacing: "var(--tracking-wider)", textTransform: "uppercase", color: "var(--text-muted)" }}>Recent Actions</p>
        <div style={{ flex: 1, height: "1px", background: "var(--border-light)" }} />
      </div>
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", overflow: "hidden", marginBottom: "var(--space-6)" }}>
        {recentActions.map(({ icon: Icon, color, label, title, time }, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-4) var(--space-5)", borderBottom: i < recentActions.length - 1 ? "1px solid var(--border-light)" : "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: "var(--radius-full)", background: `${color}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={13} style={{ color }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{label}</p>
              <p style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</p>
            </div>
            <span style={{ fontSize: "0.65rem", color: "var(--text-faint)", whiteSpace: "nowrap" }}>{time}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: "var(--space-5)", background: "var(--accent-sage-bg)", border: "1px solid var(--accent-sage-ring)", borderRadius: "var(--radius-sm)" }}>
        <p style={{ fontSize: "var(--text-sm)", color: "var(--accent-sage-text)", lineHeight: "var(--leading-relaxed)" }}>
          Mark books as reading or completed from any book detail page. Your progress syncs automatically.
        </p>
      </div>
    </motion.div>
  );
}

function AboutPage() {
  const features = [
    { icon: BookOpen,    color: "var(--accent-sage)",   title: "Curated Catalogue",       desc: "Every title is hand-reviewed. No noise, just books worth your time." },
    { icon: Star,        color: "var(--accent-gold)",   title: "Personalised Discovery",  desc: "Recommendations improve the more you read, rate, and shelf books." },
    { icon: BookMarked,  color: "var(--accent-info)",   title: "Reading Shelves",         desc: "Track what you're reading, completed, want to read, or dropped." },
    { icon: ShoppingBag, color: "var(--accent-amber)",  title: "Seamless Purchase",       desc: "Buy directly through BookMosaic with secure checkout and order tracking." },
    { icon: Bell,        color: "var(--accent-danger)", title: "Smart Notifications",     desc: "Get alerted about new arrivals, price drops, and author news." },
    { icon: User,        color: "var(--text-muted)",    title: "Unified Profile",         desc: "Your wishlist, cart, reviews, and reading history — all in one place." },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-2)" }}>
        <Info size={16} style={{ color: "var(--accent-sage)" }} />
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 600, color: "var(--text-primary)" }}>About BookMosaic</h2>
      </div>
      <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", marginBottom: "var(--space-7)" }}>Where every reader finds their next great book.</p>

      {/* Mission statement */}
      <div style={{ padding: "var(--space-6)", background: "var(--bg-surface)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-sm)", marginBottom: "var(--space-6)" }}>
        <p style={{ fontSize: "var(--text-xs)", fontWeight: 700, letterSpacing: "var(--tracking-wider)", textTransform: "uppercase", color: "var(--accent-sage)", marginBottom: "var(--space-3)" }}>Our Mission</p>
        <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-4)" }}>
          BookMosaic exists to put the right book in front of the right reader at the right moment. We believe that every person has a book that will change how they see the world — our job is to help you find it.
        </p>
        <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: "var(--leading-relaxed)" }}>
          We combine a hand-curated catalogue with personalised discovery to surface titles that genuinely resonate — not just what's selling, but what's right for you specifically.
        </p>
      </div>

      {/* Key features */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
        <p style={{ fontSize: "var(--text-xs)", fontWeight: 700, letterSpacing: "var(--tracking-wider)", textTransform: "uppercase", color: "var(--text-muted)" }}>Platform Features</p>
        <div style={{ flex: 1, height: "1px", background: "var(--border-light)" }} />
      </div>
      <div className="grid sm:grid-cols-2 gap-3" style={{ marginBottom: "var(--space-8)" }}>
        {features.map(({ icon: Icon, color, title, desc }) => (
          <div key={title} style={{ padding: "var(--space-4)", background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-sm)", display: "flex", gap: "var(--space-3)", alignItems: "flex-start" }}>
            <div style={{ width: 32, height: 32, borderRadius: "var(--radius-sm)", background: `${color}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={13} style={{ color }} />
            </div>
            <div>
              <p style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>{title}</p>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", lineHeight: "var(--leading-snug)" }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Platform stats */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
        <p style={{ fontSize: "var(--text-xs)", fontWeight: 700, letterSpacing: "var(--tracking-wider)", textTransform: "uppercase", color: "var(--text-muted)" }}>Platform Info</p>
        <div style={{ flex: 1, height: "1px", background: "var(--border-light)" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", marginBottom: "var(--space-6)" }}>
        {[
          { label: "Founded",            value: "2024" },
          { label: "Books in catalogue", value: "10,000+" },
          { label: "Active readers",     value: "50,000+" },
          { label: "Average rating",     value: "4.8 / 5" },
          { label: "Version",            value: "2.0 — Stable" },
          { label: "Support",            value: "support@bookmosaic.com" },
        ].map(({ label, value }) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--space-3) var(--space-4)", background: "var(--bg-surface)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-sm)" }}>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)", fontWeight: 600 }}>{label}</span>
            <span style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-primary)" }}>{value}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
        <Link to="/blog" style={{ textDecoration: "none" }}>
          <button className="btn btn-secondary" style={{ fontSize: "var(--text-xs)" }}>Read our Blog</button>
        </Link>
        <Link to="/authors" style={{ textDecoration: "none" }}>
          <button className="btn btn-secondary" style={{ fontSize: "var(--text-xs)" }}>Featured Authors</button>
        </Link>
      </div>
    </motion.div>
  );
}

function NotificationsPage() {
  const [notifications, setNotifications] = useState(null);
  useEffect(() => {
    api.get("/get-notifications/")
      .then((r) => setNotifications(r.data || []))
      .catch(() => setNotifications([]));
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-2)" }}>
        <Bell size={16} style={{ color: "var(--accent-sage)" }} />
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 600, color: "var(--text-primary)" }}>Notifications</h2>
      </div>
      <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", marginBottom: "var(--space-6)" }}>Updates, alerts, and messages from BookMosaic.</p>

      {notifications === null && (
        <div style={{ textAlign: "center", padding: "var(--space-10) 0" }}>
          <div className="skeleton" style={{ height: 60, borderRadius: "var(--radius-sm)", marginBottom: "var(--space-3)" }} />
          <div className="skeleton" style={{ height: 60, borderRadius: "var(--radius-sm)", marginBottom: "var(--space-3)" }} />
          <div className="skeleton" style={{ height: 60, borderRadius: "var(--radius-sm)" }} />
        </div>
      )}

      {notifications !== null && notifications.length === 0 && (
        <div className="empty-state" style={{ minHeight: "30vh" }}>
          <div className="empty-state-icon">
            <Bell size={22} style={{ color: "var(--text-muted)" }} />
          </div>
          <h2>No notifications yet</h2>
          <p>We'll alert you about orders, recommendations, and platform news here.</p>
          <Link to="/allbooks" className="btn btn-secondary" style={{ marginTop: "var(--space-2)", textDecoration: "none", fontSize: "var(--text-sm)" }}>
            Browse Books
          </Link>
        </div>
      )}

      {notifications !== null && notifications.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {notifications.map((n, i) => (
            <div key={n._id || i} style={{ padding: "var(--space-4) var(--space-5)", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", display: "flex", gap: "var(--space-4)", alignItems: "flex-start" }}>
              <div style={{ width: 32, height: 32, borderRadius: "var(--radius-full)", background: "var(--accent-sage-bg)", border: "1px solid var(--accent-sage-ring)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                <Bell size={13} style={{ color: "var(--accent-sage)" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-primary)", marginBottom: 2 }}>{n.title || n.message || "Notification"}</p>
                {n.message && n.title && (
                  <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{n.message}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(undefined);

  useEffect(() => {
    api.get("/user-information")
      .then((r) => setProfile(r.data))
      .catch((err) => {
        setProfile(null);
        if (err.response?.status === 401 || err.response?.status === 403) navigate("/login");
      });
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  if (profile === undefined) return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-page)" }}>
      <Loader />
    </div>
  );

  if (profile === null) return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-page)" }}>
      <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
        Could not load profile.{" "}
        <button onClick={() => navigate("/login")} style={{ color: "var(--accent-sage)", background: "none", border: "none", cursor: "pointer" }}>Sign in</button>
      </p>
    </div>
  );

  const isBase = location.pathname === "/profile" || location.pathname === "/profile/";
  const isReadingActivity = location.pathname === "/profile/reading-activity";
  const isNotifications = location.pathname === "/profile/notifications";
  const isAbout = location.pathname === "/profile/about";
  const isInline = isBase || isReadingActivity || isNotifications || isAbout;
  const initials = (profile.fullname || profile.username || "U").charAt(0).toUpperCase();

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)" }}>
      <div className="page-container" style={{ paddingTop: "var(--space-10)", paddingBottom: "var(--space-10)" }}>
      <div className="profile-layout" style={{ display: "flex", gap: "var(--space-8)" }}>
        {/* Sidebar */}
        <div className="profile-sidebar" style={{ width: "13rem", flexShrink: 0 }}>
          <div style={{ borderRadius: "var(--radius-sm)", overflow: "hidden", position: "sticky", top: "6rem", background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            {/* User card */}
            <div style={{ padding: "var(--space-5)", textAlign: "center", borderBottom: "1px solid var(--border-light)", background: "var(--bg-surface)" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", overflow: "hidden", margin: "0 auto var(--space-3)", border: "2px solid var(--border-medium)" }}>
                {profile.image ? (
                  <img src={profile.image} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "var(--text-lg)", fontWeight: 600, background: "var(--accent-sage)", color: "#fff", fontFamily: "var(--font-heading)" }}>
                    {initials}
                  </div>
                )}
              </div>
              <p style={{ fontSize: "var(--text-sm)", fontFamily: "var(--font-heading)", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>@{profile.username}</p>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profile.email}</p>
            </div>

            {/* Nav */}
            <nav style={{ padding: "var(--space-2)" }}>
              {SIDEBAR_ITEMS.map((item) => {
                const active = item.path === "/profile"
                  ? isBase
                  : location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path} style={{ textDecoration: "none" }}>
                    <div
                      style={{
                        display: "flex", alignItems: "center", gap: "var(--space-2)",
                        padding: "var(--space-2) var(--space-3)", borderRadius: "var(--radius-sm)",
                        fontSize: "var(--text-sm)", marginBottom: "1px", cursor: "pointer",
                        background: active ? "var(--accent-sage-bg)" : "transparent",
                        color: active ? "var(--accent-sage-text)" : "var(--text-secondary)",
                        fontWeight: active ? 500 : 400,
                        borderLeft: active ? "2px solid var(--accent-sage)" : "2px solid transparent",
                        transition: "var(--transition)",
                      }}
                      onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "var(--bg-surface)"; e.currentTarget.style.color = "var(--text-primary)"; } }}
                      onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; } }}
                    >
                      <span style={{ color: active ? "var(--accent-sage)" : "var(--text-muted)" }}>{item.icon}</span>
                      {item.name}
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Logout */}
            <div style={{ padding: "var(--space-2)", borderTop: "1px solid var(--border-light)" }}>
              <button
                onClick={handleLogout}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: "var(--space-2)", padding: "var(--space-2) var(--space-3)", borderRadius: "var(--radius-sm)", fontSize: "var(--text-sm)", color: "var(--accent-danger)", background: "none", border: "none", cursor: "pointer", transition: "var(--transition)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(184,84,80,0.06)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <LogOut size={14} /> Sign out
              </button>
            </div>
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {isBase ? (
            <Dashboard profile={profile} />
          ) : isReadingActivity ? (
            <div style={{ borderRadius: "var(--radius-sm)", overflow: "hidden", background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <div style={{ padding: "var(--space-6)" }}>
                <ReadingActivityPage profile={profile} />
              </div>
            </div>
          ) : isNotifications ? (
            <div style={{ borderRadius: "var(--radius-sm)", overflow: "hidden", background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <div style={{ padding: "var(--space-6)" }}>
                <NotificationsPage />
              </div>
            </div>
          ) : isAbout ? (
            <div style={{ borderRadius: "var(--radius-sm)", overflow: "hidden", background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <div style={{ padding: "var(--space-6)" }}>
                <AboutPage />
              </div>
            </div>
          ) : (
            <div style={{ borderRadius: "var(--radius-sm)", overflow: "hidden", background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <div style={{ padding: "var(--space-6)" }}>
                <Outlet />
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default Profile;
