'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

const Pagination = ({ currentPage, totalPages }: PaginationProps) => {

  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('common');

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`/?${params.toString()}`);
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range: number[] = [];
    for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
      range.push(i);
    }
    return range;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={styles.pagination}>
      <button
        className={styles.button}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        {t('previous')}
      </button>

      {visiblePages[0] > 1 && (
        <>
          <button className={styles.button} onClick={() => handlePageChange(1)}>1</button>
          {visiblePages[0] > 2 && <span className={styles.ellipsis}>...</span>}
        </>
      )}

      {visiblePages.map(page => (
        <button
          key={page}
          className={`${styles.button} ${currentPage === page ? styles.active : ''}`}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      ))}

      {visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && <span className={styles.ellipsis}>...</span>}
          <button className={styles.button} onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
        </>
      )}

      <button
        className={styles.button}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        {t('next')}
      </button>
    </div>
  );
};

export default Pagination;