import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layout/RootLayout/RootLayout';
import HomePage from '../pages/HomePage/HomePage';
import AboutPage from '../pages/AboutPage/AboutPage';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';
import PokemonDetailPage from '../pages/PokemonDetailPage/PokemonDetailPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: '/',
        element: <HomePage />,
        children: [
          { path: 'pokemon/:id', element: <PokemonDetailPage /> },
        ],
      },
      { path: 'about', element: <AboutPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);