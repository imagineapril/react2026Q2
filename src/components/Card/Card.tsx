import { Component } from 'react';
import type { CardProps } from '../../types';
import styles from './Card.module.css';

class Card extends Component<CardProps> {
  render() {
    const { name, description } = this.props;
    
    return (
      <div className={styles.card}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.description}>{description}</p>
      </div>
    );
  }
}

export default Card;