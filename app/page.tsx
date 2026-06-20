'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { usePokemonList, pokemonKeys } from '../src/hooks/usePokemonQueries';
import Main from '../src/layout/Main/Main';
import Search from '../src/components/Search/Search';
import Results from '../src/components/Results/Results';
import Loader from '../src/components/Loader/Loader';
import Pagination from '../src/components/Pagination/Pagination';
import Flyout from '../src/components/Flyout/Flyout';
import ErrorFallback from '../src/components/ErrorFallback/ErrorFallback';
import styles from './page.module.css';

const ITEMS_PER_PAGE = 20;

const HomePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const searchTerm = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const validPage = isNaN(currentPage) || currentPage < 1 ? 1 : currentPage;

  const { data, isLoading, error, refetch } = usePokemonList(validPage, searchTerm, ITEMS_PER_PAGE);
  const items = data?.items ?? [];
  const totalItems = data?.total ?? 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const handleSearch = (term: string) => {
    const params = new URLSearchParams();
    if (term) params.set('search', term);
    params.set('page', '1');
    router.push(`/?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`/?${params.toString()}`);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: pokemonKeys.lists() });
  };

  return (
    <Main>
      <div className={styles.searchBar}>
        <Search onSearch={handleSearch} initialValue={searchTerm} />
        <button onClick={handleRefresh} className={styles.refreshButton}>
          🔄 Refresh
        </button>
      </div>

      {isLoading && <Loader />}

      {error && <ErrorFallback message={error.message} onRetry={refetch} />}

      {!isLoading && !error && (
        <div className={styles.splitLayout}>
          <div className={styles.leftPanel}>
            <Results items={items} currentPage={validPage} />
            {totalPages > 1 && (
              <Pagination
                currentPage={validPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>

          <div className={styles.rightPanel}>
            <p>Выберите покемона, чтобы увидеть детали</p>
          </div>
        </div>
      )}

      <Flyout />
    </Main>
  );
};

export default HomePage;