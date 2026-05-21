import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { apiService } from '../../services/api';
import type { Item } from '../../types';
import styles from './PokemonDetailPage.module.css';

const PokemonDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentPage = searchParams.get('page') || '1';
  
  const [pokemon, setPokemon] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadPokemon = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const found = await apiService.getItemById(parseInt(id, 10));
        if (isMounted) {
          if (found) {
            setPokemon(found);
          } else {
            setError('Pokemon not found');
          }
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load details');
      } finally {
        setLoading(false);
      }
    };
    loadPokemon();
    return () => {
      isMounted = false;
    }
  }, [id]);

  const handleClose = () => {
    navigate(`/?page=${currentPage}`);
  };

  if (loading) return <div className={styles.detailContainer}>Loading details...</div>;
  if (error) return <div className={styles.detailContainer}>Error: {error}</div>;
  if (!pokemon) return <div className={styles.detailContainer}>No data</div>;

  return (
    <div className={styles.detailContainer}>
      <button className={styles.closeButton} onClick={handleClose}>✕</button>
      <h2>{pokemon.name}</h2>
      <img src={pokemon.image} alt={pokemon.name} className={styles.image} />
      <p>{pokemon.description}</p>
      <p><strong>Height:</strong> {pokemon.height} dm</p>
      <p><strong>Weight:</strong> {pokemon.weight} hg</p>
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