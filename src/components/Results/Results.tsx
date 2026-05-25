import { Link } from 'react-router-dom';
import Card from '../Card/Card';
import { type ResultsProps } from '../../types';
import styles from './Results.module.css';

const Results = ({ items = [], currentPage = 1 }: ResultsProps) => {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Results ({items.length})</h2>
        {items.length === 0 ? (
          <p className={styles.noResults}>No items found. Try searching for something!</p>
        ) : (
          <div className={styles.cardsList}>
            {items.map(item => (
              <Link
                key={item.id}
                to={`/pokemon/${item.id}?page=${currentPage}`}
                style={{ textDecoration: 'none' }}
              >
                <Card
                  id={item.id}
                  name={item.name}
                  description={item.description}
                  image={item.image}
                  height={item.height}
                  weight={item.weight}
                  types={item.types}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    );
}

export default Results;