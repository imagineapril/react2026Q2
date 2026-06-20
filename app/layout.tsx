import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';
import Navbar from './components/Navbar';
import Header from '../src/layout/Header/Header';

export const metadata: Metadata = {
  title: 'Pokemon Search App',
  description: 'Search for your favorite Pokemon',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <Navbar />
          <main style={{ padding: '2rem' }}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}