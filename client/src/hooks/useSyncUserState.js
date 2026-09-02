import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../services/axios";
import { setCart, setWishlist } from "../store/slices/user.slice";

export function useSyncUserState() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((s) => s.auth.isLoggedIn);
  const role = useSelector((s) => s.auth.user?.role);

  useEffect(() => {
    if (!isLoggedIn) return;
    // Admin has no cart/wishlist — skip to avoid 401 noise on /admin routes
    // (admin token is still valid, but cart/wishlist are user-only features)
    if (role === "admin" || role === "author") return;
    Promise.allSettled([
      api.get("/get-user-cart"),
      api.get("/get-all-wishlist"),
    ]).then(([cartRes, wishRes]) => {
      if (cartRes.status === "fulfilled") {
        const ids = (cartRes.value.data?.data ?? []).map((b) => b._id);
        dispatch(setCart(ids));
      } else if (cartRes.value?.response?.status === 401) {
        // Cookie expired but Redux still says logged in — don't spam console, just keep empty
      }
      if (wishRes.status === "fulfilled") {
        const ids = (wishRes.value.data?.data ?? []).map((b) => b._id);
        dispatch(setWishlist(ids));
      }
    });
  }, [isLoggedIn, role, dispatch]);
}
