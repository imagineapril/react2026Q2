import { useEffect } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import Main from '../../layout/Main/Main';
import Search from '../../components/Search/Search';
import Results from '../../components/Results/Results';
import Loader from '../../components/Loader/Loader';
import Pagination from '../../components/Pagination/Pagination';
import { usePokemonStore } from '../../store/pokemonStore';
import styles from './HomePage.module.css';

const ITEMS_PER_PAGE = 20;

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {items, loading, error, fetchAllItems, setSearchTerm} = usePokemonStore();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const validPage = isNaN(currentPage) || currentPage < 1 ? 1 : currentPage;

  useEffect(() => {
    if (items.length === 0 && !loading) {
      fetchAllItems();
    }
  }, [items.length, loading, fetchAllItems]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setSearchParams({ page: '1' });
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ page: String(page) });
  };

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <Main>
      <Search onSearch={handleSearch} />

      {loading && <Loader />}

      {error && <div className="error-message">{error}</div>}

      {!loading && !error && (
        <div className={styles.splitLayout}>
          <div className={styles.leftPanel}>
            <Results items={paginatedItems} currentPage={validPage} />
            {totalPages > 1 && (
              <Pagination
                currentPage={validPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>

          <div className={styles.rightPanel}>
            <Outlet />
          </div>
        </div>
      )}
    </Main>
  );
};

export default HomePage;