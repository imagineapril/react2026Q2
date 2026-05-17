import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layout/RootLayout/RootLayout';
import HomePage from '../pages/HomePage/HomePage';
import AboutPage from '../pages/AboutPage/AboutPage';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);