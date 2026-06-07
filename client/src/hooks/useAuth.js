import { useSelector } from 'react-redux';

/**
 * Returns the current auth state from Redux in one call.
 * Replaces 3 separate useSelector calls in every component.
 */
export function useAuth() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.user?.role ?? null);
  const userId = useSelector((state) => state.auth.user?.id ?? null);
  const username = useSelector((state) => state.auth.user?.username ?? null);
  return { isLoggedIn, role, userId, username };
}
