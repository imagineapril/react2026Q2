import { Component } from 'react';
import type { SearchProps, SearchState } from '../../types';
import Button from '../Button/Button';
import styles from './Search.module.css';

class Search extends Component<SearchProps, SearchState> {
  constructor(props: SearchProps) {
    super(props);
    this.state = {
      inputValue: props.initialSearchTerm || ''
    };
  }

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: event.target.value });
  };

  handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.handleSearch();
    }
  };

  handleSearch = () => {
    const trimmedValue = this.state.inputValue.trim();
    console.log('Search clicked:', trimmedValue);
    this.props.onSearch(trimmedValue);
  };

  render() {
    return (
      <div className={styles.wrapper}>
        <input
          type="text"
          className={styles.input}
          value={this.state.inputValue}
          onChange={this.handleInputChange}
          onKeyDown={this.handleKeyDown}
          placeholder="Enter search term..."
        />
        <Button onClick={this.handleSearch}>Search</Button>
      </div>
    );
  }
}

export default Search;