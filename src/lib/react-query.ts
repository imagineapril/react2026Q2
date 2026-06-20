import { QueryClient } from '@tanstack/react-query';

const STALE_TIME = Number(process.env.NEXT_PUBLIC_QUERY_STALE_TIME) || 5 * 60 * 1000;
const GC_TIME = Number(process.env.NEXT_PUBLIC_QUERY_GC_TIME) || 10 * 60 * 1000;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME,
      gcTime: GC_TIME,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});