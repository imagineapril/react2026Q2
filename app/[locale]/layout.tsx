import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Providers from '../providers';
import Navbar from '../components/Navbar';
import Header from '../../src/layout/Header/Header';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>
        <Header />
        <Navbar />
        <main style={{ padding: '2rem' }}>{children}</main>
      </Providers>
    </NextIntlClientProvider>
  );
}
