import { useEffect, useState, useCallback } from "react";
import api from "../services/axios";

export function useBrandingLive() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetch = useCallback(async () => {
    try { const { data } = await api.get("/branding"); setData(data?.data ?? data); } catch { setData(null); } finally { setLoading(false); }
  }, []);
  useEffect(() => { fetch(); }, [fetch]);
  useEffect(() => { if (data?.siteTitle) document.title = data.siteTitle; }, [data]);
  return { branding: data, loading, refresh: fetch };
}

export function useThemeLive() {
  const [theme, setTheme] = useState(null);
  useEffect(() => {
    api.get("/theme").then(({ data }) => {
      const t = data?.data ?? data;
      setTheme(t);
      if (t?.primary) {
        const root = document.documentElement;
        root.style.setProperty("--accent-sage", t.primary);
        root.style.setProperty("--accent-sage-bg", `${t.primary}14`);
        root.style.setProperty("--accent-sage-text", t.primary);
        root.style.setProperty("--color-primary", t.primary);
        if (t.accent) { root.style.setProperty("--color-accent", t.accent); root.style.setProperty("--accent-amber", t.accent); }
        if (t.bg) { root.style.setProperty("--bg-page", t.bg); root.style.setProperty("--bg-card", t.bg); root.style.setProperty("--color-bg", t.bg); }
        if (t.textColor || t.text) root.style.setProperty("--text-primary", t.textColor||t.text);
        try { localStorage.setItem("cms-theme", JSON.stringify(t)); } catch {}
      }
    }).catch(() => {
      try { const cached = JSON.parse(localStorage.getItem("cms-theme")||"null"); if(cached?.primary){ const root=document.documentElement; root.style.setProperty("--accent-sage", cached.primary); } } catch {}
    });
  }, []);
  return theme;
}

export function useFeatureFlagsLive() {
  const [flags, setFlags] = useState(null);
  useEffect(() => {
    api.get("/feature-flags").then(({ data }) => setFlags(data?.data ?? data)).catch(() => setFlags({}));
  }, []);
  return flags;
}

export function useHomepageBlocksLive() {
  const [blocks, setBlocks] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get("/homepage-blocks").then(({ data }) => setBlocks(data?.data?.blocks ?? data?.blocks ?? [])).catch(() => setBlocks([])).finally(() => setLoading(false));
  }, []);
  return { blocks, loading };
}

export function useAuthorsLive() {
  const [authors, setAuthors] = useState([]);
  useEffect(() => { api.get("/authors").then(({ data }) => setAuthors(data?.data ?? [])).catch(() => {}); }, []);
  return authors;
}

export function useCategoriesLive() {
  const [categories, setCategories] = useState([]);
  useEffect(() => { api.get("/categories").then(({ data }) => setCategories(data?.data ?? [])).catch(() => {}); }, []);
  return categories;
}

export function usePromotionsLive() {
  const [promos, setPromos] = useState([]);
  useEffect(() => { api.get("/promotions/active").then(({ data }) => setPromos(data?.data ?? [])).catch(() => {}); }, []);
  return promos;
}

export function useBlogLive() {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get("/blog").then(({ data }) => {
      // SiteSetting shape: {success:true,data:{value:{posts:[]}}} or {group:"blog",value:{posts:[]}}
      const v = data?.data?.value ?? data?.value ?? data?.data ?? data;
      const list = v?.posts ?? (Array.isArray(v) ? v : []);
      setPosts(Array.isArray(list) && list.length ? list : null); // null = fallback to static sample
    }).catch(()=> setPosts(null)).finally(()=> setLoading(false));
  }, []);
  return { posts, loading };
}

export function useFaqLive() {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get("/faq").then(({ data }) => {
      const v = data?.data?.value ?? data?.value ?? data?.data ?? data;
      const list = v?.items ?? (Array.isArray(v) ? v : []);
      setItems(Array.isArray(list) && list.length ? list : null);
    }).catch(()=> setItems(null)).finally(()=> setLoading(false));
  }, []);
  return { items, loading };
}

export function useSocialProofLive() {
  const [proof, setProof] = useState(null);
  useEffect(() => {
    api.get("/social-proof").then(({ data }) => {
      const v = data?.data?.value ?? data?.value ?? data?.data ?? data;
      if (v && (v.titles || v.readers)) setProof(v);
    }).catch(()=>{});
    // also compute live counters from /books and /analytics as progressive enhancement
    api.get("/get-all-books").then(({ data }) => {
      const count = data?.data?.length ?? data?.length ?? 0;
      if (count) setProof(p=> ({ ...(p||{}), titles: `${Math.max(10, Math.round(count/100)*100)}+` }));
    }).catch(()=>{});
  }, []);
  return proof;
}
