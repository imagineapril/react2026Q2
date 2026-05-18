import { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { SearchProps } from '../../types';
import Button from '../Button/Button';
import styles from './Search.module.css';

const Search = ({onSearch, initialSearchTerm = ''}: SearchProps) => {

  const [savedTerm, setSavedTerm] = useLocalStorage('pokemonSearchTerm', '');
  const [inputValue, setInputValue] = useState(
    savedTerm || initialSearchTerm
  );

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

    if (trimmedValue) {
      setSavedTerm(trimmedValue)
    } else {
      setSavedTerm('')
    }

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
        placeholder="Enter pokemon name"
      />
      <Button onClick={handleSearch}>Search</Button>
    </div>
  );
}

export default Search;