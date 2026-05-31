import { type UseQueryResult } from '@tanstack/react-query';
import { vi } from 'vitest';

export function mockUseQueryResult<T>(
  data: T,
  isLoading: boolean = false,
  error: Error | null = null
): UseQueryResult<T> {
  const now = Date.now();
  const isError = error !== null;
  const result = {
    data,
    error,
    isLoading,
    isError,
    isPending: isLoading,
    isSuccess: !isLoading && !isError,
    status: isLoading ? 'pending' : isError ? 'error' : 'success',
    fetchStatus: 'idle',
    isFetched: !isLoading,
    isFetchedAfterMount: true,
    isFetching: false,
    isPlaceholderData: false,
    isRefetching: false,
    isStale: false,
    refetch: vi.fn(),
    promise: Promise.resolve(data),
    dataUpdatedAt: now,
    errorUpdatedAt: isError ? now : 0,
    errorUpdateCount: isError ? 1 : 0,
    failureCount: 0,
    failureReason: null,
    isInitialLoading: isLoading,
    isLoadingError: false,
    isRefetchError: false,
    isPaused: false,
  };
  return result as unknown as UseQueryResult<T>;
}