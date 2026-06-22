import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';

export default async function NotFound() {

  const t = await getTranslations ('common');

  return (
    <main>
      <h1>404 – {t('404')}</h1>
      <p>{t('404Message')}</p>
      <Link href="/">{t('goHome')}</Link>
    </main>
  );
}