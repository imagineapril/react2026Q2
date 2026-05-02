import { Component} from 'react';

interface MainProps {
  children: React.ReactNode;
}

class Main extends Component<MainProps> {
  render() {
    return (
      <main>
        {this.props.children}
      </main>
    );
  }
}

export default Main;