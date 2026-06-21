'use client';

import { useTranslations } from 'next-intl';
import { usePokemonStore } from '../../store/pokemonStore';
import { usePokemonList } from '../../hooks/usePokemonQueries';
import styles from './Flyout.module.css';

const Flyout = () => {
  const t = useTranslations('common');
  const selectedIds = usePokemonStore((state) => state.selectedIds);
  const clearSelected = usePokemonStore((state) => state.clearSelected);
  const { data } = usePokemonList(1, '', 151);
  const allItems = data?.items ?? [];
  const selectedCount = selectedIds.size;

  if (selectedCount === 0) return null;

  const handleUnselectAll = () => {
    clearSelected();
  };

  const handleDownload = () => {
    const selectedPokemons = allItems.filter((item) => selectedIds.has(item.id));
    if (selectedPokemons.length === 0) return;

    const headers = ['Name', 'Description', 'Height', 'Weight', 'Types'];
    const rows = selectedPokemons.map((p) => [
      p.name,
      p.description,
      p.height ?? '',
      p.weight ?? '',
      p.types?.join(', ') ?? '',
    ]);
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `${selectedCount}_items.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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