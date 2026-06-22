'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { searchPokemonAction } from '../../../app/actions/search';
import Button from '../Button/Button';
import styles from './Search.module.css';

interface SearchProps {
  initialValue?: string;
}

const Search = ({ initialValue = '' }: SearchProps) => {
  const t = useTranslations('common');
  const [inputValue, setInputValue] = useState(initialValue);

  return (
    <form action={searchPokemonAction} className={styles.wrapper}>
      <input
        type="text"
        name="search"
        className={styles.input}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={t('searchPlaceholder')}
      />
      <input type="hidden" name="page" value="1" />
      <Button type="submit">{t('search')}</Button>
    </form>
  );
}

export default Search;