import { useState, useEffect } from 'react';
import Main from '../../layout/Main/Main';
import Search from '../../components/Search/Search';
import Results from '../../components/Results/Results';
import Loader from '../../components/Loader/Loader';
import { apiService } from '../../services/api';
import type { Item } from '../../types';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetched = searchTerm
        ? await apiService.searchItems(searchTerm)
        : await apiService.getAllItems();
      setItems(fetched);
    } catch (err) {
      console.error(err);
      setError('Failed to load items. Please try again.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };
  loadData();
}, [searchTerm]);

  const handleSearch = (term: string) => {
    if (term === searchTerm) return;
    setSearchTerm(term);
  };

  return (
    <div>
      <Main>
        <Search onSearch={handleSearch} initialSearchTerm={searchTerm} />

        {loading && <Loader />}

        {error && <div className="error-message">{error}</div>}

        {!loading && !error && <Results items={items} />}
      </Main>
    </div>
  );
};

export default HomePage;