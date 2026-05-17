import { Outlet, Link } from 'react-router-dom';

const RootLayout = () => {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link> | <Link to="/about">About</Link>
      </nav>
      <Outlet />
    </div>
  );
};

export default RootLayout;