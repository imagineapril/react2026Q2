'use server';

import { fetchFullPokemonItem } from '@/services/pokeApi';

const escapeCSV = (value: string | number | null | undefined): string => {
  if (value == null) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export async function generateCSV(selectedIds: number[]) {
  if (!selectedIds.length) {
    throw new Error('No items selected');
  }

  const pokemons = await Promise.all(
    selectedIds.map(id => fetchFullPokemonItem(id.toString()))
  );

  const headers = ['Name', 'Description', 'Height', 'Weight', 'Types'];
  const rows = pokemons.map(p => [
    escapeCSV(p.name),
    escapeCSV(p.description),
    escapeCSV(p.height),
    escapeCSV(p.weight),
    escapeCSV(p.types?.join(', ')),
  ]);

  const csvContent = [headers.map(escapeCSV), ...rows]
    .map(row => row.join(','))
    .join('\n');

  return {
    csv: csvContent,
    filename: `${selectedIds.length}_items.csv`,
  };
}