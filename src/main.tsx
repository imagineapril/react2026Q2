import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/react-query';
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.tsx'
import { ThemeProvider } from './context/ThemeProvider.tsx'
import './index.css'
import './styles/variables.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </ThemeProvider>
    </QueryClientProvider>
  
  </StrictMode>,
)
