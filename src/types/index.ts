import type { ReactNode } from "react";

export interface Item {
  id: number;
  name: string;
  description: string;
  image?: string;
  height?: number;
  weight?: number;
  types?: string[];
}

export interface ApiPokemonListItem {
  name: string;
  url: string;
}

export interface ApiPokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: { type: { name: string } }[];
}

export interface ApiPokemonSpecies {
  flavor_text_entries: {
    flavor_text: string;
    language: { name: string };
  }[];
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
    other?: {
      'official-artwork'?: {
        front_default: string;
      };
    };
  };
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
}

export interface SearchProps {
  onSearch: (term: string) => void;
  initialValue?: string;
}

export interface ResultsProps {
  items: Item[];
  currentPage?: number;
}

export interface CardProps {
  id: number; 
  name: string;
  description: string;
  image?: string;
  height?: number;
  weight?: number;
  types?: string[];
}

export interface ErrorBoundaryProps {
  children: ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export interface ErrorTestButtonProps {
  onError?: () => void;
}

export interface ErrorTestButtonState {
  shouldThrow: boolean;
}

export interface PokemonStoreState {
  selectedIds: Set<number>;
  toggleSelected: (id: number) => void;
  clearSelected: () => void;
  isSelected: (id: number) => boolean;
}