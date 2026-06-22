'use client';

import { useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { usePokemonStore } from '../../store/pokemonStore';
import { usePokemonList } from '../../hooks/usePokemonQueries';
import { generateCSV } from '../../../app/actions/csv';
import styles from './Flyout.module.css';

const Flyout = () => {
  const t = useTranslations('common');
  const selectedIds = usePokemonStore((state) => state.selectedIds);
  const clearSelected = usePokemonStore((state) => state.clearSelected);
  const { data } = usePokemonList(1, '', 151);
  const allItems = data?.items ?? [];
  const selectedCount = selectedIds.size;
  const [isPending, startTransition] = useTransition();

  if (selectedCount === 0) return null;

  const handleUnselectAll = () => {
    clearSelected();
  };

  const handleDownload = () => {
    const ids = Array.from(selectedIds);
    startTransition(async () => {
      try {
        const result = await generateCSV(ids);
        const blob = new Blob([result.csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', result.filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Failed to generate CSV:', error);
      }
    });
  };

  return (
    <div className={styles.flyout}>
      <div className={styles.content}>
        <span className={styles.count}>{t('selected')}: {selectedCount}</span>
        <div className={styles.buttons}>
          <button onClick={handleUnselectAll} className={styles.button}>
            {t('unselectAll')}
          </button>
          <button onClick={handleDownload} className={styles.button}>
            {t('downloadCSV')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Flyout;