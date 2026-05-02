import { Component } from 'react';
import type { SearchProps, SearchState } from '../../types';

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

  handleSearch = () => {
    const trimmedValue = this.state.inputValue.trim();
    console.log('Search clicked:', trimmedValue);
    this.props.onSearch(trimmedValue);
  };

  render() {
    return (
      <div>
        <input
          type="text"
          value={this.state.inputValue}
          onChange={this.handleInputChange}
          placeholder="Enter search term..."
        />
        <button
          onClick={this.handleSearch}
        >
          Search
        </button>
      </div>
    );
  }
}

export default Search;