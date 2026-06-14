import { useEffect, useMemo, useRef } from 'react';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
import type { Country } from '../../types';
import { getPopulationForYear, createYearDataMap } from '../../utils/data-transformers';
import { CountryCard } from '../country-card/country-card';

import styles from './country-list.module.css';

type CountryListProps = {
  countries: Country[];
  searchQuery: string;
  selectedColumns: string[];
  selectedRegion: string;
  selectedYear: number;
  sortField: 'name' | 'population';
  sortOrder: 'asc' | 'desc';
  onYearChange: (year: number) => void;
};

export const CountryList = ({
  countries,
  searchQuery,
  selectedColumns,
  selectedRegion,
  selectedYear,
  sortField,
  sortOrder,
}: CountryListProps) => {
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const filteredCountries = useMemo(() => { 
    return countries
    .filter((c) => {
      const matchesSearch = c.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = !selectedRegion || c.data.some((d) => d.region === selectedRegion);
      return matchesSearch && matchesRegion;
    })
    .sort((a, b) => {
      if (sortField === 'name') {
        return sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
      } else {
        const popA = getPopulationForYear(createYearDataMap(a.data), selectedYear) || 0;
        const popB = getPopulationForYear(createYearDataMap(b.data), selectedYear) || 0;
        return sortOrder === 'asc' ? popA - popB : popB - popA;
      }
    });
  }, [countries, searchQuery, selectedRegion, selectedYear, sortField, sortOrder]);

  useEffect(() => {
    if (virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex(0);
    }
  }, [filteredCountries]);

  console.log('filteredCountries length:', filteredCountries.length);
console.log('first country:', filteredCountries[0]);
  return (
    <div className={styles.countryList}>
      <Virtuoso
        ref={virtuosoRef}
        data={filteredCountries}
        itemContent={(_index, country) => (
          <CountryCard
            country={country}
            selectedYear={selectedYear}
            selectedColumns={selectedColumns}
          />
        )}
        style={{ height: '800px', width: '100%' }}
      />
    </div>
  );
};
