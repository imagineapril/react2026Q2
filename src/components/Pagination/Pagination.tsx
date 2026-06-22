import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  searchTerm?: string;
}

const Pagination = async({ currentPage, totalPages, searchTerm = ''  }: PaginationProps) => {

  const t = await getTranslations('common');

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    params.set('page', String(page));
    return `/?${params.toString()}`;
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
      {currentPage > 1 && (
        <Link href={getPageUrl(currentPage - 1)} className={styles.button}>
          {t('previous')}
        </Link>
      )}

      {visiblePages[0] > 1 && (
        <>
          <Link href={getPageUrl(1)} className={styles.button}>1</Link>
          {visiblePages[0] > 2 && <span className={styles.ellipsis}>...</span>}
        </>
      )}

      {visiblePages.map(page => (
        <Link
          key={page}
          href={getPageUrl(page)}
          className={`${styles.button} ${currentPage === page ? styles.active : ''}`}
        >
          {page}
        </Link>
      ))}

      {visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && <span className={styles.ellipsis}>...</span>}
          <Link href={getPageUrl(totalPages)} className={styles.button}>{totalPages}</Link>
        </>
      )}

      {currentPage < totalPages && (
        <Link href={getPageUrl(currentPage + 1)} className={styles.button}>
          {t('next')}
        </Link>
      )}
    </div>
  );
};

export default Pagination;