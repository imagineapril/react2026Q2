'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import styles from '../../../app/[locale]/page.module.css';

export default function RefreshButton() {
  const router = useRouter();
  const t = useTranslations('common');

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <button onClick={handleRefresh} className={styles.refreshButton}>
      🔄 {t('refresh')}
    </button>
  );
}