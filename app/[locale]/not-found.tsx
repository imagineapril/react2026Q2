import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function NotFound() {

  const t = useTranslations('common');

  return (
    <main>
      <h1>404 – {t('404')}</h1>
      <p>{t('404Message')}</p>
      <Link href="/">{t('goHome')}</Link>
    </main>
  );
}