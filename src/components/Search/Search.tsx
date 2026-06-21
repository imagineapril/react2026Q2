'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Button from '../Button/Button';
import styles from './Search.module.css';

interface SearchProps {
  initialValue?: string;
}

const Search = ({ initialValue = '' }: SearchProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('common');
  const [inputValue, setInputValue] = useState(initialValue);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (inputValue.trim()) params.set('search', inputValue.trim());
    params.set('page', '1');
    router.push(`/?${params.toString()}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className={styles.wrapper}>
      <input
        type="text"
        className={styles.input}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t('searchPlaceholder')}
      />
      <Button onClick={handleSearch}>{t('search')}</Button>
    </div>
  );
}

export default Search;