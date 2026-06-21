'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { SearchProps } from '../../types';
import Button from '../Button/Button';
import styles from './Search.module.css';

const Search = ({onSearch, initialValue = ''}: SearchProps) => {

  const t = useTranslations('common');
  const [inputValue, setInputValue] = useState(initialValue);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  };

  const handleSearch = () => {
    const trimmedValue = inputValue.trim();
    onSearch(trimmedValue);
  };

  return (
    <div className={styles.wrapper}>
      <input
        type="text"
        className={styles.input}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={t('searchPlaceholder')}
      />
      <Button onClick={handleSearch}>{t('search')}</Button>
    </div>
  );
}

export default Search;