import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiService } from '../services/api';
import type { Item } from '../types';

const ITEMS_PER_PAGE = 20;

export const useHomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const validPage = isNaN(currentPage) || currentPage < 1 ? 1 : currentPage;

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetched = searchTerm
          ? await apiService.searchItems(searchTerm)
          : await apiService.getAllItems();
        if (isMounted) setAllItems(fetched);
      } catch {
        if (isMounted) {
          setError('Failed to load items.');
          setAllItems([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, [searchTerm]);

  useEffect(() => {
    if (searchTerm !== '') {
      setSearchParams({ page: '1' });
    }
  }, [searchTerm, setSearchParams]);

  const handleSearch = useCallback((term: string) => {
    if (term === searchTerm) return;
    setSearchTerm(term);
  }, [searchTerm]);

  const handlePageChange = useCallback((page: number) => {
    setSearchParams({ page: String(page) });
  }, [setSearchParams]);

  const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE);
  const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = allItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return {
    searchTerm,
    loading,
    error,
    validPage,
    totalPages,
    paginatedItems,
    handleSearch,
    handlePageChange,
  };
};