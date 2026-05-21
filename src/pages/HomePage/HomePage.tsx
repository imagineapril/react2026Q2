import { Outlet } from 'react-router-dom';
import Main from '../../layout/Main/Main';
import Search from '../../components/Search/Search';
import Results from '../../components/Results/Results';
import Loader from '../../components/Loader/Loader';
import Pagination from '../../components/Pagination/Pagination';
import { useHomePage } from '../../hooks/useHomePage';
import styles from './HomePage.module.css';

const HomePage = () => {
  const {
    loading,
    error,
    validPage,
    totalPages,
    paginatedItems,
    handleSearch,
    handlePageChange,
  } = useHomePage();

  return (
    <Main>
      <Search onSearch={handleSearch} initialSearchTerm="" />

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