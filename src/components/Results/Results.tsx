import Card from '../Card/Card';
import { type ResultsProps } from '../../types';
import styles from './Results.module.css';

const Results = ({ items = [] }: ResultsProps) => {

    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Results ({items.length})</h2>
        {items.length === 0 ? (
          <p className={styles.noResults}>No items found. Try searching for something!</p>
        ) : (
          <div className={styles.cardsList}>
            {items.map(item => (
              <Card
                key={item.id}
                name={item.name}
                description={item.description}
                image={item.image}
                height={item.height}
                weight={item.weight}
                types={item.types}
              />
            ))}
          </div>
        )}
      </div>
    );
}

export default Results;