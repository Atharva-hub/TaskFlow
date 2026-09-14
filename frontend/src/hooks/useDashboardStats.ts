import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDashboardStats } from '../api/dashboard';
import type { DashboardStats } from '../types/models';
import { ApiError } from '../api/client';

export function useDashboardStats() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      setStats(await getDashboardStats(token));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load dashboard stats.');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!token) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await getDashboardStats(token);
        if (!cancelled) setStats(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Failed to load dashboard stats.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  return { stats, isLoading, error, refetch: fetchStats };
}