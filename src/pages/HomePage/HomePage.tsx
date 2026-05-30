import { Outlet, useSearchParams } from 'react-router-dom';
import { usePokemonList } from '../../hooks/usePokemonQueries';
import Main from '../../layout/Main/Main';
import Search from '../../components/Search/Search';
import Results from '../../components/Results/Results';
import Loader from '../../components/Loader/Loader';
import Pagination from '../../components/Pagination/Pagination';
import Flyout from '../../components/Flyout/Flyout';
import styles from './HomePage.module.css';

const ITEMS_PER_PAGE = 20;

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const validPage = isNaN(currentPage) || currentPage < 1 ? 1 : currentPage;

  const { data, isLoading, error } = usePokemonList(searchTerm, validPage, ITEMS_PER_PAGE);
  const items = data?.items ?? [];
  const totalItems = data?.total ?? 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const handleSearch = (term: string) => {
    setSearchParams({ search: term, page: '1' });
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ page: String(page), ...(searchTerm && { search: searchTerm }) });
  };

  return (
    <Main>
      <Search onSearch={handleSearch} initialValue={searchTerm} />

      {isLoading && <Loader />}

      {error && <div className="error-message">{error.message}</div>}

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
            <Outlet />
          </div>
        </div>
      )}

      <Flyout />
    </Main>
  );
};

export default HomePage;