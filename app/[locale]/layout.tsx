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
  params: { locale: string };
}) {
  const locale = params.locale || 'en';
  const messages = await getMessages(locale);

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
