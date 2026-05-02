export interface Item {
  id: number;
  name: string;
  description: string;
}

export interface AppState {
  searchTerm: string;
  items: Item[];
  loading: boolean;
  error: string | null;
}

export interface SearchProps {
  onSearch: (term: string) => void;
  initialSearchTerm?: string;
}

export interface SearchState {
  inputValue: string;
}

export interface ResultsProps {
  items: Item[];
}

export interface CardProps {
  name: string;
  description: string;
}