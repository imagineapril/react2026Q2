'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '../src/context/ThemeProvider';
import { queryClient } from '../src/lib/react-query';
import ErrorBoundary from '../src/components/ErrorBoundary/ErrorBoundary';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </ThemeProvider>
    </QueryClientProvider>
  );
}