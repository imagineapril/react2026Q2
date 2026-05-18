import { useState, useEffect } from 'react';
import { useSearchParams, Outlet } from 'react-router-dom';
import Main from '../../layout/Main/Main';
import Search from '../../components/Search/Search';
import Results from '../../components/Results/Results';
import Loader from '../../components/Loader/Loader';
import Pagination from '../../components/Pagination/Pagination';
import { apiService } from '../../services/api';
import type { Item } from '../../types';
import styles from './HomePage.module.css';

const ITEMS_PER_PAGE = 20;

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const validPage = isNaN(currentPage) || currentPage < 1 ? 1 : currentPage;

  useEffect(() => {
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetched = searchTerm
        ? await apiService.searchItems(searchTerm)
        : await apiService.getAllItems();
      setAllItems(fetched);
    } catch (err) {
      console.error(err);
      setError('Failed to load items. Please try again.');
      setAllItems([]);
    } finally {
      setLoading(false);
    }
  };
  loadData();
}, [searchTerm]);

  useEffect(() => {
  if (searchTerm !== '') {
    setSearchParams({ page: '1' });
  }
  }, [searchTerm, setSearchParams]);

  const handleSearch = (term: string) => {
    if (term === searchTerm) return;
    setSearchTerm(term);
  };

  const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE);
  const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = allItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setSearchParams({ page: String(page) });
  };

  return (
    <Main>
      <Search onSearch={handleSearch} initialSearchTerm={searchTerm} />

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