import { Component } from 'react';
import type { CardProps } from '../../types';
import styles from './Card.module.css';

class Card extends Component<CardProps> {
  render() {
    const { name, description, image, types } = this.props;

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

    const mainType = types && types.length > 0 ? types[0] : 'normal';
    const nameColor = getTypeColor(mainType);
    
    return (
      <div className={styles.card}>
        {image && (
          <div className={styles.imageContainer}>
            <img src={image} alt={name} className={styles.image} />
          </div>
        )}
        <div className={styles.content}>
          <h3 className={styles.name} style={{ color: nameColor }}>{name}</h3>
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
}

export default Card;