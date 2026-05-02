import { Component } from 'react';
import Card from '../Card/Card';
import { type ResultsProps } from '../../types';

class Results extends Component<ResultsProps> {
  render() {
    const { items = [] } = this.props;
    
    return (
      <div>
        <h2>Results ({items.length})</h2>
        {items.length === 0 ? (
          <p>No items found. Try searching for something!</p>
        ) : (
          items.map(item => (
            <Card key={item.id} name={item.name} description={item.description} />
          ))
        )}
      </div>
    );
  }
}

export default Results;