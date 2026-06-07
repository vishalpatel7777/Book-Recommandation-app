import { useState, useEffect } from 'react';
import api from '../services/axios';

export function useAdminProfile() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/get-admin-profile')
      .then((res) => setAdmin(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Error fetching profile'))
      .finally(() => setLoading(false));
  }, []);

  return { admin, setAdmin, loading, error };
}
