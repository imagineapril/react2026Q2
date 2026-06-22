import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pokemon Search App',
  description: 'Search for your favorite Pokemon',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  );
}