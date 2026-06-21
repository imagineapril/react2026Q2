import Image from 'next/image';
import type { CardProps } from '../../types';
import styles from './Card.module.css';
import { usePokemonStore } from '../../store/pokemonStore';

const getTypeColor = (type: string): string => {
      const colors: Record<string, string> = {
        grass: '#78c850',
        fire: '#f08030',
        water: '#6890f0',
        electric: '#f8d030',
        psychic: '#f85888',
        ice: '#98d8d8',
        dragon: '#7038f8',
        dark: '#705848',
        fairy: '#ee99ac',
        normal: '#a8a878',
        fighting: '#c03028',
        flying: '#a890f0',
        poison: '#a040a0',
        ground: '#e0c068',
        rock: '#b8a038',
        bug: '#a8b820',
        ghost: '#705898',
        steel: '#b8b8d0',
      };
      return colors[type] || '#ffffff';
    };

const Card = ({ id, name, description, image, types }:CardProps) => {
    const mainType = types && types.length > 0 ? types[0] : 'normal';
    const nameColor = getTypeColor(mainType);
    const isSelected = usePokemonStore((state) => state.selectedIds.has(id));
    const toggleSelected = usePokemonStore((state) => state.toggleSelected);

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    toggleSelected(id);
    };

    return (
      <div className={styles.card}>
        {image && (
          <div className={styles.imageContainer}>
            <Image 
            src={image} 
            alt={name} 
            width={100}
            height={100}
            className={styles.image} />
          </div>
        )}
        <div className={styles.content}>
          <div className={styles.header}>
            <h3 className={styles.name} style={{ color: nameColor }}>{name}</h3>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={isSelected}
              onChange={handleCheckboxChange}
              onClick={(e) => e.stopPropagation()}
              aria-label={`Select ${name}`}
            />
          </div>
          {types && types.length > 0 && (
            <div className={styles.types}>
              {types.map(type => (
                <span key={type} className={`${styles.type} ${styles[type]}`}>
                  {type}
                </span>
              ))}
            </div>
          )}
          <p className={styles.description}>{description}</p>
        </div>
      </div>
    );
}

export default Card;