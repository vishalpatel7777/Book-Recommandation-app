import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../services/axios";
import { setCart, setWishlist } from "../store/slices/user.slice";

export function useSyncUserState() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((s) => s.auth.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) return;
    Promise.allSettled([
      api.get("/get-user-cart"),
      api.get("/get-all-wishlist"),
    ]).then(([cartRes, wishRes]) => {
      if (cartRes.status === "fulfilled") {
        const ids = (cartRes.value.data?.data ?? []).map((b) => b._id);
        dispatch(setCart(ids));
      }
      if (wishRes.status === "fulfilled") {
        const ids = (wishRes.value.data?.data ?? []).map((b) => b._id);
        dispatch(setWishlist(ids));
      }
    });
  }, [isLoggedIn, dispatch]);
}
