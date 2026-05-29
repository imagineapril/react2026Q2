import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { usePokemonDetail } from '../../hooks/usePokemonQueries';
import styles from './PokemonDetailPage.module.css';

const PokemonDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentPage = searchParams.get('page') || '1';
  
  const { data: pokemon, isLoading, error } = usePokemonDetail(id);

  const handleClose = () => {
    navigate(`/?page=${currentPage}`);
  };

  if (isLoading) return <div className={styles.detailContainer}>Loading details...</div>;
  if (error) return <div className={styles.detailContainer}>Error: {error.message}</div>;
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