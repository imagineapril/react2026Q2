import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.tsx'
import { ThemeProvider } from './context/ThemeProvider.tsx'
import './index.css'
import './styles/variables.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </ThemeProvider>
  </StrictMode>,
)
