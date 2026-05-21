import { Outlet, Link } from 'react-router-dom';
import Header from '../Header/Header';

const RootLayout = () => {
  return (
    <div>
      <Header />
      <nav>
        <Link to="/">Home</Link> | <Link to="/about">About</Link>
      </nav>
      <Outlet />
    </div>
  );
};

export default RootLayout;