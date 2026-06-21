'use client';

import { use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { usePokemonDetail, pokemonKeys } from '../../../src/hooks/usePokemonQueries';
import ErrorFallback from '../../../src/components/ErrorFallback/ErrorFallback';
import Loader from '../../../src/components/Loader/Loader';
import styles from './page.module.css';

interface PokemonDetailPageProps {
  params: Promise<{ id: string }>;
}

const PokemonDetailPage = ({ params }: PokemonDetailPageProps) => {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const t = useTranslations('common');
  const tPokemon = useTranslations('pokemon');

  const currentPage = searchParams.get('page') || '1';

  const { data: pokemon, isLoading, error, refetch } = usePokemonDetail(id);

  const handleClose = () => {
    router.push(`/?page=${currentPage}`);
  };

  const handleRefresh = () => {
    if (id) {
      queryClient.invalidateQueries({ queryKey: pokemonKeys.detail(id) });
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <ErrorFallback message={error.message} onRetry={refetch} />;
  if (!pokemon) return <div className={styles.detailContainer}>No data</div>;

  return (
    <div className={styles.detailContainer}>
      <button className={styles.closeButton} onClick={handleClose}>✕</button>
      <button className={styles.refreshButton} onClick={handleRefresh}>🔄 {t('refresh')}</button>
      <h2>{pokemon.name}</h2>
      <img src={pokemon.image} alt={pokemon.name} className={styles.image} />
      <p>{pokemon.description}</p>
      <p><strong>{tPokemon('height')}:</strong> {pokemon.height} dm</p>
      <p><strong>{tPokemon('weight')}:</strong> {pokemon.weight} hg</p>
      {pokemon.types && (
        <div className={styles.types}>
          {pokemon.types.map(type => (
            <span key={type} className={styles.type}>{type}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default PokemonDetailPage;